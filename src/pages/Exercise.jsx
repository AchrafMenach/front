import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Send, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Upload,
  FileText,
  Lightbulb,
  Timer,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useStudent } from '@/contexts/StudentContext';
import { useApi } from '@/contexts/ApiContext';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { useToast } from '@/hooks/use-toast';

const Exercise = () => {
  const { currentStudent } = useStudent();
  const { generateExercise, generateSimilarExercise, evaluateAnswer, evaluateFileAnswer } = useApi();
  const { toast } = useToast();

  const [currentExercise, setCurrentExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval;
    if (startTime && !evaluation) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, evaluation]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerateExercise = async () => {
    if (!currentStudent) return;

    setLoading(true);
    setCurrentExercise(null);
    setUserAnswer('');
    setEvaluation(null);
    setUploadedFile(null);
    setStartTime(null);
    setElapsedTime(0);

    try {
      const exercise = await generateExercise(currentStudent.student_id);
      setCurrentExercise(exercise);
      setStartTime(Date.now());
      toast({
        title: "Nouvel exercice généré",
        description: "Bonne chance !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer un exercice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSimilar = async () => {
    if (!currentExercise) return;

    setLoading(true);
    setUserAnswer('');
    setEvaluation(null);
    setUploadedFile(null);
    setStartTime(Date.now());
    setElapsedTime(0);

    try {
      const similarExercise = await generateSimilarExercise(currentExercise);
      setCurrentExercise(similarExercise);
      toast({
        title: "Exercice similaire généré",
        description: "Continuez à vous entraîner !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer un exercice similaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentExercise || (!userAnswer.trim() && !uploadedFile)) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une réponse",
        variant: "destructive",
      });
      return;
    }

    setEvaluating(true);
    try {
      let result;
      if (uploadedFile) {
        result = await evaluateFileAnswer(currentStudent.student_id, currentExercise, uploadedFile);
      } else {
        result = await evaluateAnswer(currentExercise, userAnswer, currentStudent.student_id);
      }
      
      setEvaluation(result);
      toast({
        title: result.is_correct ? "Correct !" : "Pas tout à fait",
        description: result.is_correct ? "Excellente réponse !" : "Consultez les explications",
        variant: result.is_correct ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'évaluer la réponse",
        variant: "destructive",
      });
    } finally {
      setEvaluating(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUserAnswer(''); // Clear text answer if file is uploaded
      toast({
        title: "Fichier uploadé",
        description: `${file.name} prêt pour évaluation`,
      });
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setEvaluation(null);
    setUploadedFile(null);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Exercices Mathématiques
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Entraînez-vous avec des exercices adaptés à votre niveau
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button
          onClick={handleGenerateExercise}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {loading ? "Génération..." : "Nouvel Exercice"}
        </Button>

        {currentExercise && (
          <Button
            onClick={handleGenerateSimilar}
            disabled={loading}
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Exercice Similaire
          </Button>
        )}

        {currentExercise && !evaluation && (
          <Button
            onClick={resetExercise}
            variant="ghost"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Recommencer
          </Button>
        )}
      </motion.div>

      {/* Exercise Display */}
      <AnimatePresence mode="wait">
        {currentExercise && (
          <motion.div
            key={currentExercise.exercise}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Exercice</span>
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    {currentExercise.difficulty && (
                      <Badge variant="outline">
                        Niveau {currentExercise.difficulty}
                      </Badge>
                    )}
                    {startTime && !evaluation && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Timer className="w-4 h-4" />
                        <span>{formatTime(elapsedTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {currentExercise.objective && (
                  <CardDescription>
                    Objectif: {currentExercise.objective}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <AutoMathRenderer 
                      text={currentExercise.exercise}
                      className="text-lg leading-relaxed"
                      blockClassName="text-center my-4"
                    />
                  </div>

                  {currentExercise.context && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <AutoMathRenderer 
                          text={currentExercise.context}
                          className="text-sm text-blue-700 dark:text-blue-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer Input */}
      {currentExercise && !evaluation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Votre Réponse</CardTitle>
              <CardDescription>
                Saisissez votre réponse ou uploadez un fichier (image, PDF)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Answer */}
              <div>
                <Textarea
                  placeholder="Tapez votre réponse ici... (vous pouvez utiliser LaTeX avec $ pour les formules mathématiques)"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={!!uploadedFile}
                  rows={4}
                  className="resize-none"
                />
                {userAnswer && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                    <p className="text-sm font-medium mb-2">Aperçu:</p>
                    <AutoMathRenderer 
                      text={userAnswer}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Separator className="flex-1" />
                <span className="text-sm text-gray-500">OU</span>
                <Separator className="flex-1" />
              </div>

              {/* File Upload */}
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    disabled={!!userAnswer.trim()}
                    className="hidden"
                  />
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    uploadedFile 
                      ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}>
                    {uploadedFile ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 dark:text-green-300">
                          {uploadedFile.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setUploadedFile(null);
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Cliquez pour uploader une image ou un PDF
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <Button
                onClick={handleSubmitAnswer}
                disabled={evaluating || (!userAnswer.trim() && !uploadedFile)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {evaluating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {evaluating ? "Évaluation..." : "Soumettre"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Evaluation Results */}
      <AnimatePresence>
        {evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`border-2 ${
              evaluation.is_correct 
                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700' 
                : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {evaluation.is_correct ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <span className={evaluation.is_correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                    {evaluation.is_correct ? 'Réponse Correcte !' : 'Réponse Incorrecte'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluation.feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">Commentaires:</h4>
                    <AutoMathRenderer 
                      text={evaluation.feedback}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </div>
                )}

                {evaluation.explanation && (
                  <div>
                    <h4 className="font-semibold mb-2">Explication:</h4>
                    <AutoMathRenderer 
                      text={evaluation.explanation}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </div>
                )}

                {evaluation.correct_answer && (
                  <div>
                    <h4 className="font-semibold mb-2">Réponse Attendue:</h4>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                      <AutoMathRenderer 
                        text={evaluation.correct_answer}
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleGenerateExercise}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Nouvel Exercice
                  </Button>
                  <Button
                    onClick={handleGenerateSimilar}
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Exercice Similaire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!currentExercise && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Prêt à commencer ?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Cliquez sur "Nouvel Exercice" pour générer votre premier exercice
          </p>
          <Button
            onClick={handleGenerateExercise}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Commencer
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Exercise;

