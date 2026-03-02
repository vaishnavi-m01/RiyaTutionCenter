// src/api/apiClient.tsx
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import config from '../config/enviroment';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false,
  validateStatus: (status) => status >= 200 && status < 300,
});

// ✅ Request interceptor (NO AsyncStorage)
apiClient.interceptors.request.use(
  async (config: any) => {
    // If you want to add token later, you can do it here
    // Example (later):
    // config.headers.Authorization = `Bearer ${token}`;
    config.metadata = { startTime: Date.now() };

    // Set Content-Type for POST/PUT requests with data, but not for DELETE/GET
    if ((config.method === 'post' || config.method === 'put') && config.data) {
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    // Log request details for debugging
    if (__DEV__) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

//  Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      const start = (response.config as any).metadata?.startTime;
      const duration = start ? Date.now() - start : 'unknown';
      console.log(
        `✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
        { status: response.status, data: response.data }
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (__DEV__) {
      console.error(`❌ API Error: ${originalRequest?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized (401) - user may need to login again');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
