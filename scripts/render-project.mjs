import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { execa } from "execa";

const propsPath = process.argv[2];

if (!propsPath) {
  console.error(
    "Usage: npm run render:project -- src/projects/<group>/<project>.json",
  );
  process.exit(1);
}

const absolutePropsPath = resolve(propsPath);
const props = JSON.parse(await readFile(absolutePropsPath, "utf8"));
const slug =
  props.slug ||
  absolutePropsPath
    .split("/")
    .at(-1)
    ?.replace(/\.json$/, "video");
const group =
  absolutePropsPath.split("/projects/")[1]?.split("/")[0] || "renders";
const outputPath = join("out", group, `${slug}.mp4`);

mkdirSync(dirname(outputPath), { recursive: true });

await execa(
  "npx",
  [
    "remotion",
    "render",
    "ProjectShowcase",
    outputPath,
    "--props",
    absolutePropsPath,
  ],
  {
    stdio: "inherit",
  },
);
