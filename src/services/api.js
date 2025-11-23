import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;