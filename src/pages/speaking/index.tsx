// pages/speaking/index.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import SpeakingHero from '../../components/speaking/SpeakingHero';
import TalkCard from '../../components/speaking/TalkCard';
import AnimatedSection from '../../components/shared/AnimatedSection';
import SEO from '../../components/shared/SEO';
import { getSpeakingEvents } from '../../data/speaking-events';
import type { SpeakingEvent } from '../../data/speaking-events';
import countryFlagEmoji from "country-flag-emoji";

interface SpeakingProps {
  pastEvents: SpeakingEvent[];
  upcomingEvents: SpeakingEvent[];
}

export default function Speaking({ pastEvents, upcomingEvents }: SpeakingProps) {
  const [filter, setFilter] = useState('all');
  
  // Filter events by type if needed
  const filteredPastEvents = pastEvents.filter(event => 
    filter === 'all' || event.type.toLowerCase() === filter
  );
  
  // Generate JSON-LD structured data for events
  const structuredData = useMemo(() => {
    return upcomingEvents.map(event => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': `${event.title} at ${event.conference}`,
      'startDate': event.date,
      'location': {
        '@type': 'Place',
        'name': event.conference,
        'address': event.location
      },
      'description': event.description,
      'performer': {
        '@type': 'Person',
        'name': 'Faris Aziz'
      },
      'organizer': {
        '@type': 'Organization',
        'name': event.conference
      },
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'image': '/images/speaking/1.jpeg',
      'url': event.eventUrl || 'https://faziz-dev.com/speaking'
    }));
  }, [upcomingEvents]);
  
  return (
    <>
      <SEO
        title="Speaking Events & Workshops | Faris Aziz"
        description="Conference talks, workshops, and tech meetups by Faris Aziz. Join me at upcoming events or explore my past presentations on frontend development, engineering leadership, and web technologies."
        image="/images/speaking/1.jpeg"
        article={true}
        keywords="tech speaker, conference talks, workshops, frontend development, tech meetups, engineering leadership, JavaScript conferences, NextJS talks, React workshops"
        pathname="/speaking"
        structuredData={structuredData.length > 0 ? structuredData[0] : undefined}
      />
      
      <Layout>
        <SpeakingHero />
        
        <div className="container mx-auto px-6 py-16">
          {/* Upcoming Events Section */}
          <AnimatedSection>
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Upcoming Speaking Engagements 🎤
              </motion.h2>
              <motion.p 
                className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Join me at these exciting tech events! I&apos;ll be speaking about frontend development, engineering leadership, and more.
              </motion.p>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TalkCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg mb-4">Currently no upcoming events scheduled. Check back soon!</p>
                <Link href="/contact" legacyBehavior>
                  <motion.a 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Invite Me to Speak
                  </motion.a>
                </Link>
              </motion.div>
            )}
          </AnimatedSection>
          
          {/* Map Section */}
          <AnimatedSection className="mt-24">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Speaking Around the World 🌍</h2>
              <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                I&apos;ve had the privilege of speaking at events across these amazing cities:
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {getUniqueLocations([...upcomingEvents, ...pastEvents]).map(({ city, country, flag }) => (
                <motion.div
                  key={`${city}-${country}`}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {flag}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{city}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{country}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
          
          {/* Past Events Section */}
          <AnimatedSection className="mt-24">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Past Talks & Workshops</h2>
              <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-6">
                A collection of my previous speaking engagements, workshops, and conference appearances.
              </p>
              
              {/* Filter buttons */}
              <div className="flex justify-center flex-wrap gap-3 mt-6">
                {['all', 'conference', 'workshop', 'meetup'].map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === type 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              {filteredPastEvents.length > 0 ? (
                filteredPastEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <div className="flex items-center">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeColor(event.type)} text-white mr-3`}>
                            {event.type}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(event.date)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {event.conference}
                        </div>
                      </div>
                      
                      {event.slidesUrl || event.videoUrl ? (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
                          {event.slidesUrl && (
                            <a 
                              href={event.slidesUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Slides
                            </a>
                          )}
                          {event.videoUrl && (
                            <a 
                              href={event.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              Watch Talk
                            </a>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <p>No events found for this filter. Try selecting a different category.</p>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
          
          {/* Call to Action */}
          <AnimatedSection className="mt-24">
            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Looking for a speaker for your event? 🎙️</h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Excited to share insights on frontend development, engineering leadership, 
                and building scalable systems! I&apos;m available for conferences, workshops, and meetups.
              </p>
              <Link href="/contact" legacyBehavior>
                <motion.a 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get In Touch
                </motion.a>
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </Layout>
    </>
  );
}

// Helper function to get badge color based on event type
function getBadgeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'conference':
      return 'bg-purple-600';
    case 'workshop':
      return 'bg-green-600';
    case 'meetup':
      return 'bg-blue-600';
    case 'panel':
      return 'bg-orange-600';
    case 'podcast':
      return 'bg-pink-600';
    case 'webinar':
      return 'bg-teal-600';
    default:
      return 'bg-gray-600';
  }
}

// Helper function to format date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function to get unique locations with country codes
const getUniqueLocations = (events: SpeakingEvent[]) => {
  const locations = new Set(events.map(event => event.location));
  return Array.from(locations).map(location => {
    const country = location.split(', ')[1];
    const city = location.split(', ')[0];
    const countryCode = getCountryCode(country);
    const flag = countryCode ? countryFlagEmoji.get(countryCode)?.emoji : '🌍';
    return { city, country, flag };
  });
};

// Helper function to get country codes
const getCountryCode = (country: string): string => {
  const codes = {
    'Switzerland': 'CH',
    'United Kingdom': 'GB',
    'United States': 'US',
    'Italy': 'IT',
    'Germany': 'DE',
    'Netherlands': 'NL',
    'Austria': 'AT',
    'Greece': 'GR'
  };
  return codes[country as keyof typeof codes] || '';
};

export async function getStaticProps() {
  const allEvents = getSpeakingEvents();
  
  // Split events into past and upcoming
  const currentDate = new Date();
  const pastEvents = allEvents
    .filter(event => new Date(event.date) < currentDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by most recent first
  
  const upcomingEvents = allEvents
    .filter(event => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by earliest first
  
  return {
    props: {
      pastEvents,
      upcomingEvents,
    },
    // Revalidate every 24 hours
    revalidate: 86400,
  };
}