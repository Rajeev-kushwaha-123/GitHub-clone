import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './explore.css';

const Explore = () => {
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeTab, setActiveTab] = useState('repositories');

  // Mock data for demonstration
  useEffect(() => {
    setTrendingRepos([
      {
        id: 1,
        name: 'awesome-ai',
        owner: 'ai-community',
        description: 'A curated list of awesome AI frameworks, libraries, and resources',
        language: 'Python',
        stars: 15420,
        forks: 3200,
        languageColor: '#3572A5'
      },
      {
        id: 2,
        name: 'react-best-practices',
        owner: 'react-dev',
        description: 'Best practices for React development with examples and explanations',
        language: 'JavaScript',
        stars: 8900,
        forks: 1200,
        languageColor: '#f1e05a'
      },
      {
        id: 3,
        name: 'machine-learning-algorithms',
        owner: 'ml-enthusiasts',
        description: 'Implementation of popular machine learning algorithms from scratch',
        language: 'Python',
        stars: 12500,
        forks: 2800,
        languageColor: '#3572A5'
      }
    ]);

    setTrendingTopics([
      { name: 'javascript', count: 125000 },
      { name: 'python', count: 98000 },
      { name: 'machine-learning', count: 75000 },
      { name: 'react', count: 65000 },
      { name: 'nodejs', count: 52000 },
      { name: 'docker', count: 48000 }
    ]);

    setCollections([
      {
        id: 1,
        title: 'Getting Started with Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript',
        repos: 15,
        image: 'https://via.placeholder.com/300x200/0366d6/ffffff?text=Web+Dev'
      },
      {
        id: 2,
        title: 'Machine Learning Fundamentals',
        description: 'Essential concepts and algorithms for ML beginners',
        repos: 23,
        image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=ML+Fundamentals'
      },
      {
        id: 3,
        title: 'Full-Stack Development',
        description: 'Complete web development from frontend to backend',
        repos: 18,
        image: 'https://via.placeholder.com/300x200/d73a49/ffffff?text=Full+Stack'
      }
    ]);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="explore-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="explore-header">
          <h1 className="explore-title">Explore</h1>
          <p className="explore-subtitle">Discover the best of GitHub</p>
        </div>

        {/* Navigation Tabs */}
        <div className="explore-tabs">
          <button
            className={`tab-button ${activeTab === 'repositories' ? 'active' : ''}`}
            onClick={() => setActiveTab('repositories')}
          >
            Trending repositories
          </button>
          <button
            className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Trending topics
          </button>
          <button
            className={`tab-button ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'repositories' && (
          <div className="trending-repos">
            <h2 className="section-title">Trending repositories</h2>
            <div className="repos-grid">
              {trendingRepos.map((repo) => (
                <div key={repo.id} className="repo-card">
                  <div className="repo-header">
                    <h3 className="repo-name">
                      <Link to={`/repository/${repo.id}`}>
                        {repo.owner}/{repo.name}
                      </Link>
                    </h3>
                    <button className="star-button">
                      <i className="bi bi-star"></i>
                      Star
                    </button>
                  </div>
                  <p className="repo-description">{repo.description}</p>
                  <div className="repo-meta">
                    <span className="language">
                      <span 
                        className="language-color" 
                        style={{ backgroundColor: repo.languageColor }}
                      ></span>
                      {repo.language}
                    </span>
                    <span className="stars">
                      <i className="bi bi-star-fill"></i>
                      {formatNumber(repo.stars)}
                    </span>
                    <span className="forks">
                      <i className="bi bi-branch"></i>
                      {formatNumber(repo.forks)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="trending-topics">
            <h2 className="section-title">Trending topics</h2>
            <div className="topics-grid">
              {trendingTopics.map((topic) => (
                <div key={topic.name} className="topic-card">
                  <h3 className="topic-name">
                    <Link to={`/topics/${topic.name}`}>
                      #{topic.name}
                    </Link>
                  </h3>
                  <p className="topic-count">{formatNumber(topic.count)} repositories</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="collections">
            <h2 className="section-title">Collections</h2>
            <div className="collections-grid">
              {collections.map((collection) => (
                <div key={collection.id} className="collection-card">
                  <div className="collection-image">
                    <img src={collection.image} alt={collection.title} />
                  </div>
                  <div className="collection-content">
                    <h3 className="collection-title">{collection.title}</h3>
                    <p className="collection-description">{collection.description}</p>
                    <div className="collection-meta">
                      <span className="collection-repos">
                        <i className="bi bi-collection"></i>
                        {collection.repos} repositories
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Subscribe to our newsletter</h3>
            <p>Get the latest updates on trending repositories and topics</p>
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

export default Explore;
