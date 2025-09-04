import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Target, 
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/contexts/ApiContext';
import { useStudent } from '@/contexts/StudentContext';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { useToast } from '@/hooks/use-toast';

const LevelTest = ({ onComplete }) => {
  const { 
    getAvailableTestObjectives, 
    generateLevelTest, 
    submitLevelTest 
  } = useApi();
  const { currentStudent } = useStudent();
  const { toast } = useToast();

  const [phase, setPhase] = useState('intro'); // intro, test, results
  const [availableObjectives, setAvailableObjectives] = useState([]);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    loadAvailableObjectives();
  }, []);

  const loadAvailableObjectives = async () => {
    try {
      const data = await getAvailableTestObjectives();
      setAvailableObjectives(data.objectives);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les objectifs de test",
        variant: "destructive",
      });
    }
  };

  const startTest = async () => {
    setLoading(true);
    try {
      const testData = await generateLevelTest(
        availableObjectives, 
        2, // 2 questions par objectif
        3  // niveau max 3
      );
      
      setTestQuestions(testData.questions);
      setUserResponses([]);
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());
      setPhase('test');
      
      toast({
        title: "Test commencé",
        description: `${testData.total_questions} questions à répondre`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    const newResponses = [...userResponses];
    const existingIndex = newResponses.findIndex(r => r.question_id === questionId);
    
    if (existingIndex >= 0) {
      newResponses[existingIndex] = { question_id: questionId, selected_answer: selectedAnswer };
    } else {
      newResponses.push({ question_id: questionId, selected_answer: selectedAnswer });
    }
    
    setUserResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const results = await submitLevelTest(currentStudent.student_id, userResponses);
      setTestResults(results);
      setPhase('results');
      
      toast({
        title: "Test terminé",
        description: `Score: ${results.score_percentage}%`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre le test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentResponse = () => {
    if (!testQuestions[currentQuestionIndex]) return null;
    return userResponses.find(r => r.question_id === testQuestions[currentQuestionIndex].id);
  };

  const progress = testQuestions.length > 0 ? ((currentQuestionIndex + 1) / testQuestions.length) * 100 : 0;
  const currentQuestion = testQuestions[currentQuestionIndex];
  const currentResponse = getCurrentResponse();

  // Phase d'introduction
  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="text-center">
          <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test de Niveau
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Évaluons vos connaissances pour adapter les exercices à votre niveau
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Objectifs Évalués</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {availableObjectives.map((objective, index) => (
                <div key={objective} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <span className="font-medium">{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Durée estimée: {availableObjectives.length * 4} minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4" />
                <span>{availableObjectives.length * 2} questions au total</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Target className="w-4 h-4" />
                <span>Questions adaptées à différents niveaux</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={startTest}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg py-3"
        >
          {loading ? "Génération du test..." : "Commencer le Test"}
        </Button>
      </motion.div>
    );
  }

  // Phase de test
  if (phase === 'test' && currentQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Question {currentQuestionIndex + 1} sur {testQuestions.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {currentQuestion.objective}
                  </CardTitle>
                  <Badge variant="outline">
                    Niveau {currentQuestion.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Question */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <AutoMathRenderer 
                    text={currentQuestion.question}
                    className="text-lg leading-relaxed"
                    blockClassName="text-center my-2"
                    inline={false}
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        currentResponse?.selected_answer === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          currentResponse?.selected_answer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {currentResponse?.selected_answer === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <AutoMathRenderer 
                          text={option}
                          className="flex-1"
                          inline={false}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Précédent
          </Button>

          <div className="space-x-2">
            {currentQuestionIndex < testQuestions.length - 1 ? (
              <Button
                onClick={nextQuestion}
                disabled={!currentResponse}
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={submitTest}
                disabled={loading || userResponses.length !== testQuestions.length}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {loading ? "Soumission..." : "Terminer le Test"}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {testQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                    index === currentQuestionIndex
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : userResponses.find(r => r.question_id === testQuestions[index].id)
                      ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/20'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Phase de résultats
  if (phase === 'results' && testResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Header des résultats */}
        <div className="text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Résultats du Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Voici votre évaluation et votre niveau recommandé
          </p>
        </div>

        {/* Score global */}
        <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Score Global</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {testResults.score_percentage}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={testResults.score_percentage} className="h-3" />
              <div className="flex justify-between text-sm">
                <span>{testResults.correct_answers} réponses correctes</span>
                <span>sur {testResults.total_questions} questions</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mt-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-lg">
                  Niveau recommandé: {testResults.recommended_level}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détail par objectif */}
        <Card>
          <CardHeader>
            <CardTitle>Détail par Objectif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(testResults.objective_scores).map(([objective, scores]) => {
                const percentage = (scores.correct / scores.total) * 100;
                return (
                  <div key={objective} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{objective}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {scores.correct}/{scores.total} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feedback détaillé */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Analyse Détaillée</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AutoMathRenderer 
              text={testResults.detailed_feedback}
              className="text-gray-700 dark:text-gray-300"
              inline={false}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Votre profil a été mis à jour avec votre niveau recommandé.
            Vous êtes maintenant prêt à commencer les exercices !
          </p>
          
          <Button
            onClick={() => onComplete && onComplete(testResults)}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Commencer les Exercices
          </Button>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default LevelTest;