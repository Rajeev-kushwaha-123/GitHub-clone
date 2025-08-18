import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'issue',
        title: 'New issue opened in react-app',
        description: 'Bug: Component not rendering properly on mobile devices',
        repository: 'user123/react-app',
        time: '2 hours ago',
        unread: true,
        icon: 'bi-exclamation-circle',
        color: '#d73a49'
      },
      {
        id: 2,
        type: 'pull_request',
        title: 'Pull request #42 opened in node-backend',
        description: 'Add user authentication middleware',
        repository: 'user123/node-backend',
        time: '4 hours ago',
        unread: true,
        icon: 'bi-git-pull-request',
        color: '#28a745'
      },
      {
        id: 3,
        type: 'commit',
        title: 'New commit pushed to main branch',
        description: 'Fix responsive design issues in dashboard',
        repository: 'user123/web-dashboard',
        time: '6 hours ago',
        unread: false,
        icon: 'bi-git-commit',
        color: '#0366d6'
      },
      {
        id: 4,
        type: 'discussion',
        title: 'New discussion in community-forum',
        description: 'Best practices for React hooks optimization',
        repository: 'community/community-forum',
        time: '1 day ago',
        unread: false,
        icon: 'bi-chat-dots',
        color: '#6f42c1'
      },
      {
        id: 5,
        type: 'release',
        title: 'New release v2.1.0 published',
        description: 'Major performance improvements and bug fixes',
        repository: 'user123/api-library',
        time: '2 days ago',
        unread: false,
        icon: 'bi-tag',
        color: '#f6a434'
      },
      {
        id: 6,
        type: 'mention',
        title: 'You were mentioned in a comment',
        description: '@user123 can you review this PR?',
        repository: 'team/project-x',
        time: '3 days ago',
        unread: false,
        icon: 'bi-at',
        color: '#6f42c1'
      }
    ]);

    setUnreadCount(2);
  }, []);

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === filter);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
    setUnreadCount(0);
  };

  const getTypeLabel = (type) => {
    const labels = {
      issue: 'Issue',
      pull_request: 'Pull Request',
      commit: 'Commit',
      discussion: 'Discussion',
      release: 'Release',
      mention: 'Mention'
    };
    return labels[type] || type;
  };

  const getTimeAgo = (time) => {
    return time;
  };

  return (
    <div className="notifications-container">
      <div className="container-fluid">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-content">
            <h1 className="notifications-title">
              Notifications
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </h1>
            <div className="header-actions">
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-funnel"></i>
                Filters
              </button>
              <button 
                className="btn btn-primary"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="filters-section">
            <div className="filter-buttons">
              <button
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-button ${filter === 'issue' ? 'active' : ''}`}
                onClick={() => setFilter('issue')}
              >
                Issues
              </button>
              <button
                className={`filter-button ${filter === 'pull_request' ? 'active' : ''}`}
                onClick={() => setFilter('pull_request')}
              >
                Pull Requests
              </button>
              <button
                className={`filter-button ${filter === 'commit' ? 'active' : ''}`}
                onClick={() => setFilter('commit')}
              >
                Commits
              </button>
              <button
                className={`filter-button ${filter === 'discussion' ? 'active' : ''}`}
                onClick={() => setFilter('discussion')}
              >
                Discussions
              </button>
              <button
                className={`filter-button ${filter === 'release' ? 'active' : ''}`}
                onClick={() => setFilter('release')}
              >
                Releases
              </button>
              <button
                className={`filter-button ${filter === 'mention' ? 'active' : ''}`}
                onClick={() => setFilter('mention')}
              >
                Mentions
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-bell"></i>
              </div>
              <h3>All caught up!</h3>
              <p>You're all caught up with your notifications.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.unread ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  <i 
                    className={`bi ${notification.icon}`}
                    style={{ color: notification.color }}
                  ></i>
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">{getTimeAgo(notification.time)}</span>
                  </div>
                  
                  <p className="notification-description">{notification.description}</p>
                  
                  <div className="notification-meta">
                    <span className="repository-name">
                      <i className="bi bi-repo"></i>
                      {notification.repository}
                    </span>
                    <span className="notification-type">
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                </div>
                
                <div className="notification-actions">
                  {notification.unread && (
                    <button
                      className="mark-read-button"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <i className="bi bi-check2"></i>
                    </button>
                  )}
                  
                  <div className="dropdown">
                    <button 
                      className="btn btn-link dropdown-toggle"
                      type="button" 
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <i className="bi bi-check2"></i>
                          Mark as read
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item">
                          <i className="bi bi-mute"></i>
                          Mute repository
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item">
                          <i className="bi bi-gear"></i>
                          Notification settings
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="load-more-section">
            <button className="btn btn-outline-secondary load-more-button">
              Load more notifications
            </button>
          </div>
        )}

        {/* Notification Settings */}
        <div className="settings-section">
          <div className="settings-card">
            <h3>Notification Settings</h3>
            <p>Customize how you receive notifications</p>
            <div className="settings-options">
              <div className="setting-option">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input" defaultChecked />
                  <span className="form-check-label">Email notifications</span>
                </label>
              </div>
              <div className="setting-option">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input" defaultChecked />
                  <span className="form-check-label">Push notifications</span>
                </label>
              </div>
              <div className="setting-option">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input" />
                  <span className="form-check-label">SMS notifications</span>
                </label>
              </div>
            </div>
            <Link to="/settings/notifications" className="btn btn-outline-primary">
              Manage all settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
