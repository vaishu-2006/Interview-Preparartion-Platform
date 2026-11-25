import apiClient from './apiClient';

const list = (slug) => apiClient.get(`/discussions/${slug}`).then((res) => res.data);
const create = (slug, body) => apiClient.post(`/discussions/${slug}`, { body }).then((res) => res.data);
const remove = (id) => apiClient.delete(`/discussions/comment/${id}`).then((res) => res.data);

export default { list, create, remove };
