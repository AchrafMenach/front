// hooks/useProgression.js
import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { useStudent } from '@/contexts/StudentContext';

export const useProgression = () => {
  const { 
    getProgressionStatus, 
    advanceStudentObjective, 
    checkObjectiveCompletion 
  } = useApi();
  const { currentStudent, updateStudentData } = useStudent();
  
  const [progressionStatus, setProgressionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [progressionData, setProgressionData] = useState(null);

  // Charger le statut de progression
  const loadProgressionStatus = useCallback(async () => {
    if (!currentStudent?.student_id) return;
    
    setLoading(true);
    try {
      const status = await getProgressionStatus(currentStudent.student_id);
      setProgressionStatus(status);
      return status;
    } catch (error) {
      console.error('Error loading progression status:', error);
    } finally {
      setLoading(false);
    }
  }, [currentStudent?.student_id, getProgressionStatus]);

  // Vérifier si l'étudiant peut progresser
  const checkCanAdvance = useCallback(async () => {
    if (!currentStudent?.student_id) return false;
    
    try {
      const result = await checkObjectiveCompletion(currentStudent.student_id);
      return result.can_advance;
    } catch (error) {
      console.error('Error checking advancement:', error);
      return false;
    }
  }, [currentStudent?.student_id, checkObjectiveCompletion]);

  // Faire progresser l'étudiant
  const advanceStudent = useCallback(async () => {
    if (!currentStudent?.student_id) return null;
    
    setLoading(true);
    try {
      const result = await advanceStudentObjective(currentStudent.student_id);
      
      if (result.progression_occurred) {
        // Mettre à jour les données de l'étudiant
        const updatedStudent = {
          ...currentStudent,
          current_objective: result.new_objective,
          level: result.new_level,
          objectives_completed: [
            ...currentStudent.objectives_completed,
            currentStudent.current_objective
          ].filter(Boolean)
        };
        
        await updateStudentData(updatedStudent);
        
        // Afficher la notification
        setProgressionData(result);
        setShowNotification(true);
        
        // Recharger le statut
        await loadProgressionStatus();
        
        // Émettre un événement pour mettre à jour d'autres composants
        window.dispatchEvent(new CustomEvent('studentProgressUpdated'));
      }
      
      return result;
    } catch (error) {
      console.error('Error advancing student:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentStudent, advanceStudentObjective, updateStudentData, loadProgressionStatus]);

  // Traiter une progression automatique après évaluation
  const handleProgressionResult = useCallback((evaluationResult) => {
    if (evaluationResult?.progression?.progression_occurred) {
      setProgressionData(evaluationResult.progression);
      setShowNotification(true);
      
      // Mettre à jour les données de l'étudiant
      if (evaluationResult.progression.new_objective) {
        const updatedStudent = {
          ...currentStudent,
          current_objective: evaluationResult.progression.new_objective,
          level: evaluationResult.progression.new_level,
          objectives_completed: [
            ...currentStudent.objectives_completed,
            currentStudent.current_objective
          ].filter(Boolean)
        };
        
        updateStudentData(updatedStudent);
      }
      
      // Recharger le statut et émettre l'événement
      loadProgressionStatus();
      window.dispatchEvent(new CustomEvent('studentProgressUpdated'));
    }
  }, [currentStudent, updateStudentData, loadProgressionStatus]);

  // Fermer la notification
  const hideNotification = useCallback(() => {
    setShowNotification(false);
    setProgressionData(null);
  }, []);

  // Charger le statut au montage et lors des changements d'étudiant
  useEffect(() => {
    loadProgressionStatus();
  }, [loadProgressionStatus]);

  return {
    progressionStatus,
    loading,
    showNotification,
    progressionData,
    loadProgressionStatus,
    checkCanAdvance,
    advanceStudent,
    handleProgressionResult,
    hideNotification,
  };
};