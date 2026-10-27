import http from './client.js';

export const dashboardApi = {
  getSummary: () => http.get('/dashboard/summary'),
  getRecentActivity: () => http.get('/dashboard/recent-activity'),
};
