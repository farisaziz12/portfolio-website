import { defineType, defineField } from 'sanity';

/**
 * Enhanced Impact Metric with lens blocks for the Interactive Impact Explorer
 * Supports three lens views: Outcomes, How, and Proof
 */
export default defineType({
  name: 'impactMetricV2',
  title: 'Impact Metric (Enhanced)',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'lenses', title: 'Lens Content' },
    { name: 'story', title: 'Story & Links' },
    { name: 'display', title: 'Display Settings' },
  ],
  fields: [
    // ─────────────────────────────────────────────────────────────
    // MAIN GROUP - Core metric data
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this metric (used in Studio)',
      validation: (Rule) => Rule.required().max(100),
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'domain',
      title: 'Domain',
      type: 'string',
      description: 'The domain/category this metric belongs to',
      options: {
        list: [
          { title: 'Community', value: 'community' },
          { title: 'Product / Monetization', value: 'product' },
          { title: 'Engineering Leadership', value: 'leadership' },
          { title: 'Speaking', value: 'speaking' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'headlineNumber',
      title: 'Headline Number',
      type: 'number',
      description: 'The main numeric value (e.g., 50000, 3.1, 98)',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'unit',
      title: 'Unit / Format',
      type: 'string',
      description: 'How to display the number',
      options: {
        list: [
          { title: 'Plain number', value: 'number' },
          { title: 'Thousands (K)', value: 'k' },
          { title: 'Millions (M)', value: 'm' },
          { title: 'Percentage (%)', value: 'percent' },
          { title: 'Multiplier (x)', value: 'x' },
          { title: 'Currency (CHF)', value: 'chf' },
          { title: 'Currency (EUR)', value: 'eur' },
          { title: 'Currency (USD)', value: 'usd' },
          { title: 'Rating (/5)', value: 'rating' },
        ],
      },
      initialValue: 'number',
      group: 'main',
    }),
    defineField({
      name: 'prefix',
      title: 'Prefix',
      type: 'string',
      description: 'Optional symbol before the number (e.g., "+", "~")',
      group: 'main',
    }),
    defineField({
      name: 'label',
      title: 'Short Label',
      type: 'string',
      description: 'Brief label shown with the number (e.g., "Community Members")',
      validation: (Rule) => Rule.required().max(50),
      group: 'main',
    }),
    defineField({
      name: 'timeWindow',
      title: 'Time Window',
      type: 'string',
      description: 'Time period for this metric (e.g., "Jan–Sep 2025", "Since 2022")',
      validation: (Rule) => Rule.max(30),
      group: 'main',
    }),
    defineField({
      name: 'delta',
      title: 'Delta / Change',
      type: 'string',
      description: 'Optional growth indicator (e.g., "+32%", "3.1x", "↑ 50%")',
      group: 'main',
    }),
    defineField({
      name: 'contextNote',
      title: 'Context Note',
      type: 'text',
      description: 'One sentence, plain English explanation. Non-marketing, factual.',
      validation: (Rule) => Rule.max(200),
      rows: 2,
      group: 'main',
    }),
    defineField({
      name: 'confidenceSource',
      title: 'Confidence / Source Note',
      type: 'string',
      description: 'Internal note about data source (e.g., "From Stripe dashboard", "Meetup.com analytics")',
      group: 'main',
    }),

    // ─────────────────────────────────────────────────────────────
    // LENSES GROUP - Three lens content blocks
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'outcomesBlock',
      title: 'Outcomes Lens',
      type: 'object',
      description: 'What changed, why it mattered',
      group: 'lenses',
      fields: [
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Short headline for outcomes view',
          validation: (Rule) => Rule.max(80),
        },
        {
          name: 'body',
          title: 'Body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
              lists: [{ title: 'Bullet', value: 'bullet' }],
            },
          ],
          validation: (Rule) => Rule.max(3),
        },
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || !value.headline) {
            return 'Outcomes lens requires at least a headline';
          }
          return true;
        }),
    }),
    defineField({
      name: 'howBlock',
      title: 'How Lens',
      type: 'object',
      description: 'What I did, approach, constraints',
      group: 'lenses',
      fields: [
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Short headline for how view',
          validation: (Rule) => Rule.max(80),
        },
        {
          name: 'body',
          title: 'Body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }],
                  },
                ],
              },
              lists: [{ title: 'Bullet', value: 'bullet' }],
            },
          ],
          validation: (Rule) => Rule.max(3),
        },
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || !value.headline) {
            return 'How lens requires at least a headline';
          }
          return true;
        }),
    }),
    defineField({
      name: 'proofBlock',
      title: 'Proof Lens',
      type: 'object',
      description: 'Links to talks, posts, PRs, dashboards, public artifacts',
      group: 'lenses',
      fields: [
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Short headline for proof view',
          validation: (Rule) => Rule.max(80),
        },
        {
          name: 'items',
          title: 'Proof Items',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'proofItem',
              fields: [
                {
                  name: 'type',
                  title: 'Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Link', value: 'link' },
                      { title: 'Image/Screenshot', value: 'image' },
                      { title: 'Logo', value: 'logo' },
                      { title: 'Quote', value: 'quote' },
                      { title: 'Metric Source', value: 'metricSource' },
                    ],
                  },
                  initialValue: 'link',
                },
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(60),
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  hidden: ({ parent }) => parent?.type === 'image' || parent?.type === 'logo',
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: { hotspot: true },
                  hidden: ({ parent }) => parent?.type !== 'image' && parent?.type !== 'logo',
                },
                {
                  name: 'quote',
                  title: 'Quote Text',
                  type: 'text',
                  rows: 3,
                  hidden: ({ parent }) => parent?.type !== 'quote',
                },
                {
                  name: 'quoteAuthor',
                  title: 'Quote Author',
                  type: 'string',
                  hidden: ({ parent }) => parent?.type !== 'quote',
                },
                {
                  name: 'sourceNote',
                  title: 'Source Note',
                  type: 'string',
                  description: 'e.g., "Internal dashboard screenshot", "Public repo"',
                },
                {
                  name: 'tag',
                  title: 'Tag',
                  type: 'string',
                  description: 'e.g., "Case study", "Talk recording", "GitHub"',
                },
              ],
              preview: {
                select: {
                  title: 'label',
                  type: 'type',
                  tag: 'tag',
                  media: 'image',
                },
                prepare({ title, type, tag, media }) {
                  const typeIcons: Record<string, string> = {
                    link: '🔗',
                    image: '📷',
                    logo: '🏢',
                    quote: '💬',
                    metricSource: '📊',
                  };
                  return {
                    title: title || 'Untitled',
                    subtitle: `${typeIcons[type] || '•'} ${tag || type}`,
                    media,
                  };
                },
              },
            },
          ],
        },
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || !value.headline) {
            return 'Proof lens requires at least a headline';
          }
          return true;
        }),
    }),

    // ─────────────────────────────────────────────────────────────
    // STORY GROUP - Expandable story and action links
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'story',
      title: 'Expandable Story',
      type: 'text',
      description: 'Short story, max 120-180 words. Shown when metric is expanded.',
      validation: (Rule) =>
        Rule.max(1200).warning('Story should be 120-180 words (roughly 600-1000 characters)'),
      rows: 6,
      group: 'story',
    }),
    defineField({
      name: 'actionLinks',
      title: 'Action Links',
      type: 'array',
      description: '1-3 relevant links shown at the end of the story',
      group: 'story',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Link Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Talk', value: 'talk' },
                  { title: 'Blog Post', value: 'blog' },
                  { title: 'Project', value: 'project' },
                  { title: 'Service', value: 'service' },
                  { title: 'Booking', value: 'booking' },
                  { title: 'External', value: 'external' },
                ],
              },
              initialValue: 'external',
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'label',
              type: 'type',
            },
            prepare({ title, type }) {
              const typeIcons: Record<string, string> = {
                talk: '🎤',
                blog: '📝',
                project: '💼',
                service: '🛠',
                booking: '📅',
                external: '🔗',
              };
              return {
                title: title || 'Untitled',
                subtitle: typeIcons[type] || '🔗',
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ─────────────────────────────────────────────────────────────
    // DISPLAY GROUP - Ordering and featured settings
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Featured (Hero Metric)',
      type: 'boolean',
      description: 'Show in the hero section of the impact page',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'highlightStrip',
      title: 'Show in Highlight Strip',
      type: 'boolean',
      description: 'Show in the top 3 quick stats strip',
      initialValue: false,
      group: 'display',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 100,
      group: 'display',
    }),
    defineField({
      name: 'highlightColor',
      title: 'Accent Color',
      type: 'string',
      options: {
        list: [
          { title: 'Indigo (Default)', value: 'indigo' },
          { title: 'Violet', value: 'violet' },
          { title: 'Emerald', value: 'emerald' },
          { title: 'Amber', value: 'amber' },
          { title: 'Pink', value: 'pink' },
          { title: 'Blue', value: 'blue' },
        ],
      },
      initialValue: 'indigo',
      group: 'display',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Domain, then Order',
      name: 'domainOrder',
      by: [
        { field: 'domain', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      headlineNumber: 'headlineNumber',
      unit: 'unit',
      domain: 'domain',
      featured: 'featured',
      highlightStrip: 'highlightStrip',
    },
    prepare({ title, headlineNumber, unit, domain, featured, highlightStrip }) {
      // Format the number based on unit
      let displayNumber = String(headlineNumber || 0);
      switch (unit) {
        case 'k':
          displayNumber = `${headlineNumber}K`;
          break;
        case 'm':
          displayNumber = `${headlineNumber}M`;
          break;
        case 'percent':
          displayNumber = `${headlineNumber}%`;
          break;
        case 'x':
          displayNumber = `${headlineNumber}x`;
          break;
        case 'chf':
          displayNumber = `CHF ${headlineNumber}`;
          break;
        case 'eur':
          displayNumber = `€${headlineNumber}`;
          break;
        case 'usd':
          displayNumber = `$${headlineNumber}`;
          break;
        case 'rating':
          displayNumber = `${headlineNumber}/5`;
          break;
      }

      const domainLabels: Record<string, string> = {
        community: '👥 Community',
        product: '💰 Product',
        leadership: '🎯 Leadership',
        speaking: '🎤 Speaking',
      };

      const badges = [];
      if (featured) badges.push('⭐');
      if (highlightStrip) badges.push('📌');

      return {
        title: `${displayNumber} — ${title || 'Untitled'}`,
        subtitle: `${domainLabels[domain] || domain} ${badges.join(' ')}`,
      };
    },
  },
});
