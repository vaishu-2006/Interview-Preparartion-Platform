import apiClient from './apiClient';

const getCategories = () => apiClient.get('/aptitude/categories').then((res) => res.data);
const getQuiz = (category, limit = 10) =>
  apiClient.get('/aptitude/quiz', { params: { category, limit } }).then((res) => res.data);
const submitAttempt = (payload) => apiClient.post('/aptitude/submit', payload).then((res) => res.data);
const getHistory = () => apiClient.get('/aptitude/history').then((res) => res.data);
const getStats = () => apiClient.get('/aptitude/stats').then((res) => res.data);
const practiceMore = (topic) => apiClient.post('/aptitude/practice-more', { topic }).then((res) => res.data);

export default { getCategories, getQuiz, submitAttempt, getHistory, getStats, practiceMore };
