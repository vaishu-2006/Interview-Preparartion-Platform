import apiClient from './apiClient';

const getProfile = () => apiClient.get('/profile').then((res) => res.data);
const updateProfile = (payload) => apiClient.put('/profile/update', payload).then((res) => res.data);

export default { getProfile, updateProfile };
