import groq from 'groq';

// Events
export const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    type,
    conference,
    date,
    endDate,
    location,
    description,
    "talk": talk->{
      _id,
      title,
      "slug": slug.current
    },
    links,
    featured
  }
`;

export const pastEventsQuery = groq`
  *[_type == "event" && date < now()] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    type,
    conference,
    date,
    location,
    description,
    "talk": talk->{
      _id,
      title,
      "slug": slug.current
    },
    links
  }
`;

export const allEventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    type,
    conference,
    date,
    location,
    description,
    "talk": talk->{
      _id,
      title,
      "slug": slug.current
    },
    links,
    featured
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    ...,
    "talk": talk->{
      _id,
      title,
      "slug": slug.current,
      abstract,
      duration,
      topics
    },
    "workshop": workshop->{
      _id,
      title,
      "slug": slug.current,
      description,
      duration
    },
    "relatedMedia": *[_type == "media" && references(^._id)] {
      _id,
      title,
      type,
      image,
      videoUrl
    }
  }
`;

// All talk slugs (for static path generation)
export const allTalkSlugsQuery = groq`
  *[_type == "talk" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// Talks - only bookable current versions (or standalone talks)
export const allTalksQuery = groq`
  *[_type == "talk" && isBookable == true && (isCurrentVersion == true || !defined(parentTalk))] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    abstract,
    audience,
    takeaways,
    topics,
    duration,
    version,
    isCurrentVersion,
    // Count events for this specific talk only
    "ownEventCount": count(*[_type == "event" && references(^._id)]),
    // Count all events across the entire talk family (this talk + parent + siblings + children)
    "eventCount": count(*[_type == "event" && (
      // Events for this talk
      references(^._id) ||
      // Events for parent talk (if this talk has a parent)
      (defined(^.parentTalk._ref) && references(^.parentTalk._ref)) ||
      // Events for sibling talks (talks with same parent)
      references(*[_type == "talk" && defined(^.^.parentTalk._ref) && defined(parentTalk._ref) && parentTalk._ref == ^.^.parentTalk._ref && _id != ^.^._id]._id) ||
      // Events for child talks (talks that have this talk as parent)
      references(*[_type == "talk" && defined(parentTalk._ref) && parentTalk._ref == ^.^._id]._id)
    )]),
    // Get the latest event from the entire family
    "latestEvent": *[_type == "event" && (
      references(^._id) ||
      (defined(^.parentTalk._ref) && references(^.parentTalk._ref)) ||
      references(*[_type == "talk" && defined(^.^.parentTalk._ref) && defined(parentTalk._ref) && parentTalk._ref == ^.^.parentTalk._ref && _id != ^.^._id]._id) ||
      references(*[_type == "talk" && defined(parentTalk._ref) && parentTalk._ref == ^.^._id]._id)
    )] | order(date desc)[0] {
      date,
      conference,
      "location": location.city
    },
    // Count of all versions in this talk family (only count if version relationships exist)
    "versionCount": count(*[_type == "talk" && (
      (defined(parentTalk._ref) && parentTalk._ref == ^._id) ||
      (defined(^.parentTalk._ref) && _id == ^.parentTalk._ref) ||
      (defined(^.parentTalk._ref) && defined(parentTalk._ref) && parentTalk._ref == ^.parentTalk._ref)
    )])
  }
