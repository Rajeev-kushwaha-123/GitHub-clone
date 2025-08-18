const express = require('express');
const issueController = require("../controllers/issueController");
const issueRouter = express.Router();

// Create a new issue
issueRouter.post('/issue/create', issueController.createIssue);

// Get all issues
issueRouter.get('/issue/all', issueController.getAllIssues);

// Get a single issue by ID
issueRouter.get('/issue/:id', issueController.getIssueById);

// Update an issue by ID
issueRouter.put('/issue/update/:id', issueController.updateIssueById);

// Delete an issue by ID
issueRouter.delete('/issue/delete/:id', issueController.deleteIssueById);

module.exports = issueRouter;
