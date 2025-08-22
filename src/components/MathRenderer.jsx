import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathRenderer = ({ 
  math, 
  block = false, 
  className = '',
  errorColor = '#cc0000'
}) => {
  if (!math) return null;

  // Clean the math string
  const cleanMath = typeof math === 'string' ? math.trim() : String(math);
  
  if (!cleanMath) return null;

  try {
    if (block) {
      return (
        <div className={`my-4 ${className}`}>
          <BlockMath
            math={cleanMath}
            errorColor={errorColor}
            renderError={(error) => (
              <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                <span className="font-mono text-sm">Erreur LaTeX: {error.message}</span>
              </div>
            )}
          />
        </div>
      );
    } else {
      return (
        <span className={className}>
          <InlineMath
            math={cleanMath}
            errorColor={errorColor}
            renderError={(error) => (
              <span className="text-red-500 font-mono text-sm">
                [Erreur LaTeX: {error.message}]
              </span>
            )}
          />
        </span>
      );
    }
  } catch (error) {
    console.error('Math rendering error:', error);
    return (
      <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
        <span className="font-mono text-sm">
          Impossible d'afficher: {cleanMath}
        </span>
      </div>
    );
  }
};

// Composant pour détecter et rendre automatiquement les expressions mathématiques dans du texte
export const AutoMathRenderer = ({ 
  text, 
  className = '',
  blockClassName = '',
  inlineClassName = ''
}) => {
  if (!text) return null;

  // Regex pour détecter les expressions mathématiques
  const blockMathRegex = /\$\$(.*?)\$\$/g;
  const inlineMathRegex = /\$(.*?)\$/g;

  let content = text;
  const elements = [];
  let lastIndex = 0;

  // D'abord traiter les math blocks
  let blockMatch;
  const blockMatches = [];
  while ((blockMatch = blockMathRegex.exec(text)) !== null) {
    blockMatches.push({
      index: blockMatch.index,
      length: blockMatch[0].length,
      math: blockMatch[1],
      type: 'block'
    });
  }

  // Ensuite traiter les math inline (en évitant les blocks)
  let inlineMatch;
  const inlineMatches = [];
  while ((inlineMatch = inlineMathRegex.exec(text)) !== null) {
    // Vérifier si cette correspondance est à l'intérieur d'un block math
    const isInsideBlock = blockMatches.some(block => 
      inlineMatch.index >= block.index && 
      inlineMatch.index < block.index + block.length
    );
    
    if (!isInsideBlock) {
      inlineMatches.push({
        index: inlineMatch.index,
        length: inlineMatch[0].length,
        math: inlineMatch[1],
        type: 'inline'
      });
    }
  }

  // Combiner et trier tous les matches
  const allMatches = [...blockMatches, ...inlineMatches].sort((a, b) => a.index - b.index);

  allMatches.forEach((match, i) => {
    // Ajouter le texte avant le match
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore) {
        elements.push(
          <span key={`text-${i}`} className={className}>
            {textBefore}
          </span>
        );
      }
    }

    // Ajouter l'élément mathématique
    elements.push(
      <MathRenderer
        key={`math-${i}`}
        math={match.math}
        block={match.type === 'block'}
        className={match.type === 'block' ? blockClassName : inlineClassName}
      />
    );

    lastIndex = match.index + match.length;
  });

  // Ajouter le texte restant
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex);
    if (textAfter) {
      elements.push(
        <span key="text-final" className={className}>
          {textAfter}
        </span>
      );
    }
  }

  // Si aucune expression mathématique n'a été trouvée, retourner le texte original
  if (elements.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return <div className="math-content">{elements}</div>;
};

export default MathRenderer;

