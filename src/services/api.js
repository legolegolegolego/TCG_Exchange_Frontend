import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Interceptor para agregar token a todas las peticiones que lo requieran
api.interceptors.request.use(config => {
  // No adjuntar Authorization en endpoints de auth (login/register)
  const url = config.url || "";
  const isAuthEndpoint = url.startsWith("/auth");
  if (isAuthEndpoint) return config;

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;