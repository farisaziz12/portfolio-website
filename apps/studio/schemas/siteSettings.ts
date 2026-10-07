import { defineType, defineField } from 'sanity';

/** Singleton: SEO defaults, the site-wide "Now" line and profile links. */

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'The name of the site (e.g., "Faris Aziz")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short tagline (e.g., "Staff Software Engineer & Conference Speaker")',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'The canonical URL of the site (e.g., "https://faziz-dev.com")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Default Meta Title',
      type: 'string',
      description: 'Default title for pages (appears in browser tab and search results)',
      validation: (Rule) => Rule.max(60).warning('Titles over 60 characters may be truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Primary meta description for the site',
      validation: (Rule) => Rule.max(160).warning('Descriptions over 160 characters may be truncated'),
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      description: 'Fallback description used when pages don\'t specify their own',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'SEO keywords for the site',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description: 'Default image for social sharing (recommended: 1200x630px)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'nowLine',
      title: '"Now" line',
      type: 'string',
      description: 'The one string that says what you do today. Kicker on home, nav meta, OG cards: "Software engineer · speaker · ZurichJS co-founder". Swap it on announcement day.',
    }),
    defineField({
      name: 'discoveryCallUrl',
      title: 'Intro call link',
      type: 'url',
      description: 'cal.com link. Opens as an on-site modal.',
      initialValue: 'https://cal.com/farisaziz12/discovery-call',
    }),
    defineField({
      name: 'introEnabled',
      title: 'Play the opener',
      type: 'boolean',
      description: 'The 3.6 s intro on first visit per session. Off = hero only.',
      initialValue: true,
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter/X Handle',
      type: 'string',
      description: 'Twitter handle without @ (e.g., "farisaziz12")',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'blueskyUrl',
      title: 'Bluesky URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      subtitle: 'tagline',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Global site configuration',
      };
    },
  },
});
