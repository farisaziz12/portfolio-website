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
    ...,
    "events": *[_type == "event" && type == "workshop" && title match ^.title] | order(date desc) {
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
    ...
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
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    author,
    role,
    company,
    image,
    source,
    context,
    featured
  }
`;

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(_createdAt desc)[0...6] {
    _id,
    quote,
    author,
    role,
    company,
    image,
    context
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

// Pages
export const pageQuery = groq`
  *[_type == "page" && identifier == $identifier][0] {
    ...
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
