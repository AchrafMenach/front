import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProgressionNotification = ({ 
  progressionData, 
  onCelebrate, 
  onContinue, 
  show 
}) => {
  if (!show || !progressionData?.progression_occurred) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="max-w-md w-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700 shadow-2xl">
        <CardContent className="p-6 text-center">
          {/* Animation de célébration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.5 }}
            className="mb-4"
          >
            <div className="relative">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Message principal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
              Félicitations ! 🎉
            </h2>
            <p className="text-yellow-600 dark:text-yellow-400 mb-4">
              {progressionData.message}
            </p>
          </motion.div>

          {/* Détails de progression */}
          {progressionData.new_objective && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Nouvel Objectif
                </Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Niveau {progressionData.new_level}
                </Badge>
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {progressionData.new_objective}
              </p>
            </motion.div>
          )}

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="flex space-x-3"
          >
            <Button 
              onClick={onCelebrate}
              variant="outline"
              className="flex-1 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              <Star className="w-4 h-4 mr-2" />
              Voir Progression
            </Button>
            <Button 
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressionNotification;