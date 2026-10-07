/** hotspotFocus (crop-relative focus), the home hero's press-photo fallback, basedIn. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homeHeroPhotos, hotspotFocus } from './image';
import { basedIn } from './site';
import type { PressPhoto } from './types';

const asset = (id: string) => ({ asset: { _ref: id } });
const press = (id: string, tag?: string): PressPhoto => ({ _key: id, tag, ...asset(id) });

test('hotspotFocus: no hotspot → undefined', () => {
  assert.equal(hotspotFocus(asset('a')), undefined);
  assert.equal(hotspotFocus(undefined), undefined);
});

test('hotspotFocus: hotspot centre as percentages', () => {
  assert.equal(hotspotFocus({ ...asset('a'), hotspot: { x: 0.3, y: 0.25, width: 0.2, height: 0.2 } }), '30% 25%');
});

test('hotspotFocus: re-expressed inside the editor crop', () => {
  const img = { ...asset('a'), hotspot: { x: 0.5, y: 0.5, width: 0.1, height: 0.1 }, crop: { left: 0.25, right: 0, top: 0, bottom: 0.5 } };
  // x: (0.5 - 0.25) / 0.75 = 33.3%; y: 0.5 / 0.5 = 100%
  assert.equal(hotspotFocus(img), '33.3% 100%');
});

test('homeHeroPhotos: Home page picks win', () => {
  const picks = [asset('h1'), asset('h2')];
  assert.deepEqual(homeHeroPhotos(picks, [press('p1', 'stage')]), picks);
});

test('homeHeroPhotos: empty picks fall back to press photos, stage first, max three', () => {
  const out = homeHeroPhotos([], [press('portrait', 'portrait'), press('ws', 'workshop'), press('st', 'stage'), press('x'), { _key: 'none' }]);
  assert.deepEqual(out.map((p) => p.asset?._ref), ['st', 'ws', 'portrait']);
});

test('homeHeroPhotos: nothing anywhere → empty', () => {
  assert.deepEqual(homeHeroPhotos([], []), []);
});

test('basedIn: city and country from "City, Country"', () => {
  assert.deepEqual(basedIn('Geneva, Switzerland'), { city: 'Geneva', country: 'Switzerland' });
  assert.deepEqual(basedIn('Zurich'), { city: 'Zurich', country: undefined });
});
