import { defineType, defineField, defineArrayMember } from 'sanity';
import { TOPICS } from 'shared';
import { options, hiddenWhenEmpty, legacyReason } from './_fields';

const labelled = (name: string, title: string, labelHint: string) =>
  defineArrayMember({
    type: 'object',
    name,
    title,
    fields: [
      defineField({ name: 'label', title: 'Label', type: 'string', description: labelHint, validation: (Rule) => Rule.required() }),
      defineField({ name: 'body', title: 'Text', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
    ],
    preview: { select: { title: 'label', subtitle: 'body' } },
  });

/**
 * Singleton: identity facts, bios, press photos, rider and the speaking copy
 * blocks. Feeds /press-kit, /invite, /speaking and every OG / JSON-LD bio.
 */
export default defineType({
  name: 'speakerProfile',
  title: 'Profile & press kit',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'bios', title: 'Bios' },
    { name: 'photos', title: 'Press photos' },
    { name: 'speaking', title: 'Speaking copy' },
    { name: 'practical', title: 'Rider & good to know' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'identity', initialValue: 'Faris Aziz' }),
    defineField({ name: 'pronunciation', title: 'Pronunciation', type: 'string', group: 'identity', description: '"FAH-riss ah-ZEEZ".' }),
    defineField({
      name: 'tagline',
      title: 'Title line',
      type: 'string',
      group: 'identity',
      description: 'Public one-liner: "Software engineer · speaker · ZurichJS co-founder".',
    }),
    defineField({ name: 'travelBase', title: 'Based in', type: 'string', group: 'identity', initialValue: 'Geneva, Switzerland', description: '"City, Country". The city shows in the footer and About kicker; both feed search results.' }),
    defineField({ name: 'jobTitle', title: 'Job title', type: 'string', group: 'identity', initialValue: 'Staff Software Engineer', description: 'Shown to search engines as your job title (schema.org Person).' }),
    defineField({ name: 'replyTime', title: 'Reply time', type: 'string', group: 'identity', initialValue: 'two working days', description: 'Used in "I reply within …".' }),
    defineField({
      name: 'socialLinks',
      title: 'Links',
      type: 'object',
      group: 'identity',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'bluesky', title: 'Bluesky', type: 'url' }),
        defineField({ name: 'twitter', title: 'X', type: 'url' }),
        defineField({ name: 'github', title: 'GitHub', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
        defineField({ name: 'mentorcruise', title: 'MentorCruise', type: 'url' }),
        defineField({
          name: 'email',
          title: 'Email (legacy)',
          type: 'string',
          hidden: hiddenWhenEmpty,
          deprecated: legacyReason('The site never shows an email address; contact goes through forms.'),
        }),
      ],
    }),

    defineField({
      name: 'bioShort',
      title: 'Short bio (~30 words)',
      type: 'text',
      rows: 3,
      group: 'bios',
      description: 'Third person, for programmes. Same facts as the others, in the same order.',
    }),
    defineField({ name: 'bioMedium', title: 'Medium bio (~80 words)', type: 'text', rows: 5, group: 'bios' }),
    defineField({ name: 'bioLong', title: 'Long bio (~180 words)', type: 'text', rows: 10, group: 'bios' }),
    defineField({ name: 'bioUpdatedAt', title: 'Bios last reviewed', type: 'date', group: 'bios' }),
    defineField({
      name: 'bioFull',
      title: 'Full bio (legacy rich text)',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'bios',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Copy as plain text into Long bio.'),
    }),

    defineField({
      name: 'headshots',
      title: 'Press photos',
      type: 'array',
      group: 'photos',
      description:
        'Open the hotspot editor on each photo and put the circle on the face: the press kit crops 1:1, 4:5 and 16:9 around it.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: '"Stage portrait", "Workshop in progress".' }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', description: 'Kicker + download filename: "portrait", "stage", "workshop".' }),
            defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required().warning('Add alt text') }),
            defineField({ name: 'credit', title: 'Photo credit', type: 'string', validation: (Rule) => Rule.required().warning('Credit the photographer') }),
            defineField({ name: 'downloadable', title: 'Allow download', type: 'boolean', initialValue: true }),
            defineField({ name: 'style', title: 'Style (legacy)', type: 'string', hidden: hiddenWhenEmpty }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'topicClusters',
      title: 'Things I talk about',
      type: 'array',
      group: 'speaking',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'topicPillar',
          fields: [
            defineField({ name: 'pillar', title: 'Pillar', type: 'string', options: { list: options(TOPICS) } }),
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'Usually the lead talk title.' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'talk', title: 'Lead talk', type: 'reference', to: [{ type: 'talk' }] }),
            defineField({ name: 'icon', title: 'Icon (legacy)', type: 'string', hidden: hiddenWhenEmpty }),
          ],
          preview: { select: { title: 'title', subtitle: 'pillar' } },
        }),
      ],
    }),
    defineField({
      name: 'formats',
      title: 'Formats',
      type: 'array',
      group: 'speaking',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'speakingFormat',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', description: '"Keynote", "Talk", "Workshop", "Panel · podcast".' }),
            defineField({ name: 'duration', title: 'Length', type: 'string' }),
            defineField({ name: 'description', title: 'Description (casual, first person)', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'name', subtitle: 'duration' } },
        }),
      ],
    }),

    defineField({
      name: 'rider',
      title: 'Rider',
      type: 'array',
      group: 'practical',
      description: 'Video, Audio, Timing, Recording…',
      of: [labelled('riderItem', 'Rider item', '"Video", "Audio".')],
    }),
    defineField({
      name: 'goodToKnow',
      title: 'Good to know (invite page)',
      type: 'array',
      group: 'practical',
      of: [labelled('goodToKnowItem', 'Good-to-know item', '"In person", "Remote", "Fee", "Tech".')],
    }),
    defineField({
      name: 'technicalRequirements',
      title: 'Technical requirements (legacy)',
      type: 'text',
      group: 'practical',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Split into Rider items.'),
    }),
    defineField({
      name: 'avatarNote',
      title: 'Illustrated avatar note',
      type: 'text',
      rows: 2,
      group: 'practical',
    }),
  ],
  preview: { prepare: () => ({ title: 'Profile & press kit', subtitle: 'Singleton' }) },
});
