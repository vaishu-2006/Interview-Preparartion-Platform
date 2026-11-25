import apiClient from './apiClient';

const searchRoadmap = (role) => apiClient.post('/career/roadmap-search', { role }).then((res) => res.data);

export default { searchRoadmap };
