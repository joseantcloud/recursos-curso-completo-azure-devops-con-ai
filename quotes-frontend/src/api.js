const runtimeConfig = window.__APP_CONFIG__ || {};
export const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || runtimeConfig.API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export const RUNTIME_FEATURE_FLAGS = {
  public_feed_enabled: runtimeConfig.FEATURE_PUBLIC_FEED_ENABLED ?? true,
  photo_upload_enabled: runtimeConfig.FEATURE_PHOTO_UPLOAD_ENABLED ?? true,
  maintenance_mode_enabled: runtimeConfig.FEATURE_MAINTENANCEMODE_ENABLED ?? false,
};

export function getToken() {
  return localStorage.getItem('quotes_token');
}

export function setToken(token) {
  localStorage.setItem('quotes_token', token);
}

export function clearToken() {
  localStorage.removeItem('quotes_token');
}

async function handleResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.error ? payload.error : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export async function apiGet(path, { auth = false } = {}) {
  const headers = {};
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  return handleResponse(response);
}

export async function apiJson(path, body, { method = 'POST', auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: JSON.stringify(body)
  });
  return handleResponse(response);
}

export async function apiForm(path, formData, { method = 'POST', auth = true } = {}) {
  const headers = {};
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: formData
  });
  return handleResponse(response);
}

export async function apiDelete(path, { auth = true } = {}) {
  const headers = {};
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE', headers });
  return handleResponse(response);
}
