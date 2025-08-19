import React, { useState } from 'react';
import './repo.css';

const CreateRepository = ({ onRepositoryCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Repository name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://13.204.45.96:3002/repo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          owner: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create repository');
      }

      const data = await response.json();
      
      // Reset form
      setFormData({ name: '', description: '', visibility: true });
      
      // Notify parent component
      if (onRepositoryCreated) {
        onRepositoryCreated(data);
      }

      // Show success message
      alert('Repository created successfully!');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-repository">
      <h3>Create New Repository</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="repo-form">
        <div className="form-group">
          <label htmlFor="name">Repository Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter repository name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your repository"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="visibility"
              checked={formData.visibility}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            Make this repository public
          </label>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Repository'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRepository;
