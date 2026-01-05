import type { PortableTextBlock, ArbitraryTypedObject } from '@portabletext/types';

// Define the span type for Portable Text
interface PortableTextSpan {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
}

/**
 * Extracts plain text from Portable Text children array.
 * Children are always an array of spans with { _type: 'span', text: '...' }
 */
export function extractTextFromChildren(children: unknown): string {
  if (!children || !Array.isArray(children)) {
    return '';
  }

  // Portable Text children are spans with a 'text' property
  return (children as PortableTextSpan[])
    .map(span => (span && typeof span.text === 'string') ? span.text : '')
    .join('');
}

/**
 * Generates a URL-friendly slug from text.
 * Handles special characters, unicode dashes, and edge cases.
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    // Normalize unicode characters
    .normalize('NFKD')
    // Replace em-dash, en-dash, and other dash-like characters with regular hyphen
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
    // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces/hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    .trim();
}

/**
 * Generates a heading ID from block data.
 * Uses slugified text for human-readable URLs, falls back to _key.
 */
export function generateHeadingIdFromBlock(block: { _key?: string; children?: unknown }): string {
  // Primary: use slugified text for human-readable anchors
  const text = extractTextFromChildren(block.children);
  const slugId = slugify(text);

  if (slugId) {
    return slugId;
  }

  // Fallback: use _key
  if (block._key) {
    return block._key;
  }

  // Last resort: random ID
  return `heading-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Extracts all headings from a Portable Text body array.
 */
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(body: (PortableTextBlock | ArbitraryTypedObject)[]): TocHeading[] {
  if (!body || !Array.isArray(body)) {
    return [];
  }

  const headings: TocHeading[] = [];

  for (const block of body) {
    if (block._type === 'block' && 'style' in block) {
      const style = block.style as string;
      if (style === 'h2' || style === 'h3' || style === 'h4') {
        const children = 'children' in block ? block.children : [];
        const text = extractTextFromChildren(children);
        if (text) {
          headings.push({
            id: generateHeadingIdFromBlock(block as { _key?: string; children?: unknown }),
            text,
            level: parseInt(style.charAt(1), 10),
          });
        }
      }
    }
  }

  return headings;
}
