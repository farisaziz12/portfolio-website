/**
 * TypeScript types for the Interactive Impact Explorer
 */

// Domain types for filtering
export type ImpactDomain = 'all' | 'community' | 'product' | 'leadership' | 'speaking';

// Lens types for viewing modes
export type ImpactLens = 'outcomes' | 'how' | 'proof';

// Unit formatting options
export type MetricUnit =
  | 'number'
  | 'k'
  | 'm'
  | 'percent'
  | 'x'
  | 'chf'
  | 'eur'
  | 'usd'
  | 'rating';

// Highlight color options
export type HighlightColor = 'indigo' | 'violet' | 'emerald' | 'amber' | 'pink' | 'blue';

// Proof item types
export type ProofItemType = 'link' | 'image' | 'logo' | 'quote' | 'metricSource';

// Action link types
export type ActionLinkType = 'talk' | 'blog' | 'project' | 'service' | 'booking' | 'external';

// Portable Text block (simplified for lens content)
export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: string;
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
  listItem?: 'bullet' | 'number';
}

// Proof item
export interface ProofItem {
  type: ProofItemType;
  label: string;
  url?: string;
  image?: {
    asset: {
      _ref: string;
    };
  };
  quote?: string;
  quoteAuthor?: string;
  sourceNote?: string;
  tag?: string;
}

// Action link
export interface ActionLink {
  type: ActionLinkType;
  label: string;
  url: string;
}

// Outcomes lens block
export interface OutcomesBlock {
  headline?: string;
  body?: PortableTextBlock[];
}

// How lens block
export interface HowBlock {
  headline?: string;
  body?: PortableTextBlock[];
}

// Proof lens block
export interface ProofBlock {
  headline?: string;
  items?: ProofItem[];
}

// Full Impact Metric V2
export interface ImpactMetricV2 {
  _id: string;
  title: string;
  slug: string;
  domain: ImpactDomain;
  headlineNumber: number;
  unit?: MetricUnit;
  prefix?: string;
  label: string;
  timeWindow?: string;
  delta?: string;
  contextNote?: string;
  confidenceSource?: string;
  outcomesBlock?: OutcomesBlock;
  howBlock?: HowBlock;
  proofBlock?: ProofBlock;
  story?: string;
  actionLinks?: ActionLink[];
  featured?: boolean;
  highlightStrip?: boolean;
  order?: number;
  highlightColor?: HighlightColor;
}

// Highlight strip metric (simplified)
export interface HighlightStripMetric {
  _id: string;
  title: string;
  slug: string;
  domain: ImpactDomain;
  headlineNumber: number;
  unit?: MetricUnit;
  prefix?: string;
  label: string;
  highlightColor?: HighlightColor;
}

// Impact Page settings
export interface ImpactPageSettings {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroTagline?: string;
  defaultDomain?: ImpactDomain;
  defaultLens?: ImpactLens;
  highlightStripMetrics?: HighlightStripMetric[];
  seoTitle?: string;
  seoDescription?: string;
}

// Domain configuration for UI
export interface DomainConfig {
  id: ImpactDomain;
  label: string;
  icon: string;
  color: string;
}

// Lens configuration for UI
export interface LensConfig {
  id: ImpactLens;
  label: string;
  shortLabel: string;
  description: string;
}

// Explorer state (for URL params)
export interface ExplorerState {
  domain: ImpactDomain;
  lens: ImpactLens;
  expandedMetric: string | null;
  searchQuery: string;
}

// Constants for UI configuration
// Icons intentionally empty — emojis are banned from the UI (docs/ui-rules.md §6).
export const DOMAIN_CONFIG: DomainConfig[] = [
  { id: 'all', label: 'All', icon: '', color: 'indigo' },
  { id: 'community', label: 'Community', icon: '', color: 'violet' },
  { id: 'product', label: 'Product / Monetization', icon: '', color: 'emerald' },
  { id: 'leadership', label: 'Engineering Leadership', icon: '', color: 'amber' },
  { id: 'speaking', label: 'Speaking', icon: '', color: 'blue' },
];

export const LENS_CONFIG: LensConfig[] = [
  { id: 'outcomes', label: 'Outcomes', shortLabel: 'Outcomes', description: 'What changed, why it mattered' },
  { id: 'how', label: 'How', shortLabel: 'How', description: 'What I did, approach, constraints' },
  { id: 'proof', label: 'Proof', shortLabel: 'Proof', description: 'Links, screenshots, artifacts' },
];

// Helper function to format metric number
export function formatMetricNumber(value: number, unit?: MetricUnit, prefix?: string): string {
  let formatted = '';

  switch (unit) {
    case 'k':
      formatted = `${value}K`;
      break;
    case 'm':
      formatted = `${value}M`;
      break;
    case 'percent':
      formatted = `${value}%`;
      break;
    case 'x':
      formatted = `${value}x`;
      break;
    case 'chf':
      formatted = `CHF ${value.toLocaleString()}`;
      break;
    case 'eur':
      formatted = `€${value.toLocaleString()}`;
      break;
    case 'usd':
      formatted = `$${value.toLocaleString()}`;
      break;
    case 'rating':
      formatted = `${value}/5`;
      break;
    default:
      formatted = value.toLocaleString();
  }

  return prefix ? `${prefix}${formatted}` : formatted;
}

// Helper function to get color classes for a highlight color.
// The legacy HighlightColor values (kept for CMS back-compat) all collapse
// into the two Design System v2 families: accent (blue) and signal (teal).
export function getColorClasses(color?: HighlightColor): {
  text: string;
  bg: string;
  border: string;
  gradient: string;
} {
  const accent = {
    text: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    gradient: 'from-accent to-accent-deep',
  };
  const accentBright = {
    text: 'text-accent-bright',
    bg: 'bg-accent-bright/10',
    border: 'border-accent-bright/30',
    gradient: 'from-accent-bright to-accent',
  };
  const signal = {
    text: 'text-signal',
    bg: 'bg-signal/10',
    border: 'border-signal/30',
    gradient: 'from-signal to-signal-deep',
  };

  const colors: Record<HighlightColor, typeof accent> = {
    indigo: accent,
    violet: accent,
    blue: accent,
    pink: accentBright,
    amber: accentBright,
    emerald: signal,
  };

  return colors[color || 'indigo'];
}
