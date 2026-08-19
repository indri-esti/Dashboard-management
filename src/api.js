import axios from "axios";

const api = axios.create({
  baseURL: "https://dashboard-management-be-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Cek koneksi backend
export const checkBackend = async () => {
  const response = await api.get("/");
  return response.data;
};

export default api;