import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  MessageCircle,
  Play,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useStudent } from '@/contexts/StudentContext';
import { useApi } from '@/contexts/ApiContext';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentStudent, getStudentProgress } = useStudent();
  const { getCoachMessage, getCurrentObjectiveInfo, getSystemStats } = useApi();
  
  const [progress, setProgress] = useState(null);
  const [coachMessage, setCoachMessage] = useState(null);
  const [objectiveInfo, setObjectiveInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentStudent) return;
      
      setLoading(true);
      try {
        const [progressData, coachData, objectiveData, statsData] = await Promise.allSettled([
          getStudentProgress(currentStudent.student_id),
          getCoachMessage(),
          getCurrentObjectiveInfo(currentStudent.student_id),
          getSystemStats()
        ]);

        if (progressData.status === 'fulfilled') {
          setProgress(progressData.value);
        }
        if (coachData.status === 'fulfilled') {
          setCoachMessage(coachData.value);
        }
        if (objectiveData.status === 'fulfilled') {
          setObjectiveInfo(objectiveData.value);
        }
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentStudent]);

  if (!currentStudent) {
    return <div>Chargement...</div>;
  }

  const quickActions = [
    {
      title: "Nouvel Exercice",
      description: "Commencer un exercice adapté à votre niveau",
      icon: BookOpen,
      action: () => navigate('/exercise'),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Voir Progression",
      description: "Consulter vos statistiques détaillées",
      icon: TrendingUp,
      action: () => navigate('/progress'),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Mon Profil",
      description: "Gérer vos informations et préférences",
      icon: Target,
      action: () => navigate('/profile'),
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bonjour, {currentStudent.name} ! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Prêt à continuer votre parcours mathématique ?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Niveau Actuel</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {currentStudent.level}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Objectifs Complétés</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {currentStudent.objectives_completed?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Progression</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {progress ? `${progress.completed}%` : '0%'}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Objective */}
      {objectiveInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Objectif Actuel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
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
                    <Progress value={progress.completed} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {action.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Commencer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      {currentStudent.learning_history && currentStudent.learning_history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>Activité Récente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentStudent.learning_history.slice(-3).reverse().map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <AutoMathRenderer 
                        text={item.exercise}
                        className="text-sm text-gray-700 dark:text-gray-300"
                        inlineClassName="text-sm"
                      />
                    </div>
                    <Badge variant={item.evaluation ? "default" : "secondary"}>
                      {item.evaluation ? "Correct" : "À revoir"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

