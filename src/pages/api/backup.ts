import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";

async function checkRepoValidity(url: string): Promise<boolean> {
  const regex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git$/;
  const match = url.match(regex);

  if (!match) {
    return false;
  }

  const [_, owner, repo] = match;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl);
    return response.ok;
  } catch (error) {
    console.error(`Error checking repository: ${error}`);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.url) {
    return res.status(400).send("URL parameter is missing");
  }

  const url = req.body.url;
  const isValid = await checkRepoValidity(url);

  if (!isValid) {
    return res.status(404).send("Invalid repository");
  }

  const backupPromise = new Promise<string>((resolve, reject) => {
    const child = exec(`./script/backup.sh ${url}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Bash script: ${error}`);
        reject(`Error executing Bash script ${error}`);
      }

      if (stderr) {
        console.error(`Error backing up repositories: ${stderr}`);
        reject(`Error backing up repositories, ${stderr}`);
      }

      resolve(stdout);
    });

    child.on("close", (code: string) => {
      console.log(`child process exited with code ${code}`);
    });
  });

  const timeoutPromise = new Promise<string>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject("Backup process timed out");
    }, 60000); // Timeout after 1 minute
  });

  try {
    const result = await Promise.race([backupPromise, timeoutPromise]);
    return res.send(result);
  } catch (error) {
    console.error(`Error backing up repositories: ${error}`);
    return res.status(500).send(`Error backing up repositories: ${error}`);
  }
}
