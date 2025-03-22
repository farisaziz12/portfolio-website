// components/speaking/UpcomingEventCalendar.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SpeakingEvent } from '@/data/speaking-events';

const UpcomingEventCalendar = ({ events }: { events: SpeakingEvent[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<{ date: Date; day: number; isCurrentMonth: boolean; isPrevMonth?: boolean; isNextMonth?: boolean }[]>([]);
  const [eventsInMonth, setEventsInMonth] = useState<SpeakingEvent[]>([]);
  
  // Month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Day names for display
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0-6, where 0 is Sunday)
    const firstDayIndex = firstDay.getDay();
    
    // Calculate days from previous month to display
    const prevMonthDays = [];
    if (firstDayIndex > 0) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = prevMonthLastDay - firstDayIndex + 1; i <= prevMonthLastDay; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, i),
          day: i,
          isCurrentMonth: false,
          isPrevMonth: true
        });
      }
    }
    
    // Calculate days for current month
    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        day: i,
        isCurrentMonth: true
      });
    }
    
    // Calculate days from next month to display
    const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = [];
    const remainingDays = 42 - totalDaysSoFar; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        day: i,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }
    
    // Combine all days
    setCalendarDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
    
    // Filter events for current month view
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
    
    setEventsInMonth(filteredEvents);
  }, [currentDate, events]);
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Check if a day has events
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Format date to show Month Day, Year
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Helper function to get badge color based on event type
  const getBadgeColor = (type: string) => {
    switch ((type || '').toLowerCase()) {
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
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Today
          </button>
          <button 
            onClick={goToPrevMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Day Names */}
      <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {dayNames.map((day, index) => (
          <div key={index} className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day.date);
          const isToday = new Date().toDateString() === day.date.toDateString();
          
          return (
            <div 
              key={index} 
              className={`min-h-[90px] p-1 border-b border-r border-gray-200 dark:border-gray-700 ${
                day.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500'
              } ${isToday ? 'relative ring-2 ring-blue-500 ring-inset' : ''}`}
            >
              <div className={`text-right p-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {day.day}
              </div>
              
              {dayEvents.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event, index) => (
                    <Link key={index} href={event.eventUrl} legacyBehavior>
                      <motion.a 
                        className={`block text-left text-xs p-1 rounded ${getBadgeColor(event.type)} text-white truncate`}
                        whileHover={{ scale: 1.02 }}
                        title={`${event.title} at ${event.conference}`}
                      >
                        {event.title.length > 18 ? event.title.substring(0, 16) + '...' : event.title}
                      </motion.a>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Events List for the Month */}
      {eventsInMonth.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-bold mb-3">Events This Month:</h3>
          <div className="space-y-3">
            {eventsInMonth.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${getBadgeColor(event.type)}`}></div>
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(event.date)} • {event.location}
                  </div>
                  <Link href={event.eventUrl} legacyBehavior>
                    <motion.a 
                      className="text-blue-600 text-sm hover:underline inline-flex items-center mt-1"
                      whileHover={{ x: 2 }}
                    >
                      Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventCalendar;