import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // chỉ dùng 1 tên biến
  headers: { 'Content-Type': 'application/json' },
});

// request interceptor
api.interceptors.request.use(cfg => {
  cfg.headers = cfg.headers ?? {};
  cfg.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return cfg;
});

// response interceptor
api.interceptors.response.use(
  r => r,
  err => {
    console.error('[API Error]', err.response?.status, err.response?.data);
    
    // Extract error message from backend response
    if (err.response?.data) {
      const errorData = err.response.data;
      
      // Check for different error message formats
      let errorMessage = 'An error occurred';
      
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.details) {
        errorMessage = errorData.details;
      }
      
      // Create a new error with the extracted message
      const customError = new Error(errorMessage);
      customError.name = 'APIError';
      return Promise.reject(customError);
    }
    
    return Promise.reject(err);
  }
);

export default api;