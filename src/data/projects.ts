// data/projects.js

// Helper function to create project slugs
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// Mock projects data with details and showcase information
const projects = [
  // {
  //   id: 1,
  //   title: "WOD-WITH-ME",
  //   slug: "wod-with-me",
  //   description: "An all-in-one SaaS platform that allows fitness coaches to easily create fitness class schedules with full payment and booking integration.",
  //   longDescription: `
  //     WOD-WITH-ME is a comprehensive solution for fitness coaches looking to streamline their business operations. 
      
  //     The platform provides a seamless experience for managing class schedules, handling payments, and allowing clients to book sessions all in one place. 
      
  //     Key features include:
  //     - Calendar management with drag-and-drop functionality
  //     - Stripe integration for secure payment processing
  //     - Automated email notifications for bookings and reminders
  //     - Client management dashboard with attendance tracking
  //     - Responsive design for both coaches and clients
  //   `,
  //   technologies: ["NextJS", "React", "Node.js", "PostgreSQL", "Stripe", "TailwindCSS"],
  //   category: "SaaS",
  //   imageUrl: "/images/projects/wod-with-me.jpg",
  //   screenshots: [
  //     "/images/projects/wod-with-me-1.jpg",
  //     "/images/projects/wod-with-me-2.jpg",
  //     "/images/projects/wod-with-me-3.jpg"
  //   ],
  //   liveUrl: "https://wod-with-me.com",
  //   githubUrl: "https://github.com/farisaziz12/wod-with-me",
  //   featured: true,
  //   date: "2020-10-23",
  //   role: "Founder & Lead Developer",
  //   challenges: "Building a scalable booking system that could handle concurrent users and integrating with payment processors across different regions.",
  //   outcomes: "Successfully launched platform with over 2,000 users and helped dozens of coaches manage their fitness businesses more efficiently."
  // },
  {
    id: 2,
    title: "Raycast Extensions",
    slug: "raycast-extensions",
    description: "A collection of powerful productivity extensions for the Raycast app, including Growthbook, Coinbase Pro, and Everhour Time Tracking integrations.",
    longDescription: `
      As an Open Source Contributor to Raycast, I've developed and contributed several high-quality extensions that are available on the Raycast App Store.

      These extensions focus on enhancing productivity and seamless integration with popular tools and services, benefiting a wide range of users:

      - Growthbook Extension: Enables users to view feature flags directly within Raycast.
      - Coinbase Pro Extension: Allows users to view and manage portfolios, tracking cryptocurrency investments.
      - Everhour Time Tracking Extension: Integrates time tracking against projects within Raycast.
      - Stripe Extension: Provides quick access to essential Stripe functionalities.
      - Fake Financial Data Extension: Generates mock financial data for testing applications.
    `,
    technologies: ["React Native", "TypeScript", "Raycast API", "REST APIs", "Stripe", "Everhour API", "Coinbase API"],
    category: "Developer Tools",
    imageUrl: "/images/projects/raycast.png",
    screenshots: [
      "/images/projects/raycast.png"
    ],
    liveUrl: "https://www.raycast.com/farisaziz12",
    githubUrl: "https://github.com/farisaziz12/extensions",
    featured: true,
    date: "2021-10-01",
    role: "Open Source Contributor",
    challenges: "Designing intuitive interfaces for complex data within the constraints of the Raycast extension framework. Managing authentication flows and API rate limits.",
    outcomes: "Multiple extensions published to the Raycast store with positive user feedback and active usage."
  },
  {
    id: 3,
    title: "ZurichJS Website",
    slug: "zurichjs-website",
    description: "The official website for the ZurichJS community, featuring event listings, speaker profiles, and community resources.",
    longDescription: `
      As the founder of ZurichJS, I built our community website from scratch to serve as a hub for JavaScript enthusiasts in the Swiss German region.
      
      The site features:
      - Upcoming and past events with detailed information
      - Speaker profiles highlighting our community's talent
      - Resources for learning JavaScript and related technologies
      - Blog section for community-contributed content
      - Integration with Meetup API for event synchronization
      - Easy ways for potential speakers to submit talk proposals
      
      The project showcases modern web development practices with a focus on performance and accessibility.
    `,
    technologies: ["NextJS", "TailwindCSS", "Framer Motion", "Sanity CMS", "Netlify", "Posthog", "OpenGraph"],
    category: "Community",
    imageUrl: "/images/projects/zurichjs.png",
    screenshots: [
      "/images/projects/zurichjs.png"
    ],
    liveUrl: "https://zurichjs.com?utm_source=personal-site&utm_medium=contact-link&utm_campaign=js-community-2025",
    githubUrl: "https://github.com/zurichjs/website",
    featured: true,
    date: "2024-10-01",
    role: "Founder & Developer",
    challenges: "Creating a platform that serves both newcomers and experienced developers in the community. Building an easily maintainable system that community members can contribute to.",
    outcomes: "A centralized hub for the ZurichJS community that has helped grow membership and increase event participation."
  },
];

