// components/layout/Layout.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ThemeProvider from '../context/ThemeProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  
  // After component mounts, allow rendering on client
  // This prevents hydration errors with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Page transition variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Fix for SSR - always render children but hide content until mounted
  // This ensures SEO tags are included in the HTML
  const content = (
    <AnimatePresence mode="wait">
      <motion.main 
        className="flex-grow pt-20"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );

  // If not mounted yet, render a simplified version without theme context
  if (!mounted)return null

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header />
        {content}
        <Footer />
        
        {/* Cursor follower effect */}
        <div 
          id="cursor-follower"
          className="fixed w-6 h-6 bg-blue-600/30 rounded-full pointer-events-none mix-blend-screen hidden md:block z-50 filter blur-sm"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        
        {/* Script for cursor follower */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.addEventListener('mousemove', (e) => {
            const follower = document.getElementById('cursor-follower');
            if (!follower) return;
            
            // Delayed follow for smooth effect
            setTimeout(() => {
              follower.style.left = \`\${e.clientX}px\`;
              follower.style.top = \`\${e.clientY}px\`;
            }, 30);
          });
        `}} />
      </div>
    </ThemeProvider>
  );
};

export default Layout;