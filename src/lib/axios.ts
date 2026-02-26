import axios from 'axios';

const env = import.meta.env.VITE_NODE_ENV
const api = axios.create({
    baseURL: env === "production" ? import.meta.env.VITE_API_BASE_URL : "https://multi-dialer-be-production.up.railway.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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

