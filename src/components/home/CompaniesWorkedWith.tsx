// components/home/CompaniesWorkedWith.js
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Company } from '@/data/companies';

const CompaniesWorkedWith = ({ companies }: { companies: Company[] }) => {
  return (
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Companies I&apos;ve Worked With</h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          I&apos;ve had the privilege of working with amazing brands across different industries
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            className="w-full h-20 relative transition-all duration-300 bg-white dark:bg-gray-100 rounded-lg p-2 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={company.logoUrl}
              alt={company.name}
              fill
              className="object-contain p-2"
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="flex flex-wrap gap-4 max-w-4xl mx-auto mt-12 justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {['NextJS', 'TypeScript', 'React', 'NodeJS', 'JavaScript', 'TailwindCSS', 'Redux', 'GraphQL', 'REST APIs', 'Connected TV'].map((tech, index) => (
          <motion.span
            key={tech}
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default CompaniesWorkedWith;