// components/speaking/SpeakingHero.js
import { events } from '@/data/speaking-events';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const speakingPhotos = [
  '/images/speaking/1.jpeg',
  '/images/speaking/2.jpeg',
  '/images/speaking/3.jpeg',
  '/images/speaking/4.jpeg',
  '/images/speaking/5.jpeg',
];

const SpeakingHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 py-16 md:py-24">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 right-10 md:right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 md:left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
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
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Talks, Workshops & Events
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Sharing knowledge and insights on frontend development, engineering leadership, 
              and building scalable systems at conferences, meetups, and workshops worldwide! 🚀
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { label: "Events", count: `${events.length}+` },
              { label: "Cities", count: "6+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-blue-600">{stat.count}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Tech event logos */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="relative h-12 w-24 md:h-16 md:w-32 bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (i * 0.1) }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-xs md:text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {["React Advanced London", "CityJS", "ZurichJS", "React & Chill", "Reactjs Day", "jsday", "Voxxed Days Zurich", "Zurich ReactJS Meetup"][i]}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Speaking Images */}
      <motion.div 
        className="mt-8 max-w-6xl mx-auto grid grid-cols-5 gap-2 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {speakingPhotos.slice(0, 5).map((photo, i) => (
          <motion.div
            key={i}
            className={`relative rounded-lg overflow-hidden ${
              i === 2 ? 'col-span-2 row-span-2' : 'col-span-1'
            }`}
            style={{ 
              height: i === 2 ? '240px' : '120px' 
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={photo}
              alt="Speaking at tech events"
              fill
              className="object-cover"
              sizes={i === 2 ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 50vw, 20vw"}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SpeakingHero;