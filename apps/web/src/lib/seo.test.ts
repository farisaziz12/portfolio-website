import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PUBLIC_EMAIL, communityOrganization, personContactPoints } from './seo';

describe('personContactPoints', () => {
  it('points at the invite and contact forms, with a contact type each', () => {
    const points = personContactPoints('https://faziz-dev.com');
    assert.deepEqual(points.map((p) => p.url), ['https://faziz-dev.com/invite', 'https://faziz-dev.com/contact']);
    for (const p of points) {
      assert.equal(p['@type'], 'ContactPoint');
      assert.ok(p.contactType);
    }
  });

  it('gives the public email as a bare address (no link, no phone)', () => {
    for (const p of personContactPoints()) {
      assert.equal(p.email, PUBLIC_EMAIL);
      assert.equal(p.telephone, undefined);
    }
    assert.match(PUBLIC_EMAIL, /^[^:\s]+@[^:\s]+\.[a-z]+$/);
  });
});

describe('communityOrganization', () => {
  it('carries a PostalAddress and a ContactPoint', () => {
    const org = communityOrganization({ name: 'ZurichJS', url: 'https://zurichjs.com', city: 'Zurich' }, 'Faris Aziz');
    assert.equal(org['@type'], 'Organization');
    assert.deepEqual(org.address, { '@type': 'PostalAddress', addressLocality: 'Zurich' });
    assert.deepEqual(org.contactPoint, { '@type': 'ContactPoint', contactType: 'community enquiries', email: 'faris@zurichjs.com', url: 'https://zurichjs.com' });
  });

  it('leaves out what the CMS does not know', () => {
    const org = communityOrganization({ name: 'Somewhere JS' }, 'Faris Aziz');
    assert.equal(org.address, undefined);
    assert.deepEqual(org.contactPoint, { '@type': 'ContactPoint', contactType: 'community enquiries', email: 'faris@zurichjs.com' });
    assert.equal(org.url, undefined);
  });
});
