/**
 * Derived, role-specific counts. "Talks delivered" counts only past, not
 * cancelled talk sessions; hosting and attending are counted apart and never
 * inflate it. Countries count where I spoke, ran a workshop or hosted.
 */
import { TALK_DELIVERY_ROLES } from 'shared';
import { FALLBACK_SPEAKER_STATS } from '../../proof';
import { getAllEvents } from './events';
import { memo } from './fetch';
import { getCatalogueTalks, getWorkshops } from './talks';
import { getWriting } from './writing';
import type { SpeakingStats } from './types';

export function getSpeakingStats(): Promise<SpeakingStats> {
  return memo('stats:speaking', async () => {
    const [events, talks, workshops, writing] = await Promise.all([getAllEvents(), getCatalogueTalks(), getWorkshops(), getWriting()]);
    const asOf = new Date().toISOString().slice(0, 10);
    if (!events.length) {
      return {
        talksDelivered: FALLBACK_SPEAKER_STATS.totalEvents,
        workshopsDelivered: 0,
        panels: 0,
        hosted: 0,
        attended: 0,
        countries: FALLBACK_SPEAKER_STATS.countries,
        cities: FALLBACK_SPEAKER_STATS.cities,
        countryList: [],
        podcasts: 0,
        catalogueTalks: talks.length,
        catalogueWorkshops: workshops.filter((w) => w.isBookable).length,
        upcoming: 0,
        eventRecords: 0,
        asOf,
        fallback: true,
      };
    }
    let talksDelivered = 0;
    let workshopsDelivered = 0;
    let panels = 0;
    let hosted = 0;
    let attended = 0;
    const countries = new Map<string, number>();
    const cities = new Set<string>();
    for (const e of events) {
      let countsForPlace = false;
      for (const s of e.sessions) {
        if (s.status !== 'delivered') continue;
        if (TALK_DELIVERY_ROLES.includes(s.role)) talksDelivered++;
        if (s.role === 'panel') panels++;
        if (s.bucket === 'workshop') workshopsDelivered++;
        if (s.bucket === 'hosted') hosted++;
        if (s.bucket === 'attended') attended++;
        if (s.bucket !== 'attended') countsForPlace = true;
      }
      if (countsForPlace && !e.location.isOnline) {
        if (e.location.country) countries.set(e.location.country, (countries.get(e.location.country) ?? 0) + 1);
        if (e.location.city) cities.add(`${e.location.city}|${e.location.country ?? ''}`);
      }
    }
    return {
      talksDelivered,
      workshopsDelivered,
      panels,
      hosted,
      attended,
      countries: countries.size,
      cities: cities.size,
      // Most-visited first, so flag rows lead with the familiar ones.
      countryList: [...countries.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c),
      podcasts: writing.filter((w) => w.format === 'podcast').length,
      catalogueTalks: talks.length,
      catalogueWorkshops: workshops.filter((w) => w.isBookable).length,
      upcoming: events.filter((e) => e.isUpcoming && e.buckets.some((b) => b !== 'attended')).length,
      eventRecords: events.length,
      asOf,
      fallback: false,
    };
  });
}
