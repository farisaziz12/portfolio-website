// components/home/Hero.js
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Hero = ({ scrollY }: { scrollY: number }) => {
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  // Calculate parallax effect based on scroll position
  const parallaxValue = -scrollY * 0.2;
  
  return (
    <section className="min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-20 right-10 md:right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" 
          style={{ transform: `translateY(${parallaxValue * 0.8}px)` }}
        />
        <div 
          className="absolute bottom-10 left-10 md:left-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" 
          style={{ transform: `translateY(${parallaxValue * 0.5}px)` }}
        />
        <div 
          className="absolute top-40 left-20 md:left-[20%] w-48 h-48 bg-green-500/10 rounded-full blur-3xl" 
          style={{ transform: `translateY(${parallaxValue * 0.3}px)` }}
        />
      </div>
      
      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <motion.span 
            className="text-blue-600 font-semibold block mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {greeting}, I&apos;m
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Faris Aziz
          </motion.h1>
          
          <motion.div
            className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TypewriterEffect texts={[
              "Frontend Subject Matter Expert",
              "Conference Speaker",
              "Engineering Manager",
              "Workshop Facilitator",
              "NextJS/React Expert"
            ]} />
          </motion.div>
          
          <motion.p 
            className="text-lg mb-8 max-w-md text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Pioneering a tech culture of innovation, growth & psychological safety with expertise in NextJS, TS/JS & NodeJS.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/speaking/upcoming" legacyBehavior>
              <motion.a 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >m
                Upcoming Talks
              </motion.a>
            </Link>
          </motion.div>
        </div>
        
        <div className="md:w-1/2 flex justify-center">
          <motion.div 
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl"
            initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.3,
              type: "spring",
              stiffness: 100 
            }}
            style={{ 
              transformStyle: "preserve-3d",
              transform: `translateY(${parallaxValue * 0.2}px)` 
            }}
          >
            <Image 
              src="/images/profile.jpg" 
              alt="Faris Aziz" 
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-4 sm:bottom-10 left-0 right-0 flex justify-center items-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="flex flex-col items-center">
          <p className="mb-1 sm:mb-2 text-xs sm:text-sm">Scroll to explore</p>
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gray-400 rounded-full"
              animate={{ 
                y: [0, 8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Typewriter effect component for rotating titles
const TypewriterEffect = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const targetText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setCurrentText(targetText.substring(0, currentText.length + 1));
        
        // If we've completed typing
        if (currentText === targetText) {
          // Pause at the end
          setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        // Deleting
        setCurrentText(targetText.substring(0, currentText.length - 1));
        
        // If we've completed deleting
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % texts.length);
          return;
        }
      }
    }, isDeleting ? 50 : 150);
    
    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts]);
  
  return (
    <div className="h-8 md:h-10 relative">
      <span>{currentText}</span>
      <span className="animate-blink">|</span>
    </div>
  );
};

export default Hero;