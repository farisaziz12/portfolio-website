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
    title: "Ask Me Anything: Career Journey & Lessons Learned",
    type: "Meetup",
    conference: "Flatiron School",
    location: "New York, United States",
    date: "2024-07-18",
    description: "An AMA session at the Flatiron School campus in NYC's financial district. Join me as I share my career journey, lessons learned, mistakes to avoid, and how I've managed to get back on my feet every time I've stumbled. An incredible opportunity to give back to the community that helped shape my career and support new talent entering the software industry.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
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
    title: "The Art of Tech Talks",
    type: "Webinar",
    conference: "Bletchley Institute - Signal Boost",
    location: "Online",
    date: "2024-09-17",
    description: "An exciting and interactive session on mastering tech presentation skills. Covering how to prepare for your first tech talk, tips for connecting with your audience, and strategies to make your presentation stand out. Whether you're gearing up for your first conference or looking to polish your speaking skills, this session provides valuable insights and practical tips to enhance your presentation game.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
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
    title: "Ask Me Anything: Career Journey & Lessons Learned",
    type: "Meetup",
    conference: "Flatiron School",
    location: "New York, United States",
    date: "2025-02-13",
    description: "An AMA session at the Flatiron School campus in NYC's financial district. Join me as I share my career journey, lessons learned, mistakes to avoid, and how I've managed to get back on my feet every time I've stumbled. An incredible opportunity to give back to the community that helped shape my career and support new talent entering the software industry.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "From Fragile to Future-Proof: Solving Web Monetization Chaos with Payment Systems That Scale",
    type: "Meetup",
    conference: "Web Zurich",
    location: "Zurich, Switzerland",
    date: "2025-02-28",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance. I'll share real-world lessons from handling multi-gateway integrations, regulatory complexities, and millions in transactions, helping you design Frontend payment architectures that scale without breaking a sweat.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.meetup.com/web-zurich/events/305943582"
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
    title: "Frontend Architecture at Scale with Faris Aziz",
    type: "Podcast",
    conference: "Señors @ Scale",
    location: "Online",
    date: "2025-09-14",
    description: "Join me on the Señors @ Scale podcast where we dive deep into frontend architecture at scale. Discussing real-world challenges, architectural patterns, and strategies for building scalable frontend systems that can handle enterprise-level complexity.",
    slidesUrl: null,
    videoUrl: "https://www.youtube.com/watch?v=4AtijFQQIZY",
    eventUrl: "https://www.youtube.com/watch?v=4AtijFQQIZY"
  },
  {
    title: "From Fragile to Future-Proof: Solving Web Monetization Chaos with Payment Systems That Scale",
    type: "Conference",
    conference: "WhatTheStack",
    location: "Skopje, Macedonia",
    date: "2025-09-20",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance. I'll share real-world lessons from handling multi-gateway integrations, regulatory complexities, and millions in transactions, helping you design Frontend payment architectures that scale without breaking a sweat.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://wts.sh/"
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
    title: "From Fragile to Future-Proof: Solving Web Monetization Chaos with Payment Systems That Scale",
    type: "Conference",
    conference: "International JavaScript Conference",
    location: "Munich, Germany",
    date: "2025-10-28",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance. I'll share real-world lessons from handling multi-gateway integrations, regulatory complexities, and millions in transactions, helping you design Frontend payment architectures that scale without breaking a sweat.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://javascript-conference.com/munich/"
  },
  {
    title: "Caching, Payloads, and Other Dark Arts: A Frontend Engineer's Journey",
    type: "Conference",
    conference: "International JavaScript Conference",
    location: "Munich, Germany",
    date: "2025-10-28",
    description: "When your backend is untouchable but your frontend is falling apart—how do you fix the UX? In this talk, I'll share how we rescued a sluggish fintech dashboard using a BFF layer, smart caching, and real-world profiling, without touching a single backend line.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://javascript-conference.com/munich/"
  },
  {
    title: "Panel Moderator: Stripe Startup Leaders Dinner",
    type: "Meetup",
    conference: "Stripe",
    location: "Zurich, Switzerland",
    date: "2025-10-23",
    description: "Moderating a panel discussion at Stripe's exclusive startup leaders dinner, bringing together founders and tech leaders to discuss the future of payments and startup growth strategies.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "Guest Judge: Figma Make-a-thon",
    type: "Conference",
    conference: "Friends of Figma Zurich",
    location: "Zurich, Switzerland",
    date: "2025-10-25",
    description: "One day. One tool. Endless ways to Make. Serving as a guest judge for Figma's first Make-a-thon - a design jam meets hackathon where 35-40 makers build AI-powered prototypes in a single day. Evaluating projects across categories including Best Use of Figma AI, Most Impact, and People's Choice.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://friends.figma.com/events/details/figma-zurich-presents-figma-make-a-thon-a-community-jam-for-the-makers-at-heart/"
  },
  {
    title: "Real-World React: The Architectural Crash Course for Scalability, Resilience, and Observability (feat. Next.js)",
    type: "Workshop",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2025-11-12",
    description: "A 3-hour crash course covering essential production-ready patterns through rapid-fire lessons, hands-on exercises, and real-world examples. Learn architectural patterns that bring stability to your React applications before the winter code freeze sets in.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/workshops/react-architecture"
  },
  {
    title: "ZurichJS Pro Meetup: H(a)unt the gaps in your Apps",
    type: "Meetup",
    conference: "ZurichJS Pro",
    location: "Zurich, Switzerland",
    date: "2025-10-28",
    description: "Every web app has ghosts lurking in the shadows. This October, we'll shine a flashlight on the dark corners of modern web development, exploring how to hunt down hidden performance drains, invisible vulnerabilities, and subtle bugs waiting to strike.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/pro-zurichjs-meetup-9"
  },
  {
    title: "It Worked on My Machine: Debugging Without the Screenshot Olympics",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2025-11-13",
    description: "Every developer has lived their own version of 'it worked on my machine'. Mine involved a client who stayed after a CrossFit class so I could debug a broken payment flow with them, outdoors, on their laptop, armed with blurry WhatsApp screenshots and bug reports that made no sense. I even found myself explaining how to open the browser network tab to someone who'd never seen DevTools. In this talk, I'm bringing that same 2020 app back to life, a weekend React-and-Rails project held together by hope, to see how we'd tackle those same problems today. We'll look at how modern full-stack session recordings and AI-assisted IDEs turn that chaos into context in a world where we now ship vibe-coded apps faster than ever.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurichjs-10-1st-anniversary-special-edition"
  },
  {
    title: "Caching, Payloads, and Other Dark Arts: Optimizing UX in Suboptimal Conditions",
    type: "Conference",
    conference: "React Summit US",
    location: "New York, United States",
    date: "2025-11-18",
    description: "When your backend is untouchable but your frontend is falling apart—how do you fix the UX? In this talk, I'll share how we rescued a sluggish fintech dashboard using a BFF layer, smart caching, and real-world profiling, without touching a single backend line.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://reactsummit.us/#person-faris-aziz"
  },
  {
    title: "From Fragile to Future-Proof: Solving Web Monetization Chaos with Payment Systems That Scale",
    type: "Conference",
    conference: "JSNation US",
    location: "New York, United States",
    date: "2025-11-20",
    description: "When expanding into global markets, payment integration becomes a technical and strategic challenge. Relying on a single provider like Stripe is fantastic until you hit a certain scale, from reliability issues to compliance roadblocks. This talk explores payment orchestration—treating payments as a dynamic system rather than a static feature—to balance cost, conversion rates, and compliance.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "Engineering Without a Safety Net: Where It Works and Where It Hurts",
    type: "Meetup",
    conference: "Software Social NYC",
    location: "New York, United States",
    date: "2025-11-20",
    description: "Testing, monitoring, observability. They're rarely urgent, often skipped, and easy to dismiss when things are moving fast. But what's the real cost of deferring them, and how much can you actually get away with? This talk explores the tradeoffs of skipping traditional engineering practices in the name of speed, and what happens when you try to layer them in after a system has already scaled.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.meetup.com/sonarqube-nyc/events/311767372/"
  },
    {
    title: "ZurichJS X Supabase Social",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2025-12-08",
    description: "​No slides, no prep, no pressure. A relaxed night for people who build things, whether you are a founder, a CTO, or a developer who ships fast and figures things out along the way.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/zurichjs-supabase-dec-2025"
  },
  {
    title: "Caching, Payloads, and Other Dark Arts: Optimizing UX in Suboptimal Conditions",
    type: "Meetup",
    conference: "LisboaJS",
    location: "Lisbon, Portugal",
    date: "2025-12-18",
    description: "When your backend is untouchable but your frontend is falling apart—how do you fix the UX? In this talk, I'll share how we rescued a sluggish fintech dashboard using a BFF layer, smart caching, and real-world profiling, without touching a single backend line.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://luma.com/y8qe9gcc"
  },
  {
    title: "ZurichJS X Stripe: Navigating Payments in the New Year",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-01-22",
    description: "A special collaborative meetup with Stripe exploring payment technologies and strategies for the new year.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/jan-2026"
  },
  {
    title: "CityJS Singapore Community Meetup",
    type: "Meetup",
    conference: "CityJS Singapore",
    location: "Singapore",
    date: "2026-02-04",
    description: "Join us for a community meetup the day before the CityJS Singapore workshops, connecting with local developers and conference attendees.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://singapore.cityjsconf.org/"
  },
  {
    title: "From Zero to Production with TanStack Query",
    type: "Workshop",
    conference: "CityJS Singapore",
    location: "Singapore",
    date: "2026-02-05",
    description: "This workshop gives you a practical introduction to TanStack Query in modern React and Next.js apps. In three hours, you'll learn how to replace manual data fetching with a structured, cache-aware approach. We'll cover the fundamentals: setting it up, fetching and mutating data, caching, query invalidation, and how to handle loading and error states.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://singapore.cityjsconf.org/"
  },
  {
    title: "Real-World React: The Architectural Crash Course for Scalability, Resilience, and Observability (feat. Next.js)",
    type: "Workshop",
    conference: "CityJS Singapore",
    location: "Singapore",
    date: "2026-02-05",
    description: "A hands-on workshop exploring production-ready React and Next.js development. Learn practical performance optimization techniques, resilience patterns, and component architecture best practices. Through real-world examples, discover how to build maintainable applications that scale from startup to enterprise needs.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://singapore.cityjsconf.org/"
  },
  {
    title: "Performance Without Memoization, The Atomic Design Approach",
    type: "Conference",
    conference: "CityJS Singapore",
    location: "Singapore",
    date: "2026-02-06",
    description: "Most teams fight React performance with memoization band aids and prop drilling acrobatics. We obsess over useMemo and useCallback, sprinkle React.memo everywhere and hope for the best. Yet performance problems keep surfacing. The root issue is usually not missing memoization, it is misunderstood component architecture. This talk reveals how React’s reconciliation algorithm actually works, and how combining it with Atomic Design principles gives you a natural performance model without hacks. By structuring components around stability boundaries and predictable render surfaces, you avoid unnecessary re renders from the start and remove half the memo calls currently in your codebase. I will show real examples at scale, common reconciliation traps, measurable outcomes when refactoring with atomic boundaries and how to test and profile effectively. You will leave knowing where React pays attention, how to design with reconciliation in mind and why deleting memoization might be the fastest performance improvement you ship all year.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://singapore.cityjsconf.org/"
  },
  {
    title: "ZurichJS X Front Conference: Warm Up",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-02-26",
    description: "Official warm-up event for Front Conference, bringing together the JavaScript community before the main conference.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/feb-2026"
  },
  {
    title: "Master of Ceremonies",
    type: "Conference",
    conference: "Front Conference",
    location: "Zurich, Switzerland",
    date: "2026-02-27",
    description: "Serving as Master of Ceremonies for Front Conference, one of Switzerland's premier frontend development conferences.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://frontconference.com/"
  },
  {
    title: "ZurichJS X VDZ: Warm Up",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-03-23",
    description: "Official warm-up event for Voxxed Days Zurich, bringing together the JavaScript community before the main conference.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/march-2026"
  },
  {
    title: "Orchestrating Millions Across the Globe: Reactive Payments at Scale",
    type: "Conference",
    conference: "jsday",
    location: "Bologna, Italy",
    date: "2026-04-09",
    description: "When your platform expands into markets beyond your own and has ever growing monetization needs, 'just integrate Stripe' is easier said than done. Here's how looking at payments as technical orchestration rather than just a feature solves growth bottlenecks.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://www.jsday.it/"
  },
  {
    title: "ZurichJS X Stripe",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-04-23",
    description: "A special collaborative meetup with Stripe exploring payment technologies and strategies.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "ZurichJS Pro: May the Source Map Be With You",
    type: "Meetup",
    conference: "ZurichJS Pro",
    location: "Zurich, Switzerland",
    date: "2026-05-21",
    description: "A premium ZurichJS Pro Meetup featuring world-class speakers and exclusive content.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://zurichjs.com/events/may-2026"
  },
  {
    title: "ZurichJS X Stripe",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-06-18",
    description: "A special collaborative meetup with Stripe exploring payment technologies and strategies.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "ZurichJS Summer Social",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-07-23",
    description: "A relaxed summer social gathering for the Zurich JavaScript community.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "ZurichJS Conf Warm Up Meetup",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-09-09",
    description: "A special edition warm-up meetup to kick off the ZurichJS Conf conference week. Join us for an evening of community building, networking, and informal discussions.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "ZurichJS Conf 2026",
    type: "Conference",
    conference: "ZurichJS Conf",
    location: "Zurich, Switzerland",
    date: "2026-09-11",
    description: "The International Community Conference - four days of community building, learning, and networking. From grassroots meetups to cutting-edge technical sessions, bringing together JavaScript enthusiasts from around the world.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://conf.zurichjs.com/"
  },
  {
    title: "ZurichJS 2nd Anniversary Special",
    type: "Meetup",
    conference: "ZurichJS",
    location: "Zurich, Switzerland",
    date: "2026-11-19",
    description: "Celebrating two years of ZurichJS with a special anniversary meetup featuring community highlights and future plans.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: null
  },
  {
    title: "From Zero to Production with TanStack Query",
    type: "Workshop",
    conference: "CityJS London",
    location: "London, United Kingdom",
    date: "2026-04-15",
    description: "This workshop gives you a practical introduction to TanStack Query in modern React and Next.js apps. In three hours, you'll learn how to replace manual data fetching with a structured, cache-aware approach. We'll cover the fundamentals: setting it up, fetching and mutating data, caching, query invalidation, and how to handle loading and error states.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://london.cityjsconf.org/"
  },
  {
    title: "Conference Day (Talk TBA)",
    type: "Conference",
    conference: "CityJS London",
    location: "London, United Kingdom",
    date: "2026-04-16",
    description: "Speaking at CityJS London conference day. Talk to be determined.",
    slidesUrl: null,
    videoUrl: null,
    eventUrl: "https://london.cityjsconf.org/"
  },
];

export const uniqueCitiesCount = new Set(events.map(event => event.location)).size;

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