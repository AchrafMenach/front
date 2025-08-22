import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Toast = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.variant) {
      case 'destructive':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (toast.variant) {
      case 'destructive':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-white border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${getStyles()}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-medium">
                {toast.title}
              </p>
            )}
            {toast.description && (
              <p className="mt-1 text-sm opacity-90">
                {toast.description}
              </p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => onDismiss(toast.id)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Toaster = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end space-y-4 p-6 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={dismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

