import http from './client.js';

export const loansApi = {
  getAll: (status) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    const qs = params.toString();
    return http.get(`/loans${qs ? `?${qs}` : ''}`);
  },
  getOverdue: () => http.get('/loans/overdue'),
  getById: (id) => http.get(`/loans/${id}`),
  issue: (loanData) => http.post('/loans', loanData),
  returnLoan: (id, waiveFine = false, returnDate = null) =>
    http.post(`/loans/${id}/return`, { waiveFine, returnDate }),
};
