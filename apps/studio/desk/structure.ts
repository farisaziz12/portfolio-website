import type { StructureBuilder } from 'sanity/structure';

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Speaker Profile (singleton - quick access)
      S.listItem()
        .title('Speaker Profile')
        .id('speakerProfile')
        .child(
          S.document()
            .schemaType('speakerProfile')
            .documentId('speakerProfile')
            .title('Speaker Profile')
        ),

      S.divider(),

      // Speaking & Events
      S.listItem()
        .title('Speaking')
        .child(
          S.list()
            .title('Speaking Content')
            .items([
              S.listItem()
                .title('Talks')
                .schemaType('talk')
                .child(S.documentTypeList('talk').title('Talks')),
              S.listItem()
                .title('Workshops')
                .schemaType('workshop')
                .child(S.documentTypeList('workshop').title('Workshops')),
              S.listItem()
                .title('Events')
                .schemaType('event')
                .child(
                  S.list()
                    .title('Events')
                    .items([
                      S.listItem()
                        .title('All Events')
                        .child(
                          S.documentTypeList('event')
                            .title('All Events')
                            .defaultOrdering([{ field: 'date', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('Upcoming Events')
                        .child(
                          S.documentList()
                            .title('Upcoming Events')
                            .filter('_type == "event" && date >= now()')
                            .defaultOrdering([{ field: 'date', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Past Events')
                        .child(
                          S.documentList()
                            .title('Past Events')
                            .filter('_type == "event" && date < now()')
                            .defaultOrdering([{ field: 'date', direction: 'desc' }])
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // Portfolio
      S.listItem()
        .title('Portfolio')
        .child(
          S.list()
            .title('Portfolio')
            .items([
              S.listItem()
                .title('Projects')
                .schemaType('project')
                .child(S.documentTypeList('project').title('Projects')),
              S.listItem()
                .title('Companies')
                .schemaType('company')
                .child(
                  S.documentTypeList('company')
                    .title('Companies')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // Media & Social Proof
      S.listItem()
        .title('Media & Social')
        .child(
          S.list()
            .title('Media & Social')
            .items([
              S.listItem()
                .title('Media Gallery')
                .schemaType('media')
                .child(
                  S.list()
                    .title('Media Gallery')
                    .items([
                      S.listItem()
                        .title('All Media')
                        .child(S.documentTypeList('media').title('All Media')),
                      S.listItem()
                        .title('Featured Media')
                        .child(
                          S.documentList()
                            .title('Featured Media')
                            .filter('_type == "media" && featured == true')
                        ),
                      S.listItem()
                        .title('Photos')
                        .child(
                          S.documentList()
                            .title('Photos')
                            .filter('_type == "media" && type == "photo"')
                        ),
                    ])
                ),
              S.listItem()
                .title('Testimonials')
                .schemaType('testimonial')
                .child(S.documentTypeList('testimonial').title('Testimonials')),
              S.listItem()
                .title('Social Posts')
                .schemaType('socialPost')
                .child(
                  S.documentTypeList('socialPost')
                    .title('Social Posts')
                    .defaultOrdering([{ field: 'postDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('External Posts')
                .schemaType('externalPost')
                .child(
                  S.documentTypeList('externalPost')
                    .title('External Posts')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // Impact Metrics
      S.listItem()
        .title('Impact')
        .child(
          S.list()
            .title('Impact')
            .items([
              // Impact Page Settings (singleton)
              S.listItem()
                .title('Page Settings')
                .id('impactPage')
                .child(
                  S.document()
                    .schemaType('impactPage')
                    .documentId('impactPage')
                    .title('Impact Page Settings')
                ),
              S.divider(),
              // Enhanced Metrics (V2)
              S.listItem()
                .title('Impact Metrics (Enhanced)')
                .schemaType('impactMetricV2')
                .child(
                  S.list()
                    .title('Impact Metrics')
                    .items([
                      S.listItem()
                        .title('All Metrics')
                        .child(
                          S.documentTypeList('impactMetricV2')
                            .title('All Metrics')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('By Domain')
                        .child(
                          S.list()
                            .title('By Domain')
                            .items([
                              S.listItem()
                                .title('Community')
                                .child(
                                  S.documentList()
                                    .title('Community Metrics')
                                    .filter('_type == "impactMetricV2" && domain == "community"')
                                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                                ),
                              S.listItem()
                                .title('Product / Monetization')
                                .child(
                                  S.documentList()
                                    .title('Product Metrics')
                                    .filter('_type == "impactMetricV2" && domain == "product"')
                                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                                ),
                              S.listItem()
                                .title('Engineering Leadership')
                                .child(
                                  S.documentList()
                                    .title('Leadership Metrics')
                                    .filter('_type == "impactMetricV2" && domain == "leadership"')
                                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                                ),
                              S.listItem()
                                .title('Speaking')
                                .child(
                                  S.documentList()
                                    .title('Speaking Metrics')
                                    .filter('_type == "impactMetricV2" && domain == "speaking"')
                                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                                ),
                            ])
                        ),
                      S.listItem()
                        .title('Featured Metrics')
                        .child(
                          S.documentList()
                            .title('Featured Metrics')
                            .filter('_type == "impactMetricV2" && featured == true')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Highlight Strip')
                        .child(
                          S.documentList()
                            .title('Highlight Strip Metrics')
                            .filter('_type == "impactMetricV2" && highlightStrip == true')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                    ])
                ),
              S.divider(),
              // Legacy metrics (original schema)
              S.listItem()
                .title('Legacy Metrics')
                .child(
                  S.list()
                    .title('Legacy Impact Metrics')
                    .items([
                      S.listItem()
                        .title('Categories')
                        .schemaType('impactCategory')
                        .child(
                          S.documentTypeList('impactCategory')
                            .title('Impact Categories')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Metrics')
                        .schemaType('impactMetric')
                        .child(
                          S.documentTypeList('impactMetric')
                            .title('Legacy Metrics')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Sponsors')
                        .child(
                          S.documentList()
                            .title('Sponsors')
                            .filter('_type == "impactMetric" && metricType == "sponsor"')
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // Services
      S.listItem()
        .title('Services')
        .child(
          S.list()
            .title('Services')
            .items([
              S.listItem()
                .title('Landing Pages (SEO)')
                .schemaType('serviceLandingPage')
                .child(
                  S.list()
                    .title('Service Landing Pages')
                    .items([
                      S.listItem()
                        .title('All Landing Pages')
                        .child(
                          S.documentTypeList('serviceLandingPage')
                            .title('All Landing Pages')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Published')
                        .child(
                          S.documentList()
                            .title('Published Landing Pages')
                            .filter('_type == "serviceLandingPage" && published == true')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Drafts')
                        .child(
                          S.documentList()
                            .title('Draft Landing Pages')
                            .filter('_type == "serviceLandingPage" && published != true')
                        ),
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Service Pages')
                .schemaType('servicePage')
                .child(S.documentTypeList('servicePage').title('Service Pages')),
              S.listItem()
                .title('Service Offers')
                .schemaType('serviceOffer')
                .child(
                  S.list()
                    .title('Service Offers')
                    .items([
                      S.listItem()
                        .title('All Offers')
                        .child(
                          S.documentTypeList('serviceOffer')
                            .title('All Offers')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Consulting Offers')
                        .child(
                          S.documentList()
                            .title('Consulting Offers')
                            .filter('_type == "serviceOffer" && serviceType == "consulting"')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                      S.listItem()
                        .title('Mentorship Offers')
                        .child(
                          S.documentList()
                            .title('Mentorship Offers')
                            .filter('_type == "serviceOffer" && serviceType == "mentorship"')
                            .defaultOrdering([{ field: 'order', direction: 'asc' }])
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // Site Settings
      S.listItem()
        .title('Site Settings')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              // Global Settings (singleton)
              S.listItem()
                .title('Global Settings')
                .id('siteSettings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Global Settings')
                ),
              S.listItem()
                .title('Navigation')
                .schemaType('siteNavigation')
                .child(S.documentTypeList('siteNavigation').title('Navigation')),
              S.listItem()
                .title('Pages')
                .schemaType('page')
                .child(S.documentTypeList('page').title('Pages')),
            ])
        ),
    ]);
