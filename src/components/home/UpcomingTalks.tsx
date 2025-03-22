// components/home/UpcomingTalks.js
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/dates';
import { SpeakingEvent } from '@/data/speaking-events';

const UpcomingTalks = ({ events }: { events: SpeakingEvent[] }) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Talks & Workshops 🎤</h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Join me at these upcoming events! I&apos;ll be sharing insights on frontend development, engineering leadership, and more.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`h-2 ${getBadgeColor(event.type)}`}></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeColor(event.type)} text-white`}>
                  {event.type}
                </span>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(event.date)}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{event.location}</p>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.conference}
              </div>
              
              <Link href={event.eventUrl} legacyBehavior>
                <motion.a 
                  className="text-blue-600 font-medium inline-flex items-center hover:underline"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Event Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        className="text-center mt-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link href="/speaking/upcoming" legacyBehavior>
          <motion.a 
            className="inline-flex items-center text-blue-600 font-medium hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Upcoming Events
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </Link>
      </motion.div>
    </div>
  );
};

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
    default:
      return 'bg-gray-600';
  }
}

export default UpcomingTalks;