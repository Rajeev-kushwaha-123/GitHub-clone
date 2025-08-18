import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IssueList from '../issue/IssueList';
import CreateIssue from '../issue/CreateIssue';
import Navbar from '../Navbar';
import './repo.css';

const RepositoryDetail = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateIssue, setShowCreateIssue] = useState(false);

  useEffect(() => {
    fetchRepository();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRepository = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/repo/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch repository');
      }
      const data = await response.json();
      setRepository(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCreated = (newIssue) => {
    // Refresh repository data to include the new issue
    fetchRepository();
    setShowCreateIssue(false);
  };

  // Function to update repository description (available for future use)
  // eslint-disable-next-line no-unused-vars
  const handleUpdateDescription = async (newDescription) => {
    try {
      const response = await fetch(`http://65.0.138.0:3002/repo/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to update repository');
      }

      // Refresh repository data
      fetchRepository();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading repository...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!repository) {
    return <div className="error">Repository not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="repository-detail">
        <div className="repo-detail-header">
          <div className="repo-info">
            <h1 className="repo-title">{repository.name}</h1>
            <span className={`visibility-badge ${repository.visibility ? 'public' : 'private'}`}>
              {repository.visibility ? 'Public' : 'Private'}
            </span>
          </div>
          <div className="repo-stats">
            <span className="stat">
              <strong>{repository.issues?.length || 0}</strong> Issues
            </span>
            <span className="stat">
              <strong>{repository.content?.length || 0}</strong> Files
            </span>
          </div>
        </div>

        <div className="repo-description-section">
          <h3>Description</h3>
          <p className="repo-description">
            {repository.description || 'No description provided'}
          </p>
        </div>

        <div className="repo-content-section">
          <div className="repo-tabs">
            <button className="tab active">Code</button>
          </div>

          <div className="repo-toolbar">
            <div className="toolbar-left">
              <div className="branch">main</div>
              <button className="btn small">Go to file</button>
              <button className="btn small">Add file</button>
              <button className="btn small">Code</button>
            </div>
          </div>

          {repository.content && repository.content.length > 0 ? (
            <div className="file-list">
              {repository.content.map((file, index) => {
                const isObject = file && typeof file === 'object';
                const fileName = isObject ? (file.name || `file-${index + 1}`) : String(file);
                const fileText = isObject ? (file.text || '') : '';
                return (
                  <details key={index} className="file-row" open>
                    <summary className="file-summary">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{fileName}</span>
                    </summary>
                    {fileText && (
                      <pre className="file-code"><code>{fileText}</code></pre>
                    )}
                  </details>
                );
              })}
            </div>
          ) : (
            <p className="no-content">No files in this repository</p>
          )}
        </div>

        <div className="issues-section">
          <div className="issues-header">
            <h3>Issues</h3>
            <button
              onClick={() => setShowCreateIssue(!showCreateIssue)}
              className="create-issue-btn"
            >
              {showCreateIssue ? 'Cancel' : 'Create Issue'}
            </button>
          </div>

          {showCreateIssue && (
            <CreateIssue 
              repositoryId={id} 
              onIssueCreated={handleIssueCreated}
            />
          )}

          <IssueList repositoryId={id} />
        </div>
      </div>
    </>
  );
};

export default RepositoryDetail;
