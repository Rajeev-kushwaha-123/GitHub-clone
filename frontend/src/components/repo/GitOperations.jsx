import React, { useState, useEffect } from 'react';
import { gitAPI, handleAPIError } from '../../services/api';
import socketService from '../../services/socket';
import './repo.css';

const GitOperations = ({ repositoryId, userId }) => {
  const [status, setStatus] = useState('');
  const [log, setLog] = useState([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Connect to Socket.IO when component mounts
    if (userId) {
      socketService.connect();
      socketService.joinRoom(userId);
    }

    // Get initial repository status
    getRepositoryStatus();

    return () => {
      // Cleanup: leave room when component unmounts
      if (userId) {
        socketService.leaveRoom(userId);
      }
    };
  }, [userId]);

  const getRepositoryStatus = async () => {
    try {
      setLoading(true);
      const response = await gitAPI.getStatus();
      setStatus(response.data);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setMessage(`Error getting status: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCommitLog = async () => {
    try {
      setLoading(true);
      const response = await gitAPI.getLog();
      setLog(response.data);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setMessage(`Error getting log: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addFiles = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Please select files to add');
      return;
    }

    try {
      setLoading(true);
      await gitAPI.addFiles(selectedFiles);
      setMessage('Files added successfully');
      setSelectedFiles([]);
      getRepositoryStatus(); // Refresh status
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setMessage(`Error adding files: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const commitFiles = async () => {
    if (!commitMessage.trim()) {
      setMessage('Please enter a commit message');
      return;
    }

    try {
      setLoading(true);
      await gitAPI.commitFiles(commitMessage);
      setMessage('Files committed successfully');
      setCommitMessage('');
      getRepositoryStatus(); // Refresh status
      getCommitLog(); // Refresh log
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setMessage(`Error committing files: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pushCommits = async () => {
    try {
      setLoading(true);
      await gitAPI.pushCommits();
      setMessage('Commits pushed successfully');
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setMessage(`Error pushing commits: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pullChanges = async () => {
    try {
      setLoading(true);
      await gitAPI.pullChanges();
      setMessage('Changes pulled successfully');
      getRepositoryStatus(); // Refresh status
      getCommitLog(); // Refresh log
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setMessage(`Error pulling changes: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files).map(file => file.name);
    setSelectedFiles(files);
  };

  return (
    <div className="git-operations">
      <h3>Git Operations</h3>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="git-section">
        <h4>Repository Status</h4>
        <button 
          onClick={getRepositoryStatus} 
          disabled={loading}
          className="git-btn"
        >
          {loading ? 'Loading...' : 'Get Status'}
        </button>
        {status && (
          <div className="status-display">
            <pre>{JSON.stringify(status, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="git-section">
        <h4>Stage Files</h4>
        <input
          type="file"
          multiple
          onChange={handleFileSelection}
          className="file-input"
        />
        <button 
          onClick={addFiles} 
          disabled={loading || selectedFiles.length === 0}
          className="git-btn"
        >
          Add Files
        </button>
        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <strong>Selected files:</strong>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="git-section">
        <h4>Commit Changes</h4>
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Enter commit message..."
          className="commit-message"
          rows="3"
        />
        <button 
          onClick={commitFiles} 
          disabled={loading || !commitMessage.trim()}
          className="git-btn"
        >
          Commit
        </button>
      </div>

      <div className="git-section">
        <h4>Remote Operations</h4>
        <div className="remote-buttons">
          <button 
            onClick={pushCommits} 
            disabled={loading}
            className="git-btn"
          >
            Push
          </button>
          <button 
            onClick={pullChanges} 
            disabled={loading}
            className="git-btn"
          >
            Pull
          </button>
        </div>
      </div>

      <div className="git-section">
        <h4>Commit History</h4>
        <button 
          onClick={getCommitLog} 
          disabled={loading}
          className="git-btn"
        >
          {loading ? 'Loading...' : 'Get Log'}
        </button>
        {log.length > 0 && (
          <div className="log-display">
            <h5>Recent Commits:</h5>
            <ul>
              {log.map((commit, index) => (
                <li key={index}>
                  <strong>{commit.hash}</strong> - {commit.message}
                  <br />
                  <small>{commit.author} - {commit.date}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="socket-status">
        <h4>Socket.IO Status</h4>
        <p>Connection: {socketService.getConnectionStatus() ? 'Connected' : 'Disconnected'}</p>
        <p>User Room: {userId}</p>
      </div>
    </div>
  );
};

export default GitOperations;
