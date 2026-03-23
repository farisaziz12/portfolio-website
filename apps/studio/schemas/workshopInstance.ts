import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'workshopInstance',
  title: 'Workshop Instance',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Instance Title',
      type: 'string',
      description: 'e.g. "Real-World React — CityJS London 2026"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'workshopRef',
      title: 'Workshop Template',
      type: 'reference',
      to: [{ type: 'workshop' }],
      description: 'Which workshop template this is an instance of'
    }),
    defineField({
      name: 'event',
      title: 'Event Name',
      type: 'string',
      description: 'e.g. "CityJS London 2026"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'token',
      title: 'Access Token',
      type: 'slug',
      description: 'Auto-generated from event name. Students access via faziz-dev.com/workshops/attend/[token]',
      options: {
        source: 'event',
        maxLength: 96,
        slugify: (input: string) => {
          const slug = input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          const rand = Math.random().toString(36).substring(2, 6)
          return `${slug}-${rand}`
        },
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'workshopDate',
      title: 'Workshop Date',
      type: 'datetime',
      description: 'Access opens at the start of this day (midnight local time)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'accessDurationDays',
      title: 'Access Duration (days)',
      type: 'number',
      description: 'How many days after the workshop date the materials stay accessible. Default 7.',
      initialValue: 7,
      validation: Rule => Rule.required().min(1).max(365)
    }),
    defineField({
      name: 'forceClose',
      title: 'Force Close',
      type: 'boolean',
      description: 'Emergency override — immediately closes access regardless of dates.',
      initialValue: false
    }),
    defineField({
      name: 'repoUrl',
      title: 'GitHub Repo URL',
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'overallFeedbackUrl',
      title: 'Overall Feedback Form URL (Tally)',
      type: 'url',
      description: 'Shown at the end of the attend page after all sections'
    }),
    defineField({
      name: 'emailCaptureEnabled',
      title: 'Email Capture Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Show the email opt-in form on the attend page'
    }),
    defineField({
      name: 'subscriberCount',
      title: 'Subscriber Count',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Auto-incremented when attendees submit the email gate'
    }),
    defineField({
      name: 'attendees',
      title: 'Attendees',
      type: 'array',
      hidden: true,
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'email', type: 'string', title: 'Email' },
          { name: 'subscribedAt', type: 'datetime', title: 'Subscribed At' }
        ]
      }]
    }),
    defineField({
      name: 'followUpSentAt',
      title: 'Follow-up Sent At',
      type: 'datetime',
      readOnly: true,
      description: 'Set automatically when follow-up emails are triggered from admin'
    }),
    defineField({
      name: 'sections',
      title: 'Workshop Sections',
      type: 'array',
      description: 'The content sections of the workshop — maps to Notion sub-pages',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'emoji',
            title: 'Emoji',
            type: 'string',
            description: 'Section emoji e.g. 🔥'
          },
          {
            name: 'title',
            title: 'Section Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'sectionFeedbackUrl',
            title: 'Section Feedback Form URL (Tally)',
            type: 'url',
            description: 'Optional per-section feedback form — shown collapsed after section content'
          },
          {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
              {
                type: 'block',
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H2', value: 'h2' },
                  { title: 'H3', value: 'h3' },
                  { title: 'H4', value: 'h4' },
                ],
                lists: [
                  { title: 'Bullet', value: 'bullet' },
                  { title: 'Number', value: 'number' },
                ],
                marks: {
                  decorators: [
                    { title: 'Bold', value: 'strong' },
                    { title: 'Italic', value: 'em' },
                    { title: 'Code', value: 'code' },
                  ],
                  annotations: [{
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{ name: 'href', type: 'url', title: 'URL' }]
                  }]
                }
              },
              { type: 'code' },
              { type: 'table' },
              {
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
                    type: 'array',
                    title: 'Content',
                    of: [
                      {
                        type: 'block',
                        styles: [{ title: 'Normal', value: 'normal' }],
                        lists: [],
                        marks: {
                          decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                            { title: 'Code', value: 'code' },
                          ],
                          annotations: [{
                            name: 'link',
                            type: 'object',
                            title: 'Link',
                            fields: [{ name: 'href', type: 'url', title: 'URL' }]
                          }]
                        }
                      }
                    ],
                  },
                ],
                preview: {
                  select: { type: 'type', title: 'title' },
                  prepare({ type, title }: { type?: string; title?: string }) {
                    return {
                      title: title || (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Callout'),
                    }
                  },
                },
              },
              {
                type: 'image',
                options: { hotspot: true },
                fields: [
                  {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    description: 'Describe the image for accessibility',
                  },
                  {
                    name: 'caption',
                    title: 'Caption',
                    type: 'string',
                  },
                ],
              }
            ]
          }
        ],
        preview: {
          select: { emoji: 'emoji', title: 'title' },
          prepare({ emoji, title }) {
            return { title: `${emoji || ''} ${title || 'Untitled'}`.trim() }
          }
        }
      }]
    })
  ],
  preview: {
    select: { title: 'title', event: 'event', workshopDate: 'workshopDate', forceClose: 'forceClose' },
    prepare({ title, event, workshopDate, forceClose }) {
      const date = workshopDate ? new Date(workshopDate).toLocaleDateString() : 'No date'
      const status = forceClose ? '🔴' : '🟢'
      return { title: `${status} ${title}`, subtitle: `${event} · ${date}` }
    }
  }
})
