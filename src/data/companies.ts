// data/companies.js


export type Company = {
    id: number;
    name: string;
    logoUrl: string;
    industry: string;
    description: string;
    period: string;
    role: string;
    url: string;
    highlight: string;
};
// Mock companies data with logos and information
const companies = [
  {
    id: 1,
    name: "Eurosport",
    logoUrl: "/logos/eurosport-logo.png",
    industry: "Connected TV",
    description: "Worked on Connected TV applications reaching millions of users worldwide",
    period: "2020-2021",
    role: "Junior Front-End Developer",
    url: "https://www.eurosport.com",
    highlight: "Helped develop the text-to-speech accessibility integration for set-top boxes and led the integration of In-App-Purchasing for Comcast devices."
  },
  {
    id: 2,
    name: "Fiit",
    logoUrl: "/logos/fiit-logo.png",
    industry: "Fitness",
    description: "Joined the #1 rated workout app that brings personal trainers to your home and gym",
    period: "2021-2022",
    role: "Software Engineer II",
    url: "https://fiit.tv",
    highlight: "Independently led investigations into website infrastructure to devise upgrade strategies, migrating monolithic codebase from legacy (2018) NextJs to the latest release."
  },
  {
    id: 3,
    name: "GCN",
    logoUrl: "/logos/gcn-logo.jpg",
    industry: "Connected TV",
    description: "Developed the Global Cycling Network (GCN) Connect Devices TV Application",
    period: "2020-2021",
    role: "Junior Front-End Developer",
    url: "https://www.globalcyclingnetwork.com",
    highlight: "Implemented text-to-speech accessibility integration for devices such as Amazon Fire TV and Samsung. Worked directly with Figma designs for UI component implementations."
  },
  {
    id: 4,
    name: "Smallpdf",
    logoUrl: "/logos/smallpdf-logo.jpg",
    industry: "SaaS",
    description: "Contributed to the popular document management SaaS platform",
    period: "2022",
    role: "Frontend Engineer",
    url: "https://smallpdf.com",
    highlight: "Developed key features and optimized frontend performance for a platform with millions of daily users."
  },
  {
    id: 5,
    name: "Navro",
    logoUrl: "/logos/navro-logo.jpg",
    industry: "FinTech",
    description: "Joined as the first member of the engineering team for this payments curation layer startup",
    period: "2022-2024",
    role: "Technical Delivery & Engineering Manager",
    url: "https://navro.com",
    highlight: "Developed and established the career progression framework for engineers. Led the architecture, design and development of the API docs platform."
  },
  {
    id: 6,
    name: "MentorCruise",
    logoUrl: "/logos/mentorcruise-logo.png", 
    industry: "Education",
    description: "Provide mentorship to aspiring frontend professionals",
    period: "2022-Present",
    role: "Software Engineering Mentor",
    url: "https://mentorcruise.com",
    highlight: "Helping the next generation of frontend developers grow through personalized mentorship and guidance."
  },
  {
    id: 7,
    name: "Discovery+",
    logoUrl: "/logos/discovery-logo.svg",
    industry: "Media",
    description: "Worked on the Discovery Plus Connected Devices Application",
    period: "2020-2021",
    role: "Junior Front-End Developer",
    url: "https://www.discoveryplus.com",
    highlight: "Contributed to accessibility features and in-app purchasing integrations for the streaming platform."
  },
  {
    id: 'fx-digital',
    name: 'FX Digital',
    logoUrl: '/logos/fx-logo.png',
    industry: 'Connected TV',
    description: 'FX is a TV, Voice and Web application development agency, providing innovative solutions for brands looking to pioneer the latest technologies.',
    period: 'Jul 2020 - Aug 2021',
    role: 'Junior Front-End Developer - Connected TV',
    url: 'https://www.wearefx.uk/',
    highlight: 'Helped develop the text-to-speech accessibility integration for set-top boxes (e.g. Comcast), Lead the integration of In-App-Purchasing for Comcast devices, EPG Schedule, Hero Component implementation, Text-to-speech accessibility integration for devices such as Amazon Fire TV, Samsung, etc., Working directly with Figma designs for Hero Component integration, Video Cards design implementation, Contributed to ideation, User flow, UI/UX, APLs, WebGL'
  }
];

/**
 * Returns all companies data
 * @returns {Array} Array of company objects
 */
export const getCompanies = () => {
  return companies;
};

/**
 * Returns a specific company by ID
 * @param {number} id - The company ID
 * @returns {Object|null} The company object or null if not found
 */
export const getCompanyById = (id: number) => {
  return companies.find(company => company.id === id) || null;
};

/**
 * Returns companies filtered by industry
 * @param {string} industry - The industry to filter by
 * @returns {Array} Filtered array of company objects
 */
export const getCompaniesByIndustry = (industry: string) => {
  return companies.filter(company => 
    company.industry.toLowerCase() === industry.toLowerCase()
  );
};

/**
 * Returns a sorted list of companies by date (most recent first)
 * @returns {Array} Sorted array of company objects
 */
export const getCompaniesByRecent = () => {
  // Create a copy of the array to avoid modifying the original
  const sortedCompanies = [...companies];
  
  // Sort companies by period (assuming format "YYYY-YYYY" or "YYYY-Present")
  return sortedCompanies.sort((a, b) => {
    const periodA = a.period.split('-')[1];
    const periodB = b.period.split('-')[1];
    
    // If period ends with "Present", it should come first
    if (periodA === "Present") return -1;
    if (periodB === "Present") return 1;
    
    // Otherwise sort by year (higher year comes first)
    return parseInt(periodB) - parseInt(periodA);
  });
};

/**
 * Returns featured companies (limit to specified number)
 * @param {number} limit - Maximum number of companies to return
 * @returns {Array} Array of featured company objects
 */
export const getFeaturedCompanies = (limit = 5) => {
  // Return the most recent companies up to the limit
  return getCompaniesByRecent().slice(0, limit);
};