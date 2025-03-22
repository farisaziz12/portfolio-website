// components/about/ValuesCard.js
import { motion } from 'framer-motion';

const ValuesCard = ({ title, description, icon, index }: { title: string, description: string, icon: React.ReactNode, index: number }) => {
  // Colors based on index to create variety
  const colors = [
    { bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300" },
    { bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-300" },
    { bg: "bg-green-50 dark:bg-green-900/30", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300" },
    { bg: "bg-yellow-50 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-700 dark:text-yellow-300" },
    { bg: "bg-red-50 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300" },
    { bg: "bg-teal-50 dark:bg-teal-900/30", border: "border-teal-200 dark:border-teal-800", text: "text-teal-700 dark:text-teal-300" },
  ];
  
  // Get color scheme based on index
  const colorScheme = colors[index % colors.length];

  return (
    <motion.div
      className={`p-6 rounded-lg border ${colorScheme.border} ${colorScheme.bg} relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-white/20 dark:bg-black/5"></div>
      <div className="absolute right-8 bottom-6 w-4 h-4 rounded-full bg-white/30 dark:bg-black/10"></div>
      
      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>
      
      {/* Content */}
      <h3 className={`text-xl font-bold mb-3 ${colorScheme.text}`}>{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

export default ValuesCard;