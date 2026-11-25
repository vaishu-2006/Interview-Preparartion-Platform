import apiClient from './apiClient';

const getQuiz = (limit = 20, stage = 'Prelims') =>
  apiClient.get('/upsc/mock-tests/quiz', { params: { limit, stage } }).then((res) => res.data);
const submitQuiz = (payload) => apiClient.post('/upsc/mock-tests/submit', payload).then((res) => res.data);
const getStats = () => apiClient.get('/upsc/mock-tests/stats').then((res) => res.data);
const getRanking = () => apiClient.get('/upsc/mock-tests/ranking').then((res) => res.data);

const submitAnswerWriting = (payload) => apiClient.post('/upsc/answer-writing', payload).then((res) => res.data);
const getAnswerWritingHistory = () => apiClient.get('/upsc/answer-writing/history').then((res) => res.data);

const askDoubt = (question) => apiClient.post('/upsc/doubt-solver/ask', { question }).then((res) => res.data);

const getLiveCurrentAffairs = () => apiClient.get('/upsc/current-affairs/live').then((res) => res.data);

export default {
  getQuiz,
  submitQuiz,
  getStats,
  getRanking,
  submitAnswerWriting,
  getAnswerWritingHistory,
  askDoubt,
  getLiveCurrentAffairs,
};
