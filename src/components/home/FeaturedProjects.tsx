// components/home/FeaturedProjects.js
import { useState } from 'react';
// import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type{ Project } from '@/data/projects';

const FeaturedProjects = ({ projects }: { projects: Project[] }) => {
  const [activeProject, setActiveProject] = useState(0);
  const projectsToDisplay = projects.filter(project => project.featured);

  return (
    <div className="container mx-auto px-6">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-3">
          Featured Projects
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Things I&apos;ve Built 🛠️</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Check out some of my recent projects! From SaaS platforms to productivity tools, 
          I love building applications that solve real problems.
        </p>
      </motion.div>

      {/* Project Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Project Preview */}
        <motion.div 
          className="relative overflow-hidden rounded-xl shadow-lg h-[300px] md:h-[400px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
          
          {/* Project Image */}
          <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700">
            {projectsToDisplay[activeProject]?.imageUrl ? (
              <Image
                src={projectsToDisplay[activeProject].imageUrl}
                alt={projectsToDisplay[activeProject].title}
                fill
                className="object-cover rounded-t-lg opacity-80"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <svg 
                  className="w-16 h-16 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
                <span className="text-sm font-medium">Project Preview</span>
                <span className="text-xs mt-1 opacity-75">Image coming soon</span>
              </div>
            )}
          </div>
          
          {/* Project Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded mb-2">
              {projectsToDisplay[activeProject]?.technologies?.[0] || "NextJS"}
            </span>
            <h3 className="text-2xl font-bold text-white mb-1">
              {projectsToDisplay[activeProject]?.title || "Project Title"}
            </h3>
            <p className="text-gray-100 text-sm line-clamp-2">
              {projectsToDisplay[activeProject]?.description || "Project description goes here."}
            </p>
          </div>
          
          {/* Action Links */}
          <div className="absolute top-4 right-4 flex space-x-2 z-20">
            {projectsToDisplay[activeProject]?.liveUrl && (
              <a 
                href={projectsToDisplay[activeProject].liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-800 transition-colors"
                title="Live Demo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            
            {projectsToDisplay[activeProject]?.githubUrl && (
              <a 
                href={projectsToDisplay[activeProject].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/90 hover:bg-white rounded-full text-gray-800 transition-colors"
                title="GitHub Repository"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        </motion.div>
        
        {/* Project Selector */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4">Explore My Work</h3>
          
          {projectsToDisplay.map((project, index) => (
            <motion.div
              key={project.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                activeProject === index 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
              }`}
              onClick={() => setActiveProject(index)}
              whileHover={{ x: activeProject !== index ? 5 : 0 }}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {index === 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {index === 3 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{project.description}</p>
                </div>
              </div>
              
              {activeProject === index && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          
          {/* <div className="mt-6 text-center md:text-left">
            <Link href="/projects" legacyBehavior>
              <motion.a
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                View All Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </Link>
          </div> */}
        </motion.div>
      </div>
      
      {/* Tech Stack */}
      <motion.div 
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-6">Technologies I Love Working With</h3>
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {[
            { name: "NextJS", icon: "nextjs.svg" },
            { name: "React", icon: "react.svg" },
            { name: "TypeScript", icon: "typescript.svg" },
            { name: "JavaScript", icon: "javascript.svg" },
            { name: "TailwindCSS", icon: "tailwind.svg" },
            { name: "NodeJS", icon: "nodejs.svg" },
            { name: "REST APIs", icon: "rest.svg" },
            { name: "Connected TV", icon: "connected-tv.svg" },
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center p-3 mb-2">
                <div className="text-gray-800 dark:text-gray-200 text-2xl">
                  {tech.name === "NextJS" && "N"}
                  {tech.name === "React" && "⚛️"}
                  {tech.name === "TypeScript" && "TS"}
                  {tech.name === "JavaScript" && "JS"}
                  {tech.name === "TailwindCSS" && "TW"}
                  {tech.name === "NodeJS" && "N"}
                  {tech.name === "REST APIs" && "API"}
                  {tech.name === "Connected TV" && "CTV"}
                </div>
              </div>
              <span className="text-sm">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedProjects;