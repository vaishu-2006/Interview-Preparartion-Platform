import apiClient from './apiClient';

const list = () => apiClient.get('/bookmarks').then((res) => res.data);
const create = (payload) => apiClient.post('/bookmarks', payload).then((res) => res.data);
const remove = (id) => apiClient.delete(`/bookmarks/${id}`).then((res) => res.data);

export default { list, create, remove };
