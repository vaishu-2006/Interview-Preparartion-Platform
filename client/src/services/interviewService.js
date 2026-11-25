import apiClient from './apiClient';

const createConfig = (formData) =>
  apiClient
    .post('/interview/config', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);
const startSession = (configId) => apiClient.post('/interview/start', { configId }).then((res) => res.data);
const getSession = (sessionId) => apiClient.get(`/interview/session/${sessionId}`).then((res) => res.data);
const answerTurn = (sessionId, index, payload) =>
  apiClient.post(`/interview/session/${sessionId}/turn/${index}/answer`, payload).then((res) => res.data);
const skipTurn = (sessionId, index) =>
  apiClient.post(`/interview/session/${sessionId}/turn/${index}/skip`).then((res) => res.data);
const recordMetric = (sessionId, sample) =>
  apiClient.post(`/interview/session/${sessionId}/metrics`, sample).then((res) => res.data);
const recordViolation = (sessionId, payload) =>
  apiClient.post(`/interview/session/${sessionId}/violation`, payload).then((res) => res.data);
const completeSession = (sessionId, payload) =>
  apiClient.post(`/interview/session/${sessionId}/complete`, payload).then((res) => res.data);
const getReport = (sessionId) => apiClient.get(`/interview/session/${sessionId}/report`).then((res) => res.data);
const getSessions = () => apiClient.get('/interview/sessions').then((res) => res.data);
const getReports = () => apiClient.get('/interview/reports').then((res) => res.data);

const downloadReportPdf = async (sessionId) => {
  const res = await apiClient.get(`/interview/session/${sessionId}/report/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'interview-report.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default {
  createConfig,
  startSession,
  getSession,
  answerTurn,
  skipTurn,
  recordMetric,
  recordViolation,
  completeSession,
  getReport,
  getSessions,
  getReports,
  downloadReportPdf,
};
