import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://103.69.97.14/api/v1', 
  timeout: 10000, // Thêm timeout 10s tránh treo app khi server chậm
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
    // Bỏ qua lỗi nếu là do request bị hủy (abort)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    
    // Xử lý timeout
    if (error.code === 'ECONNABORTED') {
      toast.error('Kết nối đến máy chủ thất bại (Timeout). Vui lòng thử lại sau.');
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data;

    if (status === 401) {
      // Trường hợp 1: Lỗi từ API Đăng nhập -> Trả về lỗi để component xử lý (ví dụ: Sai mật khẩu)
      if (error.config.url.toLowerCase().includes('/auth/signin')) {
        return Promise.reject(error);
      }

      // Trường hợp 2: Token hết hạn hoặc không hợp lệ -> Xóa token và chuyển về trang signin
      // Chỉ redirect nếu hiện tại KHÔNG phải là trang signin hoặc login để tránh reload loop
      const path = window.location.pathname.toLowerCase();
      if (!path.includes('/signin') && !path.includes('/login')) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/signin";
      } else {
        // Nếu đang ở trang đăng nhập mà gặp 401 (ngoài endpoint /signin) thì cứ reject
        return Promise.reject(error);
      }
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