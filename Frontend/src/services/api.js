import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5020/api/v1"
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // ĐÃ SỬA: Phải kiểm tra thật kỹ xem token có hợp lệ không mới được gắn vào
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;