import apiClient from './apiClient';

const downloadMyData = async () => {
  const res = await apiClient.get('/account/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'placementprep-my-data.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default { downloadMyData };
