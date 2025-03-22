// components/about/Skillset.js
import { useState } from 'react';
import { motion } from 'framer-motion';

const Skillset = () => {
  // Active category for filtering
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Skill categories
  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'tools', name: 'Tools & DevOps' },
    { id: 'soft', name: 'Leadership & Soft Skills' }
  ];
  
  // Skills data with proficiency levels and categories
  const skills = [
    // Frontend Skills
    { name: 'NextJS', level: 95, category: 'frontend', icon: '⚛️' },
    { name: 'React', level: 95, category: 'frontend', icon: '⚛️' },
    { name: 'TypeScript', level: 90, category: 'frontend', icon: 'TS' },
    { name: 'JavaScript', level: 95, category: 'frontend', icon: 'JS' },
    { name: 'TailwindCSS', level: 90, category: 'frontend', icon: '🎨' },
    { name: 'CSS/SCSS', level: 85, category: 'frontend', icon: '🎨' },
    { name: 'HTML5', level: 95, category: 'frontend', icon: '📄' },
    { name: 'State Management', level: 90, category: 'frontend', icon: '🧩' },
    { name: 'Web Accessibility', level: 85, category: 'frontend', icon: '♿' },
    { name: 'Frontend Testing', level: 80, category: 'frontend', icon: '🧪' },
    { name: 'Web Performance', level: 90, category: 'frontend', icon: '⚡' },
    
    // Backend Skills
    { name: 'Node.js', level: 80, category: 'backend', icon: '🟢' },
    { name: 'Express', level: 75, category: 'backend', icon: '🚂' },
    { name: 'MongoDB', level: 70, category: 'backend', icon: '🍃' },
    { name: 'RESTful APIs', level: 85, category: 'backend', icon: '🔌' },
    { name: 'GraphQL', level: 70, category: 'backend', icon: '⚙️' },
    { name: 'API Design', level: 80, category: 'backend', icon: '📋' },
    
    // Tools & DevOps
    { name: 'Git', level: 90, category: 'tools', icon: '📂' },
    { name: 'CI/CD', level: 85, category: 'tools', icon: '🔄' },
    { name: 'Docker', level: 70, category: 'tools', icon: '🐳' },
    { name: 'Webpack', level: 80, category: 'tools', icon: '📦' },
    { name: 'Vercel', level: 90, category: 'tools', icon: '🚀' },
    { name: 'Testing Tools', level: 85, category: 'tools', icon: '🧪' },
    { name: 'Monitoring', level: 75, category: 'tools', icon: '📊' },
    
    // Leadership & Soft Skills
    { name: 'Team Leadership', level: 90, category: 'soft', icon: '👨‍💼' },
    { name: 'Public Speaking', level: 95, category: 'soft', icon: '🎤' },
    { name: 'Mentoring', level: 90, category: 'soft', icon: '👨‍🏫' },
    { name: 'Technical Writing', level: 85, category: 'soft', icon: '✍️' },
    { name: 'Agile Methodologies', level: 85, category: 'soft', icon: '🔄' },
    { name: 'Cross-team Collaboration', level: 90, category: 'soft', icon: '🤝' },
    { name: 'Problem Solving', level: 95, category: 'soft', icon: '🧩' },
  ];
  
  // Filter skills based on active category
  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);
  
  return (
    <div>
      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                <span className="text-lg">{skill.icon}</span>
              </div>
              <h3 className="font-bold">{skill.name}</h3>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1 overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Proficiency</span>
              <span>{skill.level}%</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Skill Categories Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frontend Expertise */}
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">⚛️</span>
            Frontend Specialization
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            My core expertise is in building robust, scalable frontend applications with modern JavaScript frameworks. I&apos;m particularly passionate about:
          </p>
          <ul className="space-y-2">
            {[
              "Creating performant Next.js applications",
              "Building accessible user interfaces",
              "Implementing state management strategies",
              "Frontend architecture and best practices",
              "Performance optimization techniques"
            ].map((item, i) => (
              <motion.li 
                key={i}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        {/* Leadership Growth */}
        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">👨‍💼</span>
            Engineering Leadership
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Beyond coding, I&apos;ve developed strong leadership skills that help teams thrive and deliver exceptional results:
          </p>
          <ul className="space-y-2">
            {[
              "Building and mentoring high-performing teams",
              "Creating career progression frameworks",
              "Facilitating effective cross-team collaboration",
              "Balancing technical excellence with business needs",
              "Fostering inclusive and psychologically safe environments"
            ].map((item, i) => (
              <motion.li 
                key={i}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
      
      {/* Learning and Growth */}
      <motion.div 
        className="mt-8 p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold mb-2">Always Learning! 📚</h3>
        <p className="text-gray-700 dark:text-gray-300">
          I&apos;m constantly exploring new technologies and approaches. Currently diving deeper into: Frontend observability, Edge computing, and React Server Components.
        </p>
      </motion.div>
    </div>
  );
};

export default Skillset;