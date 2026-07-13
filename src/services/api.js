import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neovault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch a custom event so AuthContext can handle logout through React state
      // instead of directly mutating localStorage and forcing a hard page reload.
      window.dispatchEvent(new Event('neovault-auth-logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
