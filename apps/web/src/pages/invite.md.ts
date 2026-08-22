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
    `> Booking ${bookingYears()} dates. ${availabilityLabel('Availability')}. Submit an invitation at https://faziz-dev.com/invite (replies within two days). Formats: keynote, conference talk, panel, full-day workshop.`,
    ``,
    `## What organizers get`,
    ``,
    `- A talk tailored to the audience: case studies and depth adapted, never a canned deck`,
    `- A hands-on, full-day workshop version of most talks`,
    `- Promotion of the event to his engineering audience`,
    `- Easy to work with: clear comms, on time, genuinely invested in the event`,
    ``,
    `## Logistics`,
    ``,
    `- Formats: Keynote · Talk · Workshop · Panel`,
    `- Travel from: Geneva, Switzerland`,
    `- Topics: performance, payments, engineering leadership, developer experience, React & Next.js`,
    `- Ideal notice: 4–6 weeks`,
    `- Booking form: https://faziz-dev.com/invite`,
    ``,
    `## Practical details ("the stuff I love to know") · full press kit at https://faziz-dev.com/press-kit`,
    ``,
    `None of this is a dealbreaker; Faris prefers to make events work. Highlights:`,
    ``,
    `- Honorarium: discussed per engagement, scaled to event type and budget; community meetups are usually free; tight budgets welcome to ask`,
    `- Travel & lodging: covered by the event for in-person engagements outside the Geneva/Zurich area (economy is fine)`,
    `- Code of conduct: events should have a published, enforced CoC; happy to share good templates`,
    `- Recording: encouraged! Please share the link afterwards; slides stay Faris's IP but may be freely shared with attendees`,
    `- A/V: HDMI or USB-C; for workshops a lapel/headset mic and solid attendee Wi-Fi`,
    `- Promotion: he'll promote the event to his audience before and after; tag him and he'll amplify`,
    ``,
    `## Bios (copy-ready)`,
    ``,
    `### Short`,
    ``,
    profile?.bioShort || 'Staff Software Engineer and Conference Speaker specializing in React, Next.js, and payment systems. Based in Geneva.',
    ``,
    profile?.bioMedium ? `### Medium\n\n${profile.bioMedium}` : '',
    ``,
    `Headshots: https://faziz-dev.com/press-kit (crop ratios incl. square 1:1, portrait 4:5, wide 16:9, multiple resolutions, free to use with credit)`,
    ``,
    upcoming.length
      ? `## Currently confirmed\n\n${upcoming
          .slice(0, 6)
          .map((e) => `- ${mdDate(e.date)}: ${e.title}${e.conference ? ` at ${e.conference}` : ''}`)
          .join('\n')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  return mdResponse(body);
};
