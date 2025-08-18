const express = require('express');
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();

// CREATE a new repository
repoRouter.post('/repo/create', repoController.createRepository);
repoRouter.get('/repo/all', repoController.getAllRepositories);
repoRouter.get('/repo/:id', repoController.fetchRepositoryById);
repoRouter.get('/repo/name/:name', repoController.fetchRepositoryByName);
repoRouter.get('/repo/user/:userID', repoController.fetchRepositoryForCurrentUser);
repoRouter.put('/repo/update/:id', repoController.updateRepositoryById);
repoRouter.patch('/repo/toggle/:id', repoController.toggleVisibilityById);
repoRouter.delete('/repo/delete/:id', repoController.deleteRepositoryById);

// Export the router
module.exports = repoRouter;
