import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './marketplace.css';

const Marketplace = () => {
  const [categories, setCategories] = useState([]);
  const [featuredApps, setFeaturedApps] = useState([]);
  const [popularActions, setPopularActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    setCategories([
      { id: 'all', name: 'All', count: 12500 },
      { id: 'code-quality', name: 'Code Quality', count: 3200 },
      { id: 'deployment', name: 'Deployment', count: 2800 },
      { id: 'monitoring', name: 'Monitoring', count: 2100 },
      { id: 'testing', name: 'Testing', count: 1800 },
      { id: 'security', name: 'Security', count: 1500 },
      { id: 'productivity', name: 'Productivity', count: 1200 }
    ]);

    setFeaturedApps([
      {
        id: 1,
        name: 'CodeQL',
        description: 'Semantic code analysis engine for finding vulnerabilities',
        category: 'security',
        publisher: 'GitHub',
        rating: 4.8,
        installs: 45000,
        price: 'Free',
        logo: 'https://via.placeholder.com/80x80/0366d6/ffffff?text=CodeQL',
        featured: true
      },
      {
        id: 2,
        name: 'Dependabot',
        description: 'Automated dependency updates and security alerts',
        category: 'security',
        publisher: 'GitHub',
        rating: 4.9,
        installs: 89000,
        price: 'Free',
        logo: 'https://via.placeholder.com/80x80/28a745/ffffff?text=Dependabot',
        featured: true
      },
      {
        id: 3,
        name: 'SonarCloud',
        description: 'Continuous code quality and security analysis',
        category: 'code-quality',
        publisher: 'SonarSource',
        rating: 4.7,
        installs: 32000,
        price: 'Free tier',
        logo: 'https://via.placeholder.com/80x80/d73a49/ffffff?text=SonarCloud',
        featured: true
      }
    ]);

    setPopularActions([
      {
        id: 1,
        name: 'actions/checkout',
        description: 'Checkout a Git repository at a specific version',
        publisher: 'GitHub',
        downloads: 1250000,
        rating: 4.9,
        price: 'Free'
      },
      {
        id: 2,
        name: 'actions/setup-node',
        description: 'Set up Node.js environment for GitHub Actions',
        publisher: 'GitHub',
        downloads: 980000,
        rating: 4.8,
        price: 'Free'
      },
      {
        id: 3,
        name: 'actions/upload-artifact',
        description: 'Upload build artifacts to GitHub Actions',
        publisher: 'GitHub',
        downloads: 750000,
        rating: 4.7,
        price: 'Free'
      }
    ]);
  }, []);

  const filteredApps = selectedCategory === 'all' 
    ? featuredApps 
    : featuredApps.filter(app => app.category === selectedCategory);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="marketplace-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="marketplace-header">
          <h1 className="marketplace-title">GitHub Marketplace</h1>
          <p className="marketplace-subtitle">Find the right tools to improve your workflow</p>
          
          {/* Search Bar */}
          <div className="marketplace-search">
            <div className="search-container">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search for apps, actions, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="categories-container">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-name">{category.name}</span>
                <span className="category-count">{formatNumber(category.count)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Apps */}
        <div className="featured-apps-section">
          <h2 className="section-title">Featured Apps</h2>
          <div className="apps-grid">
            {filteredApps.map((app) => (
              <div key={app.id} className="app-card">
                <div className="app-header">
                  <img src={app.logo} alt={app.name} className="app-logo" />
                  <div className="app-info">
                    <h3 className="app-name">{app.name}</h3>
                    <p className="app-publisher">by {app.publisher}</p>
                  </div>
                  {app.featured && (
                    <span className="featured-badge">Featured</span>
                  )}
                </div>
                
                <p className="app-description">{app.description}</p>
                
                <div className="app-meta">
                  <div className="app-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`bi bi-star${i < Math.floor(app.rating) ? '-fill' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">{app.rating}</span>
                  </div>
                  
                  <div className="app-stats">
                    <span className="installs">
                      <i className="bi bi-download"></i>
                      {formatNumber(app.installs)} installs
                    </span>
                  </div>
                </div>
                
                <div className="app-footer">
                  <span className="app-price">{app.price}</span>
                  <button className="install-button">
                    <i className="bi bi-download"></i>
                    Install
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Actions */}
        <div className="actions-section">
          <h2 className="section-title">Popular Actions</h2>
          <div className="actions-grid">
            {popularActions.map((action) => (
              <div key={action.id} className="action-card">
                <div className="action-header">
                  <h3 className="action-name">{action.name}</h3>
                  <span className="action-publisher">by {action.publisher}</span>
                </div>
                
                <p className="action-description">{action.description}</p>
                
                <div className="action-meta">
                  <div className="action-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`bi bi-star${i < Math.floor(action.rating) ? '-fill' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-text">{action.rating}</span>
                  </div>
                  
                  <div className="action-stats">
                    <span className="downloads">
                      <i className="bi bi-download"></i>
                      {formatNumber(action.downloads)} downloads
                    </span>
                  </div>
                </div>
                
                <div className="action-footer">
                  <span className="action-price">{action.price}</span>
                  <button className="use-action-button">
                    <i className="bi bi-code-square"></i>
                    Use this action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Resources */}
        <div className="resources-section">
          <h2 className="section-title">Developer Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-book"></i>
              </div>
              <h3>Documentation</h3>
              <p>Learn how to build and publish GitHub Apps</p>
              <Link to="/docs" className="resource-link">Get started →</Link>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-code-slash"></i>
              </div>
              <h3>API Reference</h3>
              <p>Explore the GitHub API for building integrations</p>
              <Link to="/api" className="resource-link">View API →</Link>
            </div>
            
            <div className="resource-card">
              <div className="resource-icon">
                <i className="bi bi-people"></i>
              </div>
              <h3>Community</h3>
              <p>Connect with other developers and get help</p>
              <Link to="/community" className="resource-link">Join community →</Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay updated with the latest tools</h3>
            <p>Get notified about new apps, actions, and marketplace updates</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
