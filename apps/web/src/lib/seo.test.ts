import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { communityOrganization, personContactPoints } from './seo';

describe('personContactPoints', () => {
  it('points at the invite and contact forms, with a contact type each', () => {
    const points = personContactPoints('https://faziz-dev.com');
    assert.deepEqual(points.map((p) => p.url), ['https://faziz-dev.com/invite', 'https://faziz-dev.com/contact']);
    for (const p of points) {
      assert.equal(p['@type'], 'ContactPoint');
      assert.ok(p.contactType);
    }
  });

  it('never publishes an email address or phone number', () => {
    const json = JSON.stringify(personContactPoints());
    assert.doesNotMatch(json, /email|telephone|mailto|@[a-z]+\./i);
  });
});

describe('communityOrganization', () => {
  it('carries a PostalAddress and a ContactPoint', () => {
    const org = communityOrganization({ name: 'ZurichJS', url: 'https://zurichjs.com', city: 'Zurich' }, 'Faris Aziz');
    assert.equal(org['@type'], 'Organization');
    assert.deepEqual(org.address, { '@type': 'PostalAddress', addressLocality: 'Zurich' });
    assert.deepEqual(org.contactPoint, { '@type': 'ContactPoint', contactType: 'community enquiries', url: 'https://zurichjs.com' });
  });

  it('leaves out what the CMS does not know', () => {
    const org = communityOrganization({ name: 'Somewhere JS' }, 'Faris Aziz');
    assert.equal(org.address, undefined);
    assert.equal(org.contactPoint, undefined);
    assert.equal(org.url, undefined);
  });
});
