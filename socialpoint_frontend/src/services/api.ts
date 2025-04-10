// src/services/api.ts
import axios from 'axios';
import { API_URL } from '../config';

export const api = axios.create({
  baseURL: API_URL, // Using the environment variable from config
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptors for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});