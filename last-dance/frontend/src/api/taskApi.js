import axiosClient from './axiosClient';

export const taskApi = {
  getAll: () => axiosClient.get('/tasks').then((r) => r.data),

  getOne: (id) => axiosClient.get(`/tasks/${id}`).then((r) => r.data),

  create: (payload) => axiosClient.post('/tasks', payload).then((r) => r.data),

  update: (id, payload) => axiosClient.patch(`/tasks/${id}`, payload).then((r) => r.data),

  remove: (id) => axiosClient.delete(`/tasks/${id}`).then((r) => r.data),
};
