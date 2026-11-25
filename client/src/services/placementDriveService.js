import apiClient from './apiClient';

const startDrive = (payload) => apiClient.post('/placement-drive', payload).then((res) => res.data);
const getActiveDrive = () => apiClient.get('/placement-drive/active').then((res) => res.data);
const getDrives = () => apiClient.get('/placement-drive').then((res) => res.data);
const getDrive = (driveId) => apiClient.get(`/placement-drive/${driveId}`).then((res) => res.data);
const abandonDrive = (driveId) => apiClient.post(`/placement-drive/${driveId}/abandon`).then((res) => res.data);

// `file` is optional — omit it to screen the resume already saved in the Resume Builder.
const runResumeScreening = (driveId, file) => {
  if (!file) {
    return apiClient.post(`/placement-drive/${driveId}/resume-screening`).then((res) => res.data);
  }
  const formData = new FormData();
  formData.append('resumeFile', file);
  return apiClient.post(`/placement-drive/${driveId}/resume-screening`, formData).then((res) => res.data);
};

const startAssessment = (driveId) =>
  apiClient.post(`/placement-drive/${driveId}/online-assessment/start`).then((res) => res.data);
const syncAssessment = (driveId, payload) =>
  apiClient.post(`/placement-drive/${driveId}/online-assessment/sync`, payload).then((res) => res.data);

const startTechnicalInterview = (driveId) =>
  apiClient.post(`/placement-drive/${driveId}/technical-interview/start`).then((res) => res.data);
const startHrInterview = (driveId) =>
  apiClient.post(`/placement-drive/${driveId}/hr-interview/start`).then((res) => res.data);
const syncInterviewStage = (driveId) =>
  apiClient.post(`/placement-drive/${driveId}/interview-stage/sync`).then((res) => res.data);

const finalize = (driveId) => apiClient.post(`/placement-drive/${driveId}/finalize`).then((res) => res.data);

const downloadReportPdf = async (driveId) => {
  const res = await apiClient.get(`/placement-drive/${driveId}/report/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'placement-drive-report.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default {
  startDrive,
  getActiveDrive,
  getDrives,
  getDrive,
  abandonDrive,
  runResumeScreening,
  startAssessment,
  syncAssessment,
  startTechnicalInterview,
  startHrInterview,
  syncInterviewStage,
  finalize,
  downloadReportPdf,
};
