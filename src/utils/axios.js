import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/auth/',  // Adjust this to match your Django backend URL
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;