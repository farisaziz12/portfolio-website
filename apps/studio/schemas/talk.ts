import { defineType, defineField } from 'sanity';
import { TOPICS, titleFor } from 'shared';
import { options, hiddenWhenEmpty, legacyReason, imageWithAlt, slugField, seoField, orderField } from './_fields';

/**
 * A bookable talk: timeless, no date. Where and when it was given lives on
 * event sessions that reference it, so the delivery history, recordings and
 * counts are derived, never typed in here.
 */
export default defineType({
  name: 'talk',
  title: 'Talk',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'booking', title: 'Booking box' },
    { name: 'versioning', title: 'Versions' },
    { name: 'assets', title: 'Assets' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'shortTitle',
      title: 'Short name',
      type: 'string',
      group: 'content',
      description: 'How people refer to it: "the caching talk". Used in quote labels ("On the caching talk").',
    }),
    slugField('title', 'content'),
    defineField({
      name: 'pillar',
      title: 'Topic pillar',
      type: 'string',
      group: 'content',
      options: { list: options(TOPICS), layout: 'radio' },
      description: 'Drives the topic filter on /talks and "Things I talk about".',
      validation: (Rule) => Rule.required().warning('Pick a pillar so the talk shows under a filter'),
    }),
    defineField({
      name: 'summary',
      title: 'One-line summary',
      type: 'string',
      group: 'content',
      description: 'Card text. One sentence, no marketing: "Data fetching when the network, the device and the backend are all against you."',
      validation: (Rule) => Rule.max(160).warning('Keep it to one sentence'),
    }),
    defineField({
      name: 'abstract',
      title: 'Premise (abstract)',
      type: 'text',
      rows: 5,
      group: 'content',
      description: 'First person, one real example carried end to end. 60–120 words.',
    }),
    defineField({ name: 'audience', title: "Who it's for", type: 'text', rows: 2, group: 'content' }),
    defineField({
      name: 'takeaways',
      title: 'You leave with',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      validation: (Rule) => Rule.max(4).warning('Three is the sweet spot'),
    }),
    defineField({
      name: 'topics',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'content',
      description: 'Free tags for search (React, Caching, BFF). The pillar does the filtering.',
    }),

    defineField({
      name: 'duration',
      title: 'Default length (min)',
      type: 'number',
      group: 'booking',
      validation: (Rule) => Rule.min(5).max(240),
    }),
    defineField({
      name: 'durationOptions',
      title: 'Available lengths (min)',
      type: 'array',
      of: [{ type: 'number' }],
      group: 'booking',
      description: 'e.g. 20, 30, 45 → "20, 30 or 45 min versions".',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'booking',
      description: 'e.g. "Intermediate to senior".',
    }),
    defineField({
      name: 'setup',
      title: 'Setup',
      type: 'string',
      group: 'booking',
      description: 'Leave empty to use the press-kit rider ("USB-C preferred, own laptop, headset mic").',
    }),
    defineField({
      name: 'alsoAsWorkshop',
      title: 'Also available as workshop',
      type: 'reference',
      to: [{ type: 'workshop' }],
      group: 'booking',
    }),
    defineField({
      name: 'relatedTalks',
      title: 'Pairs well with',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'talk' }] }],
      group: 'booking',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'isBookable',
      title: 'Bookable',
      type: 'boolean',
      group: 'booking',
      description: 'On = listed on /talks and bookable. Off (the default) keeps it off the catalogue; its page and sessions stay.',
      initialValue: false,
    }),
    orderField('booking'),

    defineField({
      name: 'parentTalk',
      title: 'Parent talk',
      type: 'reference',
      to: [{ type: 'talk' }],
      group: 'versioning',
      description: 'If this is a new cut of an existing talk, link the original. Sessions of every version roll up to the family.',
      options: { filter: '!defined(parentTalk)' },
    }),
    defineField({ name: 'version', title: 'Version label', type: 'string', group: 'versioning' }),
    defineField({
      name: 'isCurrentVersion',
      title: 'Current version',
      type: 'boolean',
      group: 'versioning',
      description: 'Only one per family. Only current versions are listed.',
      initialValue: true,
    }),
    defineField({ name: 'versionNotes', title: 'What changed', type: 'text', rows: 2, group: 'versioning' }),
    defineField({ name: 'firstDelivered', title: 'First delivered', type: 'date', group: 'versioning', hidden: hiddenWhenEmpty, deprecated: legacyReason('Derived from the first session.') }),

    imageWithAlt('thumbnail', 'Poster photo', {
      group: 'assets',
      description: 'A stage photo of this talk. Falls back to the first session recording thumbnail.',
    }),
    defineField({
      name: 'assets',
      title: 'Fallback assets',
      type: 'object',
      group: 'assets',
      description: 'Prefer attaching recordings and slides to the SESSION on the event. These are fallbacks only.',
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: 'repoUrl', title: 'Repository URL', type: 'url' },
        { name: 'slidesUrl', title: 'Slides URL (fallback)', type: 'url' },
        { name: 'videoUrl', title: 'Video URL (fallback)', type: 'url' },
        { name: 'thumbnailImage', title: 'Thumbnail (legacy)', type: 'image', options: { hotspot: true } },
      ],
    }),
    seoField(),

    defineField({
      name: 'homepageFeatured',
      title: 'Homepage featured (legacy)',
      type: 'boolean',
      group: 'content',
      hidden: ({ value }) => !value,
      deprecated: legacyReason('Pick featured items on the Home page document.'),
    }),
    defineField({
      name: 'viewCount',
      title: 'View count (legacy)',
      type: 'number',
      group: 'content',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('The site no longer claims "most watched" without a dated source.'),
    }),
  ],
  preview: {
    select: { title: 'title', version: 'version', current: 'isCurrentVersion', pillar: 'pillar', bookable: 'isBookable', media: 'thumbnail' },
    prepare({ title, version, current, pillar, bookable, media }) {
      return {
        title: `${title}${version ? ` (${version})` : ''}`,
        subtitle: [titleFor(TOPICS, pillar) || 'No pillar', current === false ? 'old version' : null, bookable === false ? 'retired' : null]
          .filter(Boolean)
          .join(' · '),
        media,
      };
    },
  },
  orderings: [
    { title: 'Catalogue order', name: 'order', by: [{ field: 'order', direction: 'asc' }, { field: 'title', direction: 'asc' }] },
  ],
});
