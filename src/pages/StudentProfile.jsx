import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Award, 
  Target,
  BookOpen,
  Calendar,
  Edit,
  Save,
  X,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStudent } from '@/contexts/StudentContext';
import { useApi } from '@/contexts/ApiContext';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { useToast } from '@/hooks/use-toast';

const StudentProfile = () => {
  const { currentStudent, getStudentProgress } = useStudent();
  const { getLearningObjectives, getCurrentObjectiveInfo } = useApi();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [progress, setProgress] = useState(null);
  const [objectives, setObjectives] = useState(null);
  const [objectiveInfo, setObjectiveInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentStudent) {
      setEditedName(currentStudent.name);
    }
  }, [currentStudent]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!currentStudent) return;
      
      setLoading(true);
      try {
        const [progressData, objectivesData, objectiveInfoData] = await Promise.allSettled([
          getStudentProgress(currentStudent.student_id),
          getLearningObjectives(),
          getCurrentObjectiveInfo(currentStudent.student_id)
        ]);

        if (progressData.status === 'fulfilled') {
          setProgress(progressData.value);
        }
        if (objectivesData.status === 'fulfilled') {
          setObjectives(objectivesData.value);
        }
        if (objectiveInfoData.status === 'fulfilled') {
          setObjectiveInfo(objectiveInfoData.value);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [currentStudent]);

  if (!currentStudent) {
    return <div>Chargement...</div>;
  }

  const handleSaveProfile = () => {
    // Note: Dans une vraie application, vous appelleriez une API pour sauvegarder
    toast({
      title: "Profil mis à jour",
      description: "Vos modifications ont été sauvegardées",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(currentStudent.name);
    setIsEditing(false);
  };

  const learningHistory = currentStudent.learning_history || [];
  const successRate = learningHistory.length > 0 
    ? Math.round((learningHistory.filter(item => item.evaluation).length / learningHistory.length) * 100)
    : 0;

  const completedObjectives = currentStudent.objectives_completed || [];
  const totalObjectives = objectives ? objectives.order.length : 0;

  const profileStats = [
    {
      label: "Niveau",
      value: currentStudent.level,
      icon: Award,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "Exercices Complétés",
      value: learningHistory.length,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      label: "Taux de Réussite",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      label: "Objectifs Complétés",
      value: `${completedObjectives.length}/${totalObjectives}`,
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profil Étudiant
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gérez vos informations et consultez vos statistiques
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {currentStudent.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-2xl font-bold"
                      />
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentStudent.name}
                      </h2>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  ID: {currentStudent.student_id}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Niveau {currentStudent.level}
                  </Badge>
                  {currentStudent.current_objective && (
                    <Badge variant="outline">
                      {currentStudent.current_objective}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {profileStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${stat.bgColor} border-0`}>
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.bgColor} mb-2`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Current Objective */}
      {objectiveInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Objectif Actuel</span>
              </CardTitle>
              <CardDescription>
                Votre focus d'apprentissage en cours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-700 dark:text-blue-300 mb-2">
                  {currentStudent.current_objective}
                </h3>
                {objectiveInfo.description && (
                  <AutoMathRenderer 
                    text={objectiveInfo.description}
                    className="text-gray-600 dark:text-gray-300"
                  />
                )}
              </div>
              {progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{progress.completed}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.completed}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Completed Objectives */}
      {completedObjectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-green-500" />
                <span>Objectifs Complétés</span>
              </CardTitle>
              <CardDescription>
                Vos accomplissements jusqu'à présent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {completedObjectives.map((objective, index) => (
                  <motion.div
                    key={objective}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                    className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-700 dark:text-green-300">
                        {objective}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity */}
      {learningHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>Activité Récente</span>
              </CardTitle>
              <CardDescription>
                Vos derniers exercices complétés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {learningHistory.slice(-5).reverse().map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        item.evaluation ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <AutoMathRenderer 
                        text={item.exercise}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      />
                      {item.timestamp && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <Badge variant={item.evaluation ? "default" : "secondary"} className="text-xs">
                      {item.evaluation ? "✓" : "✗"}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default StudentProfile;

