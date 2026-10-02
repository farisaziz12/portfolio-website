import { defineType, defineField } from 'sanity';
import { METRIC_AREAS, METRIC_DOMAINS, METRIC_STATUSES, titleFor } from 'shared';
import { options, orderField } from './_fields';

/**
 * A dated, defined number (4,500 ZurichJS members · Jul 2026). Replaces V2
 * `impactMetric` / `impactMetricV2`. Speaking counts (talks delivered,
 * countries) are NOT metrics: the site derives them from event sessions.
 */
export default defineType({
  name: 'metric',
  title: 'Metric',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'Display value',
      type: 'string',
      description: 'Exactly as shown: "4,500", "~14×", "−60%", "40+", "6 figures".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'What it counts, lower case: "ZurichJS members".', validation: (Rule) => Rule.required() }),
    defineField({ name: 'qualifier', title: 'Qualifier', type: 'string', description: 'Small print under the label: "across our groups", "first ZurichJS Conf".' }),
    defineField({
      name: 'asOf',
      title: 'As of',
      type: 'date',
      description: 'When the number was true. Shown next to it ("Jul 2026").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period label',
      type: 'string',
      description: 'Optional instead of the As-of month: "2024–26", "Jul 2025 – Jul 2026".',
    }),
    defineField({
      name: 'definition',
      title: 'Definition',
      type: 'text',
      rows: 2,
      description: 'How it is counted, in one sentence. Required: undefined numbers never ship.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'context', title: 'Context', type: 'text', rows: 2, description: 'One honest sentence for cards ("After localising checkout…").' }),
    defineField({ name: 'domain', title: 'Domain', type: 'string', options: { list: options(METRIC_DOMAINS), layout: 'radio', direction: 'horizontal' }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'area',
      title: 'Area',
      type: 'string',
      description: 'What the number is about. Drives the filter on Track record.',
      options: { list: options(METRIC_AREAS) },
      hidden: ({ document }) => document?.domain !== 'engineering',
    }),
    defineField({
      name: 'featured',
      title: 'Headline',
      type: 'boolean',
      description: 'Show as a big card at the top of Engineering (pick up to four). Everything else is in the explorer below.',
      initialValue: false,
      hidden: ({ document }) => document?.domain !== 'engineering',
    }),
    defineField({ name: 'community', title: 'Community', type: 'reference', to: [{ type: 'community' }], hidden: ({ document }) => document?.domain !== 'community' }),
    defineField({ name: 'company', title: 'Company / role', type: 'reference', to: [{ type: 'company' }], hidden: ({ document }) => document?.domain !== 'engineering' && document?.domain !== 'career' }),
    defineField({ name: 'sourceUrl', title: 'Source', type: 'url' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: options(METRIC_STATUSES), layout: 'radio', direction: 'horizontal' },
      initialValue: 'needs-ok',
      description: 'Only Approved metrics are public.',
      validation: (Rule) => Rule.required(),
    }),
    orderField(),
  ],
  preview: {
    select: { value: 'value', label: 'label', asOf: 'asOf', domain: 'domain', area: 'area', status: 'status' },
    prepare: ({ value, label, asOf, domain, area, status }) => ({
      title: `${value} ${label}`,
      subtitle: [titleFor(METRIC_AREAS, area) || titleFor(METRIC_DOMAINS, domain), asOf, status === 'approved' ? null : titleFor(METRIC_STATUSES, status)].filter(Boolean).join(' · '),
    }),
  },
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});
