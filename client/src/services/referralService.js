import apiClient from './apiClient';

const list = () => apiClient.get('/referrals').then((res) => res.data);
const create = (payload) => apiClient.post('/referrals', payload).then((res) => res.data);
const remove = (id) => apiClient.delete(`/referrals/${id}`).then((res) => res.data);

export default { list, create, remove };
