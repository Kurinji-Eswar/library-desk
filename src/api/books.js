import http from './client.js';

export const booksApi = {
  getAll: (query, category) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'ALL') params.append('category', category);
    const qs = params.toString();
    return http.get(`/books${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => http.get(`/books/${id}`),
  create: (bookData) => http.post('/books', bookData),
  update: (id, bookData) => http.put(`/books/${id}`, bookData),
  delete: (id) => http.delete(`/books/${id}`),
};
