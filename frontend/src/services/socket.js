import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Connect to the Socket.IO server
  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io('http://13.204.45.96:3002', {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  // Join a room (user-specific room)
  joinRoom(userID) {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket.emit('joinRoom', userID);
    console.log(`Joined room: ${userID}`);
  }

  // Leave a room
  leaveRoom(userID) {
    if (this.socket) {
      this.socket.emit('leaveRoom', userID);
      console.log(`Left room: ${userID}`);
    }
  }

  // Listen for custom events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Emit custom events
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Disconnect from the server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create and export a singleton instance
const socketService = new SocketService();
export default socketService;
