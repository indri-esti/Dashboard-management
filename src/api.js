import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
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