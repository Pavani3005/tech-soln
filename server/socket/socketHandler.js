import { getLeaderboard, addToLeaderboard } from '../store/memoryStore.js';

// Store io instance
let ioInstance = null;

export const initializeSocket = (io) => {
  ioInstance = io;
  
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Send current leaderboard on connect
    sendLeaderboardUpdate(socket);
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
    
    // Handle leaderboard subscription
    socket.on('subscribe:leaderboard', () => {
      socket.join('leaderboard-room');
      sendLeaderboardUpdate(socket);
    });
    
    // Handle progress updates
    socket.on('progress:update', (data) => {
      try {
        const { visitorId, level, action } = data;
        // Broadcast to others that someone is making progress
        socket.broadcast.emit('player:progress', {
          visitorId: visitorId.substring(0, 8) + '...',
          level,
          action,
        });
      } catch (error) {
        console.error('Progress update error:', error);
      }
    });
    
    // Handle completion
    socket.on('game:complete', (data) => {
      try {
        addToLeaderboard(data);
        broadcastLeaderboard();
      } catch (error) {
        console.error('Game complete error:', error);
      }
    });
  });
};

const sendLeaderboardUpdate = (socket) => {
  try {
    const leaderboard = getLeaderboard(10);
    socket.emit('leaderboard:update', leaderboard);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
  }
};

const broadcastLeaderboard = () => {
  if (!ioInstance) return;
  
  try {
    const leaderboard = getLeaderboard(10);
    ioInstance.to('leaderboard-room').emit('leaderboard:update', leaderboard);
    ioInstance.emit('leaderboard:update', leaderboard);
  } catch (error) {
    console.error('Broadcast error:', error);
  }
};

export const getIoInstance = () => ioInstance;
