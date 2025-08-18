const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".myGit");
    const commitPath = path.join(repoPath, "commits");

    try {
        // Check if .myGit already exists
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitPath, { recursive: true });

        // Create an empty index.json for tracking staged files
        const indexPath = path.join(repoPath, "config.json");
        await fs.writeFile(indexPath, JSON.stringify({bucket : process.env.S3_BUCKET}));

        console.log("Repository initialized successfully at", repoPath);
    } catch (err) {
        console.error("Error initializing repository:", err);
    }
}

module.exports = { initRepo };
