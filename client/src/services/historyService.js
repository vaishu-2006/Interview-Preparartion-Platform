import apiClient from './apiClient';

const getHistory = () => apiClient.get('/history').then((res) => res.data);
const getPerformance = () => apiClient.get('/history/performance').then((res) => res.data);

export default { getHistory, getPerformance };
