const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

// Create Repository
const createRepository = async (req, res) => {
    try {
        const { owner, name, issues, description, content, visibility, collaborators } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Repository name is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Normalize content to allow strings, objects {name, text}, or arrays of those
        let normalizedContent = [];
        if (Array.isArray(content)) {
            normalizedContent = content.map((item) => {
                if (typeof item === 'string') return { name: item, text: '' };
                if (item && typeof item === 'object') {
                    return { name: item.name || '', text: item.text || '' };
                }
                return item;
            });
        } else if (typeof content === 'string') {
            normalizedContent = [{ name: content, text: '' }];
        } else if (content && typeof content === 'object') {
            normalizedContent = [{ name: content.name || '', text: content.text || '' }];
        }

        const newRepo = new Repository({
            owner,
            name,
            issues,
            description,
            content: normalizedContent,
            visibility,
            collaborators: Array.isArray(collaborators) ? collaborators : []
        });

        const result = await newRepo.save();
        res.status(201).json({
            message: "Repository created successfully",
            repositoryId: result._id
        });
    } catch (err) {
        console.error("Error creating repository:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get All Repositories
const getAllRepositories = async (req, res) => {
    try {
        const repos = await Repository.find({})
            .populate("owner")
            .populate("issues");
        res.json(repos);
    } catch (err) {
        console.error("Error fetching repositories:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch Repository by ID
const fetchRepositoryById = async (req, res) => {
    try {
        const repo = await Repository.findById(req.params.id)
            .populate("owner")
            .populate("issues");

        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.json(repo);
    } catch (err) {
        console.error("Error fetching repository:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch Repository by Name
const fetchRepositoryByName = async (req, res) => {
    try {
        const repo = await Repository.findOne({ name: req.params.name })
            .populate("owner")
            .populate("issues");

        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.json(repo);
    } catch (err) {
        console.error("Error fetching repository by name:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch Repositories for Current User
const fetchRepositoryForCurrentUser = async (req, res) => {
    try {
        const { userID } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const repos = await Repository.find({
            $or: [
                { owner: userID },
                { collaborators: userID }
            ]
        }).populate("issues");

        res.json({ repositories: repos });
    } catch (err) {
        console.error("Error fetching user repositories:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Repository by ID
const updateRepositoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, content } = req.body;

        const repo = await Repository.findById(id);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (content) {
            if (Array.isArray(content)) {
                content.forEach((item) => {
                    if (typeof item === 'string') {
                        repo.content.push({ name: item, text: '' });
                    } else if (item && typeof item === 'object') {
                        repo.content.push({ name: item.name || '', text: item.text || '' });
                    }
                });
            } else if (typeof content === 'string') {
                repo.content.push({ name: content, text: '' });
            } else if (content && typeof content === 'object') {
                repo.content.push({ name: content.name || '', text: content.text || '' });
            }
        }
        if (description) repo.description = description;

        const updatedRepo = await repo.save();
        res.json({
            message: "Repository updated successfully",
            repository: updatedRepo
        });
    } catch (err) {
        console.error("Error updating repository:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Toggle Repository Visibility by ID
const toggleVisibilityById = async (req, res) => {
    try {
        const { id } = req.params;

        const repo = await Repository.findById(id);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        repo.visibility = !repo.visibility;
        const updatedRepo = await repo.save();

        res.json({
            message: `Repository visibility updated to ${updatedRepo.visibility ? "public" : "private"}`,
            repository: updatedRepo
        });
    } catch (err) {
        console.error("Error toggling repository visibility:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Repository by ID
const deleteRepositoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const repo = await Repository.findByIdAndDelete(id);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        res.json({ message: "Repository deleted successfully" });
    } catch (err) {
        console.error("Error deleting repository:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById
};
