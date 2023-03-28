import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { checkRepoValidity } from "./backup";

const dataFilePath = path.join(process.cwd(), "data.json");

interface Repo {
  url: string;
  frequency: number;
}

interface Data {
  repos: Repo[];
}

function readData(): Data {
  const rawData = fs.readFileSync(dataFilePath, { encoding: "utf-8" });
  return JSON.parse(rawData);
}

function writeData(data: Data): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), {
    encoding: "utf-8",
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) {
  if (req.method === "POST") {
    const { url, frequency } = req.body;

    console.log({ url, frequency });

    const isValid = await checkRepoValidity(url);

    if (!isValid) {
      return res.status(404).send("Invalid repository");
    }

    const data = readData();
    data.repos.push({ url, frequency });
    writeData(data);

    res.status(200).json(data);
  } else if (req.method === "GET") {
    const data = readData();
    res.status(200).json(data);
  }
}
