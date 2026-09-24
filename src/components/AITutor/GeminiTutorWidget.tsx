import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  X,
} from 'lucide-react';
import { TutorLessonResponse, UserProfile } from './types';
import { FormulaRenderer } from './FormulaRenderer';
import { getActiveStudentProfile } from './mockProfile';

const QUICK_TOPICS = [
  'Логарифмические неравенства',
  'Формулы приведения',
  'Производная сложной функции',
  'Показательные уравнения',
  'Теорема синусов и косинусов',
];

interface GeminiTutorWidgetProps {
  customProfile?: Partial<UserProfile>;
  onClose?: () => void;
}

export const GeminiTutorWidget: React.FC<GeminiTutorWidgetProps> = ({
  customProfile,
  onClose,
}) => {
  const profile = { ...getActiveStudentProfile(), ...customProfile };

  const [topicInput, setTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<TutorLessonResponse | null>(null);

  // Таб на экране результата: 'theory' | 'quiz'
  const [activeTab, setActiveTab] = useState<'theory' | 'quiz'>('theory');

  // Состояние квиза
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCopied, setIsCopied] = useState(false);

  // Генерация урока через серверный API эндпоинт (/api/tutor)
  const handleGenerateLesson = async (selectedTopic?: string) => {
    const topicToFetch = (selectedTopic || topicInput).trim();
    if (!topicToFetch || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSelectedAnswers({});
    setCurrentQuizIdx(0);
    setActiveTab('theory');

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToFetch }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || `Ошибка сервера: ${response.status}`);
      }

      setLessonData(json);
      setTopicInput('');
    } catch (err: any) {
      console.error('Ошибка Gemini Tutor:', err);
      setError(err.message || 'Не удалось сформировать урок. Проверьте соединение или API-ключ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTheory = () => {
    if (!lessonData?.theorySummary) return;
    navigator.clipboard?.writeText(lessonData.theorySummary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSelectQuizOption = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  // Подсчет результатов квиза
  const totalQuestions = lessonData?.quiz?.length || 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = lessonData?.quiz
    ? lessonData.quiz.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length
    : 0;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#080E1E] text-slate-100 shadow-2xl backdrop-blur-2xl">
      {/* Шапка виджета */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-[1.5px] shadow-lg shadow-sky-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[14.5px] bg-[#080E1E]">
              <Sparkles className="h-5 w-5 text-sky-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#080E1E] bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Digital Mentor AI</h3>
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {profile.subject} · {profile.grade} · {profile.name}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Основной контент */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Состояние ошибки */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2 font-semibold text-rose-400">
              <AlertCircle className="h-4 w-4" />
              <span>Ошибка формирования урока</span>
            </div>
            <p className="mt-1 text-slate-300">{error}</p>
            <button
              type="button"
              onClick={() => handleGenerateLesson()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 px-3 py-1.5 font-medium text-rose-200 transition-colors hover:bg-rose-500/30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Попробовать снова
            </button>
          </div>
        )}

        {/* 1. Экран загрузки Gemini */}
        {isLoading && (
          <div className="flex h-72 flex-col items-center justify-center p-6 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-sky-500 opacity-20" />
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
              <Sparkles className="absolute h-5 w-5 text-sky-400" />
            </div>
            <h4 className="mt-5 text-sm font-semibold text-white">
              Gemini анализирует тему и составляет задания...
            </h4>
            <p className="mt-1.5 max-w-xs text-xs text-slate-400">
              Выделяем ключевые формулы, алгоритм решения и готовим интерактивный квиз
            </p>
          </div>
        )}

        {/* 2. Экран ввода темы (когда урок ещё не сгенерирован) */}
        {!isLoading && !lessonData && (
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0F172A]/80 p-4 shadow-sm backdrop-blur-md">
                <label className="block text-xs font-semibold text-slate-300">
                  Какую тему или вопрос разобрать?
                </label>
                <div className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateLesson()}
                    placeholder="Например: Логарифмические неравенства..."
                    className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateLesson()}
                    disabled={!topicInput.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:brightness-110 disabled:opacity-40"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Сформировать</span>
                  </button>
                </div>
              </div>

              {/* Быстрые подсказки-темы */}
              <div>
                <span className="text-[11px] font-medium text-slate-400">
                  Популярные темы для 11 класса:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleGenerateLesson(topic)}
                      className="rounded-xl border border-slate-800 bg-[#0F172A]/60 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-sky-500/50 hover:bg-slate-800 hover:text-white"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-500/20 bg-sky-950/10 p-4 text-xs text-sky-300">
              <span className="font-semibold">💡 Как это работает:</span> Gemini мгновенно построит
              академическую шпаргалку с формулами в LaTeX и мини-тест из 3–4 практических вопросов с
              разбором ошибок.
            </div>
          </div>
        )}

        {/* 3. Экран результата урока */}
        {!isLoading && lessonData && (
          <div className="space-y-4">
            {/* Карточка темы */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-4 shadow-sm">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                  Тема урока
                </span>
                <h4 className="text-base font-bold text-white">{lessonData.topic}</h4>
              </div>
              <button
                type="button"
                onClick={() => setLessonData(null)}
                className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Другая тема</span>
              </button>
            </div>

            {/* Переключатель табов: Теория / Интерактивный тест */}
            <div className="flex rounded-xl border border-slate-800 bg-slate-950/60 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('theory')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                  activeTab === 'theory'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Теория и формулы</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Интерактивный тест ({totalQuestions})</span>
              </button>
            </div>

            {/* Вкладка 1: Теория */}
            {activeTab === 'theory' && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-800 bg-[#0F172A]/80 p-4 shadow-sm backdrop-blur-md">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Конспект от Gemini AI
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTheory}
                      className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{isCopied ? 'Скопировано!' : 'Скопировать'}</span>
                    </button>
                  </div>
                  <FormulaRenderer
                    content={lessonData.theorySummary}
                    className="text-xs text-slate-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-3 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:brightness-110"
                >
                  <span>Закрепить на тесте ({totalQuestions} вопроса)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Вкладка 2: Интерактивный тест */}
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                {/* Карточка текущего вопроса */}
                {lessonData.quiz && lessonData.quiz[currentQuizIdx] && (
                  <div className="rounded-2xl border border-slate-800 bg-[#0F172A]/90 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-sky-400">
                        Вопрос {currentQuizIdx + 1} из {totalQuestions}
                      </span>
                      <span>
                        Правильно: {correctCount}/{answeredCount}
                      </span>
                    </div>

                    <div className="mt-3 text-sm font-medium text-slate-100">
                      <FormulaRenderer content={lessonData.quiz[currentQuizIdx].question} />
                    </div>

                    {/* Варианты ответов */}
                    <div className="mt-4 space-y-2">
                      {lessonData.quiz[currentQuizIdx].options.map((opt, optIdx) => {
                        const isAnswered = selectedAnswers[currentQuizIdx] !== undefined;
                        const isSelected = selectedAnswers[currentQuizIdx] === optIdx;
                        const isCorrect = optIdx === lessonData.quiz[currentQuizIdx].correctIndex;

                        let style = 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800';
                        if (isAnswered) {
                          if (isCorrect) {
                            style = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200';
                          } else if (isSelected) {
                            style = 'border-rose-500/80 bg-rose-950/40 text-rose-200';
                          } else {
                            style = 'border-slate-800 bg-slate-950/30 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizOption(currentQuizIdx, optIdx)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all ${style}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-slate-400">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <FormulaRenderer content={opt} />
                            </div>
                            {isAnswered && isCorrect && <span className="text-emerald-400">✓</span>}
                            {isAnswered && isSelected && !isCorrect && (
                              <span className="text-rose-400">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Разбор ответа (explanation) */}
                    {selectedAnswers[currentQuizIdx] !== undefined && (
                      <div className="mt-3.5 rounded-xl border border-slate-700/60 bg-slate-950/80 p-3 text-xs text-slate-300">
                        <div className="font-semibold text-sky-400">Разбор решения:</div>
                        <div className="mt-1 leading-relaxed">
                          <FormulaRenderer
                            content={lessonData.quiz[currentQuizIdx].explanation}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Навигация по вопросам */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
                  <button
                    type="button"
                    disabled={currentQuizIdx === 0}
                    onClick={() => setCurrentQuizIdx((p) => Math.max(0, p - 1))}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-30"
                  >
                    ← Назад
                  </button>

                  <div className="text-xs text-slate-400">
                    {currentQuizIdx + 1} / {totalQuestions}
                  </div>

                  {currentQuizIdx < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuizIdx((p) => p + 1)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:brightness-110"
                    >
                      <span>Дальше</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        alert(
                          `Итог квиза: ${correctCount} из ${totalQuestions} верно! Переходим к конспекту.`
                        );
                        setActiveTab('theory');
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-500"
                    >
                      Завершить тест
                    </button>
                  )}
                </div>

                {/* Итоговый счет после ответов на все вопросы */}
                {answeredCount === totalQuestions && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center text-xs text-emerald-300">
                    <div className="font-bold text-emerald-400">
                      🎉 Вы ответили на все вопросы: {correctCount} / {totalQuestions} верно!
                    </div>
                    <div className="mt-1 text-slate-300">
                      Отличная тренировка перед созвоном с ментором Digital Mentor.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
