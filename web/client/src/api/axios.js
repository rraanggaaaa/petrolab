import axios from 'axios';

// Base URL dari backend Express (port 5000)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper functions for token management
const getToken = () => {
  return localStorage.getItem('token');
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Buat axios instance dengan konfigurasi default
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik timeout
});

// Request Interceptor - Menambahkan token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = getToken();
    
    console.log('Request URL:', config.url);
    console.log('Token exists:', !!token);
    
    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Menangani error global
api.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.config?.url, error.response?.status);
    
    // Handle error 401 (Unauthorized) - Token expired atau invalid
    if (error.response?.status === 401) {
      console.log('Unauthorized! Clearing auth data...');
      clearAuth();
      
      // Redirect ke halaman login
      window.location.href = '/login';
    }
    
    // Handle error 403 (Forbidden)
    if (error.response?.status === 403) {
      console.error('Access denied. You dont have permission.');
    }
    
    // Handle error 500 (Server Error)
    if (error.response?.status === 500) {
      console.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default api;