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
  type: 'Conference' | 'Workshop' | 'Meetup' | 'Podcast' | 'Webinar';
  conference: string;
  location: string;
  date: string;
  description: string;
  slidesUrl: string | null;
  videoUrl: string | null;
  eventUrl: string | null;
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
    title: "From Fragile to Future-Proof: Solving Web Monetization Chaos with Payment Systems That Scale",
    type: "Conference",
    conference: "CityJS London",
    location: "London, United Kingdom",
    date: "2025-04-25",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance. I'll share real-world lessons from handling multi-gateway integrations, regulatory complexities, and millions in transactions, helping you design Frontend payment architectures that scale without breaking a sweat.",
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
  {
    title: "From Zero to Production with TanStack Query",
    type: "Workshop",
    conference: "CityJS Athens",
    location: "Athens, Greece",
    date: "2025-05-28",
    description: "This workshop gives you a practical introduction to TanStack Query in modern React and Next.js apps. In three hours, you'll learn how to replace manual data fetching with a structured, cache-aware approach using TanStack Query. We'll cover the fundamentals: setting it up, fetching and mutating data, caching, query invalidation, and how to handle loading and error states. You'll also see how TanStack Query helps with validation, simplifies state management, and moves your app closer to production readiness. No prior experience with TanStack Query is needed, but you should know React and be comfortable writing async code. You'll leave with a clear understanding of how and when to use TanStack Query in real projects.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://greece.cityjsconf.org/"
  },
  {
    title: "Engineering Without a Safety Net: Where It Works and Where It Hurts",
    type: "Conference",
    conference: "CityJS Athens",
    location: "Athens, Greece",
    date: "2025-05-29",
    description: "Testing, monitoring, observability. They're rarely urgent, often skipped, and easy to dismiss when things are moving fast. But what's the real cost of deferring them, and how much can you actually get away with? This talk explores the tradeoffs of skipping traditional engineering practices in the name of speed, and what happens when you try to layer them in after a system has already scaled. It's not about dogma or checklists, it's about pragmatism, risk, and timing.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://greece.cityjsconf.org/"
  },
  {
    title: "From Fragile to Future Proof: Solving Web Monetization Chaos with Payment Systems that Scale",
    type: "Conference",
    conference: "Frontend Nation",
    location: "Online",
    date: "2025-06-04",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance. I'll share real-world lessons from handling multi-gateway integrations, regulatory complexities, and millions in transactions, helping you design Frontend payment architectures that scale without breaking a sweat.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://frontendnation.com"
  },
  {
    title: "Zurich JS Meetup #6: June's Server Solstice",
    type: "Meetup",
    conference: "Zurich JS",
    location: "Zurich, Switzerland",
    date: "2025-06-19",
    description: "Hosting the 6th Zurich JS Meetup.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurich-js-meetup-6-june-s-server-solstice"
  },
  {
    title: "Building Real World React Applications",
    type: "Webinar",
    conference: "Webinar with Praveen",
    location: "Online",
    date: "2025-06-22",
    description: "A comprehensive webinar exploring practical approaches to building production-ready React applications. Learn about real-world challenges, best practices, and architectural patterns that make React applications scalable and maintainable.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "Faris Aziz @GYFF for Hapidev",
    type: "Podcast",
    conference: "GYFF",
    location: "Online",
    date: "2025-06-27",
    description: "Join me as I share my journey into software engineering, from CrossFit instructor to tech leader. I'll discuss how I transitioned into tech, built communities like ZurichJS, and developed my passion for mentoring and public speaking. Learn about the challenges, opportunities, and lessons learned along the way.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "Engineering Without a Safety Net: Where It Works and Where It Hurts",
    type: "Meetup",
    conference: "BKK.JS",
    location: "Bangkok, Thailand",
    date: "2025-07-11",
    description: "Testing, monitoring, observability. They're rarely urgent, often skipped, and easy to dismiss when things are moving fast. But what's the real cost of deferring them, and how much can you actually get away with? This talk explores the tradeoffs of skipping traditional engineering practices in the name of speed, and what happens when you try to layer them in after a system has already scaled. It's not about dogma or checklists, it's about pragmatism, risk, and timing.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.eventpop.me/e/96871/bkkjs-23"
  },
  {
    title: "From Fragile to Future-Proof: Solving Web Monetization Chaos with Payment Systems That Scale",
    type: "Meetup",
    conference: "VueJsTalks",
    location: "Online",
    date: "2025-07-16",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance. I'll share real-world lessons from handling multi-gateway integrations, regulatory complexities, and millions in transactions, helping you design Frontend payment architectures that scale without breaking a sweat.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://lu.ma/vuestic"
  },
  {
    title: "Zurich JS Meetup #7: Sizzling Hot JavaScript",
    type: "Meetup",
    conference: "Zurich JS",
    location: "Zurich, Switzerland",
    date: "2025-07-24",
    description: "Hosting the 7th Zurich JS Meetup.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurich-js-meetup-7-sizzling-hot-java-script"
  },
  {
    title: "Caching, Payloads, and Other Dark Arts: A Frontend Engineer's Journey",
    type: "Conference",
    conference: "Software Architecture Conference",
    location: "Online",
    date: "2025-08-05",
    description: "When your backend is untouchable but your frontend is falling apart—how do you fix the UX? In this talk, I'll share how we rescued a sluggish fintech dashboard using a BFF layer, smart caching, and real-world profiling, without touching a single backend line.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://softwarearchitecture.live/"
  },
  {
    title: "Zurich JS Meetup #8: Flare up your Performance",
    type: "Meetup",
    conference: "Zurich JS",
    location: "Zurich, Switzerland",
    date: "2025-09-10",
    description: "Hosting the 8th Zurich JS Meetup.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurich-js-meetup-8-flare-up-your-performance"
  },
  {
    title: "Solving Real World Data Fetching Challenges with Next.js and TanStack Query: A Pragmatic Case Study",
    type: "Conference",
    conference: "Voxxed Days Crete",
    location: "Crete, Greece",
    date: "2025-09-27",
    description: "Discover how to optimize frontend performance and resilience when working with challenging APIs. Through a fintech case study, learn practical strategies using Next.js, TanStack Query, and the Backend-for-Frontend pattern to tackle common issues like payload bloat, caching, and network efficiency.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://crete.voxxeddays.com/speaker-details/?id=1164"
  },
  {
    title: "Caching, Payloads, and Other Dark Arts: A Frontend Engineer's Journey",
    type: "Conference",
    conference: "React Summit US",
    location: "New York, United States",
    date: "2025-11-08",
    description: "When your backend is untouchable but your frontend is falling apart—how do you fix the UX? In this talk, I'll share how we rescued a sluggish fintech dashboard using a BFF layer, smart caching, and real-world profiling, without touching a single backend line.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://reactsummit.us/#person-faris-aziz"
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