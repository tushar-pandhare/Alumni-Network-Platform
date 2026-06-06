/**
 * Centralised API configuration.
 *
 * Development:  Vite proxies backend calls (vite.config.js), BASE_URL = ""
 * Production:   Set VITE_API_BASE_URL env var (e.g. https://api.yourdomain.com)
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

/**
 * Authenticated fetch helper.
 * Attaches JWT token, handles 401 auto-redirect.
 */
export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(apiUrl(path), { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }

  return response;
};
