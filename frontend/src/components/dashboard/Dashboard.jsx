import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { repoAPI, handleAPIError } from "../../services/api";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState("repositories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  // Fetch user's repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await repoAPI.getUserRepositories(userId);
        
        if (response.data && Array.isArray(response.data.repositories)) {
          setRepositories(response.data.repositories);
        } else {
          console.error("Invalid repositories response format:", response.data);
          setRepositories([]);
        }
      } catch (err) {
        const errorInfo = handleAPIError(err);
        setError(errorInfo.message);
        console.error("Error while fetching repositories: ", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch all repos for suggestions
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await repoAPI.getAllRepositories();
        
        const allRepos = Array.isArray(response.data.repositories) ? response.data.repositories : response.data;
        const filteredSuggestions = allRepos.filter((repo) => {
          const isOwner = (repo.owner?._id || repo.owner) === userId;
          const isCollaborator = Array.isArray(repo.collaborators)
            ? repo.collaborators.some((c) => (c?._id || c) === userId)
            : false;
          return !isOwner && !isCollaborator;
        });

        setSuggestedRepositories(filteredSuggestions);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    if (userId) {
      fetchRepositories();
      fetchSuggestedRepositories();
    }
  }, [userId]);

  // Keep search results in sync
  useEffect(() => {
    setSearchResults(repositories);
  }, [repositories]);

  // Filter on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  const renderRepositoryCard = (repo) => (
    <div className="col-md-6 col-lg-4 mb-4" key={repo._id}>
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
          
          <Link to={`/repository/${repo._id}`} className="btn btn-primary btn-sm w-100">
            View Repository
          </Link>
        </div>
      </div>
    </div>
  );

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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <hr />
            <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
              Try Again
            </button>
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
          {/* Main content area */}
          <main className="col-lg-9 px-4 py-4">
            {/* Welcome section */}
            <div className="row mb-4">
              <div className="col-12">
                <h1 className="display-6 fw-bold text-primary">Welcome back!</h1>
                <p className="lead text-muted">Here's what's happening with your repositories today.</p>
              </div>
            </div>

            {/* Search and tabs */}
            <div className="row mb-4">
              <div className="col-md-8 mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search repositories..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control border-start-0"
                  />
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="btn-group w-100" role="group">
                  <button
                    className={`btn ${activeTab === 'repositories' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('repositories')}
                  >
                    Repositories
                  </button>
                  <button
                    className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('projects')}
                  >
                    Projects
                  </button>
                  <button
                    className={`btn ${activeTab === 'packages' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('packages')}
                  >
                    Packages
                  </button>
                </div>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'repositories' && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Your repositories</h2>
                    <Link to="/repositories" className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      New repository
                    </Link>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="row">
                      {searchResults.map(renderRepositoryCard)}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="bi bi-folder2-open display-1 text-muted"></i>
                      </div>
                      <h3 className="h5 text-muted">No repositories found</h3>
                      <p className="text-muted mb-4">Get started by creating a new repository or cloning an existing one.</p>
                      <Link to="/repositories" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Create repository
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Projects</h2>
                    <button className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      New project
                    </button>
                  </div>
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="bi bi-kanban display-1 text-muted"></i>
                    </div>
                    <h3 className="h5 text-muted">No projects yet</h3>
                    <p className="text-muted mb-4">Projects help you organize and prioritize your work.</p>
                    <button className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create project
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="row">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 mb-0">Packages</h2>
                    <button className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      New package
                    </button>
                  </div>
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <i className="bi bi-box display-1 text-muted"></i>
                    </div>
                    <h3 className="h5 text-muted">No packages yet</h3>
                    <p className="text-muted mb-4">Packages help you share code with your team and the world.</p>
                    <button className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create package
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Right sidebar */}
          <aside className="col-lg-3 bg-light border-start">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Suggested repositories</h3>
                {suggestedRepositories.length > 0 ? (
                  suggestedRepositories.slice(0, 5).map((repo) => (
                    <div key={repo._id} className="card mb-3 border-0 bg-white shadow-sm">
                      <div className="card-body p-3">
                        <h6 className="card-title mb-1">
                          <Link to={`/repository/${repo._id}`} className="text-decoration-none">
                            {repo.name}
                          </Link>
                        </h6>
                        <p className="card-text small text-muted mb-2">
                          {repo.description || "No description"}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-light text-dark">JavaScript</span>
                          <small className="text-muted">⭐ 42</small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No suggestions available</p>
                )}
              </div>

              <div className="mb-4">
                <h3 className="h6 fw-bold mb-3">Recent activity</h3>
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0 py-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary rounded-pill me-2">📝</span>
                      <div className="flex-grow-1">
                        <small className="text-muted">Created repository "my-project"</small>
                        <div className="text-muted small">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-warning rounded-pill me-2">🔧</span>
                      <div className="flex-grow-1">
                        <small className="text-muted">Updated README.md</small>
                        <div className="text-muted small">1 day ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-2">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success rounded-pill me-2">🚀</span>
                      <div className="flex-grow-1">
                        <small className="text-muted">Pushed to main branch</small>
                        <div className="text-muted small">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
