const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getAccount: () => request('/account'),

  getWatchlist: () => request('/watchlist'),
  getWatchlistTicker: (ticker) => request(`/watchlist/${ticker}`),

  getPositions: () => request('/positions'),
  closePosition: (id) => request(`/positions/${id}/close`, { method: 'POST' }),

  getHistory: () => request('/history'),

  getActivity: (ticker) => request(`/activity${ticker ? `?ticker=${ticker}` : ''}`),

  getRiskSettings: () => request('/risk'),
  updateRiskSettings: (settings) => request('/risk', { method: 'PUT', body: JSON.stringify(settings) }),
  getWatchlistSymbols: () => request('/risk/watchlist-symbols'),
  updateWatchlistSymbols: (symbols) =>
    request('/risk/watchlist-symbols', { method: 'PUT', body: JSON.stringify({ symbols }) }),

  getAgentStatus: () => request('/agent/status'),
  startAgent: () => request('/agent/start', { method: 'POST' }),
  stopAgent: () => request('/agent/stop', { method: 'POST' }),
  scanNow: () => request('/agent/scan-now', { method: 'POST' }),
};
