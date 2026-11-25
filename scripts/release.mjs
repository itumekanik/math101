/**
 * Reads version and date from CHANGELOG.md and ensures package.json matches.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RELEASE = /^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})\s*$/m;

export function latestRelease(changelog) {
  const match = RELEASE.exec(changelog.replace(/\r\n/g, "\n"));
  if (!match) throw new Error('CHANGELOG.md: no release heading like "## [1.0.0] - 2026-11-25"');
  return { version: match[1], date: match[2] };
}

function commit(root) {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function repoUrl(root) {
  if (process.env.GITHUB_REPOSITORY) {
    const server = process.env.GITHUB_SERVER_URL || "https://github.com";
    return `${server}/${process.env.GITHUB_REPOSITORY}`;
  }
  try {
    const raw = execFileSync("git", ["remote", "get-url", "origin"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const ssh = /^git@([^:]+):(.+?)(?:\.git)?$/.exec(raw);
    if (ssh) return `https://${ssh[1]}/${ssh[2]}`;
    if (/^https?:\/\//.test(raw)) return raw.replace(/\.git$/, "");
  } catch {
    /* no remote configured yet */
  }
  return null;
}

export function readRelease(root) {
  const release = latestRelease(readFileSync(join(root, "CHANGELOG.md"), "utf8"));
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
  if (pkg !== release.version) {
    throw new Error(`CHANGELOG.md's newest release is ${release.version} but package.json says ${pkg}`);
  }
  return { ...release, commit: commit(root), repo: repoUrl(root) };
}
