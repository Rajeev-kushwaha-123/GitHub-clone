import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <svg className="me-2" viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span className="fw-bold">GitHub Clone</span>
        </Link>

        {/* Search Bar */}
        <div className="d-none d-md-block mx-4 flex-grow-1" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSearch} className="d-flex">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search or jump to..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control bg-dark border-secondary text-light"
                style={{ maxWidth: '400px' }}
              />
              <span className="input-group-text bg-dark border-secondary text-light">
                <kbd className="bg-transparent text-light">/</kbd>
              </span>
            </div>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav me-auto d-none d-lg-flex">
          <Link to="/repositories" className="nav-link px-3">Pull requests</Link>
          <Link to="/issues" className="nav-link px-3">Issues</Link>
          <Link to="/marketplace" className="nav-link px-3">Marketplace</Link>
          <Link to="/explore" className="nav-link px-3">Explore</Link>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-nav ms-auto d-flex align-items-center">
          {/* Notifications */}
          <Link to="/notifications" className="btn btn-link nav-link px-2" title="Notifications">
            <i className="bi bi-bell fs-5"></i>
          </Link>

          {/* Create New Dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-link nav-link px-2 dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
              title="Create new..."
            >
              <i className="bi bi-plus-circle fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/repositories">New repository</Link></li>
              <li><Link className="dropdown-item" to="/issues">New issue</Link></li>
              <li><Link className="dropdown-item" to="/projects">New project</Link></li>
              <li><Link className="dropdown-item" to="/packages">New package</Link></li>
            </ul>
          </div>

          {/* User Menu */}
          <div className="dropdown ms-2">
            <button 
              className="btn btn-link nav-link p-0 d-flex align-items-center"
              type="button" 
              data-bs-toggle="dropdown"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="User avatar"
                className="rounded-circle me-2"
                width="32"
                height="32"
              />
              <i className="bi bi-chevron-down text-light"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li className="dropdown-header">
                <strong>Signed in as</strong>
                <div className="text-muted small">user123</div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link to="/profile" className="dropdown-item">Your profile</Link></li>
              <li><Link to="/repositories" className="dropdown-item">Your repositories</Link></li>
              <li><Link to="/settings" className="dropdown-item">Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button onClick={handleLogout} className="dropdown-item">Sign out</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
