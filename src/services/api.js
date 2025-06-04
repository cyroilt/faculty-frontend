import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id, params = {}) => api.get(`/api/categories/${id}`, { params }),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Recordings API
export const recordingsAPI = {
  getAll: (params = {}) => api.get('/api/recordings', { params }),
  getById: (id) => api.get(`/api/recordings/${id}`),
  create: (data) => api.post('/api/recordings', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, data) => api.put(`/api/recordings/${id}`, data),
  delete: (id) => api.delete(`/api/recordings/${id}`),
  download: (id) => api.get(`/api/recordings/${id}/download`, {
    responseType: 'blob',
  }),
  like: (id) => api.post(`/api/recordings/${id}/like`),
  unlike: (id) => api.delete(`/api/recordings/${id}/like`),
  getUserRecordings: (params = {}) => api.get('/api/recordings/my', { params }),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/password', data),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
};

// Admin API
export const adminAPI = {
  getUsers: (params = {}) => api.get('/api/admin/users', { params }),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getPendingRecordings: (params = {}) => api.get('/api/admin/recordings/pending', { params }),
  approveRecording: (id) => api.put(`/api/admin/recordings/${id}/approve`),
  rejectRecording: (id, reason) => api.put(`/api/admin/recordings/${id}/reject`, { reason }),
  getStats: () => api.get('/api/admin/stats'),
};

export default api;
