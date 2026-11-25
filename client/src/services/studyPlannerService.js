import apiClient from './apiClient';

const list = () => apiClient.get('/study-planner').then((res) => res.data);
const create = (payload) => apiClient.post('/study-planner', payload).then((res) => res.data);
const update = (id, payload) => apiClient.put(`/study-planner/${id}`, payload).then((res) => res.data);
const remove = (id) => apiClient.delete(`/study-planner/${id}`).then((res) => res.data);

export default { list, create, update, remove };
