import { handleAuthCallback, handleAuthStart, handleLogout, handleStatus, readSession, sessionCookieName } from './auth.js';
import { fetchDiscussions, UpstreamError } from './github.js';
import { clearCookie, errorResponse, jsonResponse, preflight, requireOrigin, assertMethod, readJsonObject } from './http.js';

const FEED_KEY = 'public-feed-v1';
const feedTtl = (env) => Math.max(60, Number(env.FEED_TTL_SECONDS) || 900);
const sessionCookieOptions = (env) => ({ maxAge: 0, secure: env.COOKIE_SECURE !== 'false', sameSite: 'None', httpOnly: true, path: '/' });

const readSnapshot = async (env) => {
  if (!env.OPEN_MOTION_FEED) return null;
  const raw = await env.OPEN_MOTION_FEED.get(FEED_KEY);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value.items) || !value.fetchedAt) return null;
    return value;
  } catch { return null; }
};

const writeSnapshot = async (env, items) => {
  const snapshot = { items, fetchedAt: new Date().toISOString() };
  await env.OPEN_MOTION_FEED.put(FEED_KEY, JSON.stringify(snapshot), { expirationTtl: Math.max(86400, feedTtl(env) * 8) });
  return snapshot;
};

const publicFeed = (snapshot, source = 'cache', stale = false, warning = '') => ({
  items: snapshot?.items || [],
  meta: { source, stale: Boolean(stale), fetchedAt: snapshot?.fetchedAt || null, warning: warning || null }
});

const handlePublicFeed = async (request, env) => {
  requireOrigin(request, env);
  const snapshot = await readSnapshot(env);
  if (!snapshot) return jsonResponse({ items: [], meta: { source: 'worker-unavailable', stale: true, fetchedAt: null, warning: 'feed_unavailable' } }, 503, request, env, { 'Cache-Control': 'no-store' });
  return jsonResponse(publicFeed(snapshot), 200, request, env, { 'Cache-Control': 'public, max-age=60', ETag: `W/"${snapshot.fetchedAt}"` });
};

const handleLatestFeed = async (request, env) => {
  requireOrigin(request, env);
  await readJsonObject(request, []);
  const session = await readSession(request, env);
  if (!session) return jsonResponse({ error: 'session_invalid' }, 401, request, env, { 'Cache-Control': 'no-store', 'Set-Cookie': clearCookie(sessionCookieName(env), sessionCookieOptions(env)) });
  const previous = await readSnapshot(env);
  try {
    const items = await fetchDiscussions(env, session.token);
    const snapshot = await writeSnapshot(env, items);
    return jsonResponse(publicFeed(snapshot, 'live', false), 200, request, env, { 'Cache-Control': 'no-store' });
  } catch (error) {
    if (error instanceof UpstreamError && error.status === 401) {
      await env.OPEN_MOTION_SESSIONS.delete(session.id);
      return jsonResponse({ ...(publicFeed(previous, 'cache', true, 'session_invalid')), error: 'session_invalid' }, 401, request, env, { 'Cache-Control': 'no-store', 'Set-Cookie': clearCookie(sessionCookieName(env), sessionCookieOptions(env)) });
    }
    if (previous) return jsonResponse(publicFeed(previous, 'cache', true, error?.code || 'github_feed_failed'), 200, request, env, { 'Cache-Control': 'no-store' });
    return jsonResponse({ items: [], meta: { source: 'worker-unavailable', stale: true, fetchedAt: null, warning: error?.code || 'github_feed_failed' } }, 503, request, env, { 'Cache-Control': 'no-store' });
  }
};

export const handleRequest = async (request, env = {}) => {
  const url = new URL(request.url);
  try {
    if (request.method === 'OPTIONS') return preflight(request, env);
    if (url.pathname === '/auth/start') {
      assertMethod(request, ['POST']);
      return await handleAuthStart(request, env);
    }
    if (url.pathname === '/auth/callback') {
      assertMethod(request, ['GET']);
      return await handleAuthCallback(request, env);
    }
    if (url.pathname === '/api/health') {
      assertMethod(request, ['GET']);
      requireOrigin(request, env);
      return jsonResponse({ ok: true }, 200, request, env, { 'Cache-Control': 'no-store' });
    }
    if (url.pathname === '/api/status') {
      assertMethod(request, ['GET']);
      return await handleStatus(request, env);
    }
    if (url.pathname === '/api/feed') {
      assertMethod(request, ['GET']);
      return await handlePublicFeed(request, env);
    }
    if (url.pathname === '/api/feed/latest') {
      assertMethod(request, ['POST']);
      return await handleLatestFeed(request, env);
    }
    if (url.pathname === '/api/logout') {
      assertMethod(request, ['POST']);
      return await handleLogout(request, env);
    }
    const workerRoute = url.pathname === '/api' || url.pathname.startsWith('/api/') || url.pathname === '/auth' || url.pathname.startsWith('/auth/');
    if (!workerRoute && ['GET', 'HEAD'].includes(request.method) && typeof env.ASSETS?.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }
    return jsonResponse({ error: 'not_found' }, 404, request, env);
  } catch (error) {
    return errorResponse(error, request, env);
  }
};

export default { fetch: handleRequest };
