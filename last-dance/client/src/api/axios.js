import axios from 'axios';

function getApiBaseUrl() {
  const { hostname, protocol } = window.location;
  if (hostname.includes('app.github.dev')) {
    return `${protocol}//${hostname.replace('-3000.', '-3001.')}`;
  }
  return 'http://localhost:3001';
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;