import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'socialPost',
  title: 'Social Post',
  type: 'document',
  fields: [
    defineField({
      name: 'url',
      title: 'Post URL',
      type: 'url',
      description: 'Link to the LinkedIn or Twitter/X post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Twitter/X', value: 'twitter' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Name',
      type: 'string',
      description: 'Who wrote this post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorHandle',
      title: 'Author Handle',
      type: 'string',
      description: '@handle or LinkedIn profile name',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Profile picture of the post author',
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role/Title',
      type: 'string',
      description: 'e.g., "Senior Engineer at Google", "Conference Organizer", "Tech Lead"',
    }),
    defineField({
      name: 'postImage',
      title: 'Post Screenshot',
      type: 'image',
      options: { hotspot: true },
      description: 'Screenshot of the post (recommended for best display)',
    }),
    defineField({
      name: 'content',
      title: 'Post Content',
      type: 'text',
      rows: 4,
      description: 'Copy the text content of the post (for display fallback and SEO)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tweetId',
      title: 'Tweet ID',
      type: 'string',
      description: 'For Twitter/X: the numeric ID from the URL (e.g., 1234567890123456789)',
      hidden: ({ parent }) => parent?.platform !== 'twitter',
    }),
    defineField({
      name: 'postDate',
      title: 'Post Date',
      type: 'date',
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'string',
      options: {
        list: [
          { title: 'About a Talk', value: 'talk' },
          { title: 'About My Work', value: 'work' },
          { title: 'Recommendation', value: 'recommendation' },
          { title: 'Mention', value: 'mention' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'relatedTalk',
      title: 'Related Talk',
      type: 'reference',
      to: [{ type: 'talk' }],
      description: 'If this post is about a specific talk',
    }),
    defineField({
      name: 'relatedEvent',
      title: 'Related Event',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'If this post is about a specific event',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'postDate', direction: 'desc' },
      ],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: 'postDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      author: 'author',
      content: 'content',
      platform: 'platform',
      media: 'authorImage',
      featured: 'featured',
    },
    prepare({ author, content, platform, media, featured }) {
      const truncated = content?.length > 60 ? `${content.slice(0, 60)}...` : content;
      const platformIcon = platform === 'linkedin' ? '💼' : '𝕏';
      return {
        title: `${platformIcon} ${author}${featured ? ' ⭐' : ''}`,
        subtitle: truncated,
        media,
      };
    },
  },
});
