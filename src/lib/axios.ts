import axios from 'axios';

const VITE_API_BASE_URL = "http://localhost:3000/api"
// const VITE_API_BASE_URL = "https://multi-dialer-be-production.up.railway.app/api"

const api = axios.create({
    // production url 
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    // development url
    baseURL: VITE_API_BASE_URL,
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

