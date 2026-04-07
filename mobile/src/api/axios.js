import axios from 'axios';

// Ganti dengan IP laptop Anda
const API_URL = 'http://192.168.137.1:5000/api';

console.log('📡 API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.response?.config?.url);
    console.error('Message:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;