import apiClient from './apiClient';

const listCards = () => apiClient.get('/flashcards').then((res) => res.data);
const createCard = (payload) => apiClient.post('/flashcards', payload).then((res) => res.data);
const getDueCards = () => apiClient.get('/flashcards/due').then((res) => res.data);
const getStats = () => apiClient.get('/flashcards/stats').then((res) => res.data);
const updateCard = (id, payload) => apiClient.put(`/flashcards/${id}`, payload).then((res) => res.data);
const deleteCard = (id) => apiClient.delete(`/flashcards/${id}`).then((res) => res.data);
const reviewCard = (id, quality) => apiClient.post(`/flashcards/${id}/review`, { quality }).then((res) => res.data);

export default { listCards, createCard, getDueCards, getStats, updateCard, deleteCard, reviewCard };
