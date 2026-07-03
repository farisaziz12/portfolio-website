/**
 * Per-platform chrome for social-mention cards (SocialPostCard and the
 * appreciation wall) — one source so X, LinkedIn, and Bluesky mentions look
 * like the platform they came from everywhere they appear.
 *
 * Brand colors are intentional exceptions to the token system: X is a black
 * card in both themes, LinkedIn keeps its #0a66c2, Bluesky its #1083fe.
 */

export type SocialPlatform = 'twitter' | 'linkedin' | 'bluesky';

export interface PlatformChrome {
  /** Display name used in "Read on {name}" */
  name: string;
  /** Card container classes */
  card: string;
  /** Author name */
  primaryText: string;
  /** Handle / role / date */
  secondaryText: string;
  /** Post body */
  bodyText: string;
  /** Footer divider */
  divider: string;
  /** Footer links / expand button */
  link: string;
  /** Platform logo color */
  icon: string;
  /** Initials avatar fallback */
  avatarFallback: string;
  /** Show @handle inline next to the author name (X/Bluesky convention) */
  inlineHandle: boolean;
}

const DS_CARD = 'bg-surface-2 border border-edge hover:shadow-xl hover:shadow-black/20';

export const PLATFORM_CHROME: Record<SocialPlatform, PlatformChrome> = {
  twitter: {
    name: 'X',
    card: 'bg-black border border-white/10 hover:shadow-xl hover:shadow-black/40',
    primaryText: 'text-white',
    secondaryText: 'text-white/50',
    bodyText: 'text-white/80',
    divider: 'border-white/15',
    link: 'text-white/70 hover:text-white',
    icon: 'text-white',
    avatarFallback: 'bg-white text-black',
    inlineHandle: true,
  },
  linkedin: {
    name: 'LinkedIn',
    card: DS_CARD,
    primaryText: 'text-ink',
    secondaryText: 'text-ink-faint',
    bodyText: 'text-ink-muted',
    divider: 'border-edge',
    link: 'text-accent hover:text-accent-bright',
    icon: 'text-[#0a66c2]',
    avatarFallback: 'bg-[#0a66c2] text-white',
    inlineHandle: false,
  },
  bluesky: {
    name: 'Bluesky',
    card: DS_CARD,
    primaryText: 'text-ink',
    secondaryText: 'text-ink-faint',
    bodyText: 'text-ink-muted',
    divider: 'border-edge',
    link: 'text-accent hover:text-accent-bright',
    icon: 'text-[#1083fe]',
    avatarFallback: 'bg-[#1083fe] text-white',
    inlineHandle: true,
  },
};

export function platformChrome(platform?: string): PlatformChrome {
  return PLATFORM_CHROME[(platform as SocialPlatform) || 'linkedin'] || PLATFORM_CHROME.linkedin;
}

const PATHS: Record<SocialPlatform, { viewBox: string; d: string }> = {
  twitter: {
    viewBox: '0 0 24 24',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  bluesky: {
    viewBox: '0 0 600 530',
    d: 'M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z',
  },
};

export function PlatformIcon({ platform, className = 'w-5 h-5' }: { platform?: string; className?: string }) {
  const key = (platform as SocialPlatform) in PATHS ? (platform as SocialPlatform) : 'linkedin';
  const p = PATHS[key];
  return (
    <svg className={className} viewBox={p.viewBox} fill="currentColor" aria-hidden="true">
      <path d={p.d} />
    </svg>
  );
}
