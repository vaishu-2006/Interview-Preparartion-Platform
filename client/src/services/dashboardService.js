import apiClient from './apiClient';

const getDashboard = () => apiClient.get('/dashboard').then((res) => res.data);
const updateDashboard = (payload) => apiClient.put('/dashboard/update', payload).then((res) => res.data);
const getBranchOptions = () => apiClient.get('/selection/branches').then((res) => res.data);
const saveCourse = (course) => apiClient.post('/selection/save-course', { course }).then((res) => res.data);
const saveBranch = (branch) => apiClient.post('/selection/save-branch', { branch }).then((res) => res.data);

export default { getDashboard, updateDashboard, getBranchOptions, saveCourse, saveBranch };
