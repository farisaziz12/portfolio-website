// components/speaking/SpeakingHero.js
import { events } from '@/data/speaking-events';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export const speakingPhotos = [
  '/images/speaking/1.jpeg',
  '/images/speaking/2.jpeg',
  '/images/speaking/3.jpeg',
  '/images/speaking/4.jpeg',
  '/images/speaking/5.jpeg',
  '/images/speaking/7.jpeg',
  '/images/speaking/8.jpeg',
  '/images/speaking/6.jpeg',
  '/images/speaking/9.jpeg',
];

const SpeakingHero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % speakingPhotos.length);
    }, 5000); // Increased from 3000 to 5000 for better viewing experience
    
    return () => clearInterval(interval);
  }, [isMobile]);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-indigo-50 to-white dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-gray-900 py-16 sm:py-20 md:py-28">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 right-10 md:right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -top-10 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl hidden md:block"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 9,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 md:left-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-7 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Talks, Workshops & Events
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Sharing knowledge and insights on frontend development, engineering leadership, 
              and building scalable systems worldwide! 🚀
            </p>
          </motion.div>
          
          {/* Stats - Enhanced */}
          <motion.div
            className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-8 mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { label: "Events", count: `${events.length}+` },
              { label: "Cities", count: "6+" },
            ].map((stat, index) => (
              <div key={index} className="text-center px-6 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{stat.count}</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
          
          {/* Tech event logos - Enhanced */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 items-center">
              {["React Advanced London", "CityJS", "ZurichJS", "React & Chill", "Reactjs Day", "jsday", "Voxxed Days Zurich", "Zurich ReactJS Meetup"].map((event, i) => (
                <motion.div
                  key={i}
                  className="relative h-16 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="text-xs sm:text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                    {event}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Speaking Images - Enhanced Creative Display */}
      <motion.div 
        className="mt-8 sm:mt-14 max-w-6xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Mobile Carousel - Enhanced */}
        <div className="block md:hidden relative overflow-hidden">
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
            {speakingPhotos.map((photo, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: activeIndex === i ? 1 : 0,
                  scale: activeIndex === i ? 1 : 0.9,
                  zIndex: activeIndex === i ? 10 : 0
                }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src={photo}
                  alt={`Speaking event ${i+1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === activeIndex}
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators - Enhanced */}
          <div className="flex justify-center mt-6 gap-2">
            {speakingPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-gray-300 dark:bg-gray-600 w-2'
                }`}
                aria-label={`Go to slide ${i+1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Masonry - Enhanced */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-4 auto-rows-[120px]">
            {speakingPhotos.map((photo, i) => {
              // Define different sizes for variety in the masonry layout
              const sizes = [
                "col-span-4 row-span-2", // medium rectangle
                "col-span-3 row-span-3", // tall rectangle
                "col-span-5 row-span-3", // large rectangle
                "col-span-3 row-span-2", // small rectangle
                "col-span-4 row-span-2", // medium rectangle
                "col-span-5 row-span-2", // wide rectangle
                "col-span-3 row-span-3", // tall rectangle
                "col-span-4 row-span-2", // medium rectangle
                "col-span-5 row-span-2", // wide rectangle
              ];
              
              return (
                <motion.div
                  key={i}
                  className={`relative rounded-xl overflow-hidden shadow-md ${sizes[i]} transform transition-all duration-500 group`}
                  whileHover={{ 
                    scale: 1.03, 
                    zIndex: 10, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                >
                  <Image
                    src={photo}
                    alt={`Speaking event ${i+1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 1280px) 33vw, 25vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SpeakingHero;