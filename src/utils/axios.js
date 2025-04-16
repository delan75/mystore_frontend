import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/',  // Base URL for all API requests
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;