import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { StudentProvider } from '@/contexts/StudentContext';
import { ApiProvider } from '@/contexts/ApiContext';

// Pages
import Dashboard from '@/pages/Dashboard';
import StudentProfile from '@/pages/StudentProfile';
import Exercise from '@/pages/Exercise';
import Progress from '@/pages/Progress';
import Welcome from '@/pages/Welcome';

// Components
import Navbar from '@/components/Navbar';
import LoadingScreen from '@/components/LoadingScreen';

import './App.css';
import 'katex/dist/katex.min.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="math-tutor-theme">
      <ApiProvider>
        <StudentProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <AnimatePresence mode="wait">
                {currentStudent ? (
                  <motion.div
                    key="main-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col min-h-screen"
                  >
                    <Navbar />
                    <main className="flex-1 container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/profile" element={<StudentProfile />} />
                        <Route path="/exercise" element={<Exercise />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Welcome onStudentSelect={setCurrentStudent} />
                  </motion.div>
                )}
              </AnimatePresence>
              <Toaster />
            </div>
          </Router>
        </StudentProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;

