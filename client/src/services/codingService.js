import apiClient from './apiClient';

const listProblems = (params = {}) => apiClient.get('/coding/problems', { params }).then((res) => res.data);
const getProblem = (slug) => apiClient.get(`/coding/problems/${slug}`).then((res) => res.data);
const runCode = (slug, payload) => apiClient.post(`/coding/problems/${slug}/run`, payload).then((res) => res.data);
const submitCode = (slug, payload) => apiClient.post(`/coding/problems/${slug}/submit`, payload).then((res) => res.data);
const reviewCode = (slug, payload) => apiClient.post(`/coding/problems/${slug}/review`, payload).then((res) => res.data);
const explainFailure = (slug, payload) => apiClient.post(`/coding/problems/${slug}/explain`, payload).then((res) => res.data);
const getHistory = () => apiClient.get('/coding/history').then((res) => res.data);
const getProgress = () => apiClient.get('/coding/progress').then((res) => res.data);
const getLeaderboard = (scope) => apiClient.get('/coding/leaderboard', { params: scope ? { scope } : {} }).then((res) => res.data);
const getDailyChallenge = () => apiClient.get('/coding/daily').then((res) => res.data);
const getRatings = (slug) => apiClient.get(`/coding/problems/${slug}/ratings`).then((res) => res.data);
const rateProblem = (slug, payload) => apiClient.post(`/coding/problems/${slug}/ratings`, payload).then((res) => res.data);

export default {
  listProblems,
  getProblem,
  runCode,
  submitCode,
  reviewCode,
  explainFailure,
  getHistory,
  getProgress,
  getLeaderboard,
  getDailyChallenge,
  getRatings,
  rateProblem,
};
