const http = require('http');
const { Server } = require('socket.io');
const { port, clientUrl } = require('./config/env');
const connectDB = require('./database/connection');
const app = require('./app');
const initSignaling = require('./realtime/signaling');

// Wrapped in a plain http.Server (instead of app.listen directly) so Socket.IO can share the
// same port for WebRTC signaling — no separate process or port to run.
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: clientUrl, credentials: true } });
initSignaling(io);

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
