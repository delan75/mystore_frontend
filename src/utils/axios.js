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
        // Skip token handling for refresh token requests to avoid loops
        // and for currency-related endpoints to ensure all users can access them
        if (config.url && (
            config.url.includes('/auth/token/refresh/') ||
            config.url.includes('/store/currencies/')
        )) {
            console.log(`Skipping token for ${config.url}`);
            return config;
        }

        // Get the token from localStorage
        const token = localStorage.getItem('accessToken');

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`Adding token to ${config.url}`);
        } else {
            console.log(`No token available for ${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.status, error.response.data);

            // Handle specific status codes
            if (error.response.status === 401) {
                console.log('Unauthorized request detected');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default instance;