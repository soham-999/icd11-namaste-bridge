// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const backendApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const mappingApi = axios.create({
  baseURL: import.meta.env.VITE_MAPPING_ENGINE_URL ?? 'http://localhost:8000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

function attachAuthInterceptor(instance: typeof backendApi) {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

attachAuthInterceptor(backendApi);
attachAuthInterceptor(mappingApi);

export const USE_SAMPLE_DATA = import.meta.env.VITE_USE_SAMPLE_DATA === 'true';