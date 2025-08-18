const express = require('express');
const gitRouter = express.Router();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Helper function to execute git commands
const executeGitCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error.message, stderr });
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

// Initialize a new repository
gitRouter.post('/init', async (req, res) => {
  try {
    const { path: repoPath } = req.body;
    
    if (!repoPath) {
      return res.status(400).json({ message: 'Repository path is required' });
    }

    const fullPath = path.resolve(repoPath);
    
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Directory does not exist' });
    }

    // Check if already a git repository
    if (fs.existsSync(path.join(fullPath, '.git'))) {
      return res.status(400).json({ message: 'Directory is already a git repository' });
    }

    const result = await executeGitCommand('git init', fullPath);
    res.json({ message: 'Repository initialized successfully', result });
  } catch (error) {
    console.error('Git init error:', error);
    res.status(500).json({ message: 'Failed to initialize repository', error: error.message });
  }
});

// Add files to staging area
gitRouter.post('/add', async (req, res) => {
  try {
    const { files, repoPath = '.' } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'Files array is required' });
    }

    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Add specific files
    const fileArgs = files.join(' ');
    const result = await executeGitCommand(`git add ${fileArgs}`, fullPath);
    
    res.json({ message: 'Files added successfully', result });
  } catch (error) {
    console.error('Git add error:', error);
    res.status(500).json({ message: 'Failed to add files', error: error.message });
  }
});

// Commit staged files
gitRouter.post('/commit', async (req, res) => {
  try {
    const { message, repoPath = '.' } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Commit message is required' });
    }

    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Check if there are staged changes
    const status = await executeGitCommand('git status --porcelain', fullPath);
    if (!status) {
      return res.status(400).json({ message: 'No changes to commit' });
    }

    const result = await executeGitCommand(`git commit -m "${message}"`, fullPath);
    res.json({ message: 'Files committed successfully', result });
  } catch (error) {
    console.error('Git commit error:', error);
    res.status(500).json({ message: 'Failed to commit files', error: error.message });
  }
});

// Push commits to remote
gitRouter.post('/push', async (req, res) => {
  try {
    const { remote = 'origin', branch = 'main', repoPath = '.' } = req.body;
    
    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Check if remote exists
    const remotes = await executeGitCommand('git remote', fullPath);
    if (!remotes.includes(remote)) {
      return res.status(400).json({ message: `Remote '${remote}' does not exist` });
    }

    const result = await executeGitCommand(`git push ${remote} ${branch}`, fullPath);
    res.json({ message: 'Commits pushed successfully', result });
  } catch (error) {
    console.error('Git push error:', error);
    res.status(500).json({ message: 'Failed to push commits', error: error.message });
  }
});

// Pull latest changes from remote
gitRouter.post('/pull', async (req, res) => {
  try {
    const { remote = 'origin', branch = 'main', repoPath = '.' } = req.body;
    
    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Check if remote exists
    const remotes = await executeGitCommand('git remote', fullPath);
    if (!remotes.includes(remote)) {
      return res.status(400).json({ message: `Remote '${remote}' does not exist` });
    }

    const result = await executeGitCommand(`git pull ${remote} ${branch}`, fullPath);
    res.json({ message: 'Changes pulled successfully', result });
  } catch (error) {
    console.error('Git pull error:', error);
    res.status(500).json({ message: 'Failed to pull changes', error: error.message });
  }
});

// Revert to a specific commit
gitRouter.post('/revert', async (req, res) => {
  try {
    const { commitId, repoPath = '.' } = req.body;
    
    if (!commitId) {
      return res.status(400).json({ message: 'Commit ID is required' });
    }

    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Check if commit exists
    const commitExists = await executeGitCommand(`git rev-parse --verify ${commitId}`, fullPath);
    if (!commitExists) {
      return res.status(400).json({ message: 'Invalid commit ID' });
    }

    const result = await executeGitCommand(`git revert ${commitId} --no-edit`, fullPath);
    res.json({ message: 'Reverted successfully', result });
  } catch (error) {
    console.error('Git revert error:', error);
    res.status(500).json({ message: 'Failed to revert commit', error: error.message });
  }
});

// Get repository status
gitRouter.get('/status', async (req, res) => {
  try {
    const { repoPath = '.' } = req.query;
    
    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Check if it's a git repository
    if (!fs.existsSync(path.join(fullPath, '.git'))) {
      return res.status(400).json({ message: 'Not a git repository' });
    }

    const status = await executeGitCommand('git status --porcelain', fullPath);
    const branch = await executeGitCommand('git branch --show-current', fullPath);
    const lastCommit = await executeGitCommand('git log -1 --oneline', fullPath);

    res.json({
      status: status || 'Working directory clean',
      branch: branch || 'No branch',
      lastCommit: lastCommit || 'No commits yet'
    });
  } catch (error) {
    console.error('Git status error:', error);
    res.status(500).json({ message: 'Failed to get status', error: error.message });
  }
});

// Get commit history
gitRouter.get('/log', async (req, res) => {
  try {
    const { repoPath = '.', limit = 10 } = req.query;
    
    const fullPath = path.resolve(repoPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(400).json({ message: 'Repository path does not exist' });
    }

    // Check if it's a git repository
    if (!fs.existsSync(path.join(fullPath, '.git'))) {
      return res.status(400).json({ message: 'Not a git repository' });
    }

    const log = await executeGitCommand(`git log --oneline -${limit}`, fullPath);
    
    if (!log) {
      return res.json([]);
    }

    // Parse log output
    const commits = log.split('\n').map(line => {
      const [hash, ...messageParts] = line.split(' ');
      return {
        hash: hash || '',
        message: messageParts.join(' ') || '',
        author: 'Unknown', // Could be enhanced to get actual author
        date: 'Unknown'    // Could be enhanced to get actual date
      };
    });

    res.json(commits);
  } catch (error) {
    console.error('Git log error:', error);
    res.status(500).json({ message: 'Failed to get commit log', error: error.message });
  }
});

module.exports = gitRouter;
