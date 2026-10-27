import http from './client.js';

export const membersApi = {
  getAll: (query, status) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status && status !== 'ALL') params.append('status', status);
    const qs = params.toString();
    return http.get(`/members${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => http.get(`/members/${id}`),
  create: (memberData) => http.post('/members', memberData),
  update: (id, memberData) => http.put(`/members/${id}`, memberData),
  toggleStatus: (id) => http.patch(`/members/${id}/toggle-status`),
  delete: (id) => http.delete(`/members/${id}`),
};
