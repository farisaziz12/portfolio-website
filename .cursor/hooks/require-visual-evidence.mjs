#!/usr/bin/env node
/**
 * Stop hook: if the working tree / branch diff touches a visual surface and
 * there are no screenshot artifacts, ask the agent to capture before/after
 * once. Always print {} on errors so a hook bug cannot brick agents.
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const UI_RE =
  /^(apps\/web\/src\/(pages|components|layouts|styles|emails)\/|apps\/web\/src\/pages\/og\/|apps\/web\/tailwind\.config)/;

const IMAGE_RE = /\.(png|jpe?g|webp|gif|mp4|webm)$/i;
const ARTIFACT_DIRS = [
  '/opt/cursor/artifacts',
  '/opt/cursor/artifacts/screenshots',
  process.env.CURSOR_ARTIFACTS_DIR,
].filter(Boolean);

async function readStdinJson() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function changedFiles() {
  const names = new Set();
  for (const cmd of [
    'git diff --name-only --diff-filter=ACMR',
    'git diff --cached --name-only --diff-filter=ACMR',
    'git diff --name-only --diff-filter=ACMR main...HEAD',
    'git diff --name-only --diff-filter=ACMR origin/main...HEAD',
  ]) {
    const out = sh(cmd);
    for (const line of out.split('\n')) if (line) names.add(line);
  }
  return [...names];
}

function listImages(dir, depth = 0) {
  if (!dir || !existsSync(dir) || depth > 4) return [];
  let st;
  try {
    st = statSync(dir);
  } catch {
    return [];
  }
  if (st.isFile()) return IMAGE_RE.test(dir) ? [dir] : [];
  const out = [];
  try {
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.')) continue;
      out.push(...listImages(join(dir, name), depth + 1));
    }
  } catch {
    /* unreadable */
  }
  return out;
}

function hasVisualArtifacts() {
  const found = [];
  for (const dir of ARTIFACT_DIRS) found.push(...listImages(dir));
  const extra = sh('git ls-files --others --exclude-standard')
    .split('\n')
    .filter((f) => IMAGE_RE.test(f));
  found.push(...extra);
  return found.length >= 2;
}

function done(payload) {
  process.stdout.write(JSON.stringify(payload));
  process.exit(0);
}

try {
  const input = await readStdinJson();
  if (input.status && input.status !== 'completed') done({});
  if (Number(input.loop_count || 0) > 0) done({});

  const files = changedFiles();
  const ui = files.filter((f) => UI_RE.test(f));
  if (ui.length === 0) done({});
  if (hasVisualArtifacts()) done({});

  done({
    followup_message:
      'UI files changed (' +
      ui.slice(0, 8).join(', ') +
      (ui.length > 8 ? ', …' : '') +
      '). Before finishing, follow `.cursor/skills/agent-pr-visual-evidence/SKILL.md`: capture labeled before AND after screenshots of the real pages (desktop; mobile too if layout/CSS changed), embed them in the PR body, and do not use `visual-evidence: not-applicable` for this diff.',
  });
} catch {
  done({});
}
