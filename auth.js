(() => {
  const config = window.OPEN_MOTION_CONFIG || {};
  const apiBase = String(config.apiBaseUrl || config.oauthUrl || '').replace(/\/$/, '');
  const loginButton = document.querySelector('#auth-login');
  const logoutButton = document.querySelector('#auth-logout');
  const accountLabel = document.querySelector('#auth-account');
  let status = { authenticated: false };
  let statusPromise = null;

  const dispatch = (detail = {}) => window.dispatchEvent(new CustomEvent('open-motion-auth-change', { detail }));
  const endpoint = (path) => {
    if (!apiBase) throw Object.assign(new Error('worker_unconfigured'), { code: 'worker_unconfigured' });
    return `${apiBase}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const updateControls = () => {
    if (loginButton) loginButton.hidden = status.authenticated;
    if (logoutButton) logoutButton.hidden = !status.authenticated;
    if (accountLabel) accountLabel.textContent = status.authenticated ? `@${status.user?.login || 'GitHub'}` : '';
    document.documentElement.dataset.authenticated = status.authenticated ? 'true' : 'false';
  };

  const apiFetch = async (path, options = {}) => {
    const request = { ...options, credentials: 'include', headers: { Accept: 'application/json', ...(options.headers || {}) } };
    if (request.body && typeof request.body !== 'string') {
      request.body = JSON.stringify(request.body);
      request.headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(endpoint(path), request);
    let body = null;
    try { body = await response.json(); } catch { /* empty 204 responses are valid */ }
    if (!response.ok) {
      const error = Object.assign(new Error(body?.error || `worker_${response.status}`), { status: response.status, code: body?.error || `worker_${response.status}`, body });
      throw error;
    }
    return body;
  };

  const getStatus = async ({ silent = false } = {}) => {
    if (statusPromise) return statusPromise;
    statusPromise = (async () => {
      try {
        const next = await apiFetch('/api/status');
        status = next?.authenticated ? next : { authenticated: false };
      } catch (error) {
        status = { authenticated: false, unavailable: true, error: error.code || 'worker_unavailable' };
        if (!silent) dispatch({ status, error });
      }
      updateControls();
      dispatch({ status });
      return status;
    })().finally(() => { statusPromise = null; });
    return statusPromise;
  };

  const startLogin = async () => {
    const result = await apiFetch('/auth/start', { method: 'POST', body: {} });
    if (!result?.authorizeUrl || !/^https:\/\/github\.com\/login\/oauth\/authorize\?/.test(result.authorizeUrl)) throw new Error('invalid_authorize_url');
    window.location.assign(result.authorizeUrl);
  };

  const logout = async () => {
    await apiFetch('/api/logout', { method: 'POST', body: {} });
    status = { authenticated: false };
    updateControls();
    dispatch({ status });
  };

  loginButton?.addEventListener('click', async () => {
    loginButton.disabled = true;
    try { await startLogin(); } catch (error) {
      loginButton.disabled = false;
      dispatch({ error, status });
    }
  });
  logoutButton?.addEventListener('click', async () => {
    logoutButton.disabled = true;
    try { await logout(); } catch (error) { dispatch({ error, status }); }
    logoutButton.disabled = false;
  });

  const authFragment = window.location.hash.match(/^#auth=(success|error)$/)?.[1];
  if (authFragment) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  updateControls();
  window.OpenMotionAuth = Object.freeze({ apiFetch, getStatus, startLogin, logout, get status() { return status; }, authFragment });
  getStatus({ silent: true });
})();
