import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  CheckSquare,
  AlertCircle,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { useToast } from '@/hooks/use-toast';

// Hook personnalisé pour le test de niveau
const useLevelTest = () => {
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableObjectives, setAvailableObjectives] = useState([]);
  
  const { toast } = useToast();

  // API mock functions - à remplacer par les vrais appels API
  const mockApiCalls = {
    getAvailableTestObjectives: async () => {
      return {
        objectives: ["Domaine de définition", "Calcul des limites"],
        total_objectives: 2
      };
    },

    generateLevelTest: async (objectives) => {
      const mockQuestions = [
        {
          id: "dd_1_1",
          objective: "Domaine de définition",
          level: 1,
          question: "Quel est le domaine de définition de la fonction $f(x) = x^2 + 3x - 1$ ?",
          options: ["$\\mathbb{R}$", "$\\mathbb{R}^*$", "$[0, +∞[$", "$]-∞, 0]$"],
          correct_answer: 0,
          explanation: "Une fonction polynomiale est définie sur tous les réels."
        },
        {
          id: "dd_2_1",
          objective: "Domaine de définition",
          level: 2,
          question: "Quel est le domaine de définition de $f(x) = \\frac{x+1}{x-3}$ ?",
          options: ["$\\mathbb{R}$", "$\\mathbb{R} \\setminus \\{3\\}$", "$\\mathbb{R} \\setminus \\{-1\\}$", "$\\mathbb{R} \\setminus \\{-1, 3\\}$"],
          correct_answer: 1,
          explanation: "La fonction n'est pas définie quand le dénominateur s'annule, c'est-à-dire quand $x = 3$."
        },
        {
          id: "cl_1_1",
          objective: "Calcul des limites",
          level: 1,
          question: "Quelle est $\\lim_{x \\to 2} (3x + 1)$ ?",
          options: ["6", "7", "5", "La limite n'existe pas"],
          correct_answer: 1,
          explanation: "Pour une fonction polynomiale, la limite en un point est la valeur de la fonction en ce point: $3(2) + 1 = 7$."
        },
        {
          id: "cl_2_1",
          objective: "Calcul des limites",
          level: 2,
          question: "Quelle est $\\lim_{x \\to +∞} \\frac{2x^2 + x}{x^2 + 3}$ ?",
          options: ["0", "1", "2", "$+∞$"],
          correct_answer: 2,
          explanation: "En divisant par $x^2$ : $\\lim_{x \\to +∞} \\frac{2 + \\frac{1}{x}}{1 + \\frac{3}{x^2}} = \\frac{2}{1} = 2$."
        }
      ];

      return {
        test_id: `test_${Date.now()}`,
        questions: mockQuestions.filter(q => objectives.includes(q.objective)),
        total_questions: mockQuestions.filter(q => objectives.includes(q.objective)).length,
        estimated_duration: mockQuestions.filter(q => objectives.includes(q.objective)).length * 2
      };
    },

    submitLevelTest: async (studentId, responses) => {
      // Simulation d'évaluation
      const correctCount = responses.filter((resp, index) => {
        const mockAnswers = [0, 1, 1, 2]; // Réponses correctes pour les questions mock
        return resp.selected_answer === mockAnswers[index];
      }).length;

      const total = responses.length;
      const score = (correctCount / total) * 100;
      let recommendedLevel = 1;
      if (score >= 80) recommendedLevel = 3;
      else if (score >= 60) recommendedLevel = 2;

      return {
        student_id: studentId,
        total_questions: total,
        correct_answers: correctCount,
        score_percentage: score,
        recommended_level: recommendedLevel,
        objective_scores: {
          "Domaine de définition": { correct: Math.floor(correctCount / 2), total: Math.floor(total / 2) },
          "Calcul des limites": { correct: Math.ceil(correctCount / 2), total: Math.ceil(total / 2) }
        },
        detailed_feedback: `Score: ${score.toFixed(1)}% - Niveau ${recommendedLevel} recommandé`
      };
    }
  };

  const loadAvailableObjectives = async () => {
    try {
      setLoading(true);
      const data = await mockApiCalls.getAvailableTestObjectives();
      setAvailableObjectives(data.objectives);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les objectifs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTest = async (objectives) => {
    try {
      setLoading(true);
      const data = await mockApiCalls.generateLevelTest(objectives);
      setTestData(data);
      setCurrentQuestionIndex(0);
      setResponses({});
      setTestResults(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async () => {
    if (!testData) return;

    try {
      setLoading(true);
      const formattedResponses = testData.questions.map(q => ({
        question_id: q.id,
        selected_answer: responses[q.id] || 0
      }));

      const results = await mockApiCalls.submitLevelTest("student_123", formattedResponses);
      setTestResults(results);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'évaluer le test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return testData && testResults ? <TestResults /> : testData ? <TestingPhase /> : <SetupPhase />;
};

// Composant principal du test de niveau
const LevelTest = () => {
  const [phase, setPhase] = useState('setup');
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [testData, setTestData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [testResults, setTestResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const availableObjectives = ["Domaine de définition", "Calcul des limites"];

  const mockQuestions = [
    {
      id: "dd_1_1",
      objective: "Domaine de définition",
      level: 1,
      question: "Quel est le domaine de définition de la fonction $f(x) = x^2 + 3x - 1$ ?",
      options: ["$\\mathbb{R}$", "$\\mathbb{R}^*$", "$[0, +∞[$", "$]-∞, 0]$"],
      correct_answer: 0,
      explanation: "Une fonction polynomiale est définie sur tous les réels."
    },
    {
      id: "dd_2_1", 
      objective: "Domaine de définition",
      level: 2,
      question: "Quel est le domaine de définition de $f(x) = \\frac{x+1}{x-3}$ ?",
      options: ["$\\mathbb{R}$", "$\\mathbb{R} \\setminus \\{3\\}$", "$\\mathbb{R} \\setminus \\{-1\\}$", "$\\mathbb{R} \\setminus \\{-1, 3\\}$"],
      correct_answer: 1,
      explanation: "La fonction n'est pas définie quand le dénominateur s'annule, c'est-à-dire quand $x = 3$."
    },
    {
      id: "cl_1_1",
      objective: "Calcul des limites", 
      level: 1,
      question: "Quelle est $\\lim_{x \\to 2} (3x + 1)$ ?",
      options: ["6", "7", "5", "La limite n'existe pas"],
      correct_answer: 1,
      explanation: "Pour une fonction polynomiale, la limite en un point est la valeur de la fonction en ce point: $3(2) + 1 = 7$."
    },
    {
      id: "cl_2_1",
      objective: "Calcul des limites",
      level: 2, 
      question: "Quelle est $\\lim_{x \\to +∞} \\frac{2x^2 + x}{x^2 + 3}$ ?",
      options: ["0", "1", "2", "$+∞$"],
      correct_answer: 2,
      explanation: "En divisant par $x^2$ : $\\lim_{x \\to +∞} \\frac{2 + \\frac{1}{x}}{1 + \\frac{3}{x^2}} = \\frac{2}{1} = 2$."
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (startTime && phase === 'testing') {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, phase]);

  // Initialisation des objectifs sélectionnés
  useEffect(() => {
    setSelectedObjectives(availableObjectives);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleObjectiveToggle = (objective) => {
    setSelectedObjectives(prev => 
      prev.includes(objective)
        ? prev.filter(obj => obj !== objective)
        : [...prev, objective]
    );
  };

  const startTest = () => {
    if (selectedObjectives.length === 0) {
      toast({
        title: "Aucun objectif sélectionné",
        description: "Veuillez sélectionner au moins un objectif",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const filteredQuestions = mockQuestions.filter(q => 
        selectedObjectives.includes(q.objective)
      );
      setTestData({
        questions: filteredQuestions,
        total_questions: filteredQuestions.length,
        estimated_duration: filteredQuestions.length * 2
      });
      setPhase('testing');
      setTestStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setResponses({});
      setLoading(false);
    }, 1000);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishTest = () => {
    setLoading(true);
    
    setTimeout(() => {
      const correctAnswers = testData.questions.filter(q => 
        responses[q.id] === q.correct_answer
      ).length;
      
      const score = (correctAnswers / testData.questions.length) * 100;
      let recommendedLevel;
      
      if (score >= 80) recommendedLevel = 3;
      else if (score >= 60) recommendedLevel = 2;  
      else recommendedLevel = 1;

      const objectiveScores = {};
      selectedObjectives.forEach(obj => {
        const objQuestions = testData.questions.filter(q => q.objective === obj);
        const objCorrect = objQuestions.filter(q => responses[q.id] === q.correct_answer).length;
        objectiveScores[obj] = {
          correct: objCorrect,
          total: objQuestions.length
        };
      });

      setTestResults({
        total_questions: testData.questions.length,
        correct_answers: correctAnswers,
        score_percentage: score,
        recommended_level: recommendedLevel,
        objective_scores: objectiveScores,
        time_taken: elapsedTime
      });
      
      setPhase('results');
      setLoading(false);

      toast({
        title: "Test terminé !",
        description: `Score: ${score.toFixed(1)}% - Niveau ${getLevelName(recommendedLevel)}`,
      });
    }, 1000);
  };

  const getLevelName = (level) => {
    const levelNames = { 1: "Débutant", 2: "Intermédiaire", 3: "Avancé" };
    return levelNames[level] || "Inconnu";
  };

  const restartTest = () => {
    setPhase('setup');
    setCurrentQuestionIndex(0);
    setResponses({});
    setTestResults(null);
    setElapsedTime(0);
    setTestStartTime(null);
    setTestData(null);
  };

  const currentQuestion = testData?.questions[currentQuestionIndex];
  const progress = testData ? ((currentQuestionIndex + 1) / testData.questions.length) * 100 : 0;
  const answeredCount = Object.keys(responses).length;

  // Phase de configuration
  if (phase === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Test de Niveau
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Évaluez vos connaissances pour commencer au bon niveau
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Sélectionner les Objectifs</span>
              </CardTitle>
              <CardDescription>
                Choisissez les domaines mathématiques que vous souhaitez évaluer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableObjectives.map((objective) => {
                const questionsCount = mockQuestions.filter(q => q.objective === objective).length;
                return (
                  <motion.div
                    key={objective}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedObjectives.includes(objective)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleObjectiveToggle(objective)}
                  >
                    <Checkbox
                      checked={selectedObjectives.includes(objective)}
                      readOnly
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{objective}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Évaluation de vos connaissances en {objective.toLowerCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {questionsCount} questions
                      </Badge>
                      <p className="text-xs text-gray-500">~{questionsCount * 2} min</p>
                    </div>
                  </motion.div>
                );
              })}
              
              {selectedObjectives.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Sélectionnez au moins un objectif pour commencer le test.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-500" />
                <span>Instructions du Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium">Format du test:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Questions à choix multiples</li>
                    <li>2 questions par niveau et par objectif</li>
                    <li>Durée estimée: {selectedObjectives.length * 4} minutes</li>
                    <li>Pas de limite de temps</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">Évaluation:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                    <li>≥80%: Niveau Avancé</li>
                    <li>≥60%: Niveau Intermédiaire</li>
                    <li>&lt;60%: Niveau Débutant</li>
                    <li>Feedback détaillé par objectif</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={startTest}
            disabled={selectedObjectives.length === 0 || loading}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
              />
            ) : (
              <Play className="w-6 h-6 mr-3" />
            )}
            {loading ? "Préparation..." : "Commencer le Test"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Phase de test
  if (phase === 'testing' && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header avec progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Test de Niveau
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Question {currentQuestionIndex + 1} sur {testData.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-lg">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {formatTime(elapsedTime)}
                </span>
              </div>
              <Badge variant="outline" className="text-sm">
                {currentQuestion.objective}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progression du test</span>
              <span>{Math.round(progress)}% • {answeredCount}/{testData.questions.length} répondues</span>
            </div>
            <Progress value={progress} className="w-full h-3" />
          </div>
        </motion.div>

        {/* Question actuelle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckSquare className="w-6 h-6 text-blue-500" />
                    <span>Question {currentQuestionIndex + 1}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-sm">
                      Niveau {currentQuestion.level}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {currentQuestion.objective}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <AutoMathRenderer 
                      text={currentQuestion.question}
                      className="text-xl leading-relaxed text-gray-900 dark:text-white"
                      blockClassName="text-center my-6 text-2xl"
                      inline={false}
                    />
                  </div>

                  <div className="grid gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          responses[currentQuestion.id] === index
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md transform scale-[1.02]'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:bg-blue-900/10'
                        }`}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            responses[currentQuestion.id] === index
                              ? 'border-blue-500 bg-blue-500 shadow-lg'
                              : 'border-gray-300 group-hover:border-blue-400'
                          }`}>
                            {responses[currentQuestion.id] === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 rounded-full bg-white"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <AutoMathRenderer 
                              text={option}
                              className="text-lg text-gray-900 dark:text-white"
                              inline={false}
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center"
        >
          <Button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {responses[currentQuestion.id] !== undefined ? (
                <span className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Répondu</span>
                </span>
              ) : (
                <span className="text-orange-600">En attente</span>
              )}
            </div>
            
            <Button
              onClick={nextQuestion}
              disabled={responses[currentQuestion.id] === undefined}
              size="lg"
              className={currentQuestionIndex === testData.questions.length - 1 
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }
            >
              {currentQuestionIndex === testData.questions.length - 1 ? "Terminer le Test" : "Question Suivante"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Vue d'ensemble des questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckSquare className="w-5 h-5" />
                <span>Vue d'ensemble - {answeredCount}/{testData.questions.length} répondues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {testData.questions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setCurrentQuestionIndex(index)}
                                          className={`w-12 h-12 rounded-lg text-sm font-bold transition-all transform hover:scale-105 ${
                      index === currentQuestionIndex
                        ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                        : responses[question.id] !== undefined
                        ? 'bg-green-100 text-green-800 border-2 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>
              
              {answeredCount < testData.questions.length && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {testData.questions.length - answeredCount} question(s) restante(s)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Phase de résultats
  if (phase === 'results' && testResults) {
    const levelNames = {
      1: "Débutant",
      2: "Intermédiaire", 
      3: "Avancé"
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="p-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg">
              <Award className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Test Terminé !
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Voici vos résultats et votre niveau recommandé
          </motion.p>
        </motion.div>

        {/* Score global */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
            <CardContent className="pt-8">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="text-6xl font-bold text-blue-600 dark:text-blue-400"
                >
                  {testResults.score_percentage.toFixed(1)}%
                </motion.div>
                <div className="space-y-2">
                  <div className="text-xl text-gray-700 dark:text-gray-300">
                    <strong>{testResults.correct_answers}</strong> sur <strong>{testResults.total_questions}</strong> bonnes réponses
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      Niveau {levelNames[testResults.recommended_level]}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Temps écoulé: {formatTime(testResults.time_taken)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Détails par objectif */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-purple-500" />
                <span>Résultats Détaillés par Objectif</span>
              </CardTitle>
              <CardDescription>
                Votre performance dans chaque domaine mathématique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(testResults.objective_scores).map(([objective, scores], index) => {
                  const percentage = (scores.correct / scores.total) * 100;
                  const isExcellent = percentage >= 80;
                  const isGood = percentage >= 60;
                  
                  return (
                    <motion.div
                      key={objective}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        isExcellent 
                          ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                          : isGood
                          ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700'
                          : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{objective}</h4>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-medium">
                            {scores.correct}/{scores.total}
                          </span>
                          <Badge variant={isExcellent ? "default" : isGood ? "secondary" : "destructive"}>
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={percentage} className="w-full h-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {isExcellent ? "Excellent maîtrise !" : isGood ? "Bonne compréhension" : "À revoir"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommandations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-500" />
                <span>Recommandations Personnalisées</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.score_percentage >= 80 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                          Niveau Avancé - Excellente maîtrise !
                        </h5>
                        <p className="text-green-600 dark:text-green-400">
                          Vous démontrez une solide compréhension des concepts mathématiques. 
                          Vous pouvez aborder directement des exercices complexes et des défis avancés.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : testResults.score_percentage >= 60 ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400"
                  >
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                          Niveau Intermédiaire - Bon potentiel !
                        </h5>
                        <p className="text-yellow-600 dark:text-yellow-400">
                          Vous avez de bonnes bases. Quelques révisions ciblées vous permettront 
                          de maîtriser parfaitement ces concepts et de progresser vers le niveau avancé.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400"
                  >
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                          Niveau Débutant - Excellent point de départ !
                        </h5>
                        <p className="text-blue-600 dark:text-blue-400">
                          Vous construisez vos fondations mathématiques. En commençant par les concepts 
                          de base, vous développerez progressivement une compréhension solide.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <h5 className="font-semibold mb-3 flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Plan d'action recommandé:</span>
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Votre niveau a été défini sur <strong>"{levelNames[testResults.recommended_level]}"</strong></span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Commencez par des exercices adaptés à votre niveau</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Concentrez-vous sur les objectifs où vous avez le plus de difficultés</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Pratiquez régulièrement pour progresser vers le niveau supérieur</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions finales */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Button
            onClick={restartTest}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Refaire le Test
          </Button>
          
          <Button
            onClick={() => {
              // Navigation vers la page des exercices
              window.location.href = '/exercises';
            }}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg px-8 py-3"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Commencer les Exercices
          </Button>
        </motion.div>

        {/* Statistiques détaillées */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {testResults.score_percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Score Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {testResults.correct_answers}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bonnes Réponses</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {testResults.recommended_level}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Niveau Recommandé</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatTime(testResults.time_taken)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Durée</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // État de chargement
  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
        />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {loading ? "Préparation du test..." : "Chargement..."}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {phase === 'setup' && loading ? "Génération des questions personnalisées" : "Veuillez patienter"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelTest;