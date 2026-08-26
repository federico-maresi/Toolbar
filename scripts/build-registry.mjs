/**
 * Builds shadcn registry-item JSON files from registry.json.
 *
 * Each item in registry.json becomes r/<name>.json with every file's source
 * inlined, which is the payload `npx shadcn add <url>` expects.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "r");

const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));

mkdirSync(outDir, { recursive: true });

for (const item of registry.items) {
  const built = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    files: item.files.map((file) => ({
      ...file,
      content: readFileSync(join(root, file.path), "utf8"),
    })),
  };

  const target = join(outDir, `${item.name}.json`);
  writeFileSync(target, `${JSON.stringify(built, null, 2)}\n`);
  console.log(`built r/${item.name}.json (${built.files.length} file(s))`);
}
