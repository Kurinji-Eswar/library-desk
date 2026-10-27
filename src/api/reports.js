import http from './client.js';

export const reportsApi = {
  getOverview: () => http.get('/reports/overview'),
  getOverdue: () => http.get('/reports/overdue'),
  getInventoryByCategory: () => http.get('/reports/inventory-by-category'),
  getPopularBooks: () => http.get('/reports/popular-books'),
  getMemberLoanHistory: (memberId) => http.get(`/reports/member-loan-history/${memberId}`),
};
