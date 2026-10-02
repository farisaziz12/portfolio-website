/** Role wording follows the event's tense: "Hosting" before, "Hosted" after. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketBadge, sessionFormat, sessionShort } from './events-view';
import type { Session } from './sanity/v3';

const sess = (role: Session['role'], status: Session['status']) => ({ key: 'k', role, bucket: 'hosted', status }) as Session;

test('sessionFormat: activities take the tense, nouns stay the same', () => {
  assert.equal(sessionFormat(sess('host', 'confirmed')), 'Hosting');
  assert.equal(sessionFormat(sess('host', 'delivered')), 'Hosted');
  assert.equal(sessionFormat(sess('attendee', 'delivered')), 'Attended');
  assert.equal(sessionFormat(sess('organizer', 'tba')), 'Organising');
  assert.equal(sessionFormat(sess('panel', 'delivered')), 'Panel');
  assert.equal(sessionShort(sess('host', 'confirmed')), 'Hosting');
});

test('bucketBadge: future events say what I will do, past ones what I did', () => {
  assert.equal(bucketBadge('hosted', true), 'Hosting');
  assert.equal(bucketBadge('hosted', false), 'Hosted');
  assert.equal(bucketBadge('spoke', true), 'Speaking');
  assert.equal(bucketBadge('spoke'), 'Spoke');
  assert.equal(bucketBadge(undefined), '');
});
