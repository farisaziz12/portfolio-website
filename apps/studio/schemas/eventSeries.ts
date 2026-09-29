import { defineType, defineField } from 'sanity';
import { EVENT_KINDS } from 'shared';
import { options, slugField } from './_fields';

/**
 * A recurring event brand (React Summit, CityJS, ZurichJS). Editions are
 * `event` documents that reference it. Optional: one-off events don't need one.
 */
export default defineType({
  name: 'eventSeries',
  title: 'Event series',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Brand only, no year or city: "React Summit", "CityJS", "ZurichJS".',
      validation: (Rule) => Rule.required(),
    }),
    slugField('name'),
    defineField({ name: 'kind', title: 'Kind', type: 'string', options: { list: options(EVENT_KINDS) } }),
    defineField({ name: 'url', title: 'Website', type: 'url' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({
      name: 'isOwn',
      title: 'I organise this series',
      type: 'boolean',
      description: 'ZurichJS and friends. Drives the Community page.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'kind', media: 'logo' },
  },
});
