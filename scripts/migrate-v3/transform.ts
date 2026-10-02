/**
 * V2 → V3 content migration, as a PURE function: documents in, mutations out.
 * No network here, so it's testable against the offline fixture dataset
 * (scripts/migrate-v3/transform.test.ts) and the CLI can print an exact plan
 * before touching anything.
 *
 * What it does (every step is idempotent: re-running on migrated data is a no-op):
 *  1. event:         type/conference/talk/workshop/links → kind + series + url + sessions[]
 *  2. eventSeries:   one per distinct legacy `conference` name (deduped, normalised)
 *  3. socialPost, testimonial → praise (legacyId records the source)
 *  4. impactMetricV2 → metric with status "needs-ok" (definitions must be written, see prompts)
 *  5. externalPost:  type → format
 *  6. talk:          assets.thumbnailImage → thumbnail; homepageFeatured → homePage.featured[0]
 *  7. workshop:      legacy agenda → formats[0]
 *  8. speakerProfile: bioFull → bioLong (plain text), technicalRequirements → rider[], drop socialLinks.email
 *  9. serviceOffer:  serviceType consulting → advisory
 * 10. (with deleteLegacy) delete migrated socialPost/testimonial/impactMetricV2 and the unused
 *     impactMetric, impactCategory, impactPage, servicePage, siteNavigation documents.
 */
import { LEGACY_EVENT_TYPE_ROLE, LEGACY_EXTERNAL_TYPE_FORMAT, LEGACY_METRIC_AREA, formatLegacyMetric } from '../../packages/shared/src/content-model';

export type Doc = { _id: string; _type: string; [k: string]: unknown };

export type Mutation =
  | { createIfNotExists: Doc }
  | { patch: { id: string; set?: Record<string, unknown>; unset?: string[]; setIfMissing?: Record<string, unknown> } }
  | { delete: { id: string } };

export interface Plan {
  mutations: Mutation[];
  notes: string[];
  counts: Record<string, number>;
}

const LEGACY_KIND: Record<string, string> = {
  conference: 'conference',
  meetup: 'meetup',
  workshop: 'workshop',
  podcast: 'podcast',
  webinar: 'livestream',
  panel: 'conference',
  hosting: 'meetup',
  judging: 'awards',
  mentoring: 'company',
  attending: 'conference',
};

const SOCIAL_TOPIC: Record<string, string> = { talk: 'talk', work: 'work', recommendation: 'work', mention: 'stage', other: 'stage' };
const TESTIMONIAL_TOPIC: Record<string, string> = {
  mentored: 'mentoring',
  workshop_attendee: 'workshop',
  conference_attendee: 'stage',
  speaking: 'stage',
  worked_together: 'work',
  managed: 'work',
  reported: 'work',
  consulting: 'work',
  collaboration: 'work',
};
const LEGACY_METRIC_DOMAIN: Record<string, string> = { community: 'community', product: 'engineering', leadership: 'career', speaking: 'speaking' };

const ref = (id: unknown) => (id && typeof id === 'object' && '_ref' in id ? { _type: 'reference', _ref: (id as { _ref: string })._ref } : undefined);
const isDraft = (d: Doc) => d._id.startsWith('drafts.');
const key = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || 'k';

/** "React Summit US 2025" → "react-summit-us"; "Zurich JS" and "ZurichJS" merge. */
export function seriesSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(19|20)\d{2}\b/g, '')
    .replace(/zurich\s+js/g, 'zurichjs')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((b) => ((b as { children?: { text?: string }[] }).children ?? []).map((c) => c.text ?? '').join(''))
    .filter(Boolean)
    .join('\n\n');
}

