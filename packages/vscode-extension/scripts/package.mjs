#!/usr/bin/env node
import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");

execSync("bun run build", { cwd: pkgRoot, stdio: "inherit" });

const work = mkdtempSync(join(tmpdir(), "notedown-vsce-"));
console.log(`Staging in ${work}`);

for (const entry of ["package.json", "README.md", "LICENSE", "language-configuration.json", "syntaxes", "dist"]) {
  const src = join(pkgRoot, entry);
  if (existsSync(src)) cpSync(src, join(work, entry), { recursive: true });
}

const ignore = join(pkgRoot, ".vscodeignore");
if (existsSync(ignore)) cpSync(ignore, join(work, ".vscodeignore"));

const pkgPath = join(work, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (pkg.devDependencies) {
  delete pkg.devDependencies["@notedown/parser"];
  delete pkg.devDependencies["@notedown/renderer"];
}
delete pkg.scripts?.["vscode:prepublish"];
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

execSync("npx --yes @vscode/vsce package --no-dependencies --out " + JSON.stringify(pkgRoot), {
  cwd: work,
  stdio: "inherit",
});

rmSync(work, { recursive: true, force: true });
console.log("Done. .vsix written to", pkgRoot);