`;

export const talkBySlugQuery = groq`
  *[_type == "talk" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    // Parent talk details (if this is a variation)
    "parentTalkDetails": parentTalk-> {
      _id,
      title,
      "slug": slug.current,
      version,
      firstDelivered
    },
    // Other versions of this talk (siblings + parent + children)
    "otherVersions": *[_type == "talk" && (
      // Siblings (same parent) - only match if both have the same defined parent
      (defined(^.parentTalk._ref) && defined(parentTalk._ref) && parentTalk._ref == ^.parentTalk._ref && _id != ^._id) ||
      // Parent (if we have one) - only match if current talk has a parent
      (defined(^.parentTalk._ref) && _id == ^.parentTalk._ref) ||
      // Children (if we are the parent) - only match talks that explicitly reference this talk
      (defined(parentTalk._ref) && parentTalk._ref == ^._id)
    )] | order(firstDelivered desc) {
      _id,
      title,
      "slug": slug.current,
      version,
      isCurrentVersion,
      firstDelivered,
      versionNotes,
      duration,
      "eventCount": count(*[_type == "event" && references(^._id)])
    },
    // Events where this specific version was delivered
    "events": *[_type == "event" && references(^._id)] | order(date desc) {
      _id,
      title,
      "slug": slug.current,
      date,
      conference,
      location,
      links
    },
    // All events across all versions of this talk family
    "allFamilyEvents": *[_type == "event" && (
      // Events for this talk
      references(^._id) ||
      // Events for parent talk
      (defined(^.parentTalk._ref) && references(^.parentTalk._ref)) ||
      // Events for sibling talks (same parent)
      references(*[_type == "talk" && defined(^.^.parentTalk._ref) && defined(parentTalk._ref) && parentTalk._ref == ^.^.parentTalk._ref && _id != ^.^._id]._id) ||
      // Events for child talks
      references(*[_type == "talk" && defined(parentTalk._ref) && parentTalk._ref == ^.^._id]._id)
    )] | order(date desc) {
      _id,
      title,
      "slug": slug.current,
      date,
      conference,
      location,
      links,
      "talkVersion": talk->{
        _id,
        title,
        "slug": slug.current,
        version
      }
    },
    "relatedMedia": *[_type == "media" && references(^._id)] {
      _id,
      title,
      type,
      image,
      videoUrl
    }
  }
`;

// Workshops
export const allWorkshopsQuery = groq`
  *[_type == "workshop"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    duration,
    technologies
  }
`;

export const workshopBySlugQuery = groq`
  *[_type == "workshop" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    duration,
    level,
    technologies,
    prerequisites,
    outcomes,
    isBookable,
    agenda[] {
      _key,
      title,
      "topic": title,
      duration,
      description
    },
    "upcomingEvents": *[_type == "event" && type == "workshop" && references(^._id) && date >= now()] | order(date asc) {
      _id,
      title,
      "slug": slug.current,
      date,
      conference,
      location
    },
    "pastEvents": *[_type == "event" && type == "workshop" && references(^._id) && date < now()] | order(date desc) {
      _id,
      title,
      "slug": slug.current,
      date,
      conference,
      location
    }
  }
