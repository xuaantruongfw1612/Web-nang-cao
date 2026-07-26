import axiosClient from './axiosClient';

export const authApi = {
  register: (payload) => axiosClient.post('/api/auth/register', payload).then((r) => r.data),

  login: (payload) => axiosClient.post('/api/auth/login', payload).then((r) => r.data),

  refresh: (refreshToken) =>
    axiosClient.post('/api/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: () => axiosClient.post('/api/auth/logout').then((r) => r.data),

  getProfile: () => axiosClient.get('/api/auth/profile').then((r) => r.data),

  updateProfile: (payload) => axiosClient.patch('/api/auth/profile', payload).then((r) => r.data),

  changePassword: (payload) =>
    axiosClient.patch('/api/auth/change-password', payload).then((r) => r.data),
};
