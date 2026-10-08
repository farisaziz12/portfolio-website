/**
 * /privacy copy, shared by privacy.astro and privacy.md.ts so the page and its
 * mirror never drift. Every claim here is checked against the code: analytics
 * in components/posthog.astro (docs/measurement.md), forms in pages/api and
 * apps/web/CLAUDE.md, browser storage in the islands. Change the code, change
 * this, and bump PRIVACY_UPDATED.
 */

/** ISO date of the last change to this policy. */
export const PRIVACY_UPDATED = '2026-10-08';

export interface PrivacySection {
  id: string;
  heading: string;
  body: string[];
}

export const PRIVACY_LEDE =
  'This is my personal site. There are no ads and I don’t sell anything about you to anyone. This page lists what gets collected when you visit, why, and which services see it.';

export function privacySections(replyTime: string): PrivacySection[] {
  return [
    {
      id: 'who',
      heading: 'Who looks after your data',
      body: [
        'Me, Faris Aziz, based in Geneva, Switzerland. I run this site on my own, so any question about your data comes straight to me through the contact form. There is no public email address.',
      ],
    },
    {
      id: 'analytics',
      heading: 'Analytics',
      body: [
        'I use PostHog, hosted in the EU, to see which pages people read and what they click. It records page views, clicks, how far you scroll, page errors and heatmaps.',
        'PostHog keeps a random ID in a cookie and in your browser’s local storage, so visits from the same browser count as one visitor. If you never fill in a form, that random ID is all it knows about you.',
      ],
    },
    {
      id: 'recordings',
      heading: 'Session recordings',
      body: [
        'On /invite, /contact, /services, /mentorship and /connect, PostHog records the visit: mouse movement, scrolling and clicks. I watch these to find the spots where a form gets confusing. Once a recording starts, it carries on for the rest of that visit.',
        'Everything you type into a form field is masked, so a recording never shows what you wrote.',
      ],
    },
    {
      id: 'email-address',
      heading: 'Your email address',
      body: [
        'If you type an email address into a field on this site and move on to the next field, PostHog links your visits to that address, even if you never press send. When you do send a form, it also notes your name and what the form was about (topic, company or event).',
        'I use this to know who got in touch and what they had read first. It never goes into a mailing list unless you signed up for one.',
      ],
    },
    {
      id: 'forms',
      heading: 'Forms and email',
      body: [
        'The invite, contact and mentorship forms send what you wrote to my inbox through Resend, an email delivery service, and send you a confirmation with a reference number. There is no database behind the forms. The email in my inbox is the only copy.',
        'If you sign up for workshop updates, your email address goes onto a Resend mailing list. Every email from that list has an unsubscribe link.',
      ],
    },
    {
      id: 'third-parties',
      heading: 'Other services the pages load',
      body: [
        'The site runs on Vercel. Like any host, Vercel sees your IP address and browser details when a page loads, and keeps request logs.',
        'Images load from the Sanity CDN, where the site content lives. Videos load from youtube-nocookie.com, which YouTube says sets no tracking cookies until you press play. Discovery call links open Cal.com in a window on this page, and what you enter there goes to Cal.com under their own privacy policy.',
      ],
    },
    {
      id: 'browser',
      heading: 'What stays in your browser',
      body: [
        'Local storage keeps your light or dark theme, the last command you ran in the command palette, and whether you have seen the home page intro. None of that is sent anywhere.',
        'Workshop attendees also get a sign-in cookie for the workshop page, and the name, email and progress they entered for that workshop are kept in local storage so they don’t have to type them again.',
      ],
    },
    {
      id: 'choices',
      heading: 'Your choices',
      body: [
        'Block cookies or run a tracker blocker and the site still works. Analytics just won’t see you.',
        `Want to know what I have about you, or want it deleted? Send a message through the contact form and I’ll reply within ${replyTime}.`,
        'I don’t share your data with anyone beyond the services named on this page.',
      ],
    },
  ];
}
