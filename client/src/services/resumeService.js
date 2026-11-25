import apiClient from './apiClient';

const getResume = () => apiClient.get('/resume').then((res) => res.data);
const updateResume = (payload) => apiClient.put('/resume/update', payload).then((res) => res.data);
const deleteResume = () => apiClient.delete('/resume').then((res) => res.data);

const exportPdf = async () => {
  const res = await apiClient.get('/resume/export-pdf', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'resume.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const getGithubRepos = (username) => apiClient.get('/resume/github/repos', { params: { username } }).then((res) => res.data);
const importGithubRepos = (repos) => apiClient.post('/resume/github/import', { repos }).then((res) => res.data);

// `file` is optional — omit it to score the resume already saved in the Resume Builder.
// `jobDescription` is optional — when provided, scoring is matched against it.
const atsCheck = (file, jobDescription = '') => {
  if (!file) {
    return apiClient.post('/resume/ats-check', { jobDescription }).then((res) => res.data);
  }
  const formData = new FormData();
  formData.append('resumeFile', file);
  if (jobDescription) formData.append('jobDescription', jobDescription);
  return apiClient.post('/resume/ats-check', formData).then((res) => res.data);
};

export default { getResume, updateResume, deleteResume, exportPdf, getGithubRepos, importGithubRepos, atsCheck };
