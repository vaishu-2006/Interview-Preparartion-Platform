import apiClient from './apiClient';

const list = () => apiClient.get('/job-applications').then((res) => res.data);
const create = (payload) => apiClient.post('/job-applications', payload).then((res) => res.data);
const update = (id, payload) => apiClient.put(`/job-applications/${id}`, payload).then((res) => res.data);
const remove = (id) => apiClient.delete(`/job-applications/${id}`).then((res) => res.data);

export default { list, create, update, remove };
