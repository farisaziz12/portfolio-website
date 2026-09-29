/**
 * Services + Mentorship page data: the three "How I can help" cards and the
 * mentorship details, built from `serviceOffer` documents with the approved
 * V3 copy as a per-field fallback. Shared by the HTML pages and their `.md`
 * mirrors so both always say the same thing.
 */
import type { Cta, Metric, ServiceOffer } from './sanity/v3';
import type { ServiceType } from 'shared';

export interface ServiceCardData {
  n: string;
  type: ServiceType;
  slug?: string;
  audience: string;
  title: string;
  reachOutIf: string;
  youGet: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** A CMS offer backs this card (false = fallback copy). */
  fromCms: boolean;
}

type CardCopy = Omit<ServiceCardData, 'n' | 'type' | 'fromCms' | 'slug'>;

/** Verbatim from the V3 Consulting mock; used only when the CMS field is empty. */
const FALLBACK: Record<ServiceType, CardCopy> = {
  events: {
    audience: 'Conferences, meetups, podcasts, teams',
    title: 'Events: speaking and workshops',
    reachOutIf: 'you’d like a talk, keynote, panel, podcast guest, or a hands-on workshop for your event or team.',
    youGet: 'a session shaped around your audience. Talks come with slides the same day; workshops with a repo you keep.',
    primary: { label: 'Invite me', href: '/invite' },
    secondary: { label: 'See workshops', href: '/workshops' },
  },
  advisory: {
    audience: 'Companies and founders · limited availability',
    title: 'Advisory',
    reachOutIf:
      'you want an outside view on frontend architecture, payments and monetization, engineering leadership, team structure, or go-to-market.',
    youGet: 'a close look at where you are, and a clear, written view of what to change first.',
    primary: { label: 'Tell me what’s going on', href: '/contact#message' },
  },
  mentorship: {
    audience: 'Individual engineers',
    title: 'Mentorship',
    reachOutIf: 'you’re working towards senior or lead, or want help with speaking and getting your work seen.',
    youGet: 'regular 1:1 conversations focused on your next step.',
    primary: { label: 'How mentorship works', href: '/mentorship' },
  },
};

const ORDER: ServiceType[] = ['events', 'advisory', 'mentorship'];

function cta(c: Cta | undefined, fallback?: { label: string; href: string }) {
  return c?.label && c?.href ? { label: c.label, href: c.href } : fallback;
}

/** One card per service type (events → advisory → mentorship), first offer of each type. */
export function serviceCards(offers: ServiceOffer[]): ServiceCardData[] {
  return ORDER.map((type, i) => {
    const o = offers.find((x) => x.serviceType === type);
    const f = FALLBACK[type];
    return {
      n: String(i + 1).padStart(2, '0'),
      type,
      slug: o?.slug,
      audience: o?.audience || f.audience,
      title: o?.title || f.title,
      reachOutIf: o?.reachOutIf || o?.shortDescription || f.reachOutIf,
      youGet: o?.youGet || (o?.outcomes.length ? o.outcomes.join('; ') : '') || f.youGet,
      primary: cta(o?.primaryCta) ?? (o?.bookingUrl ? { label: o.bookingLabel || 'Book', href: o.bookingUrl } : f.primary),
      secondary: o ? cta(o.secondaryCta) : f.secondary,
      fromCms: Boolean(o),
    };
  });
}

/** "How it starts" steps (Consulting mock). */
export function howItStarts(replyTime: string): { title: string; body: string }[] {
  return [
    { title: 'Send a message', body: 'A sentence or two. No brief needed.' },
    { title: `I reply within ${replyTime || 'two days'}`, body: 'With a clear yes, no, or a better idea.' },
    { title: 'A short call', body: 'We figure out the shape of it together.' },
  ];
}

// ─── Mentorship ────────────────────────────────────────────────────────────

export const MENTORCRUISE_URL = 'https://mentorcruise.com/mentor/farisaziz/';

export const MENTORSHIP_COPY = {
  kicker: ['Mentorship', 'a few seats at a time'],
  title: "Getting to senior, lead, or the talk you haven't given yet.",
  lede: 'I coached before I wrote code, and I still like it. One-to-one, every two to four weeks, for engineers who want a plan rather than a pep talk: the promotion case, the first team, the first conference abstract.',
  apply: {
    kicker: 'Apply for a seat',
    title: 'Goal, budget, cadence.',
    body: "Three fields. I take on a few people at a time and say so honestly when I'm full.",
  },
  praiseNote: 'Only mentoring and careers quotes here. Speaking praise stays on Speaking.',
};

/** The CFP metric ("436 talk proposals") if the community has one approved. */
export function cfpMetric(metrics: Metric[]): Metric | undefined {
  return metrics.find((m) => /\b(cfp|proposals?|abstracts?|submissions?)\b/i.test(`${m.label} ${m.definition ?? ''}`));
}

export function mentorshipFocus(cfp?: Metric): { kicker: string; title: string; body: string }[] {
  return [
    {
      kicker: 'Career',
      title: 'Senior and lead, earlier',
      body: 'Building the case, taking responsibility before the title, handling the first hard conversations.',
    },
    {
      kicker: 'Craft',
      title: 'Owning a system in production',
      body: 'From “I ship tickets” to “I’m responsible for this being up”. Architecture, incidents, trade-offs.',
    },
    {
      kicker: 'Speaking',
      title: 'Your first CFP and talk',
      body: cfp
        ? `I’ve read ${cfp.value} abstracts for one conference. I know what gets picked and what gets skipped.`
        : 'I’ve read every abstract sent to a conference I chair. I know what gets picked and what gets skipped.',
    },
  ];
}

/** Mentorship offers worth listing as programmes (have something bookable or concrete). */
export function mentorshipPrograms(offers: ServiceOffer[]): ServiceOffer[] {
  return offers.filter((o) => o.serviceType === 'mentorship' && (o.bookingUrl || o.bestFor || o.outcomes.length || o.engagementFormat));
}

export function offerPrice(o: ServiceOffer): string | undefined {
  if (!o.showPricing || !o.priceFrom) return undefined;
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: o.priceCurrency || 'CHF', maximumFractionDigits: 0 }).format(o.priceFrom);
  return `From ${money}${o.priceUnit ? ` / ${o.priceUnit}` : ''}`;
}

/** "How it works" rows: CMS offer fields where present, else the mock copy. */
export function mentorshipDetails(programs: ServiceOffer[]): { label: string; value: string }[] {
  const format = programs.find((o) => o.engagementFormat)?.engagementFormat;
  const price = programs.map(offerPrice).find(Boolean);
  const onPlatform = programs.some((o) => o.bookingUrl?.includes('mentorcruise'));
  return [
    { label: 'Cadence', value: format || '45 min, every 2–4 weeks' },
    { label: 'Where', value: onPlatform || !programs.length ? 'Video call; MentorCruise or direct' : 'Video call' },
    { label: 'Cost', value: price ? `${price}; community rate available` : 'Community rate available; ask' },
    { label: 'Status', value: 'Active, limited seats · reviewed quarterly' },
  ];
}
