import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'User Name',
      email: 'user@example.com',
      bio: '',
      location: '',
      company: '',
      website: '',
      twitter: ''
    },
    account: {
      username: 'username',
      emailNotifications: true,
      marketingEmails: false,
      securityEmails: true,
      twoFactorAuth: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      repositoryActivity: true,
      issueUpdates: true,
      pullRequestUpdates: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to save the settings
      console.log(`Saving ${section} settings:`, settings[section]);
      
      setIsEditing(false);
      // Show success message
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  const renderProfileTab = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Profile Settings</h3>
        <p>Update your profile information and personal details</p>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={settings.profile.name}
            onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={settings.profile.email}
            onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={settings.profile.bio}
            onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
            disabled={!isEditing}
            className="form-control"
            rows="3"
            placeholder="Tell us a little about yourself..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={settings.profile.location}
            onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            value={settings.profile.company}
            onChange={(e) => handleInputChange('profile', 'company', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            value={settings.profile.website}
            onChange={(e) => handleInputChange('profile', 'website', e.target.value)}
            disabled={!isEditing}
            className="form-control"
            placeholder="https://example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="twitter">Twitter username</label>
          <input
            type="text"
            id="twitter"
            value={settings.profile.twitter}
            onChange={(e) => handleInputChange('profile', 'twitter', e.target.value)}
            disabled={!isEditing}
            className="form-control"
            placeholder="@username"
          />
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Account Settings</h3>
        <p>Manage your account preferences and security settings</p>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={settings.account.username}
            onChange={(e) => handleInputChange('account', 'username', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.account.emailNotifications}
              onChange={(e) => handleInputChange('account', 'emailNotifications', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Email notifications
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.account.marketingEmails}
              onChange={(e) => handleInputChange('account', 'marketingEmails', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Marketing emails
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.account.securityEmails}
              onChange={(e) => handleInputChange('account', 'securityEmails', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Security emails
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.account.twoFactorAuth}
              onChange={(e) => handleInputChange('account', 'twoFactorAuth', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Two-factor authentication
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Appearance Settings</h3>
        <p>Customize how the application looks and feels</p>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={settings.appearance.theme}
            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (system preference)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="fontSize">Font Size</label>
          <select
            id="fontSize"
            value={settings.appearance.fontSize}
            onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
            disabled={!isEditing}
            className="form-control"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.appearance.compactMode}
              onChange={(e) => handleInputChange('appearance', 'compactMode', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Compact mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <p>Configure how and when you receive notifications</p>
      </div>
      
      <div className="settings-form">
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Email notifications
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Push notifications
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.notifications.sms}
              onChange={(e) => handleInputChange('notifications', 'sms', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            SMS notifications
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.notifications.repositoryActivity}
              onChange={(e) => handleInputChange('notifications', 'repositoryActivity', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Repository activity
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.notifications.issueUpdates}
              onChange={(e) => handleInputChange('notifications', 'issueUpdates', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Issue updates
          </label>
        </div>
        
        <div className="form-group">
          <label className="form-check-label">
            <input
              type="checkbox"
              checked={settings.notifications.pullRequestUpdates}
              onChange={(e) => handleInputChange('notifications', 'pullRequestUpdates', e.target.checked)}
              disabled={!isEditing}
              className="form-check-input me-2"
            />
            Pull request updates
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'account':
        return renderAccountTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'notifications':
        return renderNotificationsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header-main">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button
              className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="bi bi-person-circle me-2"></i>
              Profile
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <i className="bi bi-shield-lock me-2"></i>
              Account
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="bi bi-palette me-2"></i>
              Appearance
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="bi bi-bell me-2"></i>
              Notifications
            </button>
          </nav>
        </div>
        
        <div className="settings-main">
          {renderTabContent()}
          
          <div className="settings-actions">
            {!isEditing ? (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Settings
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => handleSave(activeTab)}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
