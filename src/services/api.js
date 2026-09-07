import axios from 'axios';
import { KEYS, getStoredItem } from './storageService';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredItem(KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages & standard status responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = error.response?.status;

    if (error.code === 'ECONNABORTED' || !error.response) {
      errorMessage = 'Network connection failed. Please check your internet connection.';
      statusCode = 0;
    } else if (statusCode === 400) {
      errorMessage = error.response.data?.message || 'Bad Request. Please check your input parameters.';
    } else if (statusCode === 401) {
      errorMessage = 'Session expired or unauthorized. Please login again.';
    } else if (statusCode === 403) {
      errorMessage = 'Access forbidden. You do not have permission for this action.';
    } else if (statusCode === 404) {
      errorMessage = 'Resource not found.';
    } else if (statusCode >= 500) {
      errorMessage = 'Internal server error. Please try again later.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = statusCode;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

// Utility delay for simulating realistic asynchronous network round-trips
export const simulateNetworkDelay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export default api;
