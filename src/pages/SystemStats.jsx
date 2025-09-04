import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Users, 
  Target, 
  Activity,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/contexts/ApiContext';

const SystemStats = () => {
  const { getSystemStats } = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const statsData = await getSystemStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading system stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const systemCards = [
    {
      title: "Étudiants Actifs",
      value: stats?.students_count || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "Nombre total d'étudiants enregistrés"
    },
    {
      title: "Objectifs Disponibles",
      value: stats?.objectives_available || 0,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Objectifs d'apprentissage configurés"
    },
    {
      title: "Statut LLM",
      value: stats?.llm_status === 'online' ? 'En ligne' : 'Hors ligne',
      icon: stats?.llm_status === 'online' ? CheckCircle : AlertCircle,
      color: stats?.llm_status === 'online' ? "text-green-500" : "text-red-500",
      bgColor: stats?.llm_status === 'online' ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
      description: "État du modèle de langage IA"
    },
    {
      title: "Version Système",
      value: stats?.system_version || "N/A",
      icon: Info,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      description: "Version actuelle du système"
    }
  ];

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
          Statistiques Système
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Vue d'ensemble de l'état et des performances du système
        </p>
      </motion.div>

      {/* System Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-500" />
              <span>État du Système</span>
            </CardTitle>
            <CardDescription>
              Informations générales sur le fonctionnement du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="font-medium">Système Opérationnel</span>
              </div>
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="w-4 h-4 mr-1" />
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {systemCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${card.bgColor} border-0 h-full`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {card.value}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informations Techniques</CardTitle>
            <CardDescription>
              Détails techniques sur la configuration du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">API Backend</span>
                  <Badge variant="outline">FastAPI</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Frontend</span>
                  <Badge variant="outline">React + Vite</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">IA Framework</span>
                  <Badge variant="outline">CrewAI</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Base de Données</span>
                  <Badge variant="outline">ChromaDB</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Modèle LLM</span>
                  <Badge variant="outline" className={stats?.llm_status === 'online' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}>
                    {stats?.llm_status === 'online' ? 'Groq LLM' : 'Indisponible'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Version API</span>
                  <Badge variant="outline">{stats?.system_version || "1.0.0"}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SystemStats;

