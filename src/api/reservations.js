import http from './client.js';

export const reservationsApi = {
  getAll: (status) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    const qs = params.toString();
    return http.get(`/reservations${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => http.get(`/reservations/${id}`),
  create: (resData) => http.post('/reservations', resData),
  cancel: (id) => http.post(`/reservations/${id}/cancel`),
  markReady: (id) => http.post(`/reservations/${id}/ready`),
  fulfill: (id) => http.post(`/reservations/${id}/fulfill`),
};
