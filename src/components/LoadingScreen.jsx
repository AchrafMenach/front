import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Calculator } from 'lucide-react';

const LoadingScreen = () => {
  const icons = [BookOpen, Brain, Calculator];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-4 relative"
            >
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center space-x-4 mb-6"
            >
              {icons.map((Icon, index) => (
                <motion.div
                  key={index}
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                >
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Math Tutor
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Initialisation de votre assistant mathématique intelligent...
          </p>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 2 }}
          className="mt-8 mx-auto max-w-xs"
        >
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;

