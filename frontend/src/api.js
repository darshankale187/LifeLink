import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lifelink_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timed out. Please try again." });
    }
    if (!err.response) {
      return Promise.reject({ message: "Backend not reachable. Start the Spring Boot app on port 8080." });
    }

    const isAuthCall = err.config?.url?.startsWith("auth/");
    if (err.response.status === 401 && !isAuthCall) {
      ["lifelink_token", "lifelink_user", "lifelink_role"].forEach((k) => localStorage.removeItem(k));
      window.location.href = "/login";
    }
    if (err.response.status === 403) {
      return Promise.reject({ message: "You do not have permission to do this." });
    }

    const data = err.response.data || {};
    return Promise.reject(
      data.errors
        ? data
        : { message: data.message || data.error || `Request failed (${err.response.status})` }
    );
  }
);

export const getJson = async (path) => {
  const res = await api.get(path);
  return res.data;
};

export const postJson = async (path, body) => {
  const res = await api.post(path, body);
  return res.data;
};