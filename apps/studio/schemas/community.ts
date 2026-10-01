import { defineType, defineField, defineArrayMember } from 'sanity';
import { imageWithAlt, photoMember, slugField, cta } from './_fields';

/**
 * A community Faris builds (ZurichJS). Feeds /community and the home feature.
 * Numbers are Metric references so they stay dated and defined.
 */
export default defineType({
  name: 'community',
  title: 'Community',
  type: 'document',
  groups: [
    { name: 'story', title: 'Story', default: true },
    { name: 'proof', title: 'Numbers & recognition' },
    { name: 'media', title: 'Aftermovie & photos' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'story', validation: (Rule) => Rule.required() }),
    slugField('name', 'story'),
    defineField({ name: 'role', title: 'My role', type: 'string', group: 'story', description: '"Co-founder and chair".' }),
    defineField({ name: 'founded', title: 'Founded (year)', type: 'number', group: 'story' }),
    defineField({ name: 'city', title: 'City', type: 'string', group: 'story' }),
    defineField({ name: 'url', title: 'Website', type: 'url', group: 'story' }),
    defineField({ name: 'series', title: 'Event series', type: 'reference', to: [{ type: 'eventSeries' }], group: 'story', description: 'Links hosted editions for counts.' }),
    defineField({ name: 'headline', title: 'Home headline', type: 'string', group: 'story', description: '"I co-founded and lead ZurichJS."' }),
    defineField({ name: 'caseStudyHeadline', title: 'Case-study headline', type: 'string', group: 'story', description: '"Co-founded in 2024. A conference by 2026."' }),
    defineField({ name: 'summary', title: 'Contribution (first person)', type: 'text', rows: 4, group: 'story' }),
    defineField({
      name: 'pillars',
      title: 'Host · Teach · Build',
      type: 'array',
      group: 'story',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'communityPillar',
          fields: [
            defineField({ name: 'kicker', title: 'Kicker', type: 'string', description: '"Host", "Teach", "Build".' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
            cta('link', 'Link'),
          ],
          preview: { select: { title: 'title', subtitle: 'kicker' } },
        }),
      ],
    }),
    defineField({ name: 'platformProject', title: 'Platform project', type: 'reference', to: [{ type: 'project' }], group: 'story', description: 'The conference platform, as an engineering project.' }),

    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      group: 'proof',
      of: [{ type: 'reference', to: [{ type: 'metric' }] }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'recognition',
      title: 'Recognition',
      type: 'array',
      group: 'proof',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'award',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'issuer', title: 'Issuer', type: 'string', description: '"OSS Awards at JSNation".' }),
            defineField({ name: 'year', title: 'Year', type: 'number' }),
            defineField({ name: 'url', title: 'Link', type: 'url' }),
            defineField({ name: 'confirmed', title: 'Wording & year confirmed', type: 'boolean', initialValue: false, description: 'Unconfirmed awards stay hidden.' }),
          ],
          preview: { select: { title: 'title', subtitle: 'issuer' } },
        }),
      ],
    }),

    defineField({
      name: 'aftermovie',
      title: 'Aftermovie',
      type: 'object',
      group: 'media',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        defineField({
          name: 'video',
          title: 'Video file',
          type: 'file',
          options: { accept: 'video/mp4,video/webm,video/quicktime' },
          description: 'Upload the film here (MP4/H.264 plays everywhere; keep it web-sized, ~1080p, under ~200 MB). It plays on /community with the captions below. For long or very large films, host on YouTube/Vimeo and use the URL instead.',
        }),
        defineField({
          name: 'captions',
          title: 'Captions (.vtt)',
          type: 'file',
          options: { accept: '.vtt,text/vtt' },
          description: 'WebVTT subtitles. Strongly recommended: the film plays muted by default for many viewers.',
        }),
        defineField({ name: 'url', title: 'Or: external video URL', type: 'url', description: 'YouTube/Vimeo link, used when no file is uploaded.' }),
        defineField({
          name: 'published',
          title: 'Published',
          type: 'boolean',
          initialValue: false,
          description: 'Off = the poster shows "Not yet published" with a disabled play button. Turn on once a file or URL is set.',
        }),
        defineField({ name: 'credit', title: 'Crew credit', type: 'string' }),
        imageWithAlt('poster', 'Poster frame'),
      ],
    }),
    defineField({ name: 'photos', title: 'Photos', type: 'array', group: 'media', of: [photoMember()] }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
});
