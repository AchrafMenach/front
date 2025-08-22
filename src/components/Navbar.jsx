import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  BookOpen, 
  TrendingUp, 
  Moon, 
  Sun, 
  LogOut,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useStudent } from '@/contexts/StudentContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { currentStudent, clearStudent } = useStudent();

  const navItems = [
    { path: '/', icon: Home, label: 'Tableau de bord' },
    { path: '/profile', icon: User, label: 'Profil' },
    { path: '/exercise', icon: BookOpen, label: 'Exercices' },
    { path: '/progress', icon: TrendingUp, label: 'Progression' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Math Tutor
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg -z-10"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Student Info */}
            {currentStudent && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {currentStudent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentStudent.name}
                </span>
              </motion.div>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </motion.div>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearStudent}
              className="w-9 h-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

