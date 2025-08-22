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
        return {
          level: 3,
          completed: 75,
          current_objective: 'Équations du second degré',
          objectives_completed: ['Équations linéaires', 'Systèmes d\'équations']
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

  const value = {
    currentStudent,
    students,
    loading,
    createStudent,
    loadStudent,
    getStudentProgress,
    selectStudent,
    clearStudent,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

