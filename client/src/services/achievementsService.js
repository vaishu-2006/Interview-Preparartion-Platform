import apiClient from './apiClient';

const get = () => apiClient.get('/achievements').then((res) => res.data);

export default { get };
