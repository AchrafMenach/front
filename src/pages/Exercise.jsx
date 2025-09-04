
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '@/hooks/useProgression';
import ProgressionNotification from '@/components/ProgressionNotification';
import { 
  BookOpen, 
  Send, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Upload,
  FileText,
  Target,
  Eye,
  HelpCircle,
  MessageCircle,
  Heart,
  TrendingUp,
  Award,
  Brain,
  Info,
  Copy,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useStudent } from '@/contexts/StudentContext';
import { useApi } from '@/contexts/ApiContext';
import { AutoMathRenderer } from '@/components/MathRenderer';
import { useToast } from '@/hooks/use-toast';

// Composant Guide LaTeX
// Guide LaTeX repensé - Simple et efficace pour les étudiants

const LaTeXGuide = ({ isOpen, onToggle }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('essentials');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copié!",
        description: "Formule copiée dans le presse-papier",
        duration: 2000,
      });
    }).catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de copier",
        variant: "destructive",
        duration: 2000,
      });
    });
  };

const latexCategories = {
  essentials: {
    title: "Essentiel",
    color: "blue",
    items: [
      { name: "Formule simple", code: "$2 + 3 = 5$", desc: "Dans le texte" },
      { name: "Formule centrée", code: "$$x^2 + y^2 = r^2$$", desc: "Sur sa propre ligne" },
      { name: "Fraction", code: "$\\frac{a}{b}$", desc: "Division" },
      { name: "Puissance", code: "$x^2$ ou $x^{n+1}$", desc: "Exposant" },
      { name: "Indice", code: "$x_1$ ou $a_{ij}$", desc: "Indice" },
      { name: "Racine", code: "$\\sqrt{x}$ ou $\\sqrt[3]{8}$", desc: "Racine carrée/cubique" }
    ]
  },

  algebra: {
    title: "Algèbre & Analyse",
    color: "green",
    items: [
      { name: "Équation", code: "$x^2 - 5x + 6 = 0$", desc: "Équation quadratique" },
      { name: "Système", code: "$\\begin{cases} x+y=3 \\\\ x-y=1 \\end{cases}$", desc: "Système 2x2" },
      { name: "Suite arithmétique", code: "$u_n = u_0 + n r$", desc: "Suite arithmétique" },
      { name: "Suite géométrique", code: "$u_n = u_0 q^n$", desc: "Suite géométrique" },
      { name: "Limite de suite", code: "$\\lim_{n \\to \\infty} u_n$", desc: "Limite" },
      { name: "Dérivée", code: "$f'(x)$ ou $\\frac{df}{dx}$", desc: "Dérivée" },
      { name: "Tangente", code: "$y = f'(a)(x-a)+f(a)$", desc: "Équation de la tangente" },
      { name: "Intégrale définie", code: "$\\int_a^b f(x) dx$", desc: "Calcul d’aire" }
    ]
  },

  geometry: {
    title: "Géométrie & Trigonométrie",
    color: "purple",
    items: [
      { name: "Identité trigonométrique", code: "$\\sin^2 x + \\cos^2 x = 1$", desc: "Relation fondamentale" },
      { name: "Angles remarquables", code: "$\\sin \\frac{\\pi}{6} = \\frac{1}{2}$", desc: "30°, 45°, 60°" },
      { name: "Produit scalaire", code: "$\\vec{u} \\cdot \\vec{v} = |u||v|\\cos \\theta$", desc: "Produit scalaire" },
      { name: "Vecteur", code: "$\\vec{v}$ ou $\\overrightarrow{AB}$", desc: "Vecteur" },
      { name: "Matrice 2×2", code: "$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$", desc: "Matrice" },
      { name: "Déterminant", code: "$\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$", desc: "Déterminant" }
    ]
  },

  probability: {
    title: "Probabilités & Statistiques",
    color: "orange",
    items: [
      { name: "Probabilité", code: "$P(A) = \\frac{|A|}{|\\Omega|}$", desc: "Définition" },
      { name: "Conditionnelle", code: "$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$", desc: "Probabilité conditionnelle" },
      { name: "Espérance", code: "$E(X) = \\sum x_i p_i$", desc: "Espérance discrète" },
      { name: "Variance", code: "$Var(X) = E(X^2) - (E(X))^2$", desc: "Variance" },
      { name: "Binomiale", code: "$P(X=k) = {n \\choose k} p^k (1-p)^{n-k}$", desc: "Loi binomiale" },
      { name: "Normale", code: "$f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$", desc: "Loi normale" }
    ]
  },

  logic: {
    title: "Logique & Ensembles",
    color: "blue",
    items: [
      { name: "Appartenance", code: "$x \\in A$", desc: "x appartient à A" },
      { name: "Inclusion", code: "$A \\subset B$", desc: "Inclusion" },
      { name: "Union", code: "$A \\cup B$", desc: "Union" },
      { name: "Intersection", code: "$A \\cap B$", desc: "Intersection" },
      { name: "Complément", code: "$\\bar{A}$", desc: "Complémentaire" },
      { name: "Quantificateurs", code: "$\\forall x, \\exists y$", desc: "∀ ∃" },
      { name: "Implication", code: "$A \\Rightarrow B$", desc: "Implication" }
    ]
  },

  advanced: {
    title: "Analyse Avancée",
    color: "green",
    items: [
      { name: "Nombre complexe", code: "$z = a+ib$", desc: "Forme algébrique" },
      { name: "Module", code: "$|z| = \\sqrt{a^2+b^2}$", desc: "Module" },
      { name: "Conjugué", code: "$\\overline{z} = a - ib$", desc: "Conjugué" },
      { name: "Forme trigonométrique", code: "$z = r(\\cos \\theta + i\\sin \\theta)$", desc: "Trigonométrique" },
      { name: "Exponentielle complexe", code: "$z = re^{i\\theta}$", desc: "Forme exponentielle" },
      { name: "Équation différentielle", code: "$y' + ay = 0$", desc: "Solution $y = Ce^{-ax}$" }
    ]
  }
};


  const getTabColor = (color, isActive) => {
    if (isActive) {
      return {
        blue: "bg-blue-500 text-white",
        green: "bg-green-500 text-white",
        purple: "bg-purple-500 text-white",
        orange: "bg-orange-500 text-white"
      }[color];
    }
    return {
      blue: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20",
      green: "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20",
      purple: "text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20",
      orange: "text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
    }[color];
  };

  const getBorderColor = (color) => {
    return {
      blue: "border-blue-200 dark:border-blue-700",
      green: "border-green-200 dark:border-green-700",
      purple: "border-purple-200 dark:border-purple-700",
      orange: "border-orange-200 dark:border-orange-700"
    }[color];
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6"
    >
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Guide LaTeX Rapide
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              ✕
            </Button>
          </div>
          <CardDescription className="text-sm">
            Cliquez sur une formule pour la copier. Utilisez $ pour formules simples et $$ pour formules centrées.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {Object.entries(latexCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  getTabColor(category.color, activeTab === key)
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={`border-l-4 ${getBorderColor(latexCategories[activeTab].color)} pl-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {latexCategories[activeTab].items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => copyToClipboard(item.code)}
                  className="group cursor-pointer p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {item.name}
                    </h4>
                    <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 mb-2">
                    <code className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                      {item.code}
                    </code>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border rounded p-2 min-h-[40px] flex items-center">
                    <AutoMathRenderer 
                      text={item.code.replace(/\$\$/g, '$')} 
                      className="text-sm w-full"
                      inline={false}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 text-sm">
              💡 Conseils rapides
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-yellow-700 dark:text-yellow-300">
              <div>• Utilisez {} pour grouper: x^{2+1}</div>
              <div>• \\ pour nouvelle ligne dans matrices</div>
              <div>• Espaces ignorés: x + y = x+y</div>
              <div>• \{ } pour afficher des accolades</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Exercise = () => {
  const { currentStudent } = useStudent();
  const { 
    generateExercise, 
    generateSimilarExercise, 
    evaluateAnswerWithPersonalizedCoaching,
    evaluateFileAnswer
  } = useApi();
  const { toast } = useToast();

  const { 
    handleProgressionResult, 
    showNotification, 
    progressionData, 
    hideNotification 
  } = useProgression();

  const [currentExercise, setCurrentExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [progression, setProgression] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [visibleHintsCount, setVisibleHintsCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showLatexGuide, setShowLatexGuide] = useState(false);

  // Debug effect pour surveiller les changements du coaching
  useEffect(() => {
    console.log('Coaching state updated:', coaching);
  }, [coaching]);

  const getDifficultyColor = (difficulty) => {
    const difficultyLower = difficulty?.toLowerCase() || '';
    if (difficultyLower.includes('débutant') || difficultyLower.includes('facile')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    } else if (difficultyLower.includes('intermédiaire') || difficultyLower.includes('moyen')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    } else if (difficultyLower.includes('avancé') || difficultyLower.includes('difficile')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getCoachingTypeColor = (coachingType) => {
    switch (coachingType) {
      case 'encouragement':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200';
      case 'correction':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200';
      case 'support':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200';
    }
  };

  const getCoachingIcon = (coachingType) => {
    switch (coachingType) {
      case 'encouragement':
        return <Award className="w-5 h-5" />;
      case 'correction':
        return <Brain className="w-5 h-5" />;
      case 'support':
        return <Heart className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  // Fonction CORRIGÉE pour transformer les données backend vers frontend
  const transformCoachingData = (backendCoaching, isCorrect) => {
    if (!backendCoaching) {
      console.log('No coaching data received from backend');
      return null;
    }
    
    console.log('Raw backend coaching data:', backendCoaching);
    
    // Mapper exactement selon la structure de votre backend
    const transformed = {
      coaching_type: isCorrect ? 'encouragement' : 'correction',
      message: backendCoaching.motivation || 'Continuez vos efforts !',
      specific_feedback: backendCoaching.tip || backendCoaching.strategy,
      next_steps: Array.isArray(backendCoaching.next_steps) 
        ? backendCoaching.next_steps.join('\n\n') 
        : (backendCoaching.next_steps || ''),
      motivation: Array.isArray(backendCoaching.encouragement)
        ? backendCoaching.encouragement.join('\n\n')
        : (backendCoaching.encouragement || backendCoaching.motivation || '')
    };
    
    console.log('Transformed coaching data:', transformed);
    return transformed;
  };

  const handleGenerateExercise = async () => {
    if (!currentStudent) return;

    setLoading(true);
    resetExerciseState();

    try {
      const exercise = await generateExercise(currentStudent.student_id);
      setCurrentExercise(exercise);
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
    resetExerciseState();

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
    setHasSubmitted(true);
    
    try {
      let result;
      
      if (uploadedFile) {
        result = await evaluateFileAnswer(
          currentStudent.student_id, 
          currentExercise, 
          uploadedFile
        );
        
        console.log('File evaluation result:', result);
        console.log('Full file result structure:', JSON.stringify(result, null, 2));
        
        if (result.evaluation) {
          setEvaluation(result.evaluation);
          
          // Transformer le coaching si présent
          if (result.coaching) {
            const adaptedCoaching = transformCoachingData(result.coaching, result.evaluation.is_correct);
            setCoaching(adaptedCoaching);
          } else {
            console.log('No coaching data in file evaluation result');
            setCoaching(null);
          }
          setProgression(result.progression);
        } else {
          setEvaluation(result);
          setCoaching(null);
          setProgression(null);
        }
      } else {
        result = await evaluateAnswerWithPersonalizedCoaching(
          currentExercise, 
          userAnswer, 
          currentStudent.student_id
        );
        
        console.log('Text evaluation result:', result);
        console.log('Full text result structure:', JSON.stringify(result, null, 2));
        
        // CORRECTION CRITIQUE: Vérifier toutes les propriétés possibles de result
        setEvaluation(result.evaluation);
        
        // Le coaching peut être à différents endroits selon votre API
        const coachingData = result.coaching || result.personalized_coaching || result.coach;
        
        if (coachingData) {
          console.log('Found coaching data:', coachingData);
          const adaptedCoaching = transformCoachingData(coachingData, result.evaluation?.is_correct);
          console.log('Setting adapted coaching:', adaptedCoaching);
          setCoaching(adaptedCoaching);
        } else {
          console.log('No coaching data found in result. Available keys:', Object.keys(result));
          setCoaching(null);
        }
        
        setProgression(result.progression);
        
        if (result.progression && result.progression.progression_occurred) {
          handleProgressionResult(result);
        }
      }
      
      toast({
        title: result.evaluation?.is_correct ? "Correct !" : "Pas tout à fait",
        description: result.evaluation?.is_correct ? "Excellente réponse !" : "Consultez les explications",
        variant: result.evaluation?.is_correct ? "default" : "destructive",
      });

      if (result.evaluation?.is_correct) {
        try {
          window.dispatchEvent(new CustomEvent('studentProgressUpdated'));
        } catch (error) {
          console.log('Erreur lors de la mise à jour de la progression:', error);
        }
      }
      
    } catch (error) {
      console.error('Error in handleSubmitAnswer:', error);
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
      setUserAnswer('');
      toast({
        title: "Fichier uploadé",
        description: `${file.name} prêt pour évaluation`,
      });
    }
  };

  const resetExerciseState = () => {
    setUserAnswer('');
    setEvaluation(null);
    setCoaching(null);
    setProgression(null);
    setUploadedFile(null);
    setVisibleHintsCount(0);
    setShowSolution(false);
    setHasSubmitted(false);
  };

  const resetExercise = () => {
    resetExerciseState();
  };

  const handleShowNextHint = () => {
    if (currentExercise.hints && visibleHintsCount < currentExercise.hints.length) {
      setVisibleHintsCount(prev => prev + 1);
    }
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    toast({
      title: "Solution révélée",
      description: "Cela peut affecter votre score d'apprentissage",
      variant: "default",
    });
  };

  const handleProgressionCelebrate = () => {
    hideNotification();
  };

  const handleProgressionContinue = () => {
    hideNotification();
    handleGenerateExercise();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressionNotification
        progressionData={progressionData}
        show={showNotification}
        onCelebrate={handleProgressionCelebrate}
        onContinue={handleProgressionContinue}
      />

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

        <Button
          onClick={() => setShowLatexGuide(!showLatexGuide)}
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
        >
          <Info className="w-4 h-4 mr-2" />
          Guide LaTeX
        </Button>

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

      {/* Guide LaTeX */}
      <LaTeXGuide 
        isOpen={showLatexGuide} 
        onToggle={() => setShowLatexGuide(!showLatexGuide)} 
      />

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
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Exercice</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {currentExercise.concept && (
                      <Badge variant="secondary">
                        {currentExercise.concept}
                      </Badge>
                    )}
                    {currentExercise.difficulty && (
                      <Badge className={getDifficultyColor(currentExercise.difficulty)}>
                        {currentExercise.difficulty}
                      </Badge>
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
                  {/* Exercise Statement */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <AutoMathRenderer 
                      text={currentExercise.exercise}
                      className="text-lg leading-relaxed"
                      blockClassName="text-center my-4 text-xl"
                      inline={false}
                    />
                  </div>

                  {/* Context/Instructions */}
                  {currentExercise.context && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                      <AutoMathRenderer 
                        text={currentExercise.context}
                        className="text-sm text-blue-700 dark:text-blue-300"
                        inline={false}
                      />
                    </div>
                  )}

                  {/* Hints Section */}
                  {currentExercise.hints && currentExercise.hints.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Indices ({visibleHintsCount}/{currentExercise.hints.length})
                        </h4>
                        {!evaluation && visibleHintsCount < currentExercise.hints.length && (
                          <Button
                            onClick={handleShowNextHint}
                            variant="outline"
                            size="sm"
                          >
                            <HelpCircle className="w-4 h-4 mr-1" />
                            {visibleHintsCount === 0 ? 'Voir un indice' : 'Indice suivant'}
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {Array.from({ length: evaluation ? currentExercise.hints.length : visibleHintsCount }).map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400"
                          >
                            <div className="flex items-start space-x-2">
                              <div className="flex-shrink-0 w-6 h-6 bg-orange-200 dark:bg-orange-800 rounded-full flex items-center justify-center text-xs font-bold text-orange-800 dark:text-orange-200">
                                {index + 1}
                              </div>
                              <AutoMathRenderer 
                                text={currentExercise.hints[index]}
                                className="text-sm text-orange-700 dark:text-orange-300"
                                inline={false}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solution Section */}
                  {currentExercise.solution && hasSubmitted && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Solution détaillée
                        </h4>
                        {!showSolution && !evaluation && (
                          <Button
                            onClick={handleShowSolution}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Révéler la solution
                          </Button>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {(showSolution || evaluation) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400"
                          >
                            <AutoMathRenderer 
                              text={currentExercise.solution}
                              className="text-sm text-green-700 dark:text-green-300"
                              inline={false}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                      inline={false}
                    />
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500">OU</div>

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
            className="space-y-4"
          >
            {/* Evaluation Card */}
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
                      inline={false}
                    />
                  </div>
                )}

                {evaluation.explanation && (
                  <div>
                    <h4 className="font-semibold mb-2">Explication:</h4>
                    <AutoMathRenderer 
                      text={evaluation.explanation}
                      className="text-gray-700 dark:text-gray-300"
                      inline={false}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coaching Card */}
            {coaching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Card className={`border ${getCoachingTypeColor(coaching.coaching_type)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {getCoachingIcon(coaching.coaching_type)}
                      <span>Message du Coach</span>
                      <Badge variant="outline" className="ml-auto">
                        {coaching.coaching_type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Message principal */}
                    {coaching.message && (
                      <div className="p-4 bg-white dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <AutoMathRenderer 
                            text={coaching.message}
                            className="text-gray-800 dark:text-gray-200 font-medium"
                            inline={false}
                          />
                        </div>
                      </div>
                    )}

                    {/* Feedback spécifique */}
                    {coaching.specific_feedback && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h5 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center space-x-1">
                          <Brain className="w-4 h-4" />
                          <span>Conseil spécifique:</span>
                        </h5>
                        <AutoMathRenderer 
                          text={coaching.specific_feedback}
                          className="text-blue-700 dark:text-blue-300 text-sm"
                          inline={false}
                        />
                      </div>
                    )}

                    {/* Prochaines étapes */}
                    {coaching.next_steps && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h5 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Prochaines étapes:</span>
                        </h5>
                        <AutoMathRenderer 
                          text={coaching.next_steps}
                          className="text-purple-700 dark:text-purple-300 text-sm"
                          inline={false}
                        />
                      </div>
                    )}

                    {/* Motivation/Encouragement */}
                    {coaching.motivation && coaching.motivation !== coaching.message && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h5 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>Encouragement:</span>
                        </h5>
                        <AutoMathRenderer 
                          text={coaching.motivation}
                          className="text-yellow-700 dark:text-yellow-300 text-sm"
                          inline={false}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Debug: Affichage temporaire si coaching manquant */}
            {!coaching && evaluation && (
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  Debug: Les données de coaching n'ont pas été reçues du backend.
                </p>
              </div>
            )}

            {/* Progression Info */}
            {progression && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      <span>Progression</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {progression.current_level}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Niveau actuel
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {progression.exercises_completed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Exercices complétés
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {Math.round(progression.success_rate)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Taux de réussite
                        </div>
                      </div>
                    </div>

                    {progression.progression_occurred && (
                      <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300">
                        <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                          <Award className="w-4 h-4" />
                          <span className="font-semibold">Progression débloquée !</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Action Buttons */}
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