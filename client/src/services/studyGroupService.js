import apiClient from './apiClient';

const list = () => apiClient.get('/study-groups').then((res) => res.data);
const create = (payload) => apiClient.post('/study-groups', payload).then((res) => res.data);
const join = (groupId) => apiClient.post(`/study-groups/${groupId}/join`).then((res) => res.data);
const leave = (groupId) => apiClient.post(`/study-groups/${groupId}/leave`).then((res) => res.data);
const listMessages = (groupId) => apiClient.get(`/study-groups/${groupId}/messages`).then((res) => res.data);
const postMessage = (groupId, body) => apiClient.post(`/study-groups/${groupId}/messages`, { body }).then((res) => res.data);

export default { list, create, join, leave, listMessages, postMessage };
