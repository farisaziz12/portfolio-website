import type { StructureBuilder, ListItemBuilder } from 'sanity/structure';

/**
 * Studio navigation, organised by what you are trying to do rather than by
 * schema type. Singletons open straight into their one document. Health
 * checks ("Needs attention") surface the content gaps that the site would
 * otherwise quietly paper over with fallbacks.
 */

const singleton = (S: StructureBuilder, type: string, title: string): ListItemBuilder =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

const typeList = (S: StructureBuilder, type: string, title: string, ordering?: { field: string; direction: 'asc' | 'desc' }[]) => {
  const list = S.documentTypeList(type).title(title);
  return S.listItem().title(title).schemaType(type).child(ordering ? list.defaultOrdering(ordering) : list);
};

const filtered = (S: StructureBuilder, title: string, filter: string, ordering?: { field: string; direction: 'asc' | 'desc' }[]) => {
  const list = S.documentList().title(title).filter(filter).apiVersion('2024-01-01');
  return S.listItem().title(title).child(ordering ? list.defaultOrdering(ordering) : list);
};

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'homePage', 'Home page'),
      singleton(S, 'speakerProfile', 'Profile & press kit'),
      singleton(S, 'availability', 'Availability'),

      S.divider(),

      S.listItem()
        .title('Speaking')
        .child(
          S.list()
            .title('Speaking')
            .items([
              typeList(S, 'talk', 'Talks', [{ field: 'order', direction: 'asc' }]),
              filtered(S, 'Talks on the catalogue (bookable)', '_type == "talk" && isBookable == true', [{ field: 'order', direction: 'asc' }]),
              filtered(S, 'Talks not bookable', '_type == "talk" && isBookable != true', [{ field: 'title', direction: 'asc' }]),
              typeList(S, 'workshop', 'Workshops'),
              S.divider(),
              filtered(S, 'Upcoming events', '_type == "event" && date >= now()', [{ field: 'date', direction: 'asc' }]),
              filtered(S, 'Past events', '_type == "event" && date < now()', [{ field: 'date', direction: 'desc' }]),
              typeList(S, 'eventSeries', 'Event series'),
              S.divider(),
              typeList(S, 'workshopInstance', 'Workshop deliveries (attendee pages)', [{ field: 'workshopDate', direction: 'desc' }]),
            ])
        ),

      S.listItem()
        .title('Writing & conversations')
        .child(
          S.list()
            .title('Writing & conversations')
            .items([
              typeList(S, 'blogPost', 'Posts on this site', [{ field: 'publishedAt', direction: 'desc' }]),
              typeList(S, 'externalPost', 'Published elsewhere (articles, podcasts, video)', [{ field: 'publishedAt', direction: 'desc' }]),
              filtered(S, 'Drafts', '_type == "blogPost" && published != true'),
            ])
        ),

      S.listItem()
        .title('Proof')
        .child(
          S.list()
            .title('Proof')
            .items([
              typeList(S, 'praise', 'Praise', [{ field: 'date', direction: 'desc' }]),
              typeList(S, 'metric', 'Metrics', [{ field: 'order', direction: 'asc' }]),
              typeList(S, 'community', 'Communities'),
              typeList(S, 'company', 'Career timeline', [{ field: 'order', direction: 'asc' }]),
              typeList(S, 'project', 'Projects'),
              typeList(S, 'media', 'Photos & media', [{ field: 'date', direction: 'desc' }]),
            ])
        ),

      S.listItem()
        .title('Services')
        .child(
          S.list()
            .title('Services')
            .items([
              typeList(S, 'serviceOffer', 'Offers', [{ field: 'order', direction: 'asc' }]),
              typeList(S, 'serviceLandingPage', 'SEO landing pages'),
            ])
        ),

      S.listItem()
        .title('Pages & settings')
        .child(
          S.list()
            .title('Pages & settings')
            .items([typeList(S, 'page', 'Pages (About)'), singleton(S, 'siteSettings', 'Site settings')])
        ),

      S.divider(),

      S.listItem()
        .title('Needs attention')
        .child(
          S.list()
            .title('Needs attention')
            .items([
              filtered(S, 'Events without sessions', '_type == "event" && count(coalesce(sessions, [])) == 0', [{ field: 'date', direction: 'desc' }]),
              filtered(S, 'Past sessions missing a recording', '_type == "event" && date < now() && count(sessions[role in ["speaker","keynote","lightning"] && !defined(recording.url) && status != "cancelled"]) > 0', [{ field: 'date', direction: 'desc' }]),
              filtered(S, 'Events without a country', '_type == "event" && location.isOnline != true && !defined(location.country)'),
              filtered(S, 'Talks without a pillar or summary', '_type == "talk" && isBookable == true && (!defined(pillar) || !defined(summary))'),
              filtered(S, 'Praise without a link or date', '_type == "praise" && ((!defined(url) && platform != "direct") || !defined(date))'),
              filtered(S, 'Metrics waiting for an OK', '_type == "metric" && status != "approved"'),
              filtered(S, 'Writing without a topic or format', '(_type == "blogPost" && !defined(topic)) || (_type == "externalPost" && (!defined(format) || !defined(topic)))'),
              filtered(S, 'Photos without alt or credit', '_type == "media" && type == "photo" && (!defined(image.alt) || !defined(credit))'),
            ])
        ),

      S.listItem()
        .title('Legacy (migrate, then delete)')
        .child(
          S.list()
            .title('Legacy V2 types')
            .items([
              typeList(S, 'socialPost', 'Social posts → Praise'),
              typeList(S, 'testimonial', 'Testimonials → Praise'),
              typeList(S, 'impactMetricV2', 'Impact metrics (enhanced) → Metric'),
              typeList(S, 'impactMetric', 'Impact metrics (v1) → Metric'),
              typeList(S, 'impactCategory', 'Impact categories (unused)'),
              typeList(S, 'impactPage', 'Impact page settings (unused)'),
              typeList(S, 'servicePage', 'Service page (unused)'),
              typeList(S, 'siteNavigation', 'Site navigation (unused)'),
            ])
        ),
    ]);
