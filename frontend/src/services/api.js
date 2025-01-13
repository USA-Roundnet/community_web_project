import axios from 'axios';

// Get the backend URL from the .env file
const apiUrl = import.meta.env.VITE_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
