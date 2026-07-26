import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Quản lý token trong bộ nhớ (không lưu accessToken vào localStorage để
// giảm rủi ro XSS đọc trộm; chỉ refreshToken được lưu localStorage vì cần
// sống sót qua lần tải lại trang, và tự nó đã được xoay vòng (rotate) mỗi
// lần dùng nên rủi ro thấp hơn nhiều so với để accessToken tồn tại lâu). ---
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function getStoredRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setStoredRefreshToken(token) {
  if (token) localStorage.setItem('refreshToken', token);
  else localStorage.removeItem('refreshToken');
}

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Khi accessToken hết hạn (401), tự động gọi /refresh 1 lần rồi thử lại
// request cũ. Nhiều request 401 cùng lúc chỉ trigger refresh 1 lần (hàng đợi).
let isRefreshing = false;
let pendingQueue = [];

function resolveQueue(error, token) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/login') ||
      originalRequest?.url?.includes('/api/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Đã có 1 lần refresh đang chạy -> xếp hàng chờ kết quả thay vì gọi thêm
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) throw new Error('Không có refreshToken');

        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        setAccessToken(data.accessToken);
        setStoredRefreshToken(data.refreshToken);

        resolveQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        resolveQueue(refreshError, null);
        setAccessToken(null);
        setStoredRefreshToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
