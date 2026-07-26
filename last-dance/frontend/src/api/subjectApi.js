import axiosClient from './axiosClient';

export const subjectApi = {
  getAll: () => axiosClient.get('/subjects').then((r) => r.data),

  getOne: (id) => axiosClient.get(`/subjects/${id}`).then((r) => r.data),

  create: (payload) => axiosClient.post('/subjects', payload).then((r) => r.data),

  update: (id, payload) => axiosClient.patch(`/subjects/${id}`, payload).then((r) => r.data),

  remove: (id) => axiosClient.delete(`/subjects/${id}`).then((r) => r.data),
};
