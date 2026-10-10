import { encryptJson, decryptJson, constantTimeEqual, isBoundedToken, isValidPkceVerifier, pkceChallenge, randomToken } from './crypto.js';
import { clearCookie, cookie, jsonResponse, parseCookies, redirectResponse, requireOrigin, readJsonObject } from './http.js';
import { exchangeCode, fetchGitHubUser } from './github.js';

export const SESSION_COOKIE = '__Host-open_motion_session';
export const STATE_COOKIE = '__Host-open_motion_oauth_state';

const cookieName = (secure, hostName) => secure ? hostName : hostName.replace('__Host-', '');
export const sessionCookieName = (env) => cookieName(env.COOKIE_SECURE !== 'false', SESSION_COOKIE);
export const stateCookieName = (env) => cookieName(env.COOKIE_SECURE !== 'false', STATE_COOKIE);

const ttl = (env, key, fallback) => Math.max(60, Number(env[key]) || fallback);
const secureCookies = (env) => env.COOKIE_SECURE !== 'false';
const cookieOptions = (env, maxAge) => ({ maxAge, secure: secureCookies(env), sameSite: 'None', httpOnly: true, path: '/' });
const pageUrl = (env) => {
  const value = new URL(env.PUBLIC_SITE_URL);
  value.hash = '';
  value.search = '';
  return value.toString().replace(/\/$/, '');
};
const callbackUrl = (request, env) => env.OAUTH_CALLBACK_URL || `${new URL(request.url).origin}/auth/callback`;

export const handleAuthStart = async (request, env) => {
  requireOrigin(request, env);
  await readJsonObject(request, []);
  if (!isBoundedToken(env.GITHUB_CLIENT_ID, 200)) throw Object.assign(new Error('oauth_not_configured'), { status: 503, code: 'oauth_not_configured' });
  const verifier = randomToken(48).replace(/[^A-Za-z0-9._~-]/g, 'A');
  const state = randomToken(32);
  const expiresAt = Date.now() + ttl(env, 'OAUTH_STATE_TTL_SECONDS', 600) * 1000;
  const encrypted = await encryptJson({ state, verifier, expiresAt }, env.OAUTH_STATE_ENCRYPTION_KEY);
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', callbackUrl(request, env));
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('code_challenge', await pkceChallenge(verifier));
  authorize.searchParams.set('code_challenge_method', 'S256');
  authorize.searchParams.set('scope', 'read:user');
  return jsonResponse({ authorizeUrl: authorize.toString() }, 200, request, env, {
    'Cache-Control': 'no-store',
    'Set-Cookie': cookie(stateCookieName(env), encrypted, cookieOptions(env, ttl(env, 'OAUTH_STATE_TTL_SECONDS', 600)))
  });
};

const authFailure = (env, code) => redirectResponse(`${pageUrl(env)}#auth=${code}`, [clearCookie(stateCookieName(env), cookieOptions(env, 0))]);

export const handleAuthCallback = async (request, env) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';
  const providerError = url.searchParams.get('error');
  if (providerError || !isBoundedToken(code, 512) || !isBoundedToken(state, 512)) return authFailure(env, 'error');
  const encrypted = parseCookies(request)[stateCookieName(env)];
  if (!encrypted) return authFailure(env, 'error');
  let pending;
  try { pending = await decryptJson(encrypted, env.OAUTH_STATE_ENCRYPTION_KEY); } catch { return authFailure(env, 'error'); }
  if (!pending || pending.expiresAt < Date.now() || !isValidPkceVerifier(pending.verifier) || !constantTimeEqual(pending.state, state)) return authFailure(env, 'error');
  try {
    const token = await exchangeCode({ code, verifier: pending.verifier, redirectUri: callbackUrl(request, env) }, env);
    const user = await fetchGitHubUser(token, env);
    const sessionId = randomToken(32);
    const expiresAt = Date.now() + ttl(env, 'SESSION_TTL_SECONDS', 28800) * 1000;
    const encryptedToken = await encryptJson({ token, expiresAt }, env.SESSION_ENCRYPTION_KEY);
    await env.OPEN_MOTION_SESSIONS.put(sessionId, JSON.stringify({ encryptedToken, user: { login: user.login, id: user.id }, createdAt: Date.now(), expiresAt }), { expirationTtl: ttl(env, 'SESSION_TTL_SECONDS', 28800) });
    return redirectResponse(`${pageUrl(env)}#auth=success`, [
      cookie(sessionCookieName(env), sessionId, cookieOptions(env, ttl(env, 'SESSION_TTL_SECONDS', 28800))),
      clearCookie(stateCookieName(env), cookieOptions(env, 0))
    ]);
  } catch {
    return authFailure(env, 'error');
  }
};

export const readSession = async (request, env) => {
  const sessionId = parseCookies(request)[sessionCookieName(env)];
  if (!isBoundedToken(sessionId, 200)) return null;
  const raw = await env.OPEN_MOTION_SESSIONS.get(sessionId);
  if (!raw) return null;
  try {
    const record = JSON.parse(raw);
    if (!record.expiresAt || record.expiresAt <= Date.now()) return null;
    const decrypted = await decryptJson(record.encryptedToken, env.SESSION_ENCRYPTION_KEY);
    if (!decrypted?.token || decrypted.expiresAt <= Date.now()) return null;
    return { id: sessionId, token: decrypted.token, user: record.user, expiresAt: record.expiresAt };
  } catch { return null; }
};

export const handleStatus = async (request, env) => {
  requireOrigin(request, env);
  const session = await readSession(request, env);
  return jsonResponse(session ? { authenticated: true, user: { login: session.user?.login || '' }, expiresAt: new Date(session.expiresAt).toISOString() } : { authenticated: false }, 200, request, env, { 'Cache-Control': 'no-store' });
};

export const handleLogout = async (request, env) => {
  requireOrigin(request, env);
  await readJsonObject(request, []);
  const sessionId = parseCookies(request)[sessionCookieName(env)];
  if (sessionId) await env.OPEN_MOTION_SESSIONS.delete(sessionId);
  return jsonResponse({ ok: true }, 200, request, env, {
    'Cache-Control': 'no-store',
    'Set-Cookie': clearCookie(sessionCookieName(env), cookieOptions(env, 0))
  });
};