// Add slugs to all projects
const projectsWithSlugs = projects.map(project => ({
  ...project,
  slug: project.slug || createSlug(project.title)
}));

/**
 * Returns all projects data
 * @returns {Array} Array of project objects
 */
export const getProjects = () => {
  return projectsWithSlugs;
};

/**
 * Returns a specific project by slug
 * @param {string} slug - The project slug
 * @returns {Object|null} The project object or null if not found
 */
export const getProjectBySlug = (slug: string) => {
  return projectsWithSlugs.find(project => project.slug === slug) || null;
};

/**
 * Returns a specific project by ID
 * @param {number} id - The project ID
 * @returns {Object|null} The project object or null if not found
 */
export const getProjectById = (id: number) => {
  return projectsWithSlugs.find(project => project.id === id) || null;
};

/**
 * Returns projects filtered by category
 * @param {string} category - The category to filter by
 * @returns {Array} Filtered array of project objects
 */
export const getProjectsByCategory = (category: string) => {
  return projectsWithSlugs.filter(project => 
    project.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Returns projects filtered by technology
 * @param {string} technology - The technology to filter by
 * @returns {Array} Filtered array of project objects
 */
export const getProjectsByTechnology = (technology: string) => {
  return projectsWithSlugs.filter(project => 
    project.technologies.some(tech => 
      tech.toLowerCase() === technology.toLowerCase()
    )
  );
};

/**
 * Returns a sorted list of projects by date (most recent first)
 * @returns {Array} Sorted array of project objects
 */
export const getProjectsByRecent = () => {
  // Create a copy of the array to avoid modifying the original
  const sortedProjects = [...projectsWithSlugs];
  
  // Sort projects by date (most recent first)
  return sortedProjects.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Returns featured projects
 * @param {number} limit - Maximum number of projects to return
 * @returns {Array} Array of featured project objects
 */
export const getFeaturedProjects = (limit = 4) => {
  const featured = projectsWithSlugs.filter(project => project.featured);
  
  // If limit specified, return only that many projects
  if (limit && limit > 0) {
    return featured.slice(0, limit);
  }
  
  return featured;
};

/**
 * Returns related projects based on categories and technologies
 * @param {string} currentSlug - The current project slug to exclude
 * @param {number} limit - Maximum number of related projects to return
 * @returns {Array} Array of related project objects
 */
export const getRelatedProjects = (currentSlug: string, limit = 3) => {
  const currentProject = getProjectBySlug(currentSlug);
  
  if (!currentProject) return [];
  
  const relatedProjects = projectsWithSlugs
    .filter(project => {
      // Exclude the current project
      if (project.slug === currentSlug) return false;
      
      // Check if projects share the same category
      const sameCategory = project.category === currentProject.category;
      
      // Check if projects share at least one technology
      const sharedTechnologies = project.technologies.some(tech => 
        currentProject.technologies.includes(tech)
      );
      
      // Include if either condition is met
      return sameCategory || sharedTechnologies;
    })
    .sort((a, b) => {
      // Count shared technologies to prioritize projects with more in common
      const techOverlapA = a.technologies.filter(tech => 
        currentProject.technologies.includes(tech)
      ).length;
      
      const techOverlapB = b.technologies.filter(tech => 
        currentProject.technologies.includes(tech)
      ).length;
      
      // Sort by number of shared technologies (most first)
      return techOverlapB - techOverlapA;
    })
    .slice(0, limit);
  
  return relatedProjects;
};

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: string;
  imageUrl: string;
  screenshots?: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  date: string;
  role?: string;
  challenges?: string;
  outcomes?: string;
}