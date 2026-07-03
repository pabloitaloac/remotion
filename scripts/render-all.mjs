import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";

const findProjectFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        return findProjectFiles(path);
      }

      return entry.isFile() && entry.name.endsWith(".json") ? [path] : [];
    }),
  );

  return files.flat();
};

const projectFiles = await findProjectFiles("src/projects");

for (const file of projectFiles) {
  await execa("npm", ["run", "render:project", "--", file], {
    stdio: "inherit",
  });
}
