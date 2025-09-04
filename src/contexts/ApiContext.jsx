import React, { createContext, useContext } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

// Configuration de l'API
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteurs pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const ApiProvider = ({ children }) => {
  
  const generateExercise = async (studentId) => {
    try {
      const response = await api.post('/exercises/generate', { student_id: studentId });
      return response.data;
    } catch (error) {
      console.error('Error generating exercise:', error);
      throw error;
    }
  };

  const generateSimilarExercise = async (originalExercise) => {
    try {
      const response = await api.post('/exercises/similar', originalExercise);
      return response.data;
    } catch (error) {
      console.error('Error generating similar exercise:', error);
      throw error;
    }
  };

  const evaluateAnswer = async (exercise, answer, studentId) => {
    try {
      const response = await api.post('/exercises/evaluate', {
        exercise,
        answer,
        student_id: studentId,
      });
      return response.data;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      throw error;
    }
  };

  const evaluateAnswerWithPersonalizedCoaching = async (exercise, answer, studentId) => {
    try {
      const response = await api.post('/exercises/evaluate-with-coaching', {
        exercise,
        answer,
        student_id: studentId,
      });
      
      // Log pour debug
      console.log('API Response:', response.data);
      console.log('API Response structure:', JSON.stringify(response.data, null, 2));
      
      // Assurez-vous de retourner response.data et non response
      return response.data;
    } catch (error) {
      console.error('Error evaluating answer with personalized coaching:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const getPersonalizedCoachingMessage = async (exercise, studentAnswer, studentId, evaluation = null) => {
    try {
      const response = await api.post('/coach/personalized-message', {
        exercise,
        student_answer: studentAnswer,
        student_id: studentId,
        evaluation
      });
      return response.data;
    } catch (error) {
      console.error('Error getting personalized coaching message:', error);
      throw error;
    }
  };

  const evaluateFileAnswer = async (studentId, exercise, file) => {
    try {
      const formData = new FormData();
      formData.append('student_id', studentId);
      formData.append('exercise', JSON.stringify(exercise));
      formData.append('file', file);

      const response = await api.post('/exercises/evaluate-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error evaluating file answer:', error);
      throw error;
    }
  };

  const getCoachMessage = async () => {
    try {
      const response = await api.get('/coach/message');
      return response.data;
    } catch (error) {
      console.error('Error getting coach message:', error);
      throw error;
    }
  };

  const getLearningObjectives = async () => {
    try {
      const response = await api.get('/objectives');
      return response.data;
    } catch (error) {
      console.error('Error getting learning objectives:', error);
      throw error;
    }
  };

  const getCurrentObjectiveInfo = async (studentId) => {
    try {
      const response = await api.get(`/objectives/${studentId}/current`);
      return response.data;
    } catch (error) {
      console.error('Error getting current objective info:', error);
      throw error;
    }
  };

  const getProgressionStatus = async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/progression-status`);
      return response.data;
    } catch (error) {
      console.error('Error getting progression status:', error);
      throw error;
    }
  };

  const advanceStudentObjective = async (studentId) => {
    try {
      const response = await api.post(`/students/${studentId}/advance-objective`);
      return response.data;
    } catch (error) {
      console.error('Error advancing student objective:', error);
      throw error;
    }
  };

  const checkObjectiveCompletion = async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/check-completion`);
      return response.data;
    } catch (error) {
      console.error('Error checking objective completion:', error);
      throw error;
    }
  };

  const getAvailableTestObjectives = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/level-test/objectives`);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des objectifs de test:', error);
      throw error;
    }
  };

  const generateLevelTest = async (objectives, questionsPerObjective = 2, maxLevelPerObjective = 3) => {
    try {
      const response = await fetch(`${API_BASE_URL}/level-test/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectives,
          questions_per_objective: questionsPerObjective,
          max_level_per_objective: maxLevelPerObjective
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la génération du test de niveau:', error);
      throw error;
    }
  };

  const submitLevelTest = async (studentId, responses) => {
    try {
      const response = await fetch(`${API_BASE_URL}/level-test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          responses
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la soumission du test de niveau:', error);
      throw error;
    }
  };

  const getSystemStats = async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw error;
    }
  };

  const value = {
    api,
    // Génération d'exercices
    generateExercise,
    generateSimilarExercise,
    
    // Évaluation
    evaluateAnswer,
    evaluateAnswerWithPersonalizedCoaching,
    evaluateFileAnswer,
    
    // Coaching personnalisé
    getPersonalizedCoachingMessage,
    getCoachMessage,
    
    // Progression et objectifs
    getProgressionStatus,
    advanceStudentObjective, 
    checkObjectiveCompletion,
    getLearningObjectives,
    getCurrentObjectiveInfo,
    
    // Test de niveau
    getAvailableTestObjectives,
    generateLevelTest,
    submitLevelTest,
    
    // Statistiques
    getSystemStats
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};