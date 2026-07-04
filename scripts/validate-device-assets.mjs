import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(
  rootDir,
  "src/assets/devices/appleDeviceModels.json",
);
const attributionPath = path.join(
  rootDir,
  "public/assets/devices/apple/ATTRIBUTION.md",
);

const readJson = (filePath) => JSON.parse(readFileSync(filePath, "utf8"));
const models = readJson(manifestPath);
const attribution = existsSync(attributionPath)
  ? readFileSync(attributionPath, "utf8")
  : "";

const errors = [];

for (const model of models) {
  const filePath = path.join(rootDir, "public", model.assetPath);
  const sketchfab = model.sketchfab;

  if (!sketchfab?.uid || !sketchfab?.url || !sketchfab?.creator) {
    errors.push(`${model.id}: missing Sketchfab attribution metadata.`);
  }

  if (sketchfab?.license !== "CC Attribution") {
    errors.push(`${model.id}: expected CC Attribution license.`);
  }

  if (!sketchfab?.requirements?.includes("Commercial use is allowed")) {
    errors.push(`${model.id}: license metadata does not allow commercial use.`);
  }

  if (!attribution.includes(sketchfab.uid)) {
    errors.push(
      `${model.id}: attribution file is missing UID ${sketchfab.uid}.`,
    );
  }

  if (!existsSync(filePath)) {
    errors.push(
      `${model.id}: missing ${model.assetPath}. Run SKETCHFAB_TOKEN=... npm run assets:download:devices.`,
    );
    continue;
  }

  const stats = statSync(filePath);

  if (!stats.isFile() || stats.size === 0) {
    errors.push(`${model.id}: ${model.assetPath} is empty or not a file.`);
  }
}

if (errors.length > 0) {
  console.error("Device asset validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Device asset validation passed for ${models.length} models.`);
