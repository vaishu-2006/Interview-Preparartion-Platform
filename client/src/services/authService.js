import apiClient from './apiClient';

const register = (payload) => apiClient.post('/auth/register', payload).then((res) => res.data);
const login = (payload) => apiClient.post('/auth/login', payload).then((res) => res.data);
const logout = () => apiClient.post('/auth/logout').then((res) => res.data);
const getCurrentUser = () => apiClient.get('/auth/profile').then((res) => res.data);
const forgotPassword = (email) =>
  apiClient.post('/auth/forgot-password', { email }).then((res) => res.data);
const resetPassword = (token, password) =>
  apiClient.post('/auth/reset-password', { token, password }).then((res) => res.data);
const changePassword = (currentPassword, newPassword) =>
  apiClient.post('/auth/change-password', { currentPassword, newPassword }).then((res) => res.data);
const deleteAccount = () => apiClient.delete('/auth/delete-account').then((res) => res.data);

export default {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
};
