import axios from "axios";
import { ACCESS_TOKEN } from "../constants/tokenConstants";

const api = axios.create({
  baseURL: "http://localhost:8000",
  // if you want to try the qr code, you need to change baseURL to your backend server URL
  // e.g. baseURL: "http://<your_ip_address>:8000/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
