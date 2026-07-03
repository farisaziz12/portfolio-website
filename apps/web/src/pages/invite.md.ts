import type { APIRoute } from 'astro';
import { sanityFetch } from '../lib/sanity/client';
import { speakerProfileQuery, upcomingEventsQuery } from '../lib/sanity/queries';
import { mdResponse, mdDate } from '../lib/markdown';
import { bookingYears, availabilityLabel } from '../lib/availability';

interface SpeakerProfile {
  bioShort?: string;
  bioMedium?: string;
}

interface EventItem {
  title: string;
  conference?: string;
  date: string;
}

export const GET: APIRoute = async () => {
  const [profile, upcoming] = await Promise.all([
    sanityFetch<SpeakerProfile | null>(speakerProfileQuery).catch(() => null),
    sanityFetch<EventItem[]>(upcomingEventsQuery).catch(() => []),
  ]);

  const body = [
    `# Invite Faris Aziz to speak`,
    ``,
    `> Booking ${bookingYears()} dates. ${availabilityLabel('Availability')}. Submit an invitation at https://faziz-dev.com/invite — replies within two days. Formats: keynote, conference talk, panel, full-day workshop.`,
    ``,
    `## What organizers get`,
    ``,
    `- A talk tailored to the audience — case studies and depth adapted, never a canned deck`,
    `- A hands-on, full-day workshop version of most talks`,
    `- Promotion of the event to his engineering audience`,
    `- Reliable communication and on-time delivery`,
    ``,
    `## Logistics`,
    ``,
    `- Formats: Keynote · Talk · Workshop · Panel`,
    `- Travel from: Geneva, Switzerland`,
    `- Topics: performance, payments, engineering leadership, developer experience, React & Next.js`,
    `- Ideal notice: 4–6 weeks`,
    `- Booking form: https://faziz-dev.com/invite`,
    ``,
    `## Speaker rider (summary)`,
    ``,
    `- Honorarium: discussed per engagement; community meetups are usually free`,
    `- Travel & lodging: covered by the event for in-person engagements outside the Geneva/Zurich area`,
    `- The event has a published, enforced code of conduct`,
    `- Recording: encouraged — a link to the recording after the event is appreciated`,
    `- Slides remain the speaker's IP; events may share them with attendees`,
    `- A/V: HDMI or USB-C, lapel or headset mic preferred for workshops`,
    ``,
    `## Bios (copy-ready)`,
    ``,
    `### Short`,
    ``,
    profile?.bioShort || 'Staff Software Engineer and Conference Speaker specializing in React, Next.js, and payment systems. Based in Geneva.',
    ``,
    profile?.bioMedium ? `### Medium\n\n${profile.bioMedium}` : '',
    ``,
    `Headshots: https://faziz-dev.com/invite (press kit section, multiple resolutions, free to use with credit)`,
    ``,
    upcoming.length
      ? `## Currently confirmed\n\n${upcoming
          .slice(0, 6)
          .map((e) => `- ${mdDate(e.date)} — ${e.title}${e.conference ? ` at ${e.conference}` : ''}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
