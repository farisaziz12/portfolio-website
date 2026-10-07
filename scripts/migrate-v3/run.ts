/**
 * V2 → V3 content migration CLI. DRY-RUN BY DEFAULT.
 *
 *   pnpm migrate:v3                          # fetch live dataset, print the plan, write plan JSON
 *   pnpm migrate:v3 --apply                  # apply it (needs SANITY_API_TOKEN with write access)
 *   pnpm migrate:v3 --apply --delete-legacy  # also delete migrated/unused legacy documents
 *   pnpm migrate:v3 --from export.ndjson     # plan against a `sanity dataset export` file, offline
 *   pnpm migrate:v3 --from x.json --simulate out.json   # write the migrated dataset to a file
 *
 * Env: SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET (default production), SANITY_API_TOKEN.
 * Take a backup first: `pnpm --filter studio exec sanity dataset export production backup.tar.gz`.
 */
import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync } from 'node:fs';
import { planMigration, applyInMemory, type Doc } from './transform';

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const value = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

function readFile(path: string): Doc[] {
  const raw = readFileSync(path, 'utf8');
  return path.endsWith('.ndjson') ? raw.split('\n').filter(Boolean).map((l) => JSON.parse(l)) : JSON.parse(raw);
}

async function main() {
  const from = value('--from');
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN;

  const client = projectId ? createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false, token }) : null;
  let docs: Doc[];
  if (from) docs = readFile(from);
  else {
    if (!client) throw new Error('Set SANITY_STUDIO_PROJECT_ID (and SANITY_API_TOKEN for private data / --apply), or pass --from <export>.');
    docs = await client.fetch<Doc[]>('*[!(_id in path("_.**")) && !(_type match "sanity.*") && !(_type match "system.*")]');
  }

  const plan = planMigration(docs, { deleteLegacy: flag('--delete-legacy') });
  console.log(`\nV3 migration plan for ${from ?? `${projectId}/${dataset}`} (${docs.length} documents)\n`);
  for (const [k, n] of Object.entries(plan.counts).sort()) console.log(`  ${k.padEnd(28)} ${n}`);
  console.log(`  ${'total mutations'.padEnd(28)} ${plan.mutations.length}`);
  if (plan.notes.length) {
    console.log('\nNotes:');
    for (const n of plan.notes) console.log(`  - ${n}`);
  }
  const planFile = value('--plan-out') ?? 'migrate-v3.plan.json';
  writeFileSync(planFile, JSON.stringify(plan, null, 2));
  console.log(`\nFull plan written to ${planFile}`);

  const sim = value('--simulate');
  if (sim) {
    writeFileSync(sim, JSON.stringify(applyInMemory(docs, plan), null, 1));
    console.log(`Simulated dataset written to ${sim}`);
  }

  if (!flag('--apply')) {
    console.log('\nDry run only. Re-run with --apply to write.');
    return;
  }
  if (!client || !token) throw new Error('--apply needs SANITY_STUDIO_PROJECT_ID and a write token in SANITY_API_TOKEN.');
  const BATCH = 100;
  for (let i = 0; i < plan.mutations.length; i += BATCH) {
    const chunk = plan.mutations.slice(i, i + BATCH);
    await client.mutate(chunk as Parameters<typeof client.mutate>[0], { visibility: 'async' });
    console.log(`  applied ${Math.min(i + BATCH, plan.mutations.length)}/${plan.mutations.length}`);
  }
  console.log('\nDone. Re-run without --apply: the plan should now be empty (idempotent).');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
