import apiClient from './apiClient';

const downloadIcs = async () => {
  const res = await apiClient.get('/calendar/export.ics', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'placementprep-calendar.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default { downloadIcs };
