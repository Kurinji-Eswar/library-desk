const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Standard HTTP client for Spring Boot REST API communication.
 * Unwraps ApiResponse<T> or throws formatted errors.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { message: await res.text() };
    }

    if (!res.ok) {
      const errorMsg = data?.message || data?.error || `HTTP error ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.validationErrors = data?.validationErrors;
      throw err;
    }

    // Spring Boot returns ApiResponse { success, message, data }
    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkErr = new Error('Cannot connect to Spring Boot backend. Please ensure the backend is running on ' + API_BASE_URL);
      networkErr.isNetworkError = true;
      throw networkErr;
    }
    throw err;
  }
}

export default {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};
