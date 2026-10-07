/** Catalogue order and "new" detection (lib/talks.ts). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { byPopularity, isNewTalk, talkSortKeys } from './talks';
import type { TalkWithHistory } from './sanity/v3';

const past = (date: string) => ({ event: { date, isUpcoming: false } });
const soon = (date: string) => ({ event: { date, isUpcoming: true } });
const talk = (id: string, count: number, last?: string, extra: Partial<TalkWithHistory> = {}) =>
  ({
    _id: id,
    deliveredCount: count,
    lastDelivery: last ? past(last) : undefined,
    deliveries: last ? [past(last)] : [],
    versions: [],
    ...extra,
  }) as unknown as TalkWithHistory;

test('byPopularity: most given first, then most recently given, then editor order', () => {
  const list = [
    talk('a', 2, '2024-05-01', { order: 1 }),
    talk('b', 5, '2025-01-01'),
    talk('c', 2, '2025-09-01', { order: 2 }),
    talk('d', 0, undefined, { order: 0 }),
  ];
  assert.deepEqual([...list].sort(byPopularity).map((t) => t._id), ['b', 'c', 'a', 'd']);
});

test('isNewTalk: no past session in the family; an upcoming premiere still counts as new', () => {
  assert.equal(isNewTalk(talk('x', 0)), true);
  assert.equal(isNewTalk({ deliveries: [soon('2026-10-09')] } as unknown as TalkWithHistory), true);
  assert.equal(isNewTalk(talk('y', 1, '2025-06-01')), false);
});

test('talkSortKeys: newest falls back to the first delivery when _createdAt is missing', () => {
  const t = talk('z', 1, '2025-06-01', { versions: [{ firstDelivered: '2024-12-13' }] as TalkWithHistory['versions'] });
  assert.equal(talkSortKeys(t).newest, '2024-12-13');
  assert.equal(talkSortKeys({ ...t, _createdAt: '2026-01-02T00:00:00Z' } as TalkWithHistory).newest, '2026-01-02T00:00:00Z');
});
