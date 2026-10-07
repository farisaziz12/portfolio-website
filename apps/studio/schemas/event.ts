import { defineType, defineField, defineArrayMember } from 'sanity';
import { EVENT_KINDS, SESSION_ROLES, SESSION_STATUSES, titleFor } from 'shared';
import { options, hiddenWhenEmpty, legacyReason, imageWithAlt, slugField, seoField } from './_fields';

/**
 * An event EDITION: one dated appearance (React Summit US 2025). What I did
 * there lives in `sessions[]`, each with an explicit role. Recordings and
 * slides attach to the session, so one edit shows up on the talk page, the
 * event page and the home poster at once.
 */
const TALK_ROLES = ['speaker', 'keynote', 'lightning', 'panel', 'guest'];

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    { name: 'edition', title: 'Edition', default: true },
    { name: 'sessions', title: 'My sessions' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
    { name: 'legacy', title: 'Legacy' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Edition title',
      type: 'string',
      group: 'edition',
      description: 'Series + year or city: "React Summit US 2025", "Devs.Ghent", "ZurichJS Conf 2026".',
      validation: (Rule) => Rule.required(),
    }),
    slugField('title', 'edition'),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'eventSeries' }],
      group: 'edition',
      description: 'Optional. Groups editions of the same event.',
    }),
    defineField({
      name: 'kind',
      title: 'Kind of event',
      type: 'string',
      group: 'edition',
      options: { list: options(EVENT_KINDS) },
      description: 'What the event is. What YOU did there is the session role.',
    }),
    defineField({ name: 'date', title: 'Start date', type: 'date', group: 'edition', validation: (Rule) => Rule.required() }),
    defineField({ name: 'endDate', title: 'End date', type: 'date', group: 'edition', description: 'Multi-day events only.' }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      group: 'edition',
      description: 'IANA name, e.g. Europe/Brussels. Upcoming/past is computed in this zone.',
      initialValue: 'Europe/Zurich',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'edition',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'venue', title: 'Venue', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          description: 'Standard English name ("Czechia", "United States"). Drives the flag.',
        }),
        defineField({ name: 'isOnline', title: 'Online', type: 'boolean', initialValue: false }),
      ],
    }),
    defineField({ name: 'language', title: 'Language', type: 'string', group: 'edition', initialValue: 'English' }),
    defineField({ name: 'url', title: 'Event website', type: 'url', group: 'edition' }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'edition',
      validation: (Rule) => Rule.max(300).warning('Keep it to two sentences'),
    }),
    defineField({
      name: 'featured',
      title: 'Headline event',
      type: 'boolean',
      group: 'edition',
      description: 'Stars it in "Stages" lists.',
      initialValue: false,
    }),

    defineField({
      name: 'sessions',
      title: 'My sessions at this edition',
      type: 'array',
      group: 'sessions',
      description: 'One entry per thing you did. A talk and a workshop at the same event = two sessions.',
      validation: (Rule) => Rule.min(1).warning('Add at least one session with a role'),
      of: [
        defineArrayMember({
          name: 'session',
          type: 'object',
          fields: [
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              options: { list: options(SESSION_ROLES) },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'talk',
              title: 'Talk',
              type: 'reference',
              to: [{ type: 'talk' }],
              hidden: ({ parent }) => !TALK_ROLES.includes(parent?.role),
            }),
            defineField({
              name: 'workshop',
              title: 'Workshop',
              type: 'reference',
              to: [{ type: 'workshop' }],
              hidden: ({ parent }) => parent?.role !== 'workshop',
            }),
            defineField({
              name: 'title',
              title: 'Session title',
              type: 'string',
              description: 'Only when it differs from the talk, or there is no talk: "Chair · host · platform", "Panel: Growing to senior".',
            }),
            defineField({
              name: 'detail',
              title: 'One-line detail',
              type: 'string',
              description: 'e.g. "3-hour workshop", "Opening keynote".',
            }),
            defineField({
              name: 'startsAt',
              title: 'Starts at',
              type: 'datetime',
              description: "This session's own slot on its scheduled day, entered in the event's time zone.",
            }),
            defineField({
              name: 'durationMinutes',
              title: 'Duration (min)',
              type: 'number',
              description: "Only when the schedule states it or gives an end time. Not the talk's usual length.",
              validation: (Rule) => Rule.min(1).integer(),
            }),
            defineField({
              name: 'stage',
              title: 'Stage / room',
              type: 'string',
              description: 'The physical stage or room ("Main stage", "Room 2"). Not the venue, not the track.',
            }),
            defineField({
              name: 'track',
              title: 'Track',
              type: 'string',
              description: 'The programme track ("Frontend", "Workshops"), when the schedule has one. Leave blank if it only names a room.',
            }),
            defineField({
              name: 'scheduleSourceUrl',
              title: 'Schedule source',
              type: 'url',
              description: 'The official schedule page or session permalink the time, stage and track came from.',
            }),
            defineField({
              name: 'scheduleCheckedAt',
              title: 'Schedule checked',
              type: 'datetime',
              description: 'When that source was last checked.',
              hidden: ({ parent }) => !parent?.scheduleSourceUrl && !parent?.scheduleCheckedAt,
            }),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: { list: options(SESSION_STATUSES), layout: 'radio', direction: 'horizontal' },
              initialValue: 'confirmed',
              description: 'Past sessions count as delivered unless cancelled.',
            }),
            defineField({
              name: 'recording',
              title: 'Recording',
              type: 'object',
              options: { collapsible: true, collapsed: false },
              fields: [
                defineField({ name: 'url', title: 'URL', type: 'url' }),
                defineField({ name: 'durationMinutes', title: 'Length (min)', type: 'number' }),
                defineField({ name: 'publishedAt', title: 'Published', type: 'date' }),
              ],
            }),
            defineField({ name: 'slidesUrl', title: 'Slides URL', type: 'url' }),
            defineField({ name: 'slidesNote', title: 'Slides note', type: 'string', description: 'e.g. "PDF, 4.2 MB".' }),
            defineField({ name: 'repoUrl', title: 'Repository URL', type: 'url' }),
            defineField({
              name: 'featured',
              title: 'Feature this recording',
              type: 'boolean',
              description: 'Offer it as the recording on the talk page when a talk has several.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { role: 'role', talk: 'talk.title', workshop: 'workshop.title', title: 'title', status: 'status', rec: 'recording.url' },
            prepare({ role, talk, workshop, title, status, rec }) {
              return {
                title: title || talk || workshop || titleFor(SESSION_ROLES, role),
                subtitle: [titleFor(SESSION_ROLES, role), status, rec ? 'recording' : null].filter(Boolean).join(' · '),
              };
            },
          },
        }),
      ],
    }),

    imageWithAlt('coverImage', 'Cover photo', { group: 'media', description: 'A photo from the day. Before the event: the venue.' }),
    seoField(),

    // ─── Legacy V2 fields (read as fallbacks until migrated) ───────────────
    defineField({
      name: 'type',
      title: 'Type (legacy)',
      type: 'string',
      group: 'legacy',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Use Kind + a session Role.'),
    }),
    defineField({
      name: 'conference',
      title: 'Conference name (legacy)',
      type: 'string',
      group: 'legacy',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Use Series + Edition title.'),
    }),
    defineField({
      name: 'talk',
      title: 'Talk (legacy)',
      type: 'reference',
      to: [{ type: 'talk' }],
      group: 'legacy',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Add a session instead.'),
    }),
    defineField({
      name: 'workshop',
      title: 'Workshop (legacy)',
      type: 'reference',
      to: [{ type: 'workshop' }],
      group: 'legacy',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Add a workshop session instead.'),
    }),
    defineField({
      name: 'links',
      title: 'Links (legacy)',
      type: 'object',
      group: 'legacy',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Event URL → Event website; video/slides → the session.'),
      fields: [
        { name: 'eventUrl', title: 'Event URL', type: 'url' },
        { name: 'videoUrl', title: 'Video Recording', type: 'url' },
        { name: 'slidesUrl', title: 'Slides URL', type: 'url' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      city: 'location.city',
      online: 'location.isOnline',
      roles: 'sessions',
      legacyType: 'type',
      media: 'coverImage',
    },
    prepare({ title, date, city, online, roles, legacyType, media }) {
      const d = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date';
      const r = Array.isArray(roles) && roles.length
        ? roles.map((s: { role?: string }) => s.role).filter(Boolean).join(' + ')
        : legacyType
          ? `${legacyType} (legacy)`
          : 'no sessions';
      return { title, subtitle: `${d} · ${online ? 'Online' : city || 'No city'} · ${r}`, media };
    },
  },
  orderings: [
    { title: 'Date, newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
    { title: 'Date, oldest', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
  ],
});