`;

// Projects
export const allProjectsQuery = groq`
  *[_type == "project"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    technologies,
    image,
    links,
    featured
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(date desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    technologies,
    image,
    links
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    category,
    technologies,
    image,
    links,
    featured,
    role,
    outcomes,
    screenshots
  }
`;

// Companies
export const companiesQuery = groq`
  *[_type == "company"] | order(order asc) {
    _id,
    name,
    logo,
    industry,
    description,
    role,
    period,
    url,
    highlight
  }
`;

// Media
export const allMediaQuery = groq`
  *[_type == "media"] | order(date desc) {
    _id,
    title,
    type,
    image,
    videoUrl,
    date,
    location,
    description,
    "event": event->{
      _id,
      title,
      "slug": slug.current
    },
    credit,
    featured
  }
`;

export const featuredMediaQuery = groq`
  *[_type == "media" && featured == true] | order(date desc)[0...12] {
    _id,
    title,
    type,
    image,
    videoUrl,
    description,
    "event": event->{
      title,
      "slug": slug.current
    }
  }
`;

// Testimonials
export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(date desc, _createdAt desc) {
    _id,
    type,
    quote,
    author,
    role,
    company,
    image,
    rating,
    source,
    context,
    date,
    featured
  }
`;

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(date desc, _createdAt desc)[0...6] {
    _id,
    type,
    quote,
    author,
    role,
    company,
    image,
    rating,
    source,
    context,
    date
  }
`;

// Social Posts
export const allSocialPostsQuery = groq`
  *[_type == "socialPost"] | order(order asc, postDate desc) {
    _id,
    url,
    platform,
    author,
    authorHandle,
    authorImage,
    authorRole,
    content,
    postDate,
    context,
    "relatedTalk": relatedTalk->{
      _id,
      title,
      "slug": slug.current
    },
    "relatedEvent": relatedEvent->{
      _id,
      title,
      "slug": slug.current,
      conference
    },
    featured
  }
`;

export const featuredSocialPostsQuery = groq`
  *[_type == "socialPost" && featured == true] | order(order asc, postDate desc)[0...12] {
    _id,
    url,
    platform,
    author,
    authorHandle,
    authorImage,
    authorRole,
    postImage,
    content,
    tweetId,
    postDate,
    context,
    "relatedTalk": relatedTalk->{
      title,
      "slug": slug.current
    },
    "relatedEvent": relatedEvent->{
      title,
      "slug": slug.current,
      conference
    }
  }
`;

// Social posts for a specific talk (including all versions in the talk family)
export const socialPostsForTalkQuery = groq`
  *[_type == "socialPost" && defined(relatedTalk._ref) && (
    relatedTalk._ref == $talkId ||
    relatedTalk._ref in *[_type == "talk" && parentTalk._ref == $talkId]._id ||
    relatedTalk._ref == *[_type == "talk" && _id == $talkId][0].parentTalk._ref
  )] | order(postDate desc) {
    _id,
    url,
    platform,
    author,
    authorHandle,
    authorImage,
    authorRole,
    content,
    postDate
  }
`;

// Social posts for a specific event
export const socialPostsForEventQuery = groq`
  *[_type == "socialPost" && defined(relatedEvent._ref) && relatedEvent._ref == $eventId] | order(postDate desc) {
    _id,
    url,
    platform,
    author,
    authorHandle,
    authorImage,
    authorRole,
    content,
    postDate
  }
`;

// External Posts
export const externalPostsQuery = groq`
  *[_type == "externalPost"] | order(publishedAt desc) {
    _id,
    title,
    url,
    type,
    publishedAt,
    source,
    excerpt,
    image
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Blog Posts (Self-hosted)
// ─────────────────────────────────────────────────────────────────────────────

// All published blog posts (for listing)
export const allBlogPostsQuery = groq`
  *[_type == "blogPost" && published == true] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage {
      asset->,
      alt
    },
    publishedAt,
    updatedAt,
    tags,
    category,
    featured,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

// Featured blog posts
export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && published == true && featured == true] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage {
      asset->,
      alt
    },
    publishedAt,
    tags,
    category,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

// All blog post slugs (for static path generation)
export const allBlogPostSlugsQuery = groq`
  *[_type == "blogPost" && published == true] {
    "slug": slug.current
  }
`;

// Single blog post by slug (full content)
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && published == true][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage {
      asset->,
      alt
    },
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    publishedAt,
    updatedAt,
    tags,
    category,
    "relatedTalk": relatedTalk->{
      _id,
      title,
      "slug": slug.current,
      abstract
    },
    seoTitle,
    seoDescription,
    "ogImage": ogImage {
      asset->,
      alt
    },
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200),
    "wordCount": length(pt::text(body)) / 5,
    "relatedPosts": *[_type == "blogPost" && published == true && slug.current != $slug && (
      count((tags[])[@ in ^.tags[]]) > 0 ||
      category == ^.category
    )] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "coverImage": coverImage {
        asset->,
        alt
      },
      publishedAt,
      category,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200)
    }
  }
`;

// Blog posts by category
export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPost" && published == true && category == $category] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage {
      asset->,
      alt
    },
    publishedAt,
    tags,
    category,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

// Blog posts by tag
export const blogPostsByTagQuery = groq`
  *[_type == "blogPost" && published == true && $tag in tags] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage {
      asset->,
      alt
    },
    publishedAt,
    tags,
    category,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 200)
  }
`;

// Pages
export const pageQuery = groq`
  *[_type == "page" && identifier == $identifier][0] {
    _id,
    identifier,
    title,
    subtitle,
    content,
    heroImage,
    seo,
    // About page specific fields
    aboutHero {
      greeting,
      name,
      role,
      location,
      bio,
      specialties,
      badges[] {
        icon,
        label
      },
      linkedinUrl
    },
    aboutWhatIDo {
      title,
      subtitle,
      activities[] {
        _key,
        title,
        description,
        icon,
        tags,
        featured
      }
    },
    aboutJourney {
      title,
      subtitle,
      milestones[] {
        _key,
        title,
        description,
        emoji,
        fullWidth
      }
    },
    aboutSkills {
      title,
      subtitle,
      categories[] {
        _key,
        category,
        icon,
        items
      }
    },
    aboutCta {
      statusText,
      title,
      description,
      primaryCtaText,
      primaryCtaUrl,
      secondaryCtaText,
      secondaryCtaUrl
    }
  }
`;

// Speaker Profile (singleton)
export const speakerProfileQuery = groq`
  *[_type == "speakerProfile"] | order(_updatedAt desc)[0] {
    ...
  }
`;

// Speaking Stats (computed)
export const speakingStatsQuery = groq`{
  "totalEvents": count(*[_type == "event"]),
  "upcomingEvents": count(*[_type == "event" && date >= now()]),
  "countries": count(array::unique(*[_type == "event"].location.country)),
  "cities": count(array::unique(*[_type == "event"].location.city)),
  "talks": count(*[_type == "talk"]),
  "workshops": count(*[_type == "workshop"])
}`;

// Impact Metrics
export const featuredImpactMetricsQuery = groq`
  *[_type == "impactMetric" && featured == true && metricType != "sponsor"] | order(order asc)[0...6] {
    _id,
    label,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      icon,
      color
    },
    metricType,
    value,
    prefix,
    suffix,
    unit,
    timeWindow,
    previousValue,
    highlightColor,
    sourceNote,
    sourceUrl
  }
`;

export const allImpactMetricsQuery = groq`{
  "categories": *[_type == "impactCategory"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    icon,
    color,
    description,
    "metrics": *[_type == "impactMetric" && metricType != "sponsor" && references(^._id)] | order(order asc) {
      _id,
      label,
      metricType,
      value,
      prefix,
      suffix,
      unit,
      timeWindow,
      previousValue,
      featured,
      highlightColor,
      sourceNote,
      sourceUrl,
      lastUpdated,
      proofItems[] {
        type,
        title,
        description,
        image,
        url,
        "testimonial": testimonialRef->{
          _id,
          quote,
          author,
          role,
          company
        }
      }
    }
  },
  "sponsors": *[_type == "impactMetric" && metricType == "sponsor"] | order(order asc) {
    _id,
    label,
    sponsorLogo,
    sponsorName,
    sponsorUrl,
    "category": category->{
      title,
      icon
    }
  }
}`;

export const impactMetricsByCategoryQuery = groq`
  *[_type == "impactMetric" && metricType != "sponsor" && category->slug.current == $categorySlug] | order(order asc) {
    _id,
    label,
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      icon,
      color
    },
    metricType,
    value,
    prefix,
    suffix,
    unit,
    timeWindow,
    previousValue,
    featured,
    highlightColor,
    sourceNote,
    sourceUrl,
    lastUpdated,
    proofItems[] {
      type,
      title,
      description,
      image,
      url,
      "testimonial": testimonialRef->{
        _id,
        quote,
        author,
        role,
        company
      }
    }
  }
`;

// Site Navigation
export const siteNavigationQuery = groq`
  *[_type == "siteNavigation" && identifier == $identifier][0] {
    _id,
    title,
    identifier,
    items[] {
      label,
      href,
      isExternal,
      hasDropdown,
      dropdownItems[] {
        label,
        href,
        description,
        icon,
        isExternal
      },
      highlight
    },
    ctaButton {
      label,
      href,
      isExternal
    }
  }
`;

// Service Offers
export const allServiceOffersQuery = groq`
  *[_type == "serviceOffer"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    serviceType,
    shortDescription,
    bestFor,
    outcomes,
    engagementFormat,
    showPricing,
    priceFrom,
    priceCurrency,
    priceUnit,
    bookingUrl,
    bookingLabel,
    proofLinks[] {
      label,
      url,
      type
    },
    featured,
    order
  }
`;

export const consultingOffersQuery = groq`
  *[_type == "serviceOffer" && serviceType == "consulting"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    serviceType,
    shortDescription,
    bestFor,
    outcomes,
    engagementFormat,
    showPricing,
    priceFrom,
    priceCurrency,
    priceUnit,
    bookingUrl,
    bookingLabel,
    proofLinks[] {
      label,
      url,
      type
    },
    featured,
    order
  }
`;

export const mentorshipOffersQuery = groq`
  *[_type == "serviceOffer" && serviceType == "mentorship"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    serviceType,
    shortDescription,
    bestFor,
    outcomes,
    engagementFormat,
    showPricing,
    priceFrom,
    priceCurrency,
    priceUnit,
    bookingUrl,
    bookingLabel,
    proofLinks[] {
      label,
      url,
      type
    },
    featured,
    order
  }
`;

export const featuredServiceOffersQuery = groq`
  *[_type == "serviceOffer" && featured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    serviceType,
    shortDescription,
    bestFor,
    outcomes,
    engagementFormat,
    showPricing,
    priceFrom,
    priceCurrency,
    priceUnit,
    bookingUrl,
    bookingLabel,
    proofLinks[] {
      label,
      url,
      type
    },
    featured,
    order
  }
`;

// Service Pages
export const servicePageQuery = groq`
  *[_type == "servicePage" && pageType == $pageType][0] {
    _id,
    pageType,
    heroTagline,
    heroTitle,
    heroSubtitle,
    heroBullets,
    primaryCtaLabel,
    primaryCtaUrl,
    secondaryCtaLabel,
    secondaryCtaUrl,
    consultingCard {
      title,
      description,
      forWhom,
      icon
    },
    mentorshipCard {
      title,
      description,
      forWhom,
      icon
    },
    howItWorks[] {
      step,
      title,
      description
    },
    faq[] {
      question,
      answer
    },
    "featuredOffers": featuredOffers[]-> {
      _id,
      title,
      "slug": slug.current,
      serviceType,
      shortDescription,
      bestFor,
      outcomes,
      engagementFormat,
      showPricing,
      priceFrom,
      priceCurrency,
      priceUnit,
      bookingUrl,
      bookingLabel,
      proofLinks[] {
        label,
        url,
        type
      }
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Site Settings (singleton)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteTitle,
    tagline,
    siteUrl,
    metaTitle,
    metaDescription,
    defaultMetaDescription,
    keywords,
    ogImage,
    twitterHandle,
    linkedinUrl,
    githubUrl,
    youtubeUrl
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Impact Explorer Queries (V2)
// ─────────────────────────────────────────────────────────────────────────────

// Impact Page Settings (singleton)
export const impactPageQuery = groq`
  *[_type == "impactPage"][0] {
    heroHeadline,
    heroSubheadline,
    heroTagline,
    defaultDomain,
    defaultLens,
    "highlightStripMetrics": highlightStripMetrics[]->{
      _id,
      title,
      "slug": slug.current,
      domain,
      headlineNumber,
      unit,
      prefix,
      label,
      highlightColor
    },
    seoTitle,
    seoDescription
  }
`;

// All Impact Metrics V2 with full lens content
export const allImpactMetricsV2Query = groq`
  *[_type == "impactMetricV2"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    domain,
    headlineNumber,
    unit,
    prefix,
    label,
    timeWindow,
    delta,
    contextNote,
    confidenceSource,
    outcomesBlock {
      headline,
      body
    },
    howBlock {
      headline,
      body
    },
    proofBlock {
      headline,
      items[] {
        type,
        label,
        url,
        image,
        quote,
        quoteAuthor,
        sourceNote,
        tag
      }
    },
    story,
    actionLinks[] {
      type,
      label,
      url
    },
    featured,
    highlightStrip,
    order,
    highlightColor
  }
`;

// Impact Metrics V2 by domain
export const impactMetricsV2ByDomainQuery = groq`
  *[_type == "impactMetricV2" && domain == $domain] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    domain,
    headlineNumber,
    unit,
    prefix,
    label,
    timeWindow,
    delta,
    contextNote,
    confidenceSource,
    outcomesBlock {
      headline,
      body
    },
    howBlock {
      headline,
      body
    },
    proofBlock {
      headline,
      items[] {
        type,
        label,
        url,
        image,
        quote,
        quoteAuthor,
        sourceNote,
        tag
      }
    },
    story,
    actionLinks[] {
      type,
      label,
      url
    },
    featured,
    highlightStrip,
    order,
    highlightColor
  }
