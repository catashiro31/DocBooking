import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5020/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Thêm Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: Xử lý 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data;

    if (status === 401) {
      // Token hết hạn hoặc không hợp lệ -> redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }

    if (status === 403) {
      // Tài khoản bị khóa -> hiển thị lý do ban
      const reason = typeof message === 'string' ? message : "Bạn không có quyền truy cập";
      toast.error(reason);
    }

    return Promise.reject(error);
  }
);

export default api;