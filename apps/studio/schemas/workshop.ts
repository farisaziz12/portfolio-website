import { defineType, defineField, defineArrayMember } from 'sanity';
import { TOPICS, titleFor } from 'shared';
import { options, hiddenWhenEmpty, legacyReason, imageWithAlt, slugField, seoField, orderField } from './_fields';

const richText = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H4', value: 'h4' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Number', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Code', value: 'code' },
    ],
    annotations: [
      { name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'url', title: 'URL' }] },
    ],
  },
});

const agendaFields = [
    defineField({ name: 'at', title: 'Starts at', type: 'string', description: 'Offset from the start: "0:00", "1:45".' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'summary', title: 'One line', type: 'string' }),
    defineField({ name: 'isBreak', title: 'Break', type: 'boolean', initialValue: false }),
    defineField({ name: 'duration', title: 'Duration (legacy)', type: 'string', hidden: hiddenWhenEmpty }),
    defineField({ name: 'description', title: 'Details (expanded)', type: 'array', of: [richText] }),
];

const agendaPreview = {
  select: { title: 'title', at: 'at', isBreak: 'isBreak' },
  prepare: ({ title, at, isBreak }: { title?: string; at?: string; isBreak?: boolean }) => ({
    title: `${at ? `${at}  ` : ''}${title || 'Untitled'}`,
    subtitle: isBreak ? 'Break' : undefined,
  }),
};

const agendaItem = defineArrayMember({ name: 'agendaItem', type: 'object', fields: agendaFields, preview: agendaPreview });
/** V2 agenda items were anonymous objects; keep the shape so old data validates. */
const legacyAgendaItem = defineArrayMember({ type: 'object', fields: agendaFields, preview: agendaPreview });

/**
 * A bookable workshop template. Each delivery is an event session with
 * role "workshop" (public history) plus, optionally, a Workshop Instance
 * (the token-gated attendee page).
 */
export default defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'agenda', title: 'Agenda' },
    { name: 'booking', title: 'Booking box' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    slugField('title', 'content'),
    defineField({ name: 'pillar', title: 'Topic pillar', type: 'string', group: 'content', options: { list: options(TOPICS), layout: 'radio' } }),
    defineField({
      name: 'summary',
      title: 'One-line summary',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.max(160).warning('One sentence'),
    }),
    defineField({ name: 'description', title: 'Intro', type: 'text', rows: 4, group: 'content' }),
    defineField({ name: 'outcomes', title: 'You leave with', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    defineField({ name: 'prerequisites', title: 'Prerequisites', type: 'array', of: [{ type: 'string' }], group: 'content' }),
    defineField({ name: 'technologies', title: 'Technologies', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, group: 'content' }),
    imageWithAlt('image', 'Photo', { group: 'content' }),

    defineField({
      name: 'formats',
      title: 'Formats',
      type: 'array',
      group: 'agenda',
      description: 'One entry per edition length (3-hour, full day). The page shows a switch.',
      of: [
        defineArrayMember({
          name: 'workshopFormat',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: '"3-hour edition", "Full day".', validation: (Rule) => Rule.required() }),
            defineField({ name: 'duration', title: 'Length', type: 'string', description: '"3 h", "6.5 h".' }),
            defineField({ name: 'agenda', title: 'Agenda', type: 'array', of: [agendaItem] }),
          ],
          preview: { select: { title: 'label', subtitle: 'duration' } },
        }),
      ],
    }),
    defineField({
      name: 'agenda',
      title: 'Agenda (legacy, single format)',
      type: 'array',
      group: 'agenda',
      of: [legacyAgendaItem],
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Move it into Formats.'),
    }),

    defineField({ name: 'duration', title: 'Length summary', type: 'string', group: 'booking', description: '"3 h or full day (6.5 h)".' }),
    defineField({
      name: 'participants',
      title: 'Group size',
      type: 'object',
      group: 'booking',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'min', title: 'Min', type: 'number' }),
        defineField({ name: 'max', title: 'Max', type: 'number' }),
      ],
    }),
    defineField({ name: 'room', title: 'Room needs', type: 'string', group: 'booking', description: '"Tables, power, reliable wifi, projector".' }),
    defineField({ name: 'after', title: 'What they keep', type: 'string', group: 'booking', description: '"Repo, slides and resources via the attendee link".' }),
    defineField({ name: 'relatedTalk', title: 'The talk version', type: 'reference', to: [{ type: 'talk' }], group: 'booking' }),
    defineField({ name: 'isBookable', title: 'Bookable', type: 'boolean', group: 'booking', initialValue: true }),
    orderField('booking'),
    seoField(),
  ],
  preview: {
    select: { title: 'title', duration: 'duration', pillar: 'pillar', media: 'image' },
    prepare: ({ title, duration, pillar, media }) => ({
      title,
      subtitle: [duration, titleFor(TOPICS, pillar)].filter(Boolean).join(' · ') || 'No length set',
      media,
    }),
  },
});
