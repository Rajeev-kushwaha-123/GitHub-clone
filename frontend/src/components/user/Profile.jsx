import React, { useState, useEffect, useCallback } from 'react';
import { userAPI, repoAPI, issueAPI, handleAPIError } from '../../services/api';
import Navbar from '../Navbar';
import HeatMap from './HeatMap';
import './profile.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userRepositories, setUserRepositories] = useState([]);
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });

  const userId = localStorage.getItem('userId');

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await userAPI.getUserProfile(userId);
      if (profileResponse.data) {
        setUserProfile(profileResponse.data);
        setEditData({
          username: profileResponse.data.username || '',
          email: profileResponse.data.email || '',
          bio: profileResponse.data.bio || '',
          location: profileResponse.data.location || '',
          website: profileResponse.data.website || ''
        });
      }

      // Fetch user repositories
      const reposResponse = await repoAPI.getUserRepositories(userId);
      if (reposResponse.data && Array.isArray(reposResponse.data.repositories)) {
        setUserRepositories(reposResponse.data.repositories);
      }

      // Fetch user issues
      const issuesResponse = await issueAPI.getAllIssues();
      if (issuesResponse.data && Array.isArray(issuesResponse.data.issues)) {
        const userIssues = issuesResponse.data.issues.filter(issue => 
          issue.reporter === userId || issue.assignee === userId
        );
        setUserIssues(userIssues);
      }

    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateUserProfile(userId, editData);
      setEditMode(false);
      fetchUserData(); // Refresh data
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        await userAPI.deleteUserProfile(userId);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        window.location.href = '/auth';
      } catch (err) {
        const errorInfo = handleAPIError(err);
        setError(errorInfo.message);
      }
    }
  };

  const getContributionStats = () => {
    const totalRepos = userRepositories.length;
    const publicRepos = userRepositories.filter(repo => repo.visibility).length;
    const privateRepos = totalRepos - publicRepos;
    const openIssues = userIssues.filter(issue => issue.status === 'open').length;
    const closedIssues = userIssues.filter(issue => issue.status === 'closed').length;

    return { totalRepos, publicRepos, privateRepos, openIssues, closedIssues };
  };

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

  if (!userProfile) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>Unable to load user profile. Please try again.</p>
            <hr />
            <button className="btn btn-outline-danger" onClick={fetchUserData}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const stats = getContributionStats();

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          {/* Main Content */}
          <main className="col-lg-9 px-4 py-4">
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

            {/* Profile Header */}
            <div className="row mb-4">
              <div className="col-md-3 text-center">
                <img
                  src={userProfile.avatar || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"}
                  alt="Profile"
                  className="rounded-circle img-fluid mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 className="h2 mb-2">{userProfile.username || 'User'}</h1>
                    <p className="text-muted mb-2">{userProfile.bio || 'No bio provided'}</p>
                    <div className="d-flex gap-3 text-muted small">
                      {userProfile.location && (
                        <span><i className="bi bi-geo-alt me-1"></i>{userProfile.location}</span>
                      )}
                      {userProfile.website && (
                        <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">
                          <i className="bi bi-link-45deg me-1"></i>{userProfile.website}
                        </a>
                      )}
                      <span><i className="bi bi-calendar me-1"></i>Joined {new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setEditMode(!editMode)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </button>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={handleDeleteProfile}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            {editMode && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Edit Profile</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          value={editData.username}
                          onChange={(e) => setEditData({...editData, username: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="bio" className="form-label">Bio</label>
                      <textarea
                        className="form-control"
                        id="bio"
                        rows="3"
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          value={editData.location}
                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="website" className="form-label">Website</label>
                        <input
                          type="url"
                          className="form-control"
                          id="website"
                          value={editData.website}
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-md-2 col-6 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="card-title text-primary">{stats.totalRepos}</h3>
                    <p className="card-text small">Repositories</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-6 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="card-title text-success">{stats.publicRepos}</h3>
                    <p className="card-text small">Public</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-6 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="card-title text-secondary">{stats.privateRepos}</h3>
                    <p className="card-text small">Private</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-6 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="card-title text-warning">{stats.openIssues}</h3>
                    <p className="card-text small">Open Issues</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-6 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="card-title text-info">{stats.closedIssues}</h3>
                    <p className="card-text small">Closed Issues</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-6 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h3 className="card-title text-dark">{userIssues.length}</h3>
                    <p className="card-text small">Total Issues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Repositories */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Repositories</h5>
                <a href="/repositories" className="btn btn-outline-primary btn-sm">View All</a>
              </div>
              <div className="card-body">
                {userRepositories.length > 0 ? (
                  <div className="row">
                    {userRepositories.slice(0, 6).map(repo => (
                      <div key={repo._id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h6 className="card-title">
                              <a href={`/repository/${repo._id}`} className="text-decoration-none">
                                {repo.name}
                              </a>
                            </h6>
                            <p className="card-text small text-muted">
                              {repo.description || 'No description'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge ${repo.visibility ? 'bg-success' : 'bg-secondary'}`}>
                                {repo.visibility ? 'Public' : 'Private'}
                              </span>
                              <small className="text-muted">
                                {repo.issues?.length || 0} issues
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-folder2-open display-4 text-muted mb-3"></i>
                    <p className="text-muted">No repositories yet</p>
                    <a href="/repositories" className="btn btn-primary btn-sm">Create Repository</a>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Issues */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Issues</h5>
                <a href="/issues" className="btn btn-outline-primary btn-sm">View All</a>
              </div>
              <div className="card-body">
                {userIssues.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {userIssues.slice(0, 5).map(issue => (
                      <div key={issue._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{issue.title}</h6>
                          <small className="text-muted">
                            {issue.description ? 
                              (issue.description.length > 100 ? 
                                `${issue.description.substring(0, 100)}...` : 
                                issue.description
                              ) : 
                              'No description'
                            }
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <span className={`badge bg-${issue.status === 'open' ? 'success' : issue.status === 'in-progress' ? 'warning' : 'secondary'}`}>
                            {issue.status}
                          </span>
                          <span className={`badge bg-${issue.priority === 'high' ? 'danger' : issue.priority === 'medium' ? 'warning' : 'info'}`}>
                            {issue.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-exclamation-circle display-4 text-muted mb-3"></i>
                    <p className="text-muted">No issues yet</p>
                    <a href="/issues" className="btn btn-primary btn-sm">Create Issue</a>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="col-lg-3 bg-light border-start">
            <div className="p-4">
              {/* Contribution Graph */}
              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Contribution Activity</h3>
                <HeatMap />
              </div>

              {/* Quick Stats */}
              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Quick Stats</h3>
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Total contributions</span>
                    <span className="badge bg-primary rounded-pill">
                      {stats.totalRepos + userIssues.length}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Followers</span>
                    <span className="badge bg-success rounded-pill">0</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2">
                    <span>Following</span>
                    <span className="badge bg-info rounded-pill">0</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Quick Actions</h3>
                <div className="d-grid gap-2">
                  <a href="/repositories" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-plus-circle me-2"></i>
                    New repository
                  </a>
                  <a href="/issues" className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    New issue
                  </a>
                  <a href="/profile" className="btn btn-outline-info btn-sm">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Profile;
