import apiClient from './apiClient';

const getMySettings = () => apiClient.get('/portfolio/settings').then((res) => res.data);
const setPublic = (isPublic) => apiClient.put('/portfolio/settings', { isPublic }).then((res) => res.data);
const getPublicPortfolio = (slug) => apiClient.get(`/portfolio/${slug}`).then((res) => res.data);

export default { getMySettings, setPublic, getPublicPortfolio };
