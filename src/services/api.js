import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-marketplace-4y8z.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');


// Products
export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Sales
export const getSales = () => api.get('/sales');
export const createSale = (data) => api.post('/sales', data);

// Analytics
export const getDashboard = () => api.get('/analytics/dashboard');
export const getBestSellers = () => api.get('/analytics/best-sellers');
export const getRevenue = () => api.get('/analytics/revenue');

// Notifications
export const getNotifications = (params) => api.get('/notifications', { params });
export const generateNotifications = () => api.post('/notifications/generate');
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllAsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Payments
export const getPlans = () => api.get('/payments/plans');
export const createPaymentLink = (plan) => api.post('/payments/create', { plan });
export const getMySubscription = () => api.get('/payments/my-subscription');

export default api;