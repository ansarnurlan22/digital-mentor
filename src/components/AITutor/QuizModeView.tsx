import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Lightbulb, Trophy } from 'lucide-react';
import { QuizQuestion, QuizState } from './types';
import { ALGEBRA_11_QUIZ } from './mockQuizData';
import { FormulaRenderer } from './FormulaRenderer';

interface QuizModeViewProps {
  onAskTutorAboutQuestion?: (questionText: string) => void;
}

export const QuizModeView: React.FC<QuizModeViewProps> = ({ onAskTutorAboutQuestion }) => {
  const [questions] = useState<QuizQuestion[]>(ALGEBRA_11_QUIZ);
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedOption: null,
    isAnswered: false,
    isCorrect: null,
    score: 0,
    totalQuestions: ALGEBRA_11_QUIZ.length,
  });

  const [showHint, setShowHint] = useState(false);

  const currentQ = questions[state.currentQuestionIndex];
  const isFinished = state.currentQuestionIndex >= questions.length;

  const handleSelectOption = (index: number) => {
    if (state.isAnswered) return;

    const isCorrect = index === currentQ.correctIndex;
    setState((prev) => ({
      ...prev,
      selectedOption: index,
      isAnswered: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNext = () => {
    setShowHint(false);
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      selectedOption: null,
      isAnswered: false,
      isCorrect: null,
    }));
  };

  const handleRestart = () => {
    setShowHint(false);
    setState({
      currentQuestionIndex: 0,
      selectedOption: null,
      isAnswered: false,
      isCorrect: null,
      score: 0,
      totalQuestions: questions.length,
    });
  };

  if (isFinished) {
    const percent = Math.round((state.score / state.totalQuestions) * 100);
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/20">
          <Trophy className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">Экспресс-квиз завершён!</h3>
        <p className="mt-1 text-sm text-slate-300">
          Правильных ответов: <span className="font-semibold text-sky-400">{state.score}</span> из {state.totalQuestions} ({percent}%)
        </p>

        <div className="mt-6 w-full rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 text-xs text-slate-300">
          {percent >= 80 ? (
            <span className="text-emerald-400">🔥 Превосходно! Ты готов к контрольным и созвону с ментором.</span>
          ) : percent >= 50 ? (
            <span className="text-amber-400">👍 Неплохой результат! Рекомендуем повторить логарифмы и производные с AI-тьютором.</span>
          ) : (
            <span className="text-rose-400">💡 Стоит разобрать теорию с AI-тьютором перед следующим уроком.</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:brightness-110 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Пройти ещё раз
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between p-4">
      {/* Шапка квиза со счетчиком */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="rounded-md border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 text-sky-300">
            {currentQ.topic}
          </span>
          <span className="font-medium text-slate-300">
            Вопрос {state.currentQuestionIndex + 1} из {state.totalQuestions}
          </span>
        </div>

        {/* Прогресс-бар */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-300"
            style={{ width: `${((state.currentQuestionIndex + 1) / state.totalQuestions) * 100}%` }}
          />
        </div>

        {/* Карточка вопроса */}
        <div className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-lg backdrop-blur-md">
          <h4 className="text-sm font-medium text-slate-200">{currentQ.question}</h4>
          {currentQ.formulaLatex && (
            <div className="mt-2 rounded-xl border border-sky-500/20 bg-sky-950/30 p-2 text-center">
              <FormulaRenderer content={`$$${currentQ.formulaLatex}$$`} />
            </div>
          )}
        </div>

        {/* Варианты ответов */}
        <div className="mt-4 space-y-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = state.selectedOption === idx;
            const isCorrectAnswer = idx === currentQ.correctIndex;

            let buttonStyle = 'border-slate-700/60 bg-slate-800/40 text-slate-200 hover:border-sky-500/50 hover:bg-slate-800/80';
            if (state.isAnswered) {
              if (isCorrectAnswer) {
                buttonStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 shadow-sm shadow-emerald-500/20';
              } else if (isSelected) {
                buttonStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
              } else {
                buttonStyle = 'border-slate-800 bg-slate-900/30 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={state.isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition-all ${buttonStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-700/50 text-xs font-semibold text-slate-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <FormulaRenderer content={option.includes('\\') ? `$${option}$` : option} />
                </div>

                {state.isAnswered && (
                  <div>
                    {isCorrectAnswer && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                    {isSelected && !isCorrectAnswer && <XCircle className="h-5 w-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Объяснение после ответа */}
        <AnimatePresence>
          {state.isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl border p-3.5 text-xs ${
                state.isCorrect
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-950/30 text-rose-300'
              }`}
            >
              <div className="font-semibold">
                {state.isCorrect ? '✅ Верно!' : '❌ Не совсем верно.'}
              </div>
              <p className="mt-1 leading-relaxed text-slate-300">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Подсказка Сократа */}
        {!state.isAnswered && (
          <div className="mt-3">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Нужна подсказка к первому шагу?
              </button>
            ) : (
              <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-2.5 text-xs text-sky-200">
                <span className="font-semibold text-sky-300">💡 Наводящий вопрос: </span>
                {currentQ.socraticHint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Футер с кнопками навигации */}
      <div className="mt-6 border-t border-slate-800/80 pt-4">
        {state.isAnswered ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onAskTutorAboutQuestion?.(currentQ.question + ' ' + (currentQ.formulaLatex || ''))}
              className="flex-1 rounded-xl border border-slate-700/80 bg-slate-800/60 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Обсудить с AI-тьютором
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:brightness-110 active:scale-95"
            >
              Следующий вопрос
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-slate-500">
            Выберите один из вариантов ответа выше
          </div>
        )}
      </div>
    </div>
  );
};
