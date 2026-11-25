import { io } from 'socket.io-client';

const resolveSocketBaseUrl = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const stripped = apiBase.replace(/\/api\/?$/, '');
  return stripped || window.location.origin;
};

let socket = null;

// Lazily created, reused for the tab's lifetime — only ever connects when a feature that needs
// real-time signaling (peer practice rooms) is actually opened, not on every page load.
export const getSocket = () => {
  if (!socket) {
    socket = io(resolveSocketBaseUrl(), {
      autoConnect: true,
      auth: { token: localStorage.getItem('token') },
    });
  }
  return socket;
};

export default getSocket;
