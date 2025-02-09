// services/sockets.services.js

class SocketService {
  handleConnection(socket) {
    console.log("connected")
    
    socket.on('disconnect', () => {
      console.log("disconnected")
    });
  }
}

class StreamService {
  handleStreamStart(socket) {
    socket.broadcast.emit('stream:started', { streamerId: socket.id });
  }

  handleStreamEnd(socket) {
    socket.broadcast.emit('stream:ended', { streamerId: socket.id });
  }
}

class ChatService {
  handleMessage(socket, message) {
    socket.broadcast.emit('chat:message', {
      userId: socket.id,
      message,
      timestamp: new Date().toISOString()
    });
  }
}

export const setupSocket = (io) => {
  const socketService = new SocketService();
  const chatService = new ChatService();
  const streamService = new StreamService();

  io.on('connection', (socket) => {
    socketService.handleConnection(socket);
    
    socket.on('stream:start', () => streamService.handleStreamStart(socket));
    socket.on('stream:end', () => streamService.handleStreamEnd(socket));
    socket.on('chat:message', (msg) => chatService.handleMessage(socket, msg));
  });
};