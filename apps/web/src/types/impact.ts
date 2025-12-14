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
export const DOMAIN_CONFIG: DomainConfig[] = [
  { id: 'all', label: 'All', icon: '✨', color: 'indigo' },
  { id: 'community', label: 'Community', icon: '👥', color: 'violet' },
  { id: 'product', label: 'Product / Monetization', icon: '💰', color: 'emerald' },
  { id: 'leadership', label: 'Engineering Leadership', icon: '🎯', color: 'amber' },
  { id: 'speaking', label: 'Speaking', icon: '🎤', color: 'blue' },
];

export const LENS_CONFIG: LensConfig[] = [
  { id: 'outcomes', label: 'Show me outcomes', description: 'What changed, why it mattered' },
  { id: 'how', label: 'Show me how', description: 'What I did, approach, constraints' },
  { id: 'proof', label: 'Show me proof', description: 'Links, screenshots, artifacts' },
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

// Helper function to get color classes for a highlight color
export function getColorClasses(color?: HighlightColor): {
  text: string;
  bg: string;
  border: string;
  gradient: string;
} {
  const colors: Record<
    HighlightColor,
    { text: string; bg: string; border: string; gradient: string }
  > = {
    indigo: {
      text: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      gradient: 'from-indigo-500 to-violet-600',
    },
    violet: {
      text: 'text-violet-500',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      gradient: 'from-violet-500 to-purple-600',
    },
    emerald: {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      gradient: 'from-emerald-500 to-teal-600',
    },
    amber: {
      text: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      gradient: 'from-amber-500 to-orange-600',
    },
    pink: {
      text: 'text-pink-500',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/30',
      gradient: 'from-pink-500 to-rose-600',
    },
    blue: {
      text: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      gradient: 'from-blue-500 to-indigo-600',
    },
  };

  return colors[color || 'indigo'];
}
