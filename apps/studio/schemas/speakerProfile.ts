import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'speakerProfile',
  title: 'Speaker Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short positioning statement',
    }),
    defineField({
      name: 'bioShort',
      title: 'Bio (Short)',
      type: 'text',
      rows: 2,
      description: '~50 words - for event programs, tweets',
    }),
    defineField({
      name: 'bioMedium',
      title: 'Bio (Medium)',
      type: 'text',
      rows: 4,
      description: '~150 words - for event websites, CFP bios',
    }),
    defineField({
      name: 'bioFull',
      title: 'Bio (Full)',
      type: 'array',
      of: [{ type: 'block' }],
      description: '~300+ words - for detailed speaker pages',
    }),
    defineField({
      name: 'headshots',
      title: 'Headshots',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Formal', value: 'formal' },
                  { title: 'Casual', value: 'casual' },
                  { title: 'Speaking', value: 'speaking' },
                  { title: 'Headshot', value: 'headshot' },
                ],
              },
            },
            {
              name: 'downloadable',
              title: 'Allow Download',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'topicClusters',
      title: 'Topic Clusters',
      type: 'array',
      description: 'What I speak about',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'icon', title: 'Icon (emoji or icon name)', type: 'string' },
          ],
          preview: {
            select: { title: 'title', icon: 'icon' },
            prepare({ title, icon }) {
              return { title: `${icon || ''} ${title}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'formats',
      title: 'Talk Formats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Format Name', type: 'string' },
            { name: 'duration', title: 'Duration', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: {
            select: { name: 'name', duration: 'duration' },
            prepare({ name, duration }) {
              return { title: name, subtitle: duration };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'technicalRequirements',
      title: 'Technical Requirements',
      type: 'text',
      rows: 4,
      description: 'A/V preferences, setup requirements',
    }),
    defineField({
      name: 'travelBase',
      title: 'Travel Base',
      type: 'string',
      initialValue: 'Geneva, Switzerland',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'twitter', title: 'Twitter/X', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn', type: 'url' },
        { name: 'github', title: 'GitHub', type: 'url' },
        { name: 'email', title: 'Email', type: 'string' },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Speaker Profile',
        subtitle: 'Singleton document',
      };
    },
  },
});
