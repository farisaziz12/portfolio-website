// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FeaturedProjects from '../components/home/FeaturedProjects';
import UpcomingTalks from '../components/home/UpcomingTalks';
import CompaniesWorkedWith from '../components/home/CompaniesWorkedWith';
import AnimatedSection from '../components/shared/AnimatedSection';
import { getSpeakingEvents, SpeakingEvent } from '../data/speaking-events';
import { getProjects, Project } from '../data/projects';
import { Company, getCompanies } from '../data/companies';


interface HomeProps {
  upcomingEvents: SpeakingEvent[];
  featuredProjects: Project[];
  companies: Company[];
}

export default function Home({ upcomingEvents, featuredProjects, companies }: HomeProps) {
  // Track scroll position for animations
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Faris Aziz | Frontend Engineer & Conference Speaker</title>
        <meta
          name="description"
          content="Engineering Manager & Frontend SME | Conference Speaker | Frontend Expert in NextJS, TS/JS & NodeJS | Pioneering a Tech Culture of Innovation"
        />
      </Head>

      <Hero scrollY={scrollY} />
      <AnimatedSection className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Tech Expertise</h2>
          <p className="text-center text-lg max-w-2xl mx-auto mb-12 text-gray-600 dark:text-gray-300">
            I build scalable, maintainable frontend systems with a focus on performance and team impact. Specialized in Next.js, TypeScript, and JavaScript, with deep experience in engineering leadership at fast-moving startups.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "🚀",
              title: "Frontend Engineering",
              description: "Built resilient, accessible UIs at scale using React, Next.js, and modern tooling."
            },
            {
              icon: "🧭",
              title: "Engineering Leadership",
              description: "Led teams of 10+ engineers, designed career ladders, and scaled orgs from seed to 60+ developers."
            },
            {
              icon: "⚙️",
              title: "System Design",
              description: "Designed and maintained scalable web architectures across product lifecycle stages."
            }
          ].map((skill, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-4xl mb-4">{skill.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <CompaniesWorkedWith companies={companies} />
      </AnimatedSection>

      <AnimatedSection className="py-16 md:py-24">
        <FeaturedProjects projects={featuredProjects} />
      </AnimatedSection>

      <AnimatedSection className="py-16 md:py-24 bg-blue-50 dark:bg-blue-900/20">
        <UpcomingTalks events={upcomingEvents} />
      </AnimatedSection>

      <AnimatedSection className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let&apos;s Connect! 🚀</h2>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            Looking for a speaker for your next event, consultant for your project, or just want to chat about web development?
          </p>
          <motion.a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </AnimatedSection>
    </Layout>
  );
}

export async function getStaticProps() {
  // Get only upcoming events (filter by date)
  const allEvents = getSpeakingEvents();
  const upcomingEvents = allEvents.filter(
    event => new Date(event.date) >= new Date()
  ).slice(0, 3); // Show only 3 upcoming events

  // Get featured projects
  const featuredProjects = getProjects().filter(project => project.featured).slice(0, 4);

  // Get companies worked with
  const companies = getCompanies();

  return {
    props: {
      upcomingEvents,
      featuredProjects,
      companies,
    },
    // Revalidate every 24 hours to keep upcoming events fresh
    revalidate: 86400,
  };
}