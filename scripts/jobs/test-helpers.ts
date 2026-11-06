import { ageLabel, type JobRole } from '../../packages/shared/src/jobs.ts';
import type { Op } from './plan.ts';

/** Apply planner ops to an in-memory store the way an idempotent createOrReplace would. */
export function applyOps(store: JobRole[], ops: Op[]): JobRole[] {
  const byId = new Map(store.map((r) => [r._id, r]));
  for (const o of ops) {
    const { _type: _t, ...doc } = o.doc as JobRole & { _type?: string };
    byId.set(o.id, doc as JobRole);
  }
  return [...byId.values()];
}

export const ageLabelFor = (r: JobRole, now: Date) => ageLabel(r, now);
