import apiClient from './apiClient';

const list = () => apiClient.get('/notifications').then((res) => res.data);
const markRead = (id) => apiClient.put(`/notifications/${id}/read`).then((res) => res.data);
const markAllRead = () => apiClient.put('/notifications/read-all').then((res) => res.data);

export default { list, markRead, markAllRead };
