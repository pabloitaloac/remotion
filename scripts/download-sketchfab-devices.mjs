import { execFile } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rename,
  rm,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(
  rootDir,
  "src/assets/devices/appleDeviceModels.json",
);
const token = process.env.SKETCHFAB_TOKEN;

if (!token) {
  console.error(
    [
      "SKETCHFAB_TOKEN is required.",
      "Create an access token in your Sketchfab account, then run:",
      "SKETCHFAB_TOKEN=... npm run assets:download:devices",
    ].join("\n"),
  );
  process.exit(1);
}

const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, "utf8"));
const models = await readJson(manifestPath);

const findFirstModelFile = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const sorted = entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const extension of [".gltf", ".glb"]) {
    for (const entry of sorted) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        return entryPath;
      }

      if (entry.isDirectory()) {
        const nested = await findFirstModelFile(entryPath);

        if (nested?.toLowerCase().endsWith(extension)) {
          return nested;
        }
      }
    }
  }

  return null;
};

const downloadFile = async (url, destination) => {
  const response = await globalThis.fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(
      `Download failed: ${response.status} ${response.statusText}`,
    );
  }

  await pipeline(
    Readable.fromWeb(response.body),
    createWriteStream(destination),
  );
};

for (const model of models) {
  const response = await globalThis.fetch(
    `https://api.sketchfab.com/v3/models/${model.sketchfab.uid}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `${model.id}: Sketchfab download API failed with ${response.status} ${response.statusText}.`,
    );
  }

  const download = await response.json();
  const archiveUrl = download.gltf?.url;

  if (!archiveUrl) {
    throw new Error(
      `${model.id}: Sketchfab did not return a glTF archive URL.`,
    );
  }

  const tempDir = await mkdtemp(path.join(os.tmpdir(), `${model.id}-`));
  const archivePath = path.join(tempDir, "model.zip");
  const extractDir = path.join(tempDir, "extract");
  const targetFile = path.join(rootDir, "public", model.assetPath);
  const targetDir = path.dirname(targetFile);

  console.log(`Downloading ${model.name}...`);
  await mkdir(extractDir, { recursive: true });
  await downloadFile(archiveUrl, archivePath);
  await execFileAsync("unzip", ["-q", archivePath, "-d", extractDir]);

  const modelFile = await findFirstModelFile(extractDir);

  if (!modelFile) {
    throw new Error(`${model.id}: no .gltf or .glb file found in archive.`);
  }

  if (path.extname(modelFile).toLowerCase() !== ".gltf") {
    throw new Error(
      `${model.id}: expected a .gltf archive entry, found ${path.basename(
        modelFile,
      )}.`,
    );
  }

  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(path.dirname(modelFile), targetDir, { recursive: true });

  const copiedEntry = path.join(targetDir, path.basename(modelFile));

  if (copiedEntry !== targetFile) {
    if (existsSync(targetFile)) {
      await rm(targetFile, { force: true });
    }

    await rename(copiedEntry, targetFile);
  }

  await rm(tempDir, { recursive: true, force: true });
  console.log(`Saved ${model.assetPath}`);
}

console.log("Device downloads complete.");
