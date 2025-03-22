// pages/404.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

const NotFoundPage = () => {
  const [mouseMoved, setMouseMoved] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseMoved(true);
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Fun 404 code pun messages
  const errorMessages = [
    "Looks like this route threw an exception! 🐛",
    "404: Path not found in the component tree!",
    "This page must be lazy-loaded... and taking forever! ⏳",
    "Oops! Forgot to import this page!",
    "The setState of this page returned undefined!",
    "Error in ./NotFound.js\nModule not found! 📦",
    "Warning: Failed prop type: The prop 'url' is marked as required",
    "Uncaught TypeError: Cannot read property 'page' of undefined",
    "The server responded with a status of 404 ¯\\_(ツ)_/¯"
  ];
  
  // Randomly select an error message
  const [errorMessage] = useState(
    errorMessages[Math.floor(Math.random() * errorMessages.length)]
  );
  
  // Suggested places to visit
  const suggestedLinks = [
    { text: "Homepage", path: "/" },
    { text: "My Speaking Events", path: "/speaking" },
    { text: "Get In Touch", path: "/contact" },
    { text: "Join ZurichJS", path: "https://zurichjs.com?utm_source=personal-site&utm_medium=contact-link&utm_campaign=js-community-2025" }
  ];

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-24 px-6 text-center">
        {/* 404 Glitchy Text */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-8xl md:text-9xl font-bold"
            animate={{ 
              x: mouseMoved ? (mousePosition.x - 0.5) * 10 : 0,
              y: mouseMoved ? (mousePosition.y - 0.5) * 10 : 0,
            }}
          >
            <span className="text-blue-600">4</span>
            <motion.span 
              className="text-purple-600 inline-block"
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.2, 0.9, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              0
            </motion.span>
            <span className="text-blue-600">4</span>
          </motion.h1>
          
          {/* Glitch effect elements */}
          <motion.div 
            className="absolute inset-0 text-8xl md:text-9xl font-bold text-red-500 opacity-10"
            animate={{ 
              x: [0, 5, -5, 3, 0],
              scaleX: [1, 1.01, 0.99, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            404
          </motion.div>
          
          <motion.div 
            className="absolute inset-0 text-8xl md:text-9xl font-bold text-green-500 opacity-10"
            animate={{ 
              x: [0, -5, 5, -3, 0],
              scaleY: [1, 0.99, 1.01, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.1
            }}
          >
            404
          </motion.div>
        </motion.div>
        
        {/* Error message */}
        <motion.div
          className="mb-8 p-4 max-w-lg bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm md:text-base overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="text-left">
            <span className="text-green-600 dark:text-green-400">&gt;</span> <span className="text-blue-600 dark:text-blue-400">console.error</span>
            <span className="text-purple-600 dark:text-purple-400">(</span>
            <span className="text-red-600 dark:text-red-400">&quot;{errorMessage}&quot;</span>
            <span className="text-purple-600 dark:text-purple-400">)</span>
            <span>;</span>
            <motion.span 
              className="inline-block w-3 h-5 bg-gray-700 dark:bg-gray-300 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>
        
        {/* Message & instructions */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Whoops! Page Not Found 🤔
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Hey there, tech explorer! 👋 Looks like this URL doesn&apos;t match any of our routes. 
            But don&apos;t worry - we&apos;ve got plenty of awesome content for you to discover!
          </p>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-bold">Community announcement:</span> Join us at the next ZurichJS meetup! 
              We&apos;re talking about NextJS, React performance, and more! The community is waiting for you! 🎉
            </p>
          </div>
        </motion.div>
        
        {/* Navigation suggestions */}
        <div className="w-full max-w-2xl">
          <motion.h3 
            className="text-lg font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Where to next? Try these instead:
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {suggestedLinks.map((link, index) => (
              <Link key={link.path} href={link.path} legacyBehavior>
                <motion.a 
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md flex items-center transition-all group"
                  whileHover={{ 
                    y: -5, 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                    {index === 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                    {index === 3 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {index === 4 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.text}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.a>
              </Link>
            ))}
          </motion.div>
        </div>
        
        {/* Easter egg - debugging joke */}
        <motion.button
          className="mt-12 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            alert("Have you tried turning it off and on again? 😉");
          }}
        >
          Run Debug Mode?
        </motion.button>
      </div>
    </Layout>
  );
};

export default NotFoundPage;