import axios from 'axios';

// Usar localhost en desarrollo, Railway en producción
const baseURL = import.meta.env.PROD 
    ? 'https://gimnasiopr-production.up.railway.app/api' 
    : 'http://localhost:3000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Agregar token a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Manejar errores 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;