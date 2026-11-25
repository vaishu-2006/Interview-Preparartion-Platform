import apiClient from './apiClient';

const getMyTeam = () => apiClient.get('/contest-teams/mine').then((res) => res.data);
const createTeam = (name) => apiClient.post('/contest-teams', { name }).then((res) => res.data);
const joinTeam = (inviteCode) => apiClient.post('/contest-teams/join', { inviteCode }).then((res) => res.data);
const leaveTeam = () => apiClient.post('/contest-teams/leave').then((res) => res.data);
const getTeamLeaderboard = (contestId) => apiClient.get(`/contest-teams/leaderboard/${contestId}`).then((res) => res.data);

export default { getMyTeam, createTeam, joinTeam, leaveTeam, getTeamLeaderboard };
