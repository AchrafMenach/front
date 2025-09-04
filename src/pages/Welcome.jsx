import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '@/contexts/StudentContext';
import { useApi } from '@/contexts/ApiContext';
import { useToast } from '@/hooks/use-toast';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { 
  User, 
  Plus, 
  BookOpen, 
  GraduationCap,
  ChevronRight,
  CheckCircle,
  Clock,
  Target,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const Welcome = ({ onStudentSelect }) => {
  const [step, setStep] = useState('initial'); // initial, create, test, results
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempStudent, setTempStudent] = useState(null);
  
  // Test de niveau
  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const { createStudent } = useStudent();
  const { 
    getAvailableTestObjectives, 
    generateLevelTest, 
    submitLevelTest,
    DEMO_MODE 
  } = useApi();
  const { toast } = useToast();

  const handleCreateStudent = async () => {
    if (!studentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const student = await createStudent(studentName.trim());
      setTempStudent(student);
      
      // Passer directement au test de niveau
      await initializeLevelTest(student);
      
      toast({
        title: "Profil créé",
        description: `Bienvenue ${studentName} ! Commençons par évaluer votre niveau.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le profil étudiant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeLevelTest = async (student) => {
    setLoading(true);
    try {
      let objectives;
      
      if (DEMO_MODE) {
        // Objectifs de démonstration
        objectives = ['Domaine de définition', 'Calcul des limites'];
      } else {
        // Récupérer les objectifs disponibles
        const objectivesData = await getAvailableTestObjectives();
        objectives = objectivesData.objectives.slice(0, 2); // Prendre les 2 premiers
      }

      const test = await generateLevelTest(objectives, 2, 3);
      setTestData(test);
      setCurrentQuestion(0);
      setResponses([]);
      setStep('test');
      
      toast({
        title: "Test de niveau prêt",
        description: `${test.total_questions} questions pour évaluer votre niveau`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le test de niveau",
        variant: "destructive",
      });
      // En cas d'erreur, passer directement au dashboard
      onStudentSelect(student);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Sélectionnez une réponse",
        description: "Veuillez choisir une option avant de continuer",
        variant: "destructive",
      });
      return;
    }

    // Sauvegarder la réponse
    const newResponse = {
      question_id: testData.questions[currentQuestion].id,
      selected_answer: selectedAnswer
    };
    
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setSelectedAnswer(null);

    // Passer à la question suivante ou terminer le test
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finalizeLevelTest(updatedResponses);
    }
  };

  const finalizeLevelTest = async (finalResponses) => {
    setLoading(true);
    try {
      const results = await submitLevelTest(tempStudent.student_id, finalResponses);
      setTestResults(results);
      setStep('results');
      
      toast({
        title: "Test terminé !",
        description: `Score: ${results.score_percentage}% - Niveau recommandé: ${results.recommended_level}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'évaluation du test",
        variant: "destructive",
      });
      // En cas d'erreur, continuer quand même
      onStudentSelect(tempStudent);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = () => {
    onStudentSelect(tempStudent);
  };

  const skipLevelTest = () => {
    onStudentSelect(tempStudent);
  };

  const currentQuestionData = testData?.questions[currentQuestion];
  const progressPercentage = testData ? ((currentQuestion + 1) / testData.questions.length) * 100 : 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              {/* Logo et titre */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MathTutor AI
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Votre assistant personnel pour apprendre les mathématiques avec une approche adaptative et personnalisée
                </p>
              </div>

              {/* Création du profil */}
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Créer votre profil</span>
                  </CardTitle>
                  <CardDescription>
                    Commençons par créer votre profil d'apprentissage personnalisé
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Votre nom complet"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateStudent()}
                    className="text-center"
                  />
                  <Button
                    onClick={handleCreateStudent}
                    disabled={loading || !studentName.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    size="lg"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Création..." : "Commencer"}
                  </Button>
                </CardContent>
              </Card>

              {/* Fonctionnalités */}
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Exercices Adaptatifs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Des exercices générés selon votre niveau et vos besoins
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Suivi Personnalisé</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Progression trackée et objectifs personnalisés
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Coach IA</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Explications détaillées et encouragements personnalisés
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 'test' && currentQuestionData && (
            <motion.div
              key="test"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Header du test */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Test de Niveau</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Répondez aux questions suivantes pour personnaliser votre parcours d'apprentissage
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <Badge variant="outline">
                    Question {currentQuestion + 1} sur {testData.questions.length}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      ~{Math.ceil((testData.questions.length - currentQuestion) * 1.5)} min restantes
                    </span>
                  </div>
                </div>

                <Progress value={progressPercentage} className="w-full max-w-md mx-auto" />
              </div>

              {/* Question actuelle */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span>{currentQuestionData.objective}</span>
                    </span>
                    <Badge variant="secondary">Niveau {currentQuestionData.level}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <AutoMathRenderer 
                      text={currentQuestionData.question}
                      className="text-lg leading-relaxed"
                      blockClassName="text-center my-4 text-xl"
                      inline={false}
                    />
                  </div>

                  {/* Options de réponse */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Choisissez votre réponse :</h4>
                    {currentQuestionData.options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAnswer === index
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedAnswer === index
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAnswer === index && (
                                <div className="w-full h-full rounded-full bg-white transform scale-50" />
                              )}
                            </div>
                            <AutoMathRenderer 
                              text={option}
                              className="flex-1"
                              inline={false}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="ghost"
                      onClick={skipLevelTest}
                      className="text-gray-500"
                    >
                      Passer le test
                    </Button>
                    
                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null || loading}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      {currentQuestion < testData.questions.length - 1 ? (
                        <>
                          Suivant
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Terminer le test
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'results' && testResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Résultats du test */}
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-3xl font-bold">Test Terminé !</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Voici vos résultats et votre niveau recommandé
                </p>
              </div>

              <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <GraduationCap className="w-6 h-6 text-green-500" />
                    <span>Résultats de votre évaluation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score global */}
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-green-600">
                      {testResults.score_percentage}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {testResults.correct_answers} bonnes réponses sur {testResults.total_questions}
                    </p>
                  </div>

                  <Separator />

                  {/* Niveau recommandé */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold">Niveau Recommandé</h3>
                    <Badge variant="outline" className="text-2xl p-3">
                      Niveau {testResults.recommended_level}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Détails par objectif */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-center">Performance par objectif :</h4>
                    {Object.entries(testResults.objective_scores || {}).map(([objective, scores]) => {
                      const percentage = Math.round((scores.correct / scores.total) * 100);
                      return (
                        <div key={objective} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{objective}</span>
                            <span className="text-sm text-gray-600">
                              {scores.correct}/{scores.total} ({percentage}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback détaillé */}
                  {testResults.detailed_feedback && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Recommandations :</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {testResults.detailed_feedback}
                      </p>
                    </div>
                  )}

                  {/* Action */}
                  <div className="text-center pt-4">
                    <Button
                      onClick={handleStartLearning}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      Commencer l'Apprentissage
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Welcome;