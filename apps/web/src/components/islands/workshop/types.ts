export interface PortableTextChild {
  _key: string;
  _type: string;
  text: string;
  marks?: string[];
}

export interface PortableTextMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

export interface PortableTextBlock {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children: PortableTextChild[];
  markDefs?: PortableTextMarkDef[];
}

export interface CodeBlock {
  _key: string;
  _type: 'code';
  language?: string;
  filename?: string;
  code?: string;
}

export interface ImageBlock {
  _key: string;
  _type: 'image';
  alt?: string;
  caption?: string;
  asset?: {
    _ref: string;
    _type: 'reference';
  };
}

export type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'tip';

export interface CalloutBlock {
  _key: string;
  _type: 'callout';
  type?: CalloutType;
  title?: string;
  content?: PortableTextBlock[];
}

export interface TableBlock {
  _key: string;
  _type: 'table';
  rows?: {
    _key: string;
    cells: string[];
  }[];
}

export type ContentBlock =
  | PortableTextBlock
  | CodeBlock
  | ImageBlock
  | CalloutBlock
  | TableBlock;

export interface WorkshopSection {
  _key: string;
  emoji?: string;
  title: string;
  sectionFeedbackUrl?: string;
  /** Present only after lazy fetch (not on first paint). */
  content?: ContentBlock[];
}

export interface WorkshopUser {
  name: string;
  email: string;
}

export interface WorkshopAttendProps {
  title: string;
  event: string;
  token: string;
  repoUrl?: string;
  overallFeedbackUrl?: string;
  sections: WorkshopSection[];
  closeDateISO: string;
  sanityProjectId: string;
  sanityDataset: string;
  /** From httpOnly cookie — paints schedule on SSR without waiting for JS. */
  initialUser?: WorkshopUser | null;
}

export type SectionContentStatus = 'loading' | 'ready' | 'error';
