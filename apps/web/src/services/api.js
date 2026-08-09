/**
 * API Service Client for @securevoyage/web
 */

const API_BASE_URL = 'http://localhost:4000/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('sv_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }
    return data;
  } catch (err) {
    console.warn(`[API] Fetch to ${endpoint} failed, falling back to local state:`, err.message);
    throw err;
  }
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getNearbyServices: (type = 'all') => request(`/nearby-services?type=${type}`),
  sendAssistantMessage: (payload) => request('/assistant/messages', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  updatePreferences: (payload) => request('/auth/me/preferences', { method: 'PATCH', body: JSON.stringify(payload) })
};
