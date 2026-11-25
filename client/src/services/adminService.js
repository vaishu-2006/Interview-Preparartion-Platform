import apiClient from './apiClient';

const getStats = () => apiClient.get('/admin/stats').then((res) => res.data);
const listStudents = (params = {}) => apiClient.get('/admin/students', { params }).then((res) => res.data);
const assignProblem = (payload) => apiClient.post('/admin/assign-problem', payload).then((res) => res.data);
const listMyAssignments = () => apiClient.get('/admin/my-assignments').then((res) => res.data);
const createEvent = (payload) => apiClient.post('/admin/events', payload).then((res) => res.data);
const listEvents = () => apiClient.get('/admin/events').then((res) => res.data);
const listActiveEvents = () => apiClient.get('/admin/events/active').then((res) => res.data);
const awardPoints = (payload) => apiClient.post('/admin/award-points', payload).then((res) => res.data);
const getCohortAnalytics = (course) => apiClient.get('/admin/cohort-analytics', { params: { course } }).then((res) => res.data);
const checkCodeSimilarity = (slug) => apiClient.get('/admin/code-similarity', { params: { slug } }).then((res) => res.data);

export default {
  getStats,
  listStudents,
  assignProblem,
  listMyAssignments,
  createEvent,
  listEvents,
  listActiveEvents,
  awardPoints,
  getCohortAnalytics,
  checkCodeSimilarity,
};
