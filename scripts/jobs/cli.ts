/**
 * node scripts/jobs/cli.ts <command> < input.json
 *   reconcile   {existing, candidates, now?}          -> {ops, skipped}
 *   batch       {roles, settings?}                    -> {ids}
 *   verify      {role, result}                        -> role
 *   edition     {roles, existingEditionIds, now?, resurface?, settings?} -> plan
 *   draft       {text}                                -> {characters, issues}
 */
import { readFileSync } from 'node:fs';
import { checkDraft, planEdition, reconcile, verificationBatch, verify } from './plan.ts';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const now = input.now ? new Date(input.now) : new Date();
const cmd = process.argv[2];
const out =
  cmd === 'reconcile' ? reconcile(input.existing ?? [], input.candidates ?? [], now)
  : cmd === 'batch' ? { ids: verificationBatch(input.roles ?? [], input.settings ?? {}) }
  : cmd === 'verify' ? verify(input.role, input.result)
  : cmd === 'edition' ? planEdition(input.roles ?? [], input.existingEditionIds ?? [], now, input.resurface, input.settings)
  : cmd === 'draft' ? checkDraft(String(input.text ?? ''))
  : (() => { console.error('Unknown command. Use reconcile | batch | verify | edition | draft'); process.exit(2); })();
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
