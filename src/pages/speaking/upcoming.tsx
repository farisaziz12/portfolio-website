// pages/speaking/upcoming.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import TalkCard from '../../components/speaking/TalkCard';
import UpcomingEventCalendar from '../../components/speaking/UpcomingEventCalendar';
import AnimatedSection from '../../components/shared/AnimatedSection';
import { getUpcomingEvents } from '../../data/speaking-events';
import { SpeakingEvent } from '@/data/speaking-events';
export default function UpcomingEvents({ events }: { events: SpeakingEvent[] }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  
  return (
    <Layout>
      <Head>
        <title>Upcoming Speaking Events | Faris Aziz</title>
        <meta 
          name="description" 
          content="See my upcoming speaking engagements, conferences, and workshops. Join me at these exciting tech events!" 
        />
      </Head>
      
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 py-24">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Where I&apos;ll Be Speaking Next! 🎤
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join me at these exciting events where I&apos;ll be sharing insights on frontend development, 
                engineering leadership, and building scalable systems! Can&apos;t wait to meet you there! 🚀
              </p>
              
              {events.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Link href="/contact" legacyBehavior>
                    <motion.a 
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Let&apos;s Connect at an Event!
                    </motion.a>
                  </Link>
                  
                  <Link href="/speaking" legacyBehavior>
                    <motion.a 
                      className="inline-flex items-center justify-center bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600/10 font-medium py-3 px-8 rounded-lg transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Past Talks
                    </motion.a>
                  </Link>
                </div>
              ) : null}
            </motion.div>
            
            {events.length > 0 && (
              <div className="mt-8 flex justify-center mb-12">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md inline-flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Card View
                    </span>
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      viewMode === 'calendar'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Calendar View
                    </span>
                  </button>
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        {events.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TalkCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <UpcomingEventCalendar events={events} />
              </div>
            )}
            
            <motion.div 
              className="mt-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Want to invite me to your event? Let&apos;s make it happen! 🙌</h2>
              <p className="max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-300">
                I&apos;m always excited to share knowledge with the community! Whether it&apos;s a conference, meetup, 
                or workshop, I&apos;d love to contribute to your event with engaging talks on frontend development, 
                engineering leadership, or building scalable systems.
              </p>
              <Link href="/contact" legacyBehavior>
                <motion.a 
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get In Touch
                </motion.a>
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-6">📅</div>
            <h2 className="text-2xl font-bold mb-4">No Upcoming Events Yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
              I&apos;m currently planning my next speaking engagements. Check back soon for updates 
              or subscribe to get notified when new events are announced!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/speaking" legacyBehavior>
                <motion.a 
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Past Talks
                </motion.a>
              </Link>
              <Link href="/contact" legacyBehavior>
                <motion.a 
                  className="inline-flex items-center justify-center bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600/10 font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Invite Me to Speak
                </motion.a>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Community Call-to-Action */}
      <div className="bg-blue-50 dark:bg-blue-900/20 py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Join Our Tech Community! 💻</h2>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              I&apos;m the founder of ZurichJS meetup - a vibrant community of JS enthusiasts sharing knowledge, 
              networking, and having fun! We&apos;re always looking for speakers, sponsors, and new members.
            </p>
            <a 
              href="https://zurichjs.com?utm_source=personal-site&utm_medium=contact-link&utm_campaign=js-community-2025" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 font-medium py-3 px-8 rounded-lg shadow-md transition-colors"
            >
              Join ZurichJS
            </a>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const events = getUpcomingEvents();
  
  return {
    props: {
      events
    },
    // Revalidate every 24 hours
    revalidate: 86400,
  };
}