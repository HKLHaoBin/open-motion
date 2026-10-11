import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../src/index.js';
import { encryptJson } from '../src/crypto.js';

class FakeKV {
  constructor() { this.values = new Map(); }
  async get(key) { return this.values.get(key) || null; }
  async put(key, value) { this.values.set(key, value); }
  async delete(key) { this.values.delete(key); }
}

const makeEnv = () => ({
  ALLOWED_ORIGIN: 'https://open-motion.example',
  PUBLIC_SITE_URL: 'https://open-motion.example',
  OAUTH_CALLBACK_URL: 'https://api.open-motion.example/auth/callback',
  GITHUB_CLIENT_ID: 'client-fixture',
  GITHUB_CLIENT_SECRET: 'client-secret-fixture',
  SESSION_ENCRYPTION_KEY: 'session-encryption-fixture-value',
  OAUTH_STATE_ENCRYPTION_KEY: 'oauth-state-encryption-fixture-value',
  GITHUB_OWNER: 'HKLHaoBin',
  GITHUB_REPO: 'open-motion',
  GITHUB_API_VERSION: '2022-11-28',
  FEED_LIMIT: '30',
  SESSION_TTL_SECONDS: '28800',
  OAUTH_STATE_TTL_SECONDS: '600',
  FEED_TTL_SECONDS: '900',
  OPEN_MOTION_SESSIONS: new FakeKV(),
  OPEN_MOTION_FEED: new FakeKV()
});

const request = (url, options = {}) => new Request(url, {
  ...options,
  headers: { Origin: 'https://open-motion.example', ...(options.headers || {}) }
});

const sameOriginRequest = (url, options = {}) => new Request(url, options);

