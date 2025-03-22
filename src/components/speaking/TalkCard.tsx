// components/speaking/TalkCard.js
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SpeakingEvent } from '@/data/speaking-events';

const TalkCard = ({ event }: { event: SpeakingEvent }) => {
  // Format date to show Month Day, Year
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Helper function to get badge color based on event type
  const getBadgeColor = (type: string) => {
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
  };
  
  // Calculate if the event is in the future
  const isUpcoming = new Date(event.date) > new Date();
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col"
      whileHover={{ y: -5 }}
    >
      <div className={`h-2 ${getBadgeColor(event.type)}`}></div>
      
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4 justify-between">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeColor(event.type)} text-white`}>
            {event.type}
          </span>
          
          {isUpcoming && (
            <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Upcoming
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(event.date)}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {event.description || `${event.title} at ${event.conference}`}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {event.conference}
        </div>
      </div>
      
      <div className="px-6 pb-6 mt-auto">
        {isUpcoming ? (
          <Link href={event.eventUrl} legacyBehavior>
            <motion.a 
              className="text-blue-600 font-medium inline-flex items-center hover:text-blue-700"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Event Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </Link>
        ) : (
          <div className="flex flex-wrap gap-3">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Watch Talk
              </a>
            )}
            
            {!event.slidesUrl && !event.videoUrl && (
              <Link href={event.eventUrl} legacyBehavior>
                <motion.a 
                  className="text-blue-600 font-medium inline-flex items-center hover:text-blue-700"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Event Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TalkCard;