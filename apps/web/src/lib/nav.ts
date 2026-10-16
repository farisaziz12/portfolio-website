/**
 * Information architecture: one source for the header, sub-nav pills,
 * mobile drawer and footer. Primary nav is five items plus "Invite me".
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavSection extends NavLink {
  /** Paths that light this section up. */
  match: string[];
  /** Sub-nav pills shown under the header on this section's pages. */
  children?: NavLink[];
}

export const PRIMARY_NAV: NavSection[] = [
  {
    label: 'Speaking',
    href: '/speaking',
    match: ['/speaking', '/talks', '/events', '/workshops', '/press-kit', '/invite', '/media'],
    children: [
      { label: 'Overview', href: '/speaking' },
      { label: 'Events', href: '/events' },
      { label: 'Talks', href: '/talks' },
      { label: 'Workshops', href: '/workshops' },
      { label: 'Press kit', href: '/press-kit' },
      { label: 'Invite me', href: '/invite' },
    ],
  },
  { label: 'Articles & podcasts', href: '/blog', match: ['/blog'] },
  { label: 'Community', href: '/community', match: ['/community'] },
  {
    label: 'About',
    href: '/about',
    match: ['/about', '/impact', '/appreciation', '/projects', '/gallery'],
    children: [
      { label: 'Story', href: '/about' },
      { label: 'Track record', href: '/impact' },
      { label: 'What people say', href: '/appreciation' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    match: ['/services', '/consulting', '/mentorship', '/contact'],
    children: [
      { label: 'All services', href: '/services' },
      { label: 'Mentorship', href: '/mentorship' },
      { label: 'Speaking & workshops', href: '/speaking' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export const INVITE_CTA: NavLink = { label: 'Invite me', href: '/invite' };

export const FOOTER_PRIMARY: NavLink[] = [
  { label: 'Speaking', href: '/speaking' },
  { label: 'Schedule', href: '/events' },
  { label: 'Talks', href: '/talks' },
  { label: 'Workshops', href: '/workshops' },
  { label: 'Articles & podcasts', href: '/blog' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
  { label: 'Press kit', href: '/press-kit' },
  { label: 'Invite me', href: '/invite' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_SECONDARY: NavLink[] = [
  { label: 'Track record', href: '/impact' },
  { label: 'What people say', href: '/appreciation' },
  { label: 'Services', href: '/services' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'RSS', href: '/rss.xml' },
  { label: 'For agents: llms.txt', href: '/llms.txt' },
  { label: 'Privacy', href: '/privacy' },
];

function matches(pathname: string, prefix: string): boolean {
  const p = pathname.replace(/\/$/, '') || '/';
  return p === prefix || p.startsWith(`${prefix}/`);
}

/** The primary section a path belongs to (for active state + sub-nav). */
export function sectionFor(pathname: string): NavSection | undefined {
  return PRIMARY_NAV.find((s) => s.match.some((m) => matches(pathname, m)));
}

/** The active child pill: longest matching href wins (so /talks/x → Talks). */
export function activeChild(section: NavSection | undefined, pathname: string): string | undefined {
  if (!section?.children) return undefined;
  const hits = section.children.filter((c) => matches(pathname, c.href));
  return hits.sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
