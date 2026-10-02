import { defineType, defineField } from 'sanity';
import { PRAISE_PLATFORMS, PRAISE_TOPICS, titleFor } from 'shared';
import { options, orderField } from './_fields';

/**
 * One thing someone said about Faris, wherever they said it. Replaces the V2
 * `socialPost` + `testimonial` pair. Cards on /appreciation take the look of
 * their platform, and every card links to the original.
 */
export default defineType({
  name: 'praise',
  title: 'Praise',
  type: 'document',
  groups: [
    { name: 'quote', title: 'Quote', default: true },
    { name: 'about', title: 'About what' },
    { name: 'display', title: 'Display' },
  ],
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 5,
      group: 'quote',
      description: 'Their words, verbatim. Trim with […] but never rewrite.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull quote',
      type: 'string',
      group: 'quote',
      description: 'The one sentence used on small cards (home, speaking). Must appear verbatim in the quote.',
      validation: (Rule) =>
        Rule.max(160).custom((pull, ctx) => {
          const q = (ctx.document?.quote as string | undefined) ?? '';
          if (!pull || !q) return true;
          const norm = (s: string) => s.replace(/[“”"'’‘.…\s]+/g, ' ').trim().toLowerCase();
          return norm(q).includes(norm(pull)) || 'Pull quote must be taken verbatim from the quote';
        }),
    }),
    defineField({
      name: 'platform',
      title: 'Where it was said',
      type: 'string',
      group: 'quote',
      options: { list: options(PRAISE_PLATFORMS), layout: 'radio', direction: 'horizontal' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link to the original',
      type: 'url',
      group: 'quote',
      validation: (Rule) =>
        Rule.custom((url, ctx) =>
          url || ctx.document?.platform === 'direct' ? true : 'Public posts need a link to the original'),
    }),
    defineField({ name: 'date', title: 'Date', type: 'date', group: 'quote', validation: (Rule) => Rule.required().warning('Dated quotes only') }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      group: 'quote',
      options: { columns: 2 },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'handle', title: 'Handle', type: 'string', description: '@handle for X / Bluesky.' }),
        defineField({ name: 'headline', title: 'Role / headline', type: 'string', description: '"Staff Engineer", "WhatTheStack co-founder".' }),
        defineField({ name: 'image', title: 'Avatar', type: 'image', options: { hotspot: true } }),
      ],
    }),

    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      group: 'about',
      options: { list: options(PRAISE_TOPICS), layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'talk', title: 'About this talk', type: 'reference', to: [{ type: 'talk' }], group: 'about' }),
    defineField({ name: 'workshop', title: 'About this workshop', type: 'reference', to: [{ type: 'workshop' }], group: 'about' }),
    defineField({ name: 'event', title: 'Said at / after', type: 'reference', to: [{ type: 'event' }], group: 'about' }),
    defineField({
      name: 'label',
      title: 'Card label',
      type: 'string',
      group: 'about',
      description: 'Optional override for the small label ("On the warm-up"). Default: "On the <talk short name>" / topic.',
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'display',
      description: 'Eligible for home, speaking and community highlights.',
      initialValue: false,
    }),
    orderField('display'),
    defineField({
      name: 'legacyId',
      title: 'Migrated from',
      type: 'string',
      group: 'display',
      readOnly: true,
      hidden: ({ value }) => !value,
    }),
  ],
  preview: {
    select: { quote: 'pullQuote', full: 'quote', author: 'author.name', platform: 'platform', topic: 'topic', featured: 'featured', media: 'author.image' },
    prepare({ quote, full, author, platform, topic, featured, media }) {
      const text = (quote || full || '') as string;
      return {
        title: `${featured ? '★ ' : ''}${text.length > 70 ? `${text.slice(0, 70)}…` : text}`,
        subtitle: [author, titleFor(PRAISE_PLATFORMS, platform), titleFor(PRAISE_TOPICS, topic)].filter(Boolean).join(' · '),
        media,
      };
    },
  },
  orderings: [
    { title: 'Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Featured first', name: 'featuredFirst', by: [{ field: 'featured', direction: 'desc' }, { field: 'order', direction: 'asc' }] },
  ],
});
