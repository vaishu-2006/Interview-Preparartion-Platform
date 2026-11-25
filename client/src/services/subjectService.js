import apiClient from './apiClient';

const getSubjects = (course) => apiClient.get('/subjects/subjects', { params: { course } }).then((res) => res.data);
const getQuiz = (course, subject, limit = 10) =>
  apiClient.get('/subjects/quiz', { params: { course, subject, limit } }).then((res) => res.data);
const submitAttempt = (payload) => apiClient.post('/subjects/submit', payload).then((res) => res.data);
const getStats = (course) => apiClient.get('/subjects/stats', { params: { course } }).then((res) => res.data);

export default { getSubjects, getQuiz, submitAttempt, getStats };