`;

// Featured Impact Metrics V2 (for hero section)
export const featuredImpactMetricsV2Query = groq`
  *[_type == "impactMetricV2" && featured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    domain,
    headlineNumber,
    unit,
    prefix,
    label,
    timeWindow,
    delta,
    contextNote,
    highlightColor
  }
`;

// Single Impact Metric V2 by slug (for deep linking)
export const impactMetricV2BySlugQuery = groq`
  *[_type == "impactMetricV2" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    domain,
    headlineNumber,
    unit,
    prefix,
    label,
    timeWindow,
    delta,
    contextNote,
    confidenceSource,
    outcomesBlock {
      headline,
      body
    },
    howBlock {
      headline,
      body
    },
    proofBlock {
      headline,
      items[] {
        type,
        label,
        url,
        image,
        quote,
        quoteAuthor,
        sourceNote,
        tag
      }
    },
    story,
    actionLinks[] {
      type,
      label,
      url
    },
    featured,
    highlightStrip,
    order,
    highlightColor
  }
`;

// ============================================================================
// SERVICE LANDING PAGES
// ============================================================================

// All published service landing pages (for getStaticPaths)
export const allServiceLandingPagesQuery = groq`
  *[_type == "serviceLandingPage" && published == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

// Single service landing page by slug
export const serviceLandingPageBySlugQuery = groq`
  *[_type == "serviceLandingPage" && slug.current == $slug && published == true][0] {
    _id,
    title,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    seoKeywords,
    ogImage,
    heroTagline,
    heroHeadline,
    heroSubheadline,
    heroPrimaryCta {
      text,
      url
    },
    heroSecondaryCta {
      text,
      url
    },
    problemTitle,
    painPoints[] {
      _key,
      title,
      description
    },
    expertiseTitle,
    expertiseAreas[] {
      _key,
      title,
      description,
      icon
    },
    servicesTitle,
    serviceOfferings[] {
      _key,
      name,
      bestFor,
      includes,
      outcome,
      highlightColor
    },
    audienceTitle,
    personas[] {
      _key,
      title,
      description,
      icon
    },
    proofTitle,
    stats[] {
      _key,
      value,
      label
    },
    testimonials[]-> {
      _id,
      quote,
      author,
      role,
      company,
      avatar
    },
    faqTitle,
    faqs[] {
      _key,
      question,
      answer
    },
    ctaHeadline,
    ctaSubheadline,
    ctaButtonText,
    ctaButtonUrl,
    ctaSecondaryText
  }
`;
