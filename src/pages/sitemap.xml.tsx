import { GetServerSideProps } from 'next';
import { getSpeakingEvents } from '../data/speaking-events';
import { getProjects } from '../data/projects';

const Sitemap = () => {
  // This component doesn't render anything
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Base URL of the site
  const baseUrl = 'https://faziz-dev.com';
  
  // Get data for dynamic routes
  const events = getSpeakingEvents();
  const projects = getProjects();

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/about</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${baseUrl}/speaking</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${baseUrl}/projects</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.7</priority>
      </url>
      
      <!-- Project pages -->
      ${projects.map(project => `
        <url>
          <loc>${baseUrl}/projects/${project.slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
      
      <!-- Speaking event pages -->
      ${events.map(event => `
        <url>
          <loc>${baseUrl}/speaking/${event.slug || ''}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  // Set appropriate headers
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap; 