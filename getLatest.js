import got from "got";
import tar from "tar";
import fs from "fs/promises";

const lookupLatestRelease = async (owner, repo) => {
  try {
    const response = await got(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        responseType: "json",
        headers: {
          "User-Agent": "Your-User-Agent",
        },
      }
    );
    return {
      tag: response.body.tag_name,
      tarball_url: response.body.tarball_url,
    };
  } catch (error) {
    console.error("Error getting the latest release asset URL:", error.message);
    throw error;
  }
};

const owner = "OP-TED";
const repo = "ePO";
const targetDir = "latest";

try {
  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir);
} catch (error) {
  console.error("Error updating directory:", error.message);
  process.exit(1);
}

const { tag, tarball_url } = await lookupLatestRelease(owner, repo);
console.log("Updating latest release:", tag, "into", targetDir);

try {
  const response = await got.stream(tarball_url);
  response.pipe(
    tar.x({
      strip: 1,
      C: targetDir,
    })
  );
} catch (error) {
  console.error("Error updating latest release:", error.message);
  process.exit(1);
}
