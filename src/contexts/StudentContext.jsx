import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from './ApiContext';

const StudentContext = createContext();

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { api, DEMO_MODE, mockStudent } = useApi();

  const createStudent = async (name) => {
    setLoading(true);
    try {
      if (DEMO_MODE) {
        // Mode démo
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoStudent = {
          ...mockStudent,
          name,
          learning_history: [
            {
              exercise: 'Résolvez: $2x + 5 = 13$',
              answer: '$x = 4$',
              evaluation: true,
              timestamp: new Date(Date.now() - 86400000).toISOString()
            },
            {
              exercise: 'Trouvez $x$ et $y$: $\\begin{cases} x + y = 5 \\\\ 2x - y = 1 \\end{cases}$',
              answer: '$x = 2, y = 3$',
              evaluation: true,
              timestamp: new Date(Date.now() - 43200000).toISOString()
            },
            {
              exercise: 'Résolvez: $x^2 - 4x + 3 = 0$',
              answer: '$x = 1$ ou $x = 3$',
              evaluation: true,
              timestamp: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        };
        setStudents(prev => [...prev, demoStudent]);
        setCurrentStudent(demoStudent);
        return demoStudent;
      } else {
        const response = await api.post('/students/', { name });
        const newStudent = response.data;
        setStudents(prev => [...prev, newStudent]);
        setCurrentStudent(newStudent);
        return newStudent;
      }
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadStudent = async (studentId) => {
    setLoading(true);
    try {
      if (DEMO_MODE) {
        setCurrentStudent(mockStudent);
        return mockStudent;
      } else {
        const response = await api.get(`/students/${studentId}`);
        const student = response.data;
        setCurrentStudent(student);
        return student;
      }
    } catch (error) {
      console.error('Error loading student:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStudentProgress = async (studentId) => {
    try {
      if (DEMO_MODE) {
        // Calculer la progression basée sur l'historique d'apprentissage
        const correctAnswers = mockStudent.learning_history ? 
          mockStudent.learning_history.filter(h => h.evaluation).length : 0;
        const totalAnswers = mockStudent.learning_history ? 
          mockStudent.learning_history.length : 0;
        
        const completionPercentage = totalAnswers > 0 ? 
          Math.round((correctAnswers / Math.max(totalAnswers, 10)) * 100) : 0;
        
        return {
          level: mockStudent.level || 3,
          completed: Math.min(completionPercentage, 100),
          current_objective: 'Équations du second degré',
          objectives_completed: correctAnswers >= 3 ? 
            ['Équations linéaires', 'Systèmes d\'équations'] : 
            correctAnswers >= 1 ? ['Équations linéaires'] : []
        };
      } else {
        const response = await api.get(`/students/${studentId}/progress`);
        return response.data;
      }
    } catch (error) {
      console.error('Error getting student progress:', error);
      throw error;
    }
  };

  const selectStudent = (student) => {
    setCurrentStudent(student);
  };

  const clearStudent = () => {
    setCurrentStudent(null);
  };

  const updateStudentName = async (studentId, newName) => {
    try {
      if (DEMO_MODE) {
        // En mode démo, on met à jour localement
        if (currentStudent && currentStudent.student_id === studentId) {
          const updatedStudent = { ...currentStudent, name: newName };
          setCurrentStudent(updatedStudent);
          return updatedStudent;
        }
      } else {
        // En mode réel, on ferait un appel API PUT/PATCH ici
        // Pour l'instant, on met à jour localement car l'endpoint n'existe pas
        if (currentStudent && currentStudent.student_id === studentId) {
          const updatedStudent = { ...currentStudent, name: newName };
          setCurrentStudent(updatedStudent);
          return updatedStudent;
        }
      }
    } catch (error) {
      console.error('Error updating student name:', error);
      throw error;
    }
  };
const updateStudentData = async (updatedStudent) => {
  try {
    // Mettre à jour l'état local
    setCurrentStudent(updatedStudent);
    
    // Optionnel: sauvegarder sur le serveur si vous avez un endpoint pour ça
    if (!DEMO_MODE) {
      // await api.put(`/students/${updatedStudent.student_id}`, updatedStudent);
    }
    
    // Mettre à jour le localStorage pour la persistance
    localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
    
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student data:', error);
    throw error;
  }
};

const refreshStudentData = async (studentId) => {
  try {
    if (DEMO_MODE) {
      // En mode démo, utiliser les données mockées mises à jour
      setCurrentStudent(mockStudent);
      return mockStudent;
    } else {
      // Recharger depuis le serveur
      const response = await api.get(`/students/${studentId}`);
      const studentData = response.data;
      setCurrentStudent(studentData);
      localStorage.setItem('currentStudent', JSON.stringify(studentData));
      return studentData;
    }
  } catch (error) {
    console.error('Error refreshing student data:', error);
    throw error;
  }
};

  const value = {
    currentStudent,
    students,
    loading,
    createStudent,
    loadStudent,
    updateStudentData,
    refreshStudentData,
    getStudentProgress,
    selectStudent,
    clearStudent,
    updateStudentName,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

