import apiClient from './apiClient';

const getCurrent = () => apiClient.get('/contests/current').then((res) => res.data);
const getPrevious = () => apiClient.get('/contests/previous').then((res) => res.data);
const getLeaderboard = (contestId, scope) =>
  apiClient.get(`/contests/${contestId}/leaderboard`, { params: scope ? { scope } : {} }).then((res) => res.data);
const getMyStats = () => apiClient.get('/contests/my-stats').then((res) => res.data);

const downloadCertificate = async (contestId) => {
  const res = await apiClient.get(`/contests/${contestId}/certificate`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'contest-certificate.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default { getCurrent, getPrevious, getLeaderboard, getMyStats, downloadCertificate };
