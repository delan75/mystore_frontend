import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/',  // Base URL for all API requests
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to include the auth token in all requests
instance.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('accessToken');

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;