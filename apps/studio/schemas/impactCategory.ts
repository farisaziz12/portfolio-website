import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'impactCategory',
  title: 'Impact Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
      description: 'An emoji to represent this category (e.g., 👥, 💰, 🎯)',
    }),
    defineField({
      name: 'color',
      title: 'Gradient Color',
      type: 'string',
      options: {
        list: [
          { title: 'Violet to Purple', value: 'from-violet-500 to-purple-600' },
          { title: 'Emerald to Teal', value: 'from-emerald-500 to-teal-600' },
          { title: 'Amber to Orange', value: 'from-amber-500 to-orange-600' },
          { title: 'Pink to Rose', value: 'from-pink-500 to-rose-600' },
          { title: 'Blue to Indigo', value: 'from-blue-500 to-indigo-600' },
          { title: 'Accent (Default)', value: 'from-accent to-accent-dark' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
      order: 'order',
    },
    prepare({ title, icon, order }) {
      return {
        title: `${icon || ''} ${title}`.trim(),
        subtitle: `Order: ${order ?? 0}`,
      };
    },
  },
});
