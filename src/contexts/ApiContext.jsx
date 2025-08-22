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
const DEMO_MODE = false; // Mode démo pour la présentation

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data pour le mode démo
const mockStudent = {
  student_id: 'demo-student-001',
  name: 'Alice Dupont',
  level: 3,
  current_objective: 'Équations du second degré',
  objectives_completed: ['Équations linéaires', 'Systèmes d\'équations']
};

const mockExercise = {
  exercise: 'Résolvez l\'équation du second degré suivante: $x^2 - 5x + 6 = 0$',
  objective: 'Équations du second degré',
  difficulty: 3,
  context: 'Utilisez la méthode de factorisation ou la formule quadratique: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$'
};

const mockEvaluation = {
  is_correct: true,
  feedback: 'Excellente réponse ! Vous avez correctement identifié les deux solutions.',
  explanation: 'L\'équation $x^2 - 5x + 6 = 0$ peut être factorisée comme $(x-2)(x-3) = 0$, donnant $x = 2$ ou $x = 3$.',
  correct_answer: '$x = 2$ ou $x = 3$'
};

const mockCoachMessage = {
  message: 'Félicitations Alice ! Vous progressez très bien dans les équations du second degré. Continuez sur cette lancée !',
  motivation: 'Votre persévérance porte ses fruits. Vous maîtrisez de mieux en mieux les concepts mathématiques !'
};

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
    if (DEMO_MODE) {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockExercise;
    }
    
    try {
      const response = await api.post('/exercises/generate', { student_id: studentId });
      return response.data;
    } catch (error) {
      console.error('Error generating exercise:', error);
      throw error;
    }
  };

  const generateSimilarExercise = async (originalExercise) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        ...mockExercise,
        exercise: 'Résolvez l\'équation du second degré suivante: $x^2 - 7x + 12 = 0$',
        context: 'Essayez de factoriser cette équation ou utilisez la formule quadratique.'
      };
    }
    
    try {
      const response = await api.post('/exercises/similar', originalExercise);
      return response.data;
    } catch (error) {
      console.error('Error generating similar exercise:', error);
      throw error;
    }
  };

  const evaluateAnswer = async (exercise, answer, studentId) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isCorrect = answer.toLowerCase().includes('2') && answer.toLowerCase().includes('3');
      return {
        ...mockEvaluation,
        is_correct: isCorrect,
        feedback: isCorrect ? mockEvaluation.feedback : 'Pas tout à fait. Vérifiez vos calculs et essayez à nouveau.',
        explanation: isCorrect ? mockEvaluation.explanation : 'Rappelez-vous que pour $ax^2 + bx + c = 0$, vous pouvez utiliser la factorisation ou la formule quadratique.'
      };
    }
    
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

  const evaluateFileAnswer = async (studentId, exercise, file) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        ...mockEvaluation,
        feedback: 'Votre fichier a été analysé. La solution présentée est correcte !',
        explanation: 'Votre démarche écrite est claire et méthodique.'
      };
    }
    
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
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockCoachMessage;
    }
    
    try {
      const response = await api.get('/coach/message');
      return response.data;
    } catch (error) {
      console.error('Error getting coach message:', error);
      throw error;
    }
  };

  const getLearningObjectives = async () => {
    if (DEMO_MODE) {
      return {
        objectives: {
          'Équations linéaires': { description: 'Résolution d\'équations du premier degré' },
          'Systèmes d\'équations': { description: 'Résolution de systèmes d\'équations linéaires' },
          'Équations du second degré': { description: 'Résolution d\'équations quadratiques' },
          'Fonctions': { description: 'Étude des fonctions mathématiques' }
        },
        order: ['Équations linéaires', 'Systèmes d\'équations', 'Équations du second degré', 'Fonctions']
      };
    }
    
    try {
      const response = await api.get('/objectives');
      return response.data;
    } catch (error) {
      console.error('Error getting learning objectives:', error);
      throw error;
    }
  };

  const getCurrentObjectiveInfo = async (studentId) => {
    if (DEMO_MODE) {
      return {
        description: 'Apprenez à résoudre les équations du second degré en utilisant différentes méthodes : factorisation, complétion du carré, et formule quadratique $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$.'
      };
    }
    
    try {
      const response = await api.get(`/objectives/${studentId}/current`);
      return response.data;
    } catch (error) {
      console.error('Error getting current objective info:', error);
      throw error;
    }
  };

  const getSystemStats = async () => {
    if (DEMO_MODE) {
      return {
        students_count: 1,
        objectives_available: 4,
        llm_status: 'online',
        system_version: '1.0.0'
      };
    }
    
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
    generateExercise,
    generateSimilarExercise,
    evaluateAnswer,
    evaluateFileAnswer,
    getCoachMessage,
    getLearningObjectives,
    getCurrentObjectiveInfo,
    getSystemStats,
    DEMO_MODE,
    mockStudent
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

