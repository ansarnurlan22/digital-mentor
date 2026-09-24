import React from 'react';
import katex from 'katex';

interface FormulaRendererProps {
  content: string;
  className?: string;
}

/**
 * Компонент рендеринга текста с поддержкой Markdown и LaTeX формул через KaTeX ($...$ и $$...$$)
 */
export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ content, className = '' }) => {
  // Разбиваем текст по блочным ($$...$$) и строчным ($...$) формулам
  const renderFormattedText = (raw: string) => {
    // Регулярка для захвата $$блочных$$ и $строчных$ формул
    const parts = raw.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={index}
              className="my-2 overflow-x-auto py-1 text-center font-serif text-sky-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <pre key={index} className="my-1 font-mono text-xs text-sky-300">{part}</pre>;
        }
      }

      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block px-1 font-serif text-sky-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <code key={index} className="font-mono text-xs text-sky-300">{part}</code>;
        }
      }

      // Обычный текст с поддержкой жирного шрифта (**текст**) и переводов строк
      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, lIdx) => {
            // Замена **жирного текста**
            const boldParts = line.split(/(\*\*[^*]+?\*\*)/g);
            return (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {boldParts.map((sub, sIdx) => {
                  if (sub.startsWith('**') && sub.endsWith('**')) {
                    return <strong key={sIdx} className="font-semibold text-white">{sub.slice(2, -2)}</strong>;
                  }
                  return sub;
                })}
              </React.Fragment>
            );
          })}
        </span>
      );
    });
  };

  return <div className={`leading-relaxed ${className}`}>{renderFormattedText(content)}</div>;
};
