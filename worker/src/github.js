const API = 'https://api.github.com';

export class UpstreamError extends Error {
  constructor(status, code = 'github_upstream_error') {
    super(code);
    this.status = status;
    this.code = code;
  }
}

const headers = (env, token = '') => {
  const value = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': env.GITHUB_API_VERSION || '2022-11-28' };
  if (token) value.Authorization = `Bearer ${token}`;
  return value;
};

const readResponse = async (response) => {
  let payload = null;
  try { payload = await response.json(); } catch { /* upstream body is intentionally discarded */ }
  return payload;
};

export const exchangeCode = async ({ code, verifier, redirectUri }, env) => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: redirectUri, code_verifier: verifier })
  });
  const payload = await readResponse(response);
  if (!response.ok || !payload?.access_token) throw new UpstreamError(response.status || 502, 'oauth_exchange_failed');
  return payload.access_token;
};

export const fetchGitHubUser = async (token, env) => {
  const response = await fetch(`${API}/user`, { headers: headers(env, token) });
  const payload = await readResponse(response);
  if (!response.ok || !payload?.login || !Number.isInteger(payload.id)) throw new UpstreamError(response.status || 502, response.status === 401 ? 'session_invalid' : 'user_lookup_failed');
  return { login: String(payload.login).slice(0, 128), id: payload.id };
};

const publicDiscussion = (item) => ({
  id: item?.id || item?.node_id || '',
  number: item?.number || 0,
  title: typeof item?.title === 'string' ? item.title.slice(0, 300) : '',
  body: typeof item?.body === 'string' ? item.body.slice(0, 50000) : '',
  html_url: typeof item?.html_url === 'string' ? item.html_url : '',
  url: typeof item?.url === 'string' ? item.url : '',
  created_at: item?.created_at || '',
  updated_at: item?.updated_at || '',
  comments: Number.isFinite(Number(item?.comments)) ? Number(item.comments) : 0,
  user: item?.user?.login ? { login: String(item.user.login).slice(0, 128) } : null,
  category: item?.category?.name ? { name: String(item.category.name).slice(0, 128) } : null,
  labels: Array.isArray(item?.labels) ? item.labels.slice(0, 20).map((label) => ({ name: String(label?.name || label).slice(0, 80) })) : []
});

export const fetchDiscussions = async (env, token = '') => {
  const owner = encodeURIComponent(env.GITHUB_OWNER || '');
  const repo = encodeURIComponent(env.GITHUB_REPO || '');
  const limit = Math.min(100, Math.max(1, Number(env.FEED_LIMIT) || 30));
  const response = await fetch(`${API}/repos/${owner}/${repo}/discussions?per_page=${limit}`, { headers: headers(env, token) });
  const payload = await readResponse(response);
  if (!response.ok) throw new UpstreamError(response.status || 502, response.status === 401 ? 'session_invalid' : response.status === 403 || response.status === 429 ? 'rate_limited' : 'github_feed_failed');
  if (!Array.isArray(payload)) throw new UpstreamError(502, 'invalid_feed');
  return payload.map(publicDiscussion);
};
