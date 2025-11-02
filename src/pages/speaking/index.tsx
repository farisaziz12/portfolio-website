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
import { getUniqueLocations } from '../../utils/countryFlags';

interface SpeakingProps {
  pastEvents: SpeakingEvent[];
  upcomingEvents: SpeakingEvent[];
}

export default function Speaking({ pastEvents, upcomingEvents }: SpeakingProps) {
  const [filter, setFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  // Get unique years from past events
  const years = useMemo(() => {
    const yearSet = new Set(pastEvents.map(event => new Date(event.date).getFullYear()));
    return ['all', ...Array.from(yearSet).sort((a, b) => b - a)];
  }, [pastEvents]);

  // Filter events by type, year, and search query
  const filteredPastEvents = useMemo(() => {
    return pastEvents.filter(event => {
      const matchesType = filter === 'all' || event.type.toLowerCase() === filter;
      const matchesYear = yearFilter === 'all' || new Date(event.date).getFullYear().toString() === yearFilter;
      const matchesSearch = searchQuery === '' ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.conference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesYear && matchesSearch;
    });
  }, [pastEvents, filter, yearFilter, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPastEvents.length / eventsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredPastEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [filteredPastEvents, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleYearFilterChange = (newYear: string) => {
    setYearFilter(newYear);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
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

          {/* Conference Logos Strip */}
          <AnimatedSection className="mt-24">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured At</h2>
              <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Proud to have shared knowledge at these amazing conferences and events
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'React Summit', type: 'Conference' },
                { name: 'JSNation', type: 'Conference' },
                { name: 'CityJS', type: 'Conference' },
                { name: 'Voxxed Days', type: 'Conference' },
                { name: 'ReactJS Day', type: 'Conference' },
                { name: 'Frontend Nation', type: 'Conference' },
                { name: 'International JavaScript Conference', type: 'Conference' },
                { name: 'ZurichJS', type: 'Meetup' },
              ].map((conf, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <h3 className="font-semibold text-lg mb-1">{conf.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{conf.type}</p>
                </motion.div>
              ))}
            </div>
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
          <div id="past-talks">
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

              {/* Search Bar */}
              <div className="max-w-xl mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, conference, or location..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Year Filter */}
              <div className="flex justify-center flex-wrap gap-3 mb-4">
                {years.map((year) => (
                  <motion.button
                    key={year}
                    onClick={() => handleYearFilterChange(year.toString())}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      yearFilter === year.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {year === 'all' ? 'All Years' : year}
                  </motion.button>
                ))}
              </div>

              {/* Type Filter buttons */}
              <div className="flex justify-center flex-wrap gap-3 mt-6">
                {['all', 'conference', 'workshop', 'meetup', 'podcast', 'webinar'].map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => handleFilterChange(type)}
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

              {/* Results count */}
              <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredPastEvents.length} event{filteredPastEvents.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event, index) => (
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-2 mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
            </AnimatedSection>
          </div>

          {/* Call to Action - Segmented for Different Audiences */}
          <AnimatedSection className="mt-24">
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 md:p-12 text-center max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Let&apos;s Work Together</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Whether you&apos;re organizing a conference, looking for workshops, or want to connect at an upcoming event
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {/* Conference Organizers */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/contact" legacyBehavior>
                    <a className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="text-3xl mb-3">🎤</div>
                      <h3 className="font-semibold mb-2">Book Me to Speak</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Conference talks & keynotes
                      </p>
                    </a>
                  </Link>
                </motion.div>

                {/* Companies */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/contact" legacyBehavior>
                    <a className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="text-3xl mb-3">🛠️</div>
                      <h3 className="font-semibold mb-2">Request Workshop</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Team training & workshops
                      </p>
                    </a>
                  </Link>
                </motion.div>

                {/* Attendees */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/speaking/upcoming" legacyBehavior>
                    <a className="block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="text-3xl mb-3">📅</div>
                      <h3 className="font-semibold mb-2">Meet Me at Event</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        View upcoming events
                      </p>
                    </a>
                  </Link>
                </motion.div>

                {/* Developers */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => {
                      const pastSection = document.querySelector('#past-talks');
                      pastSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="text-3xl mb-3">🎥</div>
                    <h3 className="font-semibold mb-2">Watch Past Talks</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Videos & slides available
                    </p>
                  </button>
                </motion.div>
              </div>

              {/* Popular Topics */}
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4 text-lg">Popular Topics I Cover:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    'Next.js & React Performance',
                    'Data Fetching Strategies',
                    'Payment Systems Architecture',
                    'Engineering Leadership',
                    'Building Scalable Systems',
                    'TanStack Query',
                  ].map((topic, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
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