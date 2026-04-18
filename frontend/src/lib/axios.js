import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.toLowerCase().includes('<html')) {
      return Promise.reject({
        response: {
          data: {
            message: "API returned HTML instead of JSON. Check your VITE_BACKEND_URL mapping. It must point to the backend domain and include /api (e.g. https://your-backend.com/api)."
          }
        }
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
