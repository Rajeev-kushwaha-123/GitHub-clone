import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { repoAPI, handleAPIError } from '../../services/api';
import Navbar from '../Navbar';
import './repo.css';

const RepositoryPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRepoData, setNewRepoData] = useState({
    name: '',
    description: '',
    visibility: true,
    isPrivate: false
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await repoAPI.getAllRepositories();
      
      if (response.data && Array.isArray(response.data.repositories)) {
        setRepositories(response.data.repositories);
      } else {
        setRepositories([]);
      }
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepository = async (e) => {
    e.preventDefault();
    try {
      const repoData = {
        name: newRepoData.name,
        description: newRepoData.description,
        visibility: newRepoData.visibility,
        owner: userId,
        collaborators: []
      };

      await repoAPI.createRepository(repoData);
      setShowCreateModal(false);
      setNewRepoData({ name: '', description: '', visibility: true, isPrivate: false });
      fetchRepositories();
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    }
  };

  const handleToggleVisibility = async (repoId, currentVisibility) => {
    try {
      await repoAPI.toggleVisibility(repoId);
      fetchRepositories();
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    }
  };

  const handleDeleteRepository = async (repoId) => {
    if (window.confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
      try {
        await repoAPI.deleteRepository(repoId);
        fetchRepositories();
      } catch (err) {
        const errorInfo = handleAPIError(err);
        setError(errorInfo.message);
      }
    }
  };

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVisibility = filterVisibility === 'all' || 
                             (filterVisibility === 'public' && repo.visibility) ||
                             (filterVisibility === 'private' && !repo.visibility);
    return matchesSearch && matchesVisibility;
  });

  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          {/* Main Content */}
          <main className="col-lg-9 px-4 py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h2 mb-1">Repositories</h1>
                <p className="text-muted mb-0">Manage your code repositories</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                New repository
              </button>
            </div>

            {/* Filters and Search */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-3 mb-3">
                <select 
                  className="form-select"
                  value={filterVisibility}
                  onChange={(e) => setFilterVisibility(e.target.value)}
                >
                  <option value="all">All repositories</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div className="col-md-3 mb-3">
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="updated">Last updated</option>
                  <option value="created">Recently created</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            {/* Repositories Grid */}
            {sortedRepositories.length > 0 ? (
              <div className="row">
                {sortedRepositories.map(repo => (
                  <div key={repo._id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0">
                            <Link to={`/repository/${repo._id}`} className="text-decoration-none">
                              {repo.name}
                            </Link>
                          </h5>
                          <span className={`badge ${repo.visibility ? 'bg-success' : 'bg-secondary'}`}>
                            {repo.visibility ? 'Public' : 'Private'}
                          </span>
                        </div>
                        
                        <p className="card-text text-muted flex-grow-1">
                          {repo.description || "No description provided."}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {repo.issues?.length || 0} issues
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-code-slash me-1"></i>
                              {repo.content?.length || 0} files
                            </small>
                          </div>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <Link to={`/repository/${repo._id}`} className="btn btn-primary btn-sm flex-fill">
                            View
                          </Link>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleToggleVisibility(repo._id, repo.visibility)}
                            title={repo.visibility ? 'Make private' : 'Make public'}
                          >
                            <i className={`bi ${repo.visibility ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteRepository(repo._id)}
                            title="Delete repository"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="bi bi-folder2-open display-1 text-muted"></i>
                </div>
                <h3 className="h5 text-muted">No repositories found</h3>
                <p className="text-muted mb-4">
                  {searchQuery || filterVisibility !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by creating your first repository.'}
                </p>
                {!searchQuery && filterVisibility === 'all' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create repository
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="col-lg-3 bg-light border-start">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Repository Statistics</h3>
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Total repositories</span>
                    <span className="badge bg-primary rounded-pill">{repositories.length}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Public</span>
                    <span className="badge bg-success rounded-pill">
                      {repositories.filter(r => r.visibility).length}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Private</span>
                    <span className="badge bg-secondary rounded-pill">
                      {repositories.filter(r => !r.visibility).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Quick Actions</h3>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    New repository
                  </button>
                  <Link to="/issues" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    View all issues
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Repository Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create a new repository</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateRepository}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="repoName" className="form-label">Repository name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="repoName"
                      value={newRepoData.name}
                      onChange={(e) => setNewRepoData({...newRepoData, name: e.target.value})}
                      placeholder="my-awesome-project"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="repoDescription" className="form-label">Description (optional)</label>
                    <textarea
                      className="form-control"
                      id="repoDescription"
                      rows="3"
                      value={newRepoData.description}
                      onChange={(e) => setNewRepoData({...newRepoData, description: e.target.value})}
                      placeholder="Add a description to help people understand your project"
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="repoVisibility"
                        checked={newRepoData.visibility}
                        onChange={(e) => setNewRepoData({...newRepoData, visibility: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="repoVisibility">
                        Make this repository public
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create repository
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RepositoryPage;
