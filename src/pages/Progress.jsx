import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useStudent } from '@/contexts/StudentContext';
import { useApi } from '@/contexts/ApiContext';
import { AutoMathRenderer } from '@/components/MathRenderer';

const ProgressPage = () => {
  const { currentStudent, getStudentProgress } = useStudent();
  const { getLearningObjectives, getCurrentObjectiveInfo } = useApi();
  
  const [progress, setProgress] = useState(null);
  const [objectives, setObjectives] = useState(null);
  const [objectiveInfo, setObjectiveInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
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
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [currentStudent]);

  if (!currentStudent) {
    return <div>Chargement...</div>;
  }

  // Prepare chart data
  const learningHistory = currentStudent.learning_history || [];
  const recentHistory = learningHistory.slice(-10);
  
  const chartData = recentHistory.map((item, index) => ({
    exercise: `Ex ${index + 1}`,
    success: item.evaluation ? 1 : 0,
    timestamp: item.timestamp
  }));

  const successRate = learningHistory.length > 0 
    ? Math.round((learningHistory.filter(item => item.evaluation).length / learningHistory.length) * 100)
    : 0;

  const pieData = [
    { name: 'Correct', value: learningHistory.filter(item => item.evaluation).length, color: '#10b981' },
    { name: 'Incorrect', value: learningHistory.filter(item => !item.evaluation).length, color: '#ef4444' }
  ];

  const objectiveProgress = objectives ? objectives.order.map((objKey, index) => ({
    name: objKey,
    completed: currentStudent.objectives_completed?.includes(objKey) || false,
    current: currentStudent.current_objective === objKey,
    description: objectives.objectives[objKey]?.description || ''
  })) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Progression de {currentStudent.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Suivez vos progrès et analysez vos performances
        </p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Niveau</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {currentStudent.level}
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Taux de Réussite</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {successRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Exercices</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {learningHistory.length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Objectifs</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                  {currentStudent.objectives_completed?.length || 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="objectives">Objectifs</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span>Progression Actuelle</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression Générale</span>
                      <span>{progress?.completed || 0}%</span>
                    </div>
                    <Progress value={progress?.completed || 0} className="h-3" />
                  </div>
                  
                  {objectiveInfo && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Objectif Actuel
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                        {currentStudent.current_objective}
                      </p>
                      {objectiveInfo.description && (
                        <AutoMathRenderer 
                          text={objectiveInfo.description}
                          className="text-sm text-gray-600 dark:text-gray-300"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <span>Performance Récente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="exercise" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip 
                          formatter={(value) => [value === 1 ? 'Correct' : 'Incorrect', 'Résultat']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="success" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune donnée disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Objectives Tab */}
          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>Parcours d'Apprentissage</span>
                </CardTitle>
                <CardDescription>
                  Suivez votre progression à travers les différents objectifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {objectiveProgress.map((objective, index) => (
                    <motion.div
                      key={objective.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`p-4 rounded-lg border-2 ${
                        objective.current 
                          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
                          : objective.completed
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{objective.name}</h4>
                        <div className="flex items-center space-x-2">
                          {objective.current && (
                            <Badge variant="default">En cours</Badge>
                          )}
                          {objective.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                      </div>
                      {objective.description && (
                        <AutoMathRenderer 
                          text={objective.description}
                          className="text-sm text-gray-600 dark:text-gray-300"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span>Historique des Exercices</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {learningHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {learningHistory.slice().reverse().map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {item.evaluation ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <AutoMathRenderer 
                            text={item.exercise}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          />
                          {item.timestamp && (
                            <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge variant={item.evaluation ? "default" : "secondary"}>
                          {item.evaluation ? "Correct" : "Incorrect"}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucun exercice complété pour le moment
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Success Rate Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-blue-500" />
                    <span>Répartition des Résultats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.some(d => d.value > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune donnée disponible
                    </div>
                  )}
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Correct ({pieData[0]?.value || 0})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Incorrect ({pieData[1]?.value || 0})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <span>Statistiques Détaillées</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {learningHistory.length}
                      </p>
                      <p className="text-sm text-blue-500">Total Exercices</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {learningHistory.filter(item => item.evaluation).length}
                      </p>
                      <p className="text-sm text-green-500">Réussites</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {currentStudent.level}
                      </p>
                      <p className="text-sm text-purple-500">Niveau</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {successRate}%
                      </p>
                      <p className="text-sm text-orange-500">Taux Réussite</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ProgressPage;

