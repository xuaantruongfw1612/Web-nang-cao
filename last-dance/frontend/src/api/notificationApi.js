import axiosClient from './axiosClient';

export const notificationApi = {
  getAll: () => axiosClient.get('/api/notifications').then((r) => r.data),

  getByTask: (taskId) => axiosClient.get(`/api/notifications/task/${taskId}`).then((r) => r.data),

  cancel: (id) => axiosClient.patch(`/api/notifications/${id}/cancel`).then((r) => r.data),
};
