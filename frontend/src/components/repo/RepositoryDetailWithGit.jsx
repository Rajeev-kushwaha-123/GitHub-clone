import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { repoAPI, handleAPIError } from '../../services/api';
import GitOperations from './GitOperations';
import './repo.css';

const RepositoryDetailWithGit = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [userId, setUserId] = useState(''); // This should come from your auth context

  useEffect(() => {
    // Get user ID from localStorage or auth context
    const storedUserId = localStorage.getItem('userId') || 'demo-user';
    setUserId(storedUserId);

    if (id) {
      fetchRepository();
    }
  }, [id]);

  const fetchRepository = async () => {
    try {
      setLoading(true);
      const response = await repoAPI.getRepositoryById(id);
      setRepository(response.data);
    } catch (error) {
      const errorInfo = handleAPIError(error);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading repository...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!repository) {
    return <div className="error-message">Repository not found</div>;
  }

  return (
    <div className="repository-detail">
      <div className="repo-detail-header">
        <div className="repo-info">
          <h1 className="repo-title">{repository.name}</h1>
          <span className={`visibility-badge ${repository.visibility}`}>
            {repository.visibility}
          </span>
        </div>
        <div className="repo-stats">
          <div className="stat">
            <strong>Stars:</strong> {repository.stars || 0}
          </div>
          <div className="stat">
            <strong>Forks:</strong> {repository.forks || 0}
          </div>
          <div className="stat">
            <strong>Issues:</strong> {repository.issues || 0}
          </div>
        </div>
      </div>

      <div className="repo-description-section">
        <h3>Description</h3>
        <p>{repository.description || 'No description provided.'}</p>
      </div>

      <div className="repo-tabs">
        <button
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button
          className={`tab ${activeTab === 'git' ? 'active' : ''}`}
          onClick={() => setActiveTab('git')}
        >
          Git Operations
        </button>
        <button
          className={`tab ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Issues
        </button>
      </div>

      {activeTab === 'code' && (
        <div className="repo-content-section">
          <h3>Repository Content</h3>
          <div className="repo-toolbar">
            <div className="toolbar-left">
              <span className="branch">main</span>
              <button className="btn small">Add file</button>
            </div>
          </div>
          <div className="file-list">
            <div className="file-row">
              <div className="file-summary">
                <span className="file-icon">📁</span>
                <span className="file-name">README.md</span>
              </div>
            </div>
            <div className="file-row">
              <div className="file-summary">
                <span className="file-icon">📁</span>
                <span className="file-name">package.json</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'git' && (
        <GitOperations 
          repositoryId={repository._id} 
          userId={userId}
        />
      )}

      {activeTab === 'issues' && (
        <div className="issues-section">
          <div className="issues-header">
            <h3>Issues</h3>
            <button className="create-issue-btn">New Issue</button>
          </div>
          <p>No issues yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default RepositoryDetailWithGit;
