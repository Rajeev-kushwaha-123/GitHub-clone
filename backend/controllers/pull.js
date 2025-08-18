const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".myGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: "commits/"
        }).promise();

        const objects = data.Contents;

        for (const object of objects) {
            const key = object.Key;

            // Skip if it's a folder (S3 folders end with '/')
            if (key.endsWith("/")) continue;

            const fullLocalPath = path.join(commitsPath, key);
            const dir = path.dirname(fullLocalPath);

            await fs.mkdir(dir, { recursive: true });

            const params = {
                Bucket: S3_BUCKET,
                Key: key,
            };

            const fileContent = await s3.getObject(params).promise();
            await fs.writeFile(fullLocalPath, fileContent.Body);
        }

        console.log("✅ All commits pulled from S3 successfully.");
    } catch (err) {
        console.error("❌ Unable to pull commits:", err);
    }
}

module.exports = { pullRepo };
