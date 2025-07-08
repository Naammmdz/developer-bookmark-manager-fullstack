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
    return Promise.reject(err);
  }
);

export default api;