const jsonRequest = (url, method, body = {}) => request(url, {
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const setCookies = (response) => {
  if (typeof response.headers.getSetCookie === 'function') return response.headers.getSetCookie();
  const value = response.headers.get('set-cookie') || '';
  return value.split(/,(?=\s*__Host-)/).filter(Boolean);
};

const cookieValue = (response, name) => setCookies(response).find((value) => value.startsWith(`${name}=`))?.split(';', 1)[0];

const body = async (response) => response.json();

test('preflight and origin policy are explicit', async () => {
  const env = makeEnv();
  const preflightResponse = await handleRequest(request('https://api.open-motion.example/api/status', { method: 'OPTIONS', headers: { 'Access-Control-Request-Method': 'GET' } }), env);
  assert.equal(preflightResponse.status, 204);
  assert.equal(preflightResponse.headers.get('Access-Control-Allow-Origin'), env.ALLOWED_ORIGIN);
  assert.equal(preflightResponse.headers.get('Access-Control-Allow-Credentials'), 'true');

  const wrongOrigin = await handleRequest(new Request('https://api.open-motion.example/api/status', { headers: { Origin: 'https://evil.example' } }), env);
  assert.equal(wrongOrigin.status, 403);
  assert.equal((await body(wrongOrigin)).error, 'origin_not_allowed');
});

test('same-origin read requests can omit Origin without widening writes', async () => {
  const env = makeEnv();
  const status = await handleRequest(sameOriginRequest('https://open-motion.example/api/status'), env);
  assert.equal(status.status, 200);
  assert.equal((await body(status)).authenticated, false);

  const feed = await handleRequest(sameOriginRequest('https://open-motion.example/api/feed'), env);
  assert.equal(feed.status, 503);

  const post = await handleRequest(sameOriginRequest('https://open-motion.example/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}'
  }), env);
  assert.equal(post.status, 403);

  const differentHost = await handleRequest(sameOriginRequest('https://api.open-motion.example/api/status'), env);
  assert.equal(differentHost.status, 403);

  const nullOrigin = await handleRequest(new Request('https://open-motion.example/api/status', { headers: { Origin: 'null' } }), env);
  assert.equal(nullOrigin.status, 403);
});

test('static assets handle public paths while unknown API routes remain JSON', async () => {
  const env = makeEnv();
  const assetRequests = [];
  env.ASSETS = {
    fetch: async (assetRequest) => {
      assetRequests.push(new URL(assetRequest.url).pathname);
      return new Response('static asset', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
  };

  const root = await handleRequest(sameOriginRequest('https://open-motion.example/'), env);
  assert.equal(root.status, 200);
  assert.equal(await root.text(), 'static asset');
  assert.deepEqual(assetRequests, ['/']);

  const unknownApi = await handleRequest(request('https://open-motion.example/api/unknown'), env);
  assert.equal(unknownApi.status, 404);
  assert.deepEqual(await body(unknownApi), { error: 'not_found' });
  assert.deepEqual(assetRequests, ['/']);
});

test('OAuth PKCE state never exposes verifier or secret and creates a secure cookie', async () => {
  const env = makeEnv();
  const response = await handleRequest(jsonRequest('https://api.open-motion.example/auth/start', 'POST'), env);
  assert.equal(response.status, 200);
  const payload = await body(response);
  const authorize = new URL(payload.authorizeUrl);
  assert.equal(authorize.hostname, 'github.com');
  assert.equal(authorize.searchParams.get('code_challenge_method'), 'S256');
  assert.ok(authorize.searchParams.get('code_challenge'));
  assert.equal(authorize.searchParams.has('code_verifier'), false);
  assert.equal(authorize.searchParams.has('client_secret'), false);
  const stateCookie = setCookies(response).find((value) => value.startsWith('__Host-open_motion_oauth_state='));
  assert.match(stateCookie, /HttpOnly/);
  assert.match(stateCookie, /Secure/);
  assert.match(stateCookie, /SameSite=None/);
  assert.match(stateCookie, /Path=\//);
  assert.doesNotMatch(stateCookie, /Domain=/i);
});

test('callback creates an opaque session and latest feed uses only the server token', async () => {
  const env = makeEnv();
  const start = await handleRequest(jsonRequest('https://api.open-motion.example/auth/start', 'POST'), env);
  const authorize = new URL((await body(start)).authorizeUrl);
  const stateCookie = cookieValue(start, '__Host-open_motion_oauth_state');
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('/access_token')) return new Response(JSON.stringify({ access_token: 'ghs_server_only_fixture' }), { status: 200 });
    if (String(url).endsWith('/user')) return new Response(JSON.stringify({ login: 'fixture-user', id: 42 }), { status: 200 });
    if (String(url).includes('/discussions')) return new Response(JSON.stringify([{ id: 'd1', title: 'Fresh discussion', body: 'public body', html_url: 'https://github.com/HKLHaoBin/open-motion/discussions/1', user: { login: 'fixture-user' }, created_at: '2026-10-11T00:00:00Z', comments: 2 }]), { status: 200 });
    throw new Error('unexpected upstream');
  };
  try {
    const callback = await handleRequest(new Request(`https://api.open-motion.example/auth/callback?code=fixture-code&state=${encodeURIComponent(authorize.searchParams.get('state'))}`, { headers: { Cookie: stateCookie } }), env);
    assert.equal(callback.status, 302);
    assert.equal(callback.headers.get('location'), 'https://open-motion.example#auth=success');
    const sessionCookie = cookieValue(callback, '__Host-open_motion_session');
    assert.ok(sessionCookie);
    assert.match(sessionCookie, /__Host-open_motion_session=.{20,}/);

    const status = await handleRequest(request('https://api.open-motion.example/api/status', { headers: { Cookie: sessionCookie } }), env);
    const statusPayload = await body(status);
    assert.equal(statusPayload.authenticated, true);
    assert.deepEqual(statusPayload.user, { login: 'fixture-user' });
    assert.ok(statusPayload.expiresAt);

    const latest = await handleRequest(request('https://api.open-motion.example/api/feed/latest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
      body: '{}'
    }), env);
    assert.equal(latest.status, 200);
    assert.equal((await body(latest)).meta.source, 'live');
    const discussionCall = calls.find((call) => call.url.includes('/discussions'));
    assert.equal(discussionCall.options.headers.Authorization, 'Bearer ghs_server_only_fixture');
    assert.equal(JSON.stringify(await env.OPEN_MOTION_FEED.get('public-feed-v1')).includes('ghs_server_only_fixture'), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rate limits preserve the last public snapshot and logout clears the session', async () => {
  const env = makeEnv();
  await env.OPEN_MOTION_FEED.put('public-feed-v1', JSON.stringify({ fetchedAt: '2026-10-10T00:00:00Z', items: [{ id: 'cached', title: 'Cached' }] }));
  const sessionId = 'fixture-session';
  const expiresAt = Date.now() + 10000;
  const encryptedToken = await encryptJson({ token: 'server-token', expiresAt }, env.SESSION_ENCRYPTION_KEY);
  await env.OPEN_MOTION_SESSIONS.put(sessionId, JSON.stringify({ encryptedToken, user: { login: 'x' }, expiresAt }));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'rate limit body must not leak' }), { status: 403 });
  try {
    const response = await handleRequest(request('https://api.open-motion.example/api/feed/latest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `__Host-open_motion_session=${sessionId}` },
      body: '{}'
    }), env);
    assert.equal(response.status, 200);
    const payload = await body(response);
    assert.equal(payload.meta.source, 'cache');
    assert.equal(payload.meta.stale, true);
    assert.equal(JSON.stringify(payload).includes('rate limit body must not leak'), false);
    const publicFeed = await handleRequest(request('https://api.open-motion.example/api/feed'), env);
    assert.equal(publicFeed.status, 200);

    const logout = await handleRequest(request('https://api.open-motion.example/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `__Host-open_motion_session=${sessionId}` },
      body: '{}'
    }), env);
    assert.equal(logout.status, 200);
    assert.match(setCookies(logout).join('; '), /Max-Age=0/);
    assert.equal(await env.OPEN_MOTION_SESSIONS.get(sessionId), null);
  } finally { globalThis.fetch = originalFetch; }
});

test('request bodies reject unknown fields and unsupported methods', async () => {
  const env = makeEnv();
  const bad = await handleRequest(jsonRequest('https://api.open-motion.example/auth/start', 'POST', { redirect_uri: 'https://evil.example' }), env);
  assert.equal(bad.status, 400);
  assert.equal((await body(bad)).error, 'unknown_field');
  const method = await handleRequest(request('https://api.open-motion.example/api/feed', { method: 'DELETE' }), env);
  assert.equal(method.status, 405);
  assert.match(method.headers.get('Allow'), /GET/);
});
