import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueAPI, repoAPI, handleAPIError } from '../../services/api';
import Navbar from '../Navbar';
import './issue.css';

const IssueList = () => {
  const [issues, setIssues] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterRepo, setFilterRepo] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIssueData, setNewIssueData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    repository: '',
    assignee: ''
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchIssues();
    fetchRepositories();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueAPI.getAllIssues();
      
      if (response.data && Array.isArray(response.data.issues)) {
        setIssues(response.data.issues);
      } else {
        setIssues([]);
      }
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepositories = async () => {
    try {
      const response = await repoAPI.getAllRepositories();
      
      if (response.data && Array.isArray(response.data.repositories)) {
        setRepositories(response.data.repositories);
      } else {
        setRepositories([]);
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const issueData = {
        title: newIssueData.title,
        description: newIssueData.description,
        priority: newIssueData.priority,
        status: 'open',
        repository: newIssueData.repository,
        assignee: newIssueData.assignee || userId,
        reporter: userId,
        createdAt: new Date().toISOString()
      };

      await issueAPI.createIssue(issueData);
      setShowCreateModal(false);
      setNewIssueData({ title: '', description: '', priority: 'medium', repository: '', assignee: '' });
      fetchIssues();
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      await issueAPI.updateIssue(issueId, { status: newStatus });
      fetchIssues();
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      try {
        await issueAPI.deleteIssue(issueId);
        fetchIssues();
      } catch (err) {
        const errorInfo = handleAPIError(err);
        setError(errorInfo.message);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'in-progress': return 'warning';
      case 'closed': return 'secondary';
      default: return 'primary';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (issue.description && issue.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    const matchesRepo = filterRepo === 'all' || issue.repository === filterRepo;
    return matchesSearch && matchesStatus && matchesPriority && matchesRepo;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'updated':
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
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
                <h1 className="h2 mb-1">Issues</h1>
                <p className="text-muted mb-0">Track and manage project issues</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                New issue
              </button>
            </div>

            {/* Filters and Search */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-2 mb-3">
                <select 
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div className="col-md-2 mb-3">
                <select 
                  className="form-select"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">All priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div className="col-md-2 mb-3">
                <select 
                  className="form-select"
                  value={filterRepo}
                  onChange={(e) => setFilterRepo(e.target.value)}
                >
                  <option value="all">All repos</option>
                  {repositories.map(repo => (
                    <option key={repo._id} value={repo._id}>{repo.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-2 mb-3">
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created">Newest first</option>
                  <option value="updated">Recently updated</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
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

            {/* Issues List */}
            {sortedIssues.length > 0 ? (
              <div className="list-group">
                {sortedIssues.map(issue => (
                  <div key={issue._id} className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <h5 className="mb-1 me-3">
                            <Link to={`/issue/${issue._id}`} className="text-decoration-none">
                              {issue.title}
                            </Link>
                          </h5>
                          <span className={`badge bg-${getStatusColor(issue.status)} me-2`}>
                            {issue.status}
                          </span>
                          <span className={`badge bg-${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        
                        <p className="mb-2 text-muted">
                          {issue.description ? 
                            (issue.description.length > 150 ? 
                              `${issue.description.substring(0, 150)}...` : 
                              issue.description
                            ) : 
                            'No description provided'
                          }
                        </p>
                        
                        <div className="d-flex align-items-center text-muted small">
                          <span className="me-3">
                            <i className="bi bi-person me-1"></i>
                            {issue.assignee || 'Unassigned'}
                          </span>
                          <span className="me-3">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                          <span>
                            <i className="bi bi-folder me-1"></i>
                            {repositories.find(r => r._id === issue.repository)?.name || 'Unknown repo'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="d-flex flex-column gap-2 ms-3">
                        <div className="btn-group btn-group-sm">
                          <button 
                            className={`btn btn-outline-${issue.status === 'open' ? 'success' : 'secondary'}`}
                            onClick={() => handleUpdateIssueStatus(issue._id, 'open')}
                            disabled={issue.status === 'open'}
                          >
                            Open
                          </button>
                          <button 
                            className={`btn btn-outline-${issue.status === 'in-progress' ? 'warning' : 'secondary'}`}
                            onClick={() => handleUpdateIssueStatus(issue._id, 'in-progress')}
                            disabled={issue.status === 'in-progress'}
                          >
                            In Progress
                          </button>
                          <button 
                            className={`btn btn-outline-${issue.status === 'closed' ? 'secondary' : 'secondary'}`}
                            onClick={() => handleUpdateIssueStatus(issue._id, 'closed')}
                            disabled={issue.status === 'closed'}
                          >
                            Close
                          </button>
                        </div>
                        
                        <div className="d-flex gap-1">
                          <Link to={`/issue/${issue._id}`} className="btn btn-primary btn-sm">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteIssue(issue._id)}
                            title="Delete issue"
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
                  <i className="bi bi-exclamation-circle display-1 text-muted"></i>
                </div>
                <h3 className="h5 text-muted">No issues found</h3>
                <p className="text-muted mb-4">
                  {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterRepo !== 'all'
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by creating your first issue.'}
                </p>
                {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && filterRepo === 'all' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create issue
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="col-lg-3 bg-light border-start">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Issue Statistics</h3>
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Total issues</span>
                    <span className="badge bg-primary rounded-pill">{issues.length}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Open</span>
                    <span className="badge bg-success rounded-pill">
                      {issues.filter(i => i.status === 'open').length}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>In Progress</span>
                    <span className="badge bg-warning rounded-pill">
                      {issues.filter(i => i.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Closed</span>
                    <span className="badge bg-secondary rounded-pill">
                      {issues.filter(i => i.status === 'closed').length}
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
                    New issue
                  </button>
                  <Link to="/repositories" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-folder me-2"></i>
                    View repositories
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create a new issue</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateIssue}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="issueTitle" className="form-label">Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="issueTitle"
                        value={newIssueData.title}
                        onChange={(e) => setNewIssueData({...newIssueData, title: e.target.value})}
                        placeholder="Brief summary of the issue"
                        required
                      />
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="issuePriority" className="form-label">Priority *</label>
                      <select
                        className="form-select"
                        id="issuePriority"
                        value={newIssueData.priority}
                        onChange={(e) => setNewIssueData({...newIssueData, priority: e.target.value})}
                        required
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="issueRepository" className="form-label">Repository *</label>
                    <select
                      className="form-select"
                      id="issueRepository"
                      value={newIssueData.repository}
                      onChange={(e) => setNewIssueData({...newIssueData, repository: e.target.value})}
                      required
                    >
                      <option value="">Select a repository</option>
                      {repositories.map(repo => (
                        <option key={repo._id} value={repo._id}>{repo.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="issueDescription" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="issueDescription"
                      rows="5"
                      value={newIssueData.description}
                      onChange={(e) => setNewIssueData({...newIssueData, description: e.target.value})}
                      placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="issueAssignee" className="form-label">Assignee (optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="issueAssignee"
                      value={newIssueData.assignee}
                      onChange={(e) => setNewIssueData({...newIssueData, assignee: e.target.value})}
                      placeholder="Username of the person to assign this issue to"
                    />
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
                    Create issue
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

export default IssueList;
