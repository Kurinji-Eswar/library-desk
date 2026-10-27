import http from './client.js';

export const migrationApi = {
  importLocalStorageData: (payload) => http.post('/migration/import', payload),
};
