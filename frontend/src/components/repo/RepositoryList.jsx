import React, { useState, useEffect } from 'react';
import './repo.css';

const RepositoryList = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, public, private

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://13.204.45.96:3002/repo/all');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      setRepositories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRepository = async (repoId) => {
    if (!window.confirm('Are you sure you want to delete this repository?')) {
      return;
    }

    try {
      const response = await fetch(`http://13.204.45.96:3002/repo/delete/${repoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete repository');
      }

      // Refresh repositories after deletion
      fetchRepositories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleVisibility = async (repoId) => {
    try {
      const response = await fetch(`http://13.204.45.96:3002/repo/toggle/${repoId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle repository visibility');
      }

      // Refresh repositories after toggle
      fetchRepositories();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'public') return matchesSearch && repo.visibility;
    if (filter === 'private') return matchesSearch && !repo.visibility;
    
    return matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading repositories...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="repository-list">
      <div className="repo-header">
        <h2>Repositories</h2>
        <div className="repo-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'public' ? 'active' : ''} 
              onClick={() => setFilter('public')}
            >
              Public
            </button>
            <button 
              className={filter === 'private' ? 'active' : ''} 
              onClick={() => setFilter('private')}
            >
              Private
            </button>
          </div>
        </div>
      </div>

      {filteredRepositories.length === 0 ? (
        <div className="no-repos">
          <p>No repositories found</p>
        </div>
      ) : (
        <div className="repos-container">
          {filteredRepositories.map((repo) => (
            <div key={repo._id} className="repo-card">
              <div className="repo-content">
                <div className="repo-header-info">
                  <h3 className="repo-name">{repo.name}</h3>
                  <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                    {repo.visibility ? 'Public' : 'Private'}
                  </span>
                </div>
                <p className="repo-description">
                  {repo.description || 'No description provided'}
                </p>
                <div className="repo-meta">
                  <span className="repo-owner">
                    Owner: {repo.owner?.username || 'Unknown'}
                  </span>
                  <span className="repo-issues">
                    Issues: {repo.issues?.length || 0}
                  </span>
                  <span className="repo-content-count">
                    Files: {repo.content?.length || 0}
                  </span>
                </div>
              </div>
              <div className="repo-actions">
                <button
                  onClick={() => handleToggleVisibility(repo._id)}
                  className="visibility-btn"
                >
                  {repo.visibility ? 'Make Private' : 'Make Public'}
                </button>
                <button
                  onClick={() => handleDeleteRepository(repo._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
