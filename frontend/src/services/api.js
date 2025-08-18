import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API endpoints
export const userAPI = {
  // Get all users
  getAllUsers: () => api.get('/allUsers'),
  
  // User authentication
  signup: (userData) => api.post('/signup', userData),
  login: (credentials) => api.post('/login', credentials),
  
  // User profile operations
  getUserProfile: (userId) => api.get(`/userProfile/${userId}`),
  updateUserProfile: (userId, userData) => api.put(`/updateProfile/${userId}`, userData),
  deleteUserProfile: (userId) => api.delete(`/deleteProfile/${userId}`),
};

// Repository API endpoints
export const repoAPI = {
  // Create new repository
  createRepository: (repoData) => api.post('/repo/create', repoData),
  
  // Get repositories
  getAllRepositories: () => api.get('/repo/all'),
  getRepositoryById: (repoId) => api.get(`/repo/${repoId}`),
  getRepositoryByName: (repoName) => api.get(`/repo/name/${repoName}`),
  getUserRepositories: (userId) => api.get(`/repo/user/${userId}`),
  
  // Update repository
  updateRepository: (repoId, repoData) => api.put(`/repo/update/${repoId}`, repoData),
  toggleVisibility: (repoId) => api.patch(`/repo/toggle/${repoId}`),
  
  // Delete repository
  deleteRepository: (repoId) => api.delete(`/repo/delete/${repoId}`),
};

// Issue API endpoints
export const issueAPI = {
  // Create new issue
  createIssue: (issueData) => api.post('/issue/create', issueData),
  
  // Get issues
  getAllIssues: () => api.get('/issue/all'),
  getIssueById: (issueId) => api.get(`/issue/${issueId}`),
  
  // Update issue
  updateIssue: (issueId, issueData) => api.put(`/issue/update/${issueId}`, issueData),
  
  // Delete issue
  deleteIssue: (issueId) => api.delete(`/issue/delete/${issueId}`),
};

// Git Operations API endpoints (matching your backend CLI commands)
export const gitAPI = {
  // Initialize a new repository
  initRepository: (repoPath) => api.post('/git/init', { path: repoPath }),
  
  // Add files to staging area
  addFiles: (files) => api.post('/git/add', { files }),
  
  // Commit staged files
  commitFiles: (message) => api.post('/git/commit', { message }),
  
  // Push commits to remote
  pushCommits: (remote = 'origin', branch = 'main') => 
    api.post('/git/push', { remote, branch }),
  
  // Pull latest changes from remote
  pullChanges: (remote = 'origin', branch = 'main') => 
    api.post('/git/pull', { remote, branch }),
  
  // Revert to a specific commit
  revertToCommit: (commitId) => api.post('/git/revert', { commitId }),
  
  // Get repository status
  getStatus: () => api.get('/git/status'),
  
  // Get commit history
  getLog: () => api.get('/git/log'),
};

// Error handler
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
};

export default api;
