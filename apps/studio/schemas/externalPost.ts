import { defineType, defineField } from 'sanity';
import { PUBLICATION_FORMATS, TOPICS, titleFor } from 'shared';
import { options, hiddenWhenEmpty, legacyReason } from './_fields';

/**
 * Something published elsewhere: a guest article, a podcast episode, a video.
 * Shares one timeline with blog posts on /blog ("Writing & conversations").
 */
export default defineType({
  name: 'externalPost',
  title: 'Publication (elsewhere)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: { list: options(PUBLICATION_FORMATS), layout: 'radio', direction: 'horizontal' },
      description: 'Written, podcast or video. Decides the tile and the action (Read / Listen / Watch).',
      validation: (Rule) => Rule.required().warning('Pick a format'),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: { list: options(TOPICS), layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Length (min)',
      type: 'number',
      description: 'Listening/watching time, or reading time for articles.',
    }),
    defineField({ name: 'episode', title: 'Episode / note', type: 'string', description: '"episode 36", "guest article".' }),
    defineField({ name: 'relatedTalk', title: 'Related talk', type: 'reference', to: [{ type: 'talk' }], description: '"The conversation behind the React Summit talk."' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'type',
      title: 'Type (legacy)',
      type: 'string',
      hidden: hiddenWhenEmpty,
      deprecated: legacyReason('Use Format.'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'source',
      title: 'Source/Publication',
      type: 'string',
      description: 'Outlet or show: "PodRocket", "ConTejas Code", "iJS". Not the platform (Spotify) unless nothing better.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      source: 'source',
      format: 'format',
      type: 'type',
      date: 'publishedAt',
      media: 'image',
    },
    prepare({ title, source, format, type, date, media }) {
      return {
        title,
        subtitle: [titleFor(PUBLICATION_FORMATS, format) || `${type} (legacy)`, source, date].filter(Boolean).join(' · '),
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
