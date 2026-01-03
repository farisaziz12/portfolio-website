import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Meta & SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'A short summary for previews and SEO (150-160 characters ideal)',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Important for accessibility and SEO',
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'openInNewTab',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal Link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [{ type: 'blogPost' }, { type: 'talk' }, { type: 'project' }],
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        }),
        defineArrayMember({
          name: 'code',
          type: 'object',
          title: 'Code Block',
          fields: [
            {
              name: 'language',
              type: 'string',
              title: 'Language',
              options: {
                list: [
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'JSX', value: 'jsx' },
                  { title: 'TSX', value: 'tsx' },
                  { title: 'HTML', value: 'html' },
                  { title: 'CSS', value: 'css' },
                  { title: 'JSON', value: 'json' },
                  { title: 'Bash', value: 'bash' },
                  { title: 'Python', value: 'python' },
                  { title: 'Go', value: 'go' },
                  { title: 'Rust', value: 'rust' },
                  { title: 'SQL', value: 'sql' },
                  { title: 'GraphQL', value: 'graphql' },
                  { title: 'YAML', value: 'yaml' },
                  { title: 'Markdown', value: 'markdown' },
                  { title: 'Plain Text', value: 'text' },
                ],
              },
            },
            {
              name: 'filename',
              type: 'string',
              title: 'Filename',
              description: 'Optional filename to display above the code block',
            },
            {
              name: 'code',
              type: 'text',
              title: 'Code',
              rows: 10,
            },
            {
              name: 'highlightedLines',
              type: 'string',
              title: 'Highlighted Lines',
              description: 'Line numbers to highlight, e.g., "1,3-5,10"',
            },
          ],
          preview: {
            select: {
              language: 'language',
              filename: 'filename',
              code: 'code',
            },
            prepare({ language, filename, code }) {
              return {
                title: filename || `Code (${language || 'text'})`,
                subtitle: code?.substring(0, 50) + '...',
              };
            },
          },
        }),
        defineArrayMember({
          name: 'callout',
          type: 'object',
          title: 'Callout',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Type',
              options: {
                list: [
                  { title: 'Info', value: 'info' },
                  { title: 'Warning', value: 'warning' },
                  { title: 'Success', value: 'success' },
                  { title: 'Error', value: 'error' },
                  { title: 'Tip', value: 'tip' },
                ],
              },
              initialValue: 'info',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
            {
              name: 'content',
              type: 'text',
              title: 'Content',
              rows: 3,
            },
          ],
          preview: {
            select: {
              type: 'type',
              title: 'title',
              content: 'content',
            },
            prepare({ type, title, content }) {
              return {
                title: title || type?.charAt(0).toUpperCase() + type?.slice(1),
                subtitle: content?.substring(0, 50),
              };
            },
          },
        }),
        defineArrayMember({
          name: 'youtube',
          type: 'object',
          title: 'YouTube Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'YouTube URL',
              description: 'Full YouTube video URL',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
          preview: {
            select: {
              url: 'url',
              caption: 'caption',
            },
            prepare({ url, caption }) {
              return {
                title: 'YouTube Video',
                subtitle: caption || url,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'meta',
      description: 'Manually set if you make significant updates',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Guide', value: 'guide' },
          { title: 'Review', value: 'review' },
          { title: 'Retrospective', value: 'retrospective' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Announcement', value: 'announcement' },
          { title: 'Deep Dive', value: 'deep-dive' },
        ],
      },
    }),
    defineField({
      name: 'relatedTalk',
      title: 'Related Talk',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'talk' }],
      description: 'Link to a talk if this post is based on or related to one',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Show this post prominently on the blog page',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Set to true to make this post publicly visible',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'meta',
      description: 'Override the default title for SEO (max 60 characters)',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'meta',
      rows: 2,
      description: 'Override the excerpt for SEO (max 160 characters)',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'meta',
      description: 'Custom image for social sharing (defaults to cover image)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      published: 'published',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare({ title, publishedAt, published, featured, media }) {
      const status = [];
      if (!published) status.push('Draft');
      if (featured) status.push('Featured');
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No date';
      return {
        title,
        subtitle: `${date}${status.length ? ` | ${status.join(', ')}` : ''}`,
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
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
