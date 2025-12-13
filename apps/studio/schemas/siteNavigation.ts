import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteNavigation',
  title: 'Site Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Navigation Name',
      type: 'string',
      description: 'Internal name for this navigation (e.g., "Main Header", "Footer")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'identifier',
      title: 'Identifier',
      type: 'string',
      options: {
        list: [
          { title: 'Header Navigation', value: 'header' },
          { title: 'Footer Navigation', value: 'footer' },
          { title: 'Mobile Navigation', value: 'mobile' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Navigation Item',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Internal path (e.g., /about) or external URL',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'isExternal',
              title: 'External Link',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hasDropdown',
              title: 'Has Dropdown',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'dropdownItems',
              title: 'Dropdown Items',
              type: 'array',
              hidden: ({ parent }) => !parent?.hasDropdown,
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Label', type: 'string' },
                    { name: 'href', title: 'Link', type: 'string' },
                    { name: 'description', title: 'Description', type: 'string' },
                    { name: 'icon', title: 'Icon (emoji)', type: 'string' },
                    { name: 'isExternal', title: 'External Link', type: 'boolean', initialValue: false },
                  ],
                  preview: {
                    select: { label: 'label', icon: 'icon' },
                    prepare: ({ label, icon }) => ({
                      title: `${icon || ''} ${label}`.trim(),
                    }),
                  },
                },
              ],
            },
            {
              name: 'highlight',
              title: 'Highlight Style',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: 'none' },
                  { title: 'New Badge', value: 'new' },
                  { title: 'Primary Button', value: 'primary' },
                ],
              },
              initialValue: 'none',
            },
          ],
          preview: {
            select: {
              label: 'label',
              hasDropdown: 'hasDropdown',
              highlight: 'highlight',
            },
            prepare: ({ label, hasDropdown, highlight }) => ({
              title: label,
              subtitle: [
                hasDropdown ? '▼ Dropdown' : null,
                highlight === 'primary' ? '🔘 Button' : null,
                highlight === 'new' ? '🆕 New' : null,
              ]
                .filter(Boolean)
                .join(' • ') || 'Link',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'href', title: 'Link', type: 'string' },
        { name: 'isExternal', title: 'External Link', type: 'boolean', initialValue: false },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      identifier: 'identifier',
    },
    prepare: ({ title, identifier }) => ({
      title,
      subtitle: identifier,
    }),
  },
});
