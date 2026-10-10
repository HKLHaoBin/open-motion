const jsonHeaders = { 'content-type': 'application/json; charset=utf-8' };

export const allowedOrigin = (request, env) => {
  const configured = typeof env.ALLOWED_ORIGIN === 'string' ? env.ALLOWED_ORIGIN.trim() : '';
  const origin = request.headers.get('Origin') || '';
  return Boolean(configured && origin === configured);
};

export const corsHeaders = (request, env) => {
  const headers = new Headers();
  const origin = request.headers.get('Origin') || '';
  if (origin && origin === env.ALLOWED_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
  headers.set('Vary', 'Origin');
  return headers;
};

export const withCors = (response, request, env) => {
  const headers = new Headers(response.headers);
  for (const [key, value] of corsHeaders(request, env)) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

export const preflight = (request, env) => {
  if (!allowedOrigin(request, env)) return new Response(null, { status: 403, headers: { Vary: 'Origin' } });
  const headers = corsHeaders(request, env);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Max-Age', '600');
  return new Response(null, { status: 204, headers });
};

export const jsonResponse = (body, status, request, env, extra = {}) => {
  const headers = corsHeaders(request, env);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  for (const [key, value] of Object.entries(extra)) headers.set(key, value);
  return new Response(JSON.stringify(body), { status, headers });
};

export const redirectResponse = (location, cookies = []) => {
  const headers = new Headers({ Location: location, 'Cache-Control': 'no-store' });
  for (const cookie of cookies) headers.append('Set-Cookie', cookie);
  return new Response(null, { status: 302, headers });
};

export const requireOrigin = (request, env) => {
  if (!allowedOrigin(request, env)) throw Object.assign(new Error('origin_not_allowed'), { status: 403, code: 'origin_not_allowed' });
};

export const assertMethod = (request, methods) => {
  if (!methods.includes(request.method)) throw Object.assign(new Error('method_not_allowed'), { status: 405, code: 'method_not_allowed', allow: methods.join(', ') });
};

export const parseCookies = (request) => {
  const value = request.headers.get('Cookie') || '';
  return Object.fromEntries(value.split(';').map((part) => part.trim().split('='))
    .filter(([key, val]) => key && val !== undefined)
    .map(([key, ...rest]) => [key, rest.join('=')]));
};

export const cookie = (name, value, options = {}) => {
  const parts = [`${name}=${value}`];
  parts.push(`Path=${options.path || '/'}`);
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.secure !== false) parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'None'}`);
  return parts.join('; ');
};

export const clearCookie = (name, options = {}) => cookie(name, '', { ...options, maxAge: 0 });

export const readJsonObject = async (request, allowedKeys = []) => {
  const contentType = request.headers.get('Content-Type') || '';
  if (!/^application\/json\s*(?:;|$)/i.test(contentType)) throw Object.assign(new Error('json_required'), { status: 415, code: 'json_required' });
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 4096) throw Object.assign(new Error('request_too_large'), { status: 413, code: 'request_too_large' });
  let value;
  try { value = await request.json(); } catch { throw Object.assign(new Error('invalid_json'), { status: 400, code: 'invalid_json' }); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw Object.assign(new Error('object_required'), { status: 400, code: 'object_required' });
  const keys = Object.keys(value);
  if (keys.some((key) => !allowedKeys.includes(key))) throw Object.assign(new Error('unknown_field'), { status: 400, code: 'unknown_field' });
  return value;
};

export const errorResponse = (error, request, env) => {
  const status = Number.isInteger(error?.status) ? error.status : 500;
  const body = { error: error?.code || 'internal_error' };
  const headers = status === 405 ? { Allow: error.allow || 'GET, POST, OPTIONS' } : {};
  return jsonResponse(body, status, request, env, headers);
};
