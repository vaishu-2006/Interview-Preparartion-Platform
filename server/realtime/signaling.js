const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

// WebRTC signaling relay for peer-to-peer practice rooms. The server never sees or stores audio/
// video — it only relays SDP offers/answers and ICE candidates between exactly two sockets in a
// room, entirely in memory, for the life of the connection. No call content is persisted.
const initSignaling = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthorized'));
      const decoded = jwt.verify(token, jwtSecret);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    let currentRoom = null;

    socket.on('join-room', ({ roomCode }) => {
      if (!roomCode) return;
      const room = io.sockets.adapter.rooms.get(roomCode);
      const size = room ? room.size : 0;
      if (size >= 2) {
        socket.emit('room-full');
        return;
      }
      currentRoom = roomCode;
      socket.join(roomCode);
      socket.to(roomCode).emit('peer-joined');
      // Simplest initiator rule: whoever joins second creates the WebRTC offer — the first
      // person's peer connection is already up and listening for it.
      socket.emit('joined', { isInitiator: size === 1 });
    });

    // Generic relay — the server never inspects the payload, just forwards it to the other
    // peer in the room. Covers offer/answer/ICE candidates with one event.
    socket.on('signal', (payload) => {
      if (currentRoom) socket.to(currentRoom).emit('signal', payload);
    });

    socket.on('leave-room', () => {
      if (currentRoom) {
        socket.to(currentRoom).emit('peer-left');
        socket.leave(currentRoom);
        currentRoom = null;
      }
    });

    socket.on('disconnect', () => {
      if (currentRoom) socket.to(currentRoom).emit('peer-left');
    });
  });
};

module.exports = initSignaling;
