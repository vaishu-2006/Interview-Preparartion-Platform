import apiClient from './apiClient';

const listOpenRooms = () => apiClient.get('/practice-rooms').then((res) => res.data);
const listMyUpcomingRooms = () => apiClient.get('/practice-rooms/mine').then((res) => res.data);
const hostRoom = (topic, scheduledFor) => apiClient.post('/practice-rooms', { topic, scheduledFor }).then((res) => res.data);
const getRoom = (roomId) => apiClient.get(`/practice-rooms/${roomId}`).then((res) => res.data);
const joinRoom = (roomId) => apiClient.post(`/practice-rooms/${roomId}/join`).then((res) => res.data);
const closeRoom = (roomId) => apiClient.post(`/practice-rooms/${roomId}/close`).then((res) => res.data);

export default { listOpenRooms, listMyUpcomingRooms, hostRoom, getRoom, joinRoom, closeRoom };
