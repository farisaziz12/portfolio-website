import { defineType, defineField } from 'sanity';
import { cta, photoMember } from './_fields';

/** Singleton: everything editorial on `/`. Lists (events, writing) are derived. */
export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'featured', title: 'Featured' },
    { name: 'sections', title: 'Sections' },
  ],
  fields: [
    defineField({
      name: 'heroVariant',
      title: 'Hero layout',
      type: 'string',
      group: 'hero',
      options: { list: [{ value: 'band', title: 'Skewed band + photo (default)' }, { value: 'fullbleed', title: 'Full-bleed photo' }], layout: 'radio' },
      initialValue: 'band',
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      group: 'hero',
      description: 'Leave empty to use the site-wide "Now" line from Site settings.',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      description: 'Wrap phrases to underline in [brackets]: "I sit at the intersection of [product engineering], [monetization] and [technical leadership]."',
    }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, group: 'hero' }),
    cta('primaryCta', 'Primary button', 'hero'),
    cta('secondaryCta', 'Secondary link', 'hero'),
    defineField({ name: 'heroPhotos', title: 'Hero photos', type: 'array', group: 'hero', of: [photoMember()], validation: (Rule) => Rule.max(3), description: 'The hero shows the first photo. Leave empty to use the press photos (stage shots first). Set the hotspot: the hero crops around it.' }),

    defineField({
      name: 'featured',
      title: 'Featured (posters)',
      type: 'array',
      group: 'featured',
      description: 'Exactly three: 01 the flagship talk, then two conversations or posts. Recordings come from sessions automatically.',
      of: [{ type: 'reference', to: [{ type: 'talk' }, { type: 'externalPost' }, { type: 'blogPost' }] }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({ name: 'featuredQuote', title: 'Quote under the posters', type: 'reference', to: [{ type: 'praise' }], group: 'featured' }),
    defineField({
      name: 'praise',
      title: 'What people say',
      type: 'array',
      group: 'featured',
      description: 'First = the big quote, then up to six cards. Empty = featured praise, newest first.',
      of: [{ type: 'reference', to: [{ type: 'praise' }] }],
      validation: (Rule) => Rule.max(7),
    }),

    defineField({ name: 'community', title: 'Community feature', type: 'reference', to: [{ type: 'community' }], group: 'sections' }),
    defineField({
      name: 'invitePanel',
      title: 'Invitation panel',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string', initialValue: 'Invite me to your stage.' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
});
