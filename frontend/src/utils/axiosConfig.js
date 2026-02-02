import axios from 'axios';
import { toast } from 'sonner';
import store from '../redux/store';
import { logout } from '../redux/authSlice';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only log non-404 errors (404 is expected when no data exists)
    if (error.response?.status !== 404) {
      console.log('Axios interceptor error:', error.response?.status, error.response?.data);
    }
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      store.dispatch(logout());
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 