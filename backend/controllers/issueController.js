const mongoose = require("mongoose");
const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");
const User=require("../models/userModel");

// Create Issue
const createIssue = async (req, res) => {
    try {
        const { title, description} = req.body;
        const {id}=req.params;

        const issue = new Issue({
            title,
            description,
            repository:id,
        });

        const savedIssue = await issue.save();
        res.status(201).json({
            message: "Issue created successfully",
            issue: savedIssue
        });
    } catch (err) {
        console.error("Error creating issue:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Issue by ID
const updateIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        if (title) issue.title = title;
        if (description) issue.description = description;
        if (status) issue.status = status;

        const updatedIssue = await issue.save();

        res.json({
            message: "Issue updated successfully",
            issue: updatedIssue
        });
    } catch (err) {
        console.error("Error updating issue:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Issue by ID
const deleteIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findByIdAndDelete(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        res.json({ message: "Issue deleted successfully" });
    } catch (err) {
        console.error("Error deleting issue:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get All Issues
const getAllIssues = async (req, res) => {
    const {id}=req.params;
    try {
        const issues = await Issue.find({repository:id});
        if (! issues){
            return res.status(404).json({error:"Issues not found"})
        }
        res.status(200).json(issues);
    } catch (err) {
        console.error("Error fetching issues:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Issue by ID
const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.json(issue);
    } catch (err) {
        console.error("Error fetching issue:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};
