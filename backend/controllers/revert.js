const fs = require('fs').promises;
const path = require('path');

async function revertRepo(commitId) {
    const repoPath = path.resolve(process.cwd(), ".myGit");
    const commitsPath = path.join(repoPath, "commits");
    const commitDir = path.join(commitsPath, commitId);
    const parentDir = path.resolve(repoPath, ".."); // working directory

    try {
        const files = await fs.readdir(commitDir);

        for (const file of files) {
            const srcPath = path.join(commitDir, file);
            const destPath = path.join(parentDir, file);

            await fs.copyFile(srcPath, destPath);
        }

        console.log(`✅ Reverted repo to commit ${commitId}`);
    } catch (err) {
        console.error("❌ Unable to revert:", err.message);
    }
}

module.exports = { revertRepo };