export function planMigration(docs: Doc[], opts: { deleteLegacy?: boolean } = {}): Plan {
  const mutations: Mutation[] = [];
  const notes: string[] = [];
  const counts: Record<string, number> = {};
  const bump = (k: string) => (counts[k] = (counts[k] ?? 0) + 1);
  const published = docs.filter((d) => !isDraft(d));
  const drafts = docs.filter(isDraft);
  if (drafts.length) notes.push(`${drafts.length} draft(s) skipped (publish or discard them first): ${drafts.slice(0, 8).map((d) => d._id).join(', ')}`);
  const byType = (t: string) => published.filter((d) => d._type === t);

  // ── 1+2. Events and series ──────────────────────────────────────────────
  const existingSeries = new Map(byType('eventSeries').map((s) => [seriesSlug(String(s.name ?? '')), s._id]));
  const newSeries = new Map<string, Doc>();
  for (const e of byType('event')) {
    const hasSessions = Array.isArray(e.sessions) && e.sessions.length > 0;
    const legacyType = typeof e.type === 'string' ? e.type : undefined;
    const set: Record<string, unknown> = {};
    const unset: string[] = [];

    if (!hasSessions && (legacyType || e.talk || e.workshop)) {
      const role = LEGACY_EVENT_TYPE_ROLE[legacyType ?? ''] ?? (e.workshop && !e.talk ? 'workshop' : 'speaker');
      const links = (e.links ?? {}) as { videoUrl?: string; slidesUrl?: string; eventUrl?: string };
      const session: Record<string, unknown> = { _key: 'migrated', _type: 'session', role };
      const talk = ref(e.talk);
      const workshop = ref(e.workshop);
      if (talk && role !== 'workshop') session.talk = talk;
      if (workshop && (role === 'workshop' || !talk)) {
        session.workshop = workshop;
        if (!talk) session.role = 'workshop';
      }
      if (links.videoUrl) session.recording = { url: links.videoUrl };
      if (links.slidesUrl) session.slidesUrl = links.slidesUrl;
      set.sessions = [session];
      if (talk && workshop && role !== 'workshop') {
        (set.sessions as unknown[]).push({ _key: 'migratedws', _type: 'session', role: 'workshop', workshop });
      }
      if (legacyType === 'podcast') notes.push(`event ${e._id} (“${e.title}”) is a podcast: consider moving it to a Publication (format podcast) — see prompt 3.`);
      bump('event.sessions');
    }
    if (!e.kind && legacyType) set.kind = LEGACY_KIND[legacyType] ?? 'conference';
    const links = (e.links ?? {}) as { eventUrl?: string };
    if (!e.url && links.eventUrl) set.url = links.eventUrl;
    if (!e.timezone) set.timezone = 'Europe/Zurich';

    const conference = typeof e.conference === 'string' ? e.conference.trim() : '';
    if (!e.series && conference) {
      const slug = seriesSlug(conference);
      let id = existingSeries.get(slug) ?? newSeries.get(slug)?._id;
      if (!id) {
        id = `series-${slug}`;
        newSeries.set(slug, { _id: id, _type: 'eventSeries', name: conference.replace(/\s+(19|20)\d{2}$/, ''), slug: { _type: 'slug', current: slug } });
      }
      set.series = { _type: 'reference', _ref: id };
    }
    if (e.location && typeof e.location === 'object') {
      const loc = e.location as { country?: string };
      const fix: Record<string, string> = { 'Czech Republic': 'Czechia', USA: 'United States', UK: 'United Kingdom', Macedonia: 'North Macedonia' };
      if (loc.country && fix[loc.country]) set['location.country'] = fix[loc.country];
    }

    // Legacy fields go only once their information lives in the new ones.
    if (hasSessions || set.sessions) {
      for (const f of ['type', 'conference', 'talk', 'workshop', 'links']) if (f in e) unset.push(f);
    }
    if (Object.keys(set).length || unset.length) {
      mutations.push({ patch: { id: e._id, ...(Object.keys(set).length ? { set } : {}), ...(unset.length ? { unset } : {}) } });
      bump('event.patched');
    }
  }
  for (const s of newSeries.values()) {
    mutations.unshift({ createIfNotExists: s });
    bump('eventSeries.created');
  }

  // ── 3. Praise ───────────────────────────────────────────────────────────
  const migratedPraise = new Set(byType('praise').map((p) => p.legacyId).filter(Boolean));
  for (const s of byType('socialPost')) {
    const legacyId = `socialPost:${s._id}`;
    if (migratedPraise.has(legacyId)) continue;
    const platform = s.platform === 'twitter' ? 'x' : s.platform;
    const doc: Doc = {
      _id: `praise-${key(s._id)}`,
      _type: 'praise',
      quote: s.content,
      platform,
      url: s.url,
      date: s.postDate,
      author: { name: s.author, handle: s.authorHandle, headline: s.authorRole, ...(s.authorImage ? { image: s.authorImage } : {}) },
      topic: SOCIAL_TOPIC[String(s.context ?? '')] ?? (s.relatedTalk ? 'talk' : 'stage'),
      ...(ref(s.relatedTalk) ? { talk: ref(s.relatedTalk) } : {}),
      ...(ref(s.relatedEvent) ? { event: ref(s.relatedEvent) } : {}),
      featured: Boolean(s.featured),
      ...(typeof s.order === 'number' ? { order: s.order } : {}),
      legacyId,
    };
    mutations.push({ createIfNotExists: doc });
    bump('praise.fromSocialPost');
    if (!s.postDate) notes.push(`praise from ${s._id} has no date — add one (prompt 4).`);
    if (opts.deleteLegacy) mutations.push({ delete: { id: s._id } });
  }
  for (const t of byType('testimonial')) {
    const legacyId = `testimonial:${t._id}`;
    if (migratedPraise.has(legacyId)) continue;
    const platform = t.type === 'linkedin' ? 'linkedin' : t.type === 'mentorcruise' ? 'mentorcruise' : 'direct';
    const headline = [t.role, t.company].filter(Boolean).join(' · ');
    const doc: Doc = {
      _id: `praise-${key(t._id)}`,
      _type: 'praise',
      quote: t.quote,
      platform,
      ...(t.source ? { url: t.source } : {}),
      date: t.date,
      author: { name: t.author, ...(headline ? { headline } : {}), ...(t.image ? { image: t.image } : {}) },
      topic: TESTIMONIAL_TOPIC[String(t.context ?? '')] ?? (t.type === 'workshop' ? 'workshop' : t.type === 'talk' ? 'talk' : t.type === 'mentorcruise' ? 'mentoring' : 'work'),
      featured: Boolean(t.featured),
      legacyId,
    };
    mutations.push({ createIfNotExists: doc });
    bump('praise.fromTestimonial');
    if (opts.deleteLegacy) mutations.push({ delete: { id: t._id } });
  }

  // ── 4. Metrics ──────────────────────────────────────────────────────────
  const migratedMetrics = new Set(byType('metric').map((m) => m._id));
  for (const m of byType('impactMetricV2')) {
    const id = `metric-${key(m._id)}`;
    if (migratedMetrics.has(id)) continue;
    const value = formatLegacyMetric(m);
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: 'metric',
        value,
        label: m.label ?? m.title ?? '',
        ...(m.timeWindow ? { period: m.timeWindow } : {}),
        asOf: String(m._updatedAt ?? new Date().toISOString()).slice(0, 10),
        definition: 'TODO: one sentence on how this is counted.',
        ...(m.contextNote ? { context: m.contextNote } : {}),
        domain: LEGACY_METRIC_DOMAIN[String(m.domain ?? '')] ?? 'engineering',
        ...(LEGACY_METRIC_AREA[String(m.domain ?? '')] ? { area: LEGACY_METRIC_AREA[String(m.domain ?? '')] } : {}),
        status: 'needs-ok',
        ...(typeof m.order === 'number' ? { order: m.order } : {}),
      },
    });
    bump('metric.fromImpactMetricV2');
    if (opts.deleteLegacy) mutations.push({ delete: { id: m._id } });
  }
  if (byType('impactMetricV2').length) notes.push('Migrated metrics are status "needs-ok" with a TODO definition: they stay hidden until reviewed (prompt 5).');

  // ── 5. Publications ─────────────────────────────────────────────────────
  for (const x of byType('externalPost')) {
    if (x.format || !x.type) continue;
    mutations.push({ patch: { id: x._id, set: { format: LEGACY_EXTERNAL_TYPE_FORMAT[String(x.type)] ?? 'article' }, unset: ['type'] } });
    bump('externalPost.format');
  }

  // ── 6. Talks + home page ────────────────────────────────────────────────
  const featuredTalk = byType('talk').find((t) => t.homepageFeatured === true);
  for (const t of byType('talk')) {
    const assets = (t.assets ?? {}) as { thumbnailImage?: unknown };
    const set: Record<string, unknown> = {};
    const unset: string[] = [];
    if (!t.thumbnail && assets.thumbnailImage) {
      set.thumbnail = assets.thumbnailImage;
      unset.push('assets.thumbnailImage');
    }
    if ('homepageFeatured' in t) unset.push('homepageFeatured');
    if ('viewCount' in t) unset.push('viewCount');
    if ('firstDelivered' in t) unset.push('firstDelivered');
    if (Object.keys(set).length || unset.length) {
      mutations.push({ patch: { id: t._id, ...(Object.keys(set).length ? { set } : {}), ...(unset.length ? { unset } : {}) } });
      bump('talk.patched');
    }
  }
  const home = byType('homePage')[0];
  if (!home) {
    mutations.push({
      createIfNotExists: {
        _id: 'homePage',
        _type: 'homePage',
        heroVariant: 'band',
        ...(featuredTalk ? { featured: [{ _key: 'f1', _type: 'reference', _ref: featuredTalk._id }] } : {}),
      },
    });
    bump('homePage.created');
  }

  // ── 7. Workshops ────────────────────────────────────────────────────────
  for (const w of byType('workshop')) {
    if ((Array.isArray(w.formats) && w.formats.length) || !Array.isArray(w.agenda) || !w.agenda.length) continue;
    const agenda = (w.agenda as Record<string, unknown>[]).map((a, i) => ({ ...a, _type: 'agendaItem', _key: String(a._key ?? `a${i}`) }));
    mutations.push({
      patch: { id: w._id, set: { formats: [{ _key: 'f1', _type: 'workshopFormat', label: String(w.duration ?? 'Agenda'), duration: w.duration, agenda }] }, unset: ['agenda'] },
    });
    bump('workshop.formats');
  }

  // ── 8. Profile ──────────────────────────────────────────────────────────
  for (const p of byType('speakerProfile')) {
    const set: Record<string, unknown> = {};
    const unset: string[] = [];
    if (!p.bioLong && Array.isArray(p.bioFull) && p.bioFull.length) {
      set.bioLong = toPlainText(p.bioFull);
      unset.push('bioFull');
    }
    if ((!Array.isArray(p.rider) || !p.rider.length) && typeof p.technicalRequirements === 'string') {
      set.rider = p.technicalRequirements
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l, i) => {
          const [label, ...rest] = l.split(':');
          return { _key: `r${i}`, _type: 'riderItem', label: rest.length ? label.trim() : 'Setup', body: rest.length ? rest.join(':').trim() : l };
        });
      unset.push('technicalRequirements');
    }
    const links = (p.socialLinks ?? {}) as { email?: string };
    if (links.email) unset.push('socialLinks.email');
    if (p._id !== 'speakerProfile') notes.push(`speakerProfile document id is "${p._id}"; the Studio singleton opens "speakerProfile". Duplicate it to that id (prompt 1).`);
    if (Object.keys(set).length || unset.length) {
      mutations.push({ patch: { id: p._id, ...(Object.keys(set).length ? { set } : {}), ...(unset.length ? { unset } : {}) } });
      bump('speakerProfile.patched');
    }
  }
  for (const s of byType('siteSettings')) {
    if (s._id !== 'siteSettings') notes.push(`siteSettings document id is "${s._id}"; the Studio singleton opens "siteSettings" (prompt 1).`);
  }

  // ── 9. Services ─────────────────────────────────────────────────────────
  for (const o of byType('serviceOffer')) {
    if (o.serviceType !== 'consulting') continue;
    mutations.push({ patch: { id: o._id, set: { serviceType: 'advisory' } } });
    bump('serviceOffer.advisory');
  }

  // ── 10. Unused legacy singletons/types ──────────────────────────────────
  if (opts.deleteLegacy) {
    for (const t of ['impactMetric', 'impactCategory', 'impactPage', 'servicePage', 'siteNavigation']) {
      for (const d of byType(t)) {
        mutations.push({ delete: { id: d._id } });
        bump(`${t}.deleted`);
      }
    }
  }

  return { mutations, notes, counts };
}

