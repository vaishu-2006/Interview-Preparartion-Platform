import apiClient from './apiClient';

const getStatus = () => apiClient.get('/push/status').then((res) => res.data);
const subscribe = (subscription) => apiClient.post('/push/subscribe', { subscription }).then((res) => res.data);
const unsubscribe = (endpoint) => apiClient.post('/push/unsubscribe', { endpoint }).then((res) => res.data);

export default { getStatus, subscribe, unsubscribe };
