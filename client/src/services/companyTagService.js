import apiClient from './apiClient';

const list = (slug) => apiClient.get(`/company-tags/${slug}`).then((res) => res.data);
const add = (slug, company, roundType) => apiClient.post(`/company-tags/${slug}`, { company, roundType }).then((res) => res.data);

export default { list, add };
