import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudent } from '@/contexts/StudentContext';
import { useToast } from '@/hooks/use-toast';

const Welcome = ({ onStudentSelect }) => {
  const [studentName, setStudentName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createStudent, loading } = useStudent();
  const { toast } = useToast();

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom d'étudiant",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      const newStudent = await createStudent(studentName.trim());
      onStudentSelect(newStudent);
      toast({
        title: "Succès",
        description: `Profil créé pour ${newStudent.name}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le profil étudiant",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "IA Avancée",
      description: "Système intelligent basé sur CrewAI pour un apprentissage personnalisé"
    },
    {
      icon: Calculator,
      title: "Exercices Adaptatifs",
      description: "Génération automatique d'exercices adaptés à votre niveau"
    },
    {
      icon: TrendingUp,
      title: "Suivi de Progression",
      description: "Visualisation détaillée de vos progrès et objectifs"
    },
    {
      icon: Users,
      title: "Coach Personnel",
      description: "Assistant virtuel pour vous motiver et vous guider"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Math Tutor
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="inline-block ml-2"
            >
              <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 inline" />
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Votre assistant mathématique intelligent propulsé par l'IA. 
            Apprenez, progressez et excellez avec un accompagnement personnalisé.
          </motion.p>

          {/* Student Creation Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-md mx-auto mb-12"
          >
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Commencer</span>
                </CardTitle>
                <CardDescription>
                  Créez votre profil pour débuter votre parcours mathématique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Votre nom"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="text-center text-lg"
                    disabled={loading || isCreating}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 text-lg"
                    disabled={loading || isCreating}
                  >
                    {isCreating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Créer mon profil
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Exercices illimités</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Progression en temps réel</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>IA personnalisée</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;

