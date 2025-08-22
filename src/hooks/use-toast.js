import { useState, useEffect } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Date.now();
    const newToast = {
      id,
      title,
      description,
      variant,
      duration
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const dismiss = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toast,
    toasts,
    dismiss
  };
};

export { useToast };

