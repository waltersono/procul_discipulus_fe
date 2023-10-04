import axios from "axios";
export const apiUrl = process.env.REACT_APP_API_URL;


const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/`
});

api.interceptors.request.use(async config => {
  const token = localStorage.getItem('@techworks-Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
