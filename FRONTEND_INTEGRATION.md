# Frontend Integration Guide

This guide explains how to utilize your Node.js/Express backend with Socket.IO in your React frontend.

## 🚀 Quick Start

### 1. Backend Setup
Make sure your backend server is running:
```bash
cd backend
npm start
# or
node index.js start
```

Your server will run on `http://localhost:3002` with Socket.IO support.

### 2. Frontend Dependencies
Install required packages:
```bash
cd frontend
npm install socket.io-client
```

## 🔌 API Integration

### Available API Endpoints

#### User Management
```javascript
import { userAPI } from './services/api';

// Authentication
await userAPI.signup({ username, email, password });
await userAPI.login({ email, password });

// Profile operations
await userAPI.getUserProfile(userId);
await userAPI.updateUserProfile(userId, userData);
await userAPI.deleteUserProfile(userId);
```

#### Repository Management
```javascript
import { repoAPI } from './services/api';

// Repository operations
await repoAPI.createRepository({ name, description, visibility });
await repoAPI.getAllRepositories();
await repoAPI.getRepositoryById(repoId);
await repoAPI.updateRepository(repoId, repoData);
await repoAPI.deleteRepository(repoId);
```

#### Issue Management
```javascript
import { issueAPI } from './services/api';

// Issue operations
await issueAPI.createIssue({ title, description, repositoryId });
await issueAPI.getAllIssues();
await issueAPI.updateIssue(issueId, issueData);
await issueAPI.deleteIssue(issueId);
```

#### Git Operations (New!)
```javascript
import { gitAPI } from './services/api';

// Git commands
await gitAPI.initRepository('/path/to/repo');
await gitAPI.addFiles(['file1.js', 'file2.js']);
await gitAPI.commitFiles('Your commit message');
await gitAPI.pushCommits('origin', 'main');
await gitAPI.pullChanges('origin', 'main');
await gitAPI.revertToCommit('commit-hash');
await gitAPI.getStatus();
await gitAPI.getLog();
```

## 📡 Socket.IO Integration

### Basic Socket Connection
```javascript
import socketService from './services/socket';

// Connect to Socket.IO server
socketService.connect();

// Join a user-specific room
socketService.joinRoom('user123');

// Listen for custom events
socketService.on('customEvent', (data) => {
  console.log('Received:', data);
});

// Emit custom events
socketService.emit('userAction', { action: 'commit', files: ['file.js'] });

// Check connection status
const isConnected = socketService.getConnectionStatus();

// Disconnect when done
socketService.disconnect();
```

### Socket Events from Backend
Your backend currently supports:
- `joinRoom`: Join a user-specific room
- `leaveRoom`: Leave a user-specific room

You can extend this by adding more events in your backend Socket.IO handlers.

## 🎯 Usage Examples

### 1. Complete Git Workflow Component
```jsx
import React, { useState, useEffect } from 'react';
import { gitAPI } from '../services/api';
import socketService from '../services/socket';

const GitWorkflow = ({ userId }) => {
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    // Connect to Socket.IO
    socketService.connect();
    socketService.joinRoom(userId);
    
    // Get initial status
    getStatus();
  }, [userId]);

  const getStatus = async () => {
    try {
      const response = await gitAPI.getStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to get status:', error);
    }
  };

  const handleCommit = async (message) => {
    try {
      await gitAPI.commitFiles(message);
      // Notify other users via Socket.IO
      socketService.emit('commitMade', { message, userId });
      getStatus(); // Refresh status
    } catch (error) {
      console.error('Commit failed:', error);
    }
  };

  return (
    <div>
      <h3>Git Status</h3>
      <pre>{JSON.stringify(status, null, 2)}</pre>
      <button onClick={() => handleCommit('Update files')}>
        Commit Changes
      </button>
    </div>
  );
};
```

### 2. Real-time Collaboration
```jsx
import React, { useEffect, useState } from 'react';
import socketService from '../services/socket';

const CollaborationPanel = ({ userId, repoId }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    socketService.connect();
    socketService.joinRoom(`${repoId}-${userId}`);

    // Listen for user activities
    socketService.on('userActivity', (data) => {
      setActivities(prev => [...prev, data]);
    });

    // Listen for user joins/leaves
    socketService.on('userJoined', (user) => {
      setActiveUsers(prev => [...prev, user]);
    });

    socketService.on('userLeft', (userId) => {
      setActiveUsers(prev => prev.filter(u => u.id !== userId));
    });

    return () => {
      socketService.leaveRoom(`${repoId}-${userId}`);
    };
  }, [userId, repoId]);

  const notifyActivity = (action) => {
    socketService.emit('userActivity', {
      userId,
      action,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div>
      <h4>Active Users: {activeUsers.length}</h4>
      <ul>
        {activeUsers.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      
      <h4>Recent Activities</h4>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            {activity.userId}: {activity.action} at {activity.timestamp}
          </li>
        ))}
      </ul>
      
      <button onClick={() => notifyActivity('viewing files')}>
        View Files
      </button>
    </div>
  );
};
```

### 3. Error Handling
```javascript
import { handleAPIError } from './services/api';

try {
  await gitAPI.commitFiles('Update');
} catch (error) {
  const errorInfo = handleAPIError(error);
  
  if (errorInfo.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (errorInfo.status === 400) {
    // Show validation error
    setError(errorInfo.message);
  } else {
    // Show generic error
    setError('Something went wrong. Please try again.');
  }
}
```

## 🔧 Backend Configuration

### Environment Variables
Create a `.env` file in your backend directory:
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/your-database
NODE_ENV=development
```

### Socket.IO Configuration
Your backend Socket.IO is configured with:
- CORS enabled for all origins (`*`)
- WebSocket and polling transport
- User-specific rooms for real-time communication

## 🚨 Common Issues & Solutions

### 1. CORS Errors
- Ensure your backend has CORS middleware enabled
- Check that frontend URL matches CORS configuration

### 2. Socket.IO Connection Issues
- Verify backend server is running
- Check network connectivity
- Ensure Socket.IO client version matches server version

### 3. Git Command Failures
- Verify Git is installed on the server
- Check file permissions for repository directories
- Ensure repository paths are valid

### 4. Authentication Issues
- Check if JWT tokens are properly stored
- Verify token expiration
- Ensure auth middleware is applied to protected routes

## 📱 Responsive Design

The provided CSS includes responsive breakpoints for mobile devices. The Git operations component will stack vertically on smaller screens.

## 🔒 Security Considerations

1. **Input Validation**: Always validate user inputs on both frontend and backend
2. **Authentication**: Use JWT tokens for protected routes
3. **File Uploads**: Implement file type and size restrictions
4. **Git Commands**: Sanitize file paths and commit messages
5. **Socket.IO**: Implement user authentication for real-time features

## 🚀 Next Steps

1. **Add More Git Commands**: Implement branch management, merge operations
2. **Real-time Notifications**: Add push notifications for Git activities
3. **File Diff Viewer**: Show changes between commits
4. **Collaborative Editing**: Real-time file editing with multiple users
5. **Webhook Integration**: Connect with GitHub/GitLab for sync

## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Git API Reference](https://git-scm.com/docs)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)

---

For questions or issues, check the backend logs and browser console for detailed error messages.
