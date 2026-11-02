/**
 * Derived, role-specific counts. The headline number (`sessionsDelivered`) and the
 * countries/cities follow ONE rule, HEADLINE_BUCKETS in shared/content-model:
 * past, not-cancelled sessions where I spoke or ran a workshop. Hosting and
 * attending are counted apart and never inflate it. `upcoming` counts
 * everything on the schedule, attending included.
 */
import { HEADLINE_BUCKETS, TALK_DELIVERY_ROLES } from 'shared';
import { FALLBACK_SPEAKER_STATS } from '../../proof';
import { getAllEvents, isScheduled } from './events';
import { memo } from './fetch';
import { getCatalogueTalks, getWorkshops } from './talks';
import { getWriting } from './writing';
import type { EventEdition, SpeakingStats } from './types';

/** Pure: the counts for a list of events. Exported for tests and scripts. */
export function countSpeaking(events: EventEdition[]) {
  let sessionsDelivered = 0;
  let conferenceTalks = 0;
  let workshopsDelivered = 0;
  let panels = 0;
  let guestSpots = 0;
  let hosted = 0;
  let attended = 0;
  const countries = new Map<string, number>();
  const cities = new Set<string>();
  for (const e of events) {
    let countsForPlace = false;
    for (const s of e.sessions) {
      if (s.status !== 'delivered') continue;
      if (HEADLINE_BUCKETS.includes(s.bucket)) {
        sessionsDelivered++;
        countsForPlace = true;
      }
      if (TALK_DELIVERY_ROLES.includes(s.role)) conferenceTalks++;
      if (s.role === 'panel') panels++;
      if (s.role === 'guest') guestSpots++;
      if (s.bucket === 'workshop') workshopsDelivered++;
      if (s.bucket === 'hosted') hosted++;
      if (s.bucket === 'attended') attended++;
    }
    if (countsForPlace && !e.location.isOnline) {
      if (e.location.country) countries.set(e.location.country, (countries.get(e.location.country) ?? 0) + 1);
      if (e.location.city) cities.add(`${e.location.city}|${e.location.country ?? ''}`);
    }
  }
  return {
    sessionsDelivered,
    conferenceTalks,
    workshopsDelivered,
    panels,
    guestSpots,
    hosted,
    attended,
    countries: countries.size,
    cities: cities.size,
    // Most-visited first, so flag rows lead with the familiar ones.
    countryList: [...countries.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c),
  };
}

export function getSpeakingStats(): Promise<SpeakingStats> {
  return memo('stats:speaking', async () => {
    const [events, talks, workshops, writing] = await Promise.all([getAllEvents(), getCatalogueTalks(), getWorkshops(), getWriting()]);
    const asOf = new Date().toISOString().slice(0, 10);
    const shared = {
      podcasts: writing.filter((w) => w.format === 'podcast').length,
      catalogueTalks: talks.length,
      catalogueWorkshops: workshops.filter((w) => w.isBookable).length,
      asOf,
    };
    if (!events.length) {
      return {
        sessionsDelivered: FALLBACK_SPEAKER_STATS.sessionsDelivered,
        conferenceTalks: 0,
        workshopsDelivered: 0,
        panels: 0,
        guestSpots: 0,
        hosted: 0,
        attended: 0,
        countries: FALLBACK_SPEAKER_STATS.countries,
        cities: FALLBACK_SPEAKER_STATS.cities,
        countryList: [],
        ...shared,
        // The fallback is a snapshot, so it is "as of" when it was taken, not today.
        asOf: FALLBACK_SPEAKER_STATS.asOf,
        upcoming: 0,
        eventRecords: 0,
        fallback: true,
      };
    }
    return {
      ...countSpeaking(events),
      ...shared,
      upcoming: events.filter(isScheduled).length,
      eventRecords: events.length,
      fallback: false,
    };
  });
}
