/**
 * Reusable field builders so every document type spells SEO, images, links
 * and ordering the same way (one GROQ projection fits all).
 */
import { defineField, defineArrayMember } from 'sanity';
import type { Option } from 'shared';

export const options = <V extends string>(list: readonly Option<V>[]) =>
  list.map(({ value, title }) => ({ value, title }));

/** Hide a legacy field once it's empty, so migrated docs look clean. */
export const hiddenWhenEmpty = ({ value }: { value?: unknown }) =>
  value === undefined || value === null || (Array.isArray(value) && value.length === 0);

export const legacyReason = (to: string) => ({
  reason: `Legacy V2 field. ${to} Run the V3 migration (scripts/migrate-v3.ts) or the Sanity MCP prompts in docs/sanity-mcp-prompts.md, then leave this empty.`,
});

export const imageWithAlt = (name: string, title: string, extra: Record<string, unknown> = {}) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'What is in the picture, for screen readers. Required for anything public.',
        validation: (Rule) => Rule.required().warning('Add alt text'),
      }),
      defineField({ name: 'credit', title: 'Photo credit', type: 'string' }),
    ],
    ...extra,
  });

export const photoMember = () =>
  defineArrayMember({
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required().warning('Add alt text') }),
      defineField({ name: 'credit', title: 'Photo credit', type: 'string' }),
      defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    ],
  });

export const cta = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    options: { columns: 2 },
    fields: [
      defineField({ name: 'label', title: 'Label', type: 'string' }),
      defineField({
        name: 'href',
        title: 'Link',
        type: 'string',
        description: 'Site path (/invite) or full URL. Never mailto:.',
        validation: (Rule) =>
          Rule.custom((v?: string) => (v && v.startsWith('mailto:') ? 'No mailto: links. Use /contact or /invite.' : true)),
      }),
    ],
  });

export const seoField = (group = 'seo') =>
  defineField({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    group,
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: 'metaTitle', title: 'Meta title', type: 'string', validation: (Rule) => Rule.max(65).warning('Keep under ~60 characters') }),
      defineField({
        name: 'metaDescription',
        title: 'Meta description',
        type: 'text',
        rows: 2,
        validation: (Rule) => Rule.max(170).warning('Keep under ~160 characters'),
      }),
      defineField({
        name: 'ogImage',
        title: 'OG image override',
        type: 'image',
        description: 'Leave empty: the site renders a branded card automatically.',
      }),
    ],
  });

export const orderField = (group?: string) =>
  defineField({
    name: 'order',
    title: 'Sort order',
    type: 'number',
    description: 'Lower first. Leave empty to sort by date.',
    group,
  });

export const slugField = (source = 'title', group?: string) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    group,
    description: 'Public URL. Permanent once published: changing it breaks links and OG cards.',
    options: { source, maxLength: 96 },
    validation: (Rule) => Rule.required(),
  });