/** Apply a plan to an in-memory dataset (used by tests and the --simulate CLI flag). */
export function applyInMemory(docs: Doc[], plan: Plan): Doc[] {
  const map = new Map(docs.map((d) => [d._id, structuredClone(d)]));
  const setPath = (obj: Record<string, unknown>, path: string, value: unknown) => {
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts.slice(0, -1)) cur = (cur[p] ??= {}) as Record<string, unknown>;
    cur[parts[parts.length - 1]] = value;
  };
  const unsetPath = (obj: Record<string, unknown>, path: string) => {
    const parts = path.split('.');
    let cur: Record<string, unknown> | undefined = obj;
    for (const p of parts.slice(0, -1)) cur = cur?.[p] as Record<string, unknown> | undefined;
    if (cur) delete cur[parts[parts.length - 1]];
  };
  for (const m of plan.mutations) {
    if ('createIfNotExists' in m) {
      if (!map.has(m.createIfNotExists._id)) map.set(m.createIfNotExists._id, structuredClone(m.createIfNotExists));
    } else if ('patch' in m) {
      const d = map.get(m.patch.id);
      if (!d) continue;
      for (const [k, v] of Object.entries(m.patch.set ?? {})) setPath(d, k, v);
      for (const k of m.patch.unset ?? []) unsetPath(d, k);
    } else if ('delete' in m) {
      map.delete(m.delete.id);
    }
  }
  return [...map.values()];
}
