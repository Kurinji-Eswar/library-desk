import http from './client.js';

export const categoriesApi = {
  getAll: () => http.get('/categories'),
  getById: (id) => http.get(`/categories/${id}`),
  create: (name, description) => http.post('/categories', { name, description }),
  update: (id, name, description) => http.put(`/categories/${id}`, { name, description }),
  delete: (id) => http.delete(`/categories/${id}`),
};
