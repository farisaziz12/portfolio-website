import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'identifier',
      title: 'Page Identifier',
      type: 'string',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Invite / Speaker Kit', value: 'invite' },
          { title: 'Speaking', value: 'speaking' },
          { title: 'Home', value: 'home' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    // About Page - Hero Section
    defineField({
      name: 'aboutHero',
      title: 'About Hero',
      type: 'object',
      hidden: ({ parent }) => parent?.identifier !== 'about',
      fields: [
        { name: 'greeting', title: 'Greeting', type: 'string', description: 'e.g., "Hey, I\'m"' },
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'role', title: 'Role', type: 'string', description: 'e.g., "Staff Software Engineer"' },
        { name: 'location', title: 'Location', type: 'string' },
        { name: 'bio', title: 'Bio', type: 'text', rows: 3 },
        {
          name: 'specialties',
          title: 'Specialties',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Highlighted skills in bio (e.g., React, Next.js, payment systems)',
        },
        {
          name: 'badges',
          title: 'Topic Badges',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'icon', title: 'Icon/Emoji', type: 'string' },
                { name: 'label', title: 'Label', type: 'string' },
              ],
              preview: {
                select: { icon: 'icon', label: 'label' },
                prepare: ({ icon, label }) => ({ title: `${icon} ${label}` }),
              },
            },
          ],
        },
        { name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' },
      ],
    }),
    // About Page - What I Do Section
    defineField({
      name: 'aboutWhatIDo',
      title: 'What I Do Section',
      type: 'object',
      hidden: ({ parent }) => parent?.identifier !== 'about',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Section Subtitle', type: 'string' },
        {
          name: 'activities',
          title: 'Activities',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
                { name: 'icon', title: 'Icon Name', type: 'string', description: 'code, microphone, users, book, desktop' },
                {
                  name: 'tags',
                  title: 'Tags',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
                { name: 'featured', title: 'Featured (larger card)', type: 'boolean' },
              ],
              preview: {
                select: { title: 'title', featured: 'featured' },
                prepare: ({ title, featured }) => ({
                  title,
                  subtitle: featured ? 'Featured' : '',
                }),
              },
            },
          ],
        },
      ],
    }),
    // About Page - Journey Section
    defineField({
      name: 'aboutJourney',
      title: 'My Journey Section',
      type: 'object',
      hidden: ({ parent }) => parent?.identifier !== 'about',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Section Subtitle', type: 'string' },
        {
          name: 'milestones',
          title: 'Milestones',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text', rows: 3 },
                { name: 'emoji', title: 'Emoji', type: 'string' },
                { name: 'fullWidth', title: 'Full Width', type: 'boolean' },
              ],
              preview: {
                select: { title: 'title', emoji: 'emoji' },
                prepare: ({ title, emoji }) => ({ title: `${emoji} ${title}` }),
              },
            },
          ],
        },
      ],
    }),
    // About Page - Skills Section
    defineField({
      name: 'aboutSkills',
      title: 'Technical Skills Section',
      type: 'object',
      hidden: ({ parent }) => parent?.identifier !== 'about',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string' },
        { name: 'subtitle', title: 'Section Subtitle', type: 'string' },
        {
          name: 'categories',
          title: 'Skill Categories',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'category', title: 'Category Name', type: 'string' },
                { name: 'icon', title: 'Icon/Emoji', type: 'string' },
                {
                  name: 'items',
                  title: 'Skills',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
              ],
              preview: {
                select: { category: 'category', icon: 'icon' },
                prepare: ({ category, icon }) => ({ title: `${icon} ${category}` }),
              },
            },
          ],
        },
      ],
    }),
    // About Page - CTA Section
    defineField({
      name: 'aboutCta',
      title: 'CTA Section',
      type: 'object',
      hidden: ({ parent }) => parent?.identifier !== 'about',
      fields: [
        { name: 'statusText', title: 'Status Text', type: 'string', description: 'e.g., "Open for opportunities"' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 2 },
        { name: 'primaryCtaText', title: 'Primary CTA Text', type: 'string' },
        { name: 'primaryCtaUrl', title: 'Primary CTA URL', type: 'string' },
        { name: 'secondaryCtaText', title: 'Secondary CTA Text', type: 'string' },
        { name: 'secondaryCtaUrl', title: 'Secondary CTA URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
        { name: 'ogImage', title: 'OG Image', type: 'image' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      identifier: 'identifier',
    },
    prepare({ title, identifier }) {
      return {
        title: title || identifier,
        subtitle: `Page: ${identifier}`,
      };
    },
  },
});
