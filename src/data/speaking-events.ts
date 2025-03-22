// data/speaking-events.js

// Helper function to create event slugs
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

export interface SpeakingEvent {
  title: string;
  type: 'Conference' | 'Workshop' | 'Meetup';
  conference: string;
  location: string;
  date: string;
  description: string;
  slidesUrl: string | null;
  videoUrl: string | null;
  eventUrl: string;
}

// Mock speaking events data
export const events: SpeakingEvent[] = [
    {
    title: "Data Fetching Unleashed: Next.js, React Query & their BFF",
    type: "Meetup",
    conference: "React Advanced London",
    location: "London, United Kingdom",
    date: "2024-02-22",
    description: "Explore how Next.js, React Query, and the Backend for Frontend pattern work together to create performant data fetching solutions. Through practical examples, learn how to leverage server rendering, efficient caching, and API optimization to build faster, more scalable React applications. Perfect for developers looking to master modern data fetching strategies.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://guild.host/events/react-advanced-london-zstd38"
  },
  {
    title: "Start Hack - Hackathon Mentor",
    type: "Conference",
    conference: "Start Hack",
    location: "St. Gallen, Switzerland",
    date: "2024-03-20",
    description: "I had the honor of serving as a Mentor at START Hack 2024, a premier hackathon event in St. Gallen, Switzerland, organized by START Global. This role allowed me to pursue my passion for supporting and guiding the next wave of tech innovators and entrepreneurs. Positioned at the intersection of technology and business, START Hack provided a perfect platform for over 500 students and budding talents to demonstrate their capabilities and for industry leaders to explore innovative solutions.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.startglobal.org/start-hack/home/"
  },
  {
    title: "React Performance Workshop",
    type: "Workshop",
    conference: "CityJS Athens",
    location: "Athens, Greece",
    date: "2024-04-24",
    description: "A hands-on workshop exploring production-ready React and Next.js development. Learn practical performance optimization techniques, resilience patterns, and component architecture best practices. Through real-world examples, discover how to build maintainable applications that scale from startup to enterprise needs.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://greece.cityjsconf.org/"
  },
  {
    title: "Data Fetching Unleashed: Next.js, React Query & their BFF",
    type: "Conference",
    conference: "CityJS Athens",
    location: "Athens, Greece",
    date: "2024-04-24",
    description: "Explore how Next.js, React Query, and the Backend for Frontend pattern work together to create performant data fetching solutions. Through practical examples, learn how to leverage server rendering, efficient caching, and API optimization to build faster, more scalable React applications. Perfect for developers looking to master modern data fetching strategies.",
    slidesUrl: null,
    videoUrl: "https://www.youtube.com/live/O3vJnQfdiJY?feature=shared&t=13173",
    eventUrl: "https://greece.cityjsconf.org/"
  },
  {
    title: "Data Fetching Unleashed: Next.js, React Query and their BFF",
    type: "Meetup",
    conference: "Zurich ReactJS Meetup",
    location: "Zurich, Switzerland",
    date: "2024-07-03",
    description: "Discover how to optimize frontend performance and resilience when working with challenging APIs. Through a fintech case study, learn practical strategies using Next.js, TanStack Query, and the Backend-for-Frontend pattern to tackle common issues like payload bloat, caching, and network efficiency.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.meetup.com/zurich-reactjs-meetup/events/300779542/?eventOrigin=group_events_list"
  },
  {
    title: "Data Fetching Unleashed: Next.js, React Query and their BFF",
    type: "Conference",
    conference: "React & Chill Conference",
    location: "Online",
    date: "2024-08-22",
    description: "Discover how to optimize frontend performance and resilience when working with challenging APIs. Through a fintech case study, learn practical strategies using Next.js, TanStack Query, and the Backend-for-Frontend pattern to tackle common issues like payload bloat, caching, and network efficiency.",
    slidesUrl: null,
    videoUrl: "https://www.youtube.com/watch?v=EV5wWqoYNjg",
    eventUrl: "https://reactandchill.live/"
  },
    {
    title: "Unleashing NextJS/React Performance & Resiliency",
    type: "Workshop",
    conference: "Reactjs day",
    location: "Verona, Italy",
    date: "2024-10-24",
    description: "This workshop will delve into React and NextJs to create scalable, high-performance web applications made for the real world, exploring architectural patterns, rendering techniques, and optimization strategies.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://2024.reactjsday.it/workshop/react_performance.html"
  },
    {
    title: "Solving Real World Data Fetching Challenges with Next.js and TanStack Query: A Pragmatic Case Study",
    type: "Conference",
    conference: "Voxxed Days Zurich",
    location: "Zurich, Switzerland",
    date: "2025-03-25",
    description: "Discover how to optimize frontend performance and resilience when working with challenging APIs. Through a fintech case study, learn practical strategies using Next.js, TanStack Query, and the Backend-for-Frontend pattern to tackle common issues like payload bloat, caching, and network efficiency.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurich.voxxeddays.com/speaker/?id=5821"
  },
  {
    title: "Solving Real World Data Fetching Challenges with Next.js and TanStack Query: A Pragmatic Case Study",
    type: "Conference",
    conference: "jsday",
    location: "Bologna, Italy",
    date: "2025-04-07",
    description: "Discover how to optimize frontend performance and resilience when working with challenging APIs. Through a fintech case study, learn practical strategies using Next.js, TanStack Query, and the Backend-for-Frontend pattern to tackle common issues like payload bloat, caching, and network efficiency.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.jsday.it/talks_speakers/"
  },
    {
    title: "Zurich JS Meetup #4: April stands for AI",
    type: "Meetup",
    conference: "Zurich JS",
    location: "Zurich, Switzerland",
    date: "2025-04-17",
    description: "Hosting the 4th Zurich JS Meetup with a focus on AI.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurichjs-5?utm_source=personal-site&utm_medium=contact-link&utm_campaign=js-community-2025"
  },
  {
    title: "Real-World React: The Architectural Playbook for Scalability, Resilience, and Observability (feat. Next.js)",
    type: "Workshop",
    conference: "CityJS London",
    location: "London, United Kingdom",
    date: "2025-04-24",
    description: "A hands-on workshop exploring production-ready React and Next.js development. Learn practical performance optimization techniques, resilience patterns, and component architecture best practices. Through real-world examples, discover how to build maintainable applications that scale from startup to enterprise needs.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://london.cityjsconf.org/talk/5EoBZeY6MVZDsrt68Vp3Tx"
  },
  {
    title: "Talk TBD",
    type: "Conference",
    conference: "CityJS London",
    location: "London, United Kingdom",
    date: "2025-04-25",
    description: "TBD",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://london.cityjsconf.org/"
  },
  {
    title: "Zurich JS Meetup #5: May the Code Be With You",
    type: "Meetup",
    conference: "Zurich JS",
    location: "Zurich, Switzerland",
    date: "2025-05-15",
    description: "Hosting the 5th Zurich JS Meetup.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurichjs-6"
  },
];

// Add slugs to all events
const eventsWithSlugs = events.map(event => ({
  ...event,
  slug: createSlug(`${event.title}-${event.conference}`)
}));

// Export a function to get all events
export const getSpeakingEvents = () => {
  return eventsWithSlugs;
};

// Export a function to get a specific event by slug
export const getSpeakingEventBySlug = (slug: string) => {
  return eventsWithSlugs.find(event => event.slug === slug);
};

// Export a function to get upcoming events
export const getUpcomingEvents = () => {
  const today = new Date();
  return eventsWithSlugs
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Export a function to get past events
export const getPastEvents = () => {
  const today = new Date();
  return eventsWithSlugs
    .filter(event => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first
};