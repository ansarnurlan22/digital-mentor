import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Trash2,
  Send,
  HelpCircle,
  Zap,
  BookOpen,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { TutorMode, UserProfile, ChatMessage } from './types';
import { ChatMessageItem } from './ChatMessageItem';
import { QuizModeView } from './QuizModeView';
import { TheoryModeView } from './TheoryModeView';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

const QUICK_CHIPS = [
  'Разбери ошибку',
  'Дай подсказку к первому шагу',
  'Проверь меня по теме',
  'Какую формулу здесь применить?',
];

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  const [mode, setMode] = useState<TutorMode>('tutor');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Привет, **${profile.name}**! 👋\nЯ твой персональный AI-тьютор по **${profile.subject}** (${profile.grade}).\n\nМоя задача — помочь тебе дойти до верного ответа самостоятельно, разобрать сложные формулы или подготовиться к ближайшему созвону с ментором.\n\nКакую задачу или формулу разберём сегодня?`,
      timestamp: 'Только что',
      quickReplies: ['Логарифмические уравнения', 'Производная сложной функции', 'Тригонометрия: двойной угол'],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Автопрокрутка вниз при новых сообщениях
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, mode]);

  // Автоматическое расширение textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Очистка контекста диалога
  const handleClearChat = () => {
    if (window.confirm('Очистить историю диалога с тьютором?')) {
      setMessages([
        {
          id: String(Date.now()),
          sender: 'assistant',
          content: `Диалог очищен. С чего начнем изучение **${profile.subject}**, **${profile.name}**?`,
          timestamp: 'Только что',
        },
      ]);
    }
  };

  // Имитация потокового ответа (SSE / Typewriter Effect) в Сократовском стиле
  const simulateAssistantStreaming = (userText: string) => {
    setIsTyping(true);

    // Логика ответов по Сократовскому методу (направлять вопросами, не давать ответ)
    let replyText = '';
    const lower = userText.toLowerCase();

    if (lower.includes('реши') || lower.includes('ответ') || lower.includes('сколько будет')) {
      replyText = `Я не даю готовые числовые ответы — ведь на контрольной или ЕНТ ментора рядом не будет! 😉\n\nДавай решим вместе по шагам. **Шаг 1:** С чего мы всегда начинаем? Какое здесь ограничение на ОДЗ или какую базовую формулу мы можем применить к левой части?`;
    } else if (lower.includes('лог') || lower.includes('log')) {
      replyText = `Отличный вопрос по логарифмам! 📐\n\nВспомним главное свойство: сумма логарифмов с одинаковым основанием $\\log_a(u) + \\log_a(v)$ равна логарифму произведения $\\log_a(u \\cdot v)$.\n\nЧто у тебя стоит в основании и чему равны аргументы?`;
    } else if (lower.includes('производн') || lower.includes('дифференц')) {
      replyText = `Разбираем производные! 📈\n\nВспомни базовое правило: $(x^n)' = n \\cdot x^{n-1}$.\nЕсли у нас сложная функция $f(g(x))$, её производная равна произведению: $f'(g(x)) \\cdot g'(x)$.\n\nКакая именно функция вызывает сложность?`;
    } else if (lower.includes('тригоном') || lower.includes('синус') || lower.includes('косинус')) {
      replyText = `Тригонометрия требует аккуратности с формулами! 🎯\n\nЧаще всего задачу упрощает переход к одной функции через основное тождество $\\sin^2(x) + \\cos^2(x) = 1$ или формулы двойного угла $\\sin(2x) = 2\\sin(x)\\cos(x)$.\n\nВ твоем примере есть одинаковые углы или разные?`;
    } else {
      replyText = `Хороший вопрос, **${profile.name}**! Давай разберем эту мысль.\n\nЧто из условия задачи нам уже известно, и к какому виду или формуле мы хотим прийти? Назови первый шаг, как ты его видишь.`;
    }

    const messageId = 'ai-' + Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Создаем пустое потоковое сообщение
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: 'assistant',
        content: '',
        timestamp: timeStr,
        isStreaming: true,
      },
    ]);

    // Посимвольный typewriter
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx += 3;
      if (currentIdx >= replyText.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: replyText,
                  isStreaming: false,
                  quickReplies: ['Дай ещё подсказку', 'Я понял, идём дальше', 'Покажи формулу'],
                }
              : msg
          )
        );
        setIsTyping(false);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: replyText.slice(0, currentIdx),
                }
              : msg
          )
        );
      }
    }, 25);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Имитация ответа
    setTimeout(() => {
      simulateAssistantStreaming(text);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Полупрозрачный оверлей на мобилках */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm sm:hidden"
          />

          {/* Выдвижная панель чата */}
          <motion.aside
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col border-l border-slate-700/60 bg-[#080E1E]/95 shadow-2xl shadow-sky-950/50 backdrop-blur-2xl sm:bottom-6 sm:right-6 sm:top-auto sm:h-[680px] sm:max-h-[calc(100vh-3rem)] sm:w-[420px] sm:rounded-3xl sm:border sm:border-slate-700/70"
          >
            {/* Хедер виджета */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-[1px] shadow-lg shadow-sky-500/25">
                  <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-slate-950">
                    <Sparkles className="h-5 w-5 text-sky-400" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">Digital Mentor AI</h3>
                    <span className="rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/30">
                      Q-Chat
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{profile.subject}</span>
                    <span>·</span>
                    <span>{profile.grade}</span>
                  </div>
                </div>
              </div>

              {/* Кнопки управления шапкой */}
              <div className="flex items-center gap-1">
                {mode === 'tutor' && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Очистить контекст диалога"
                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  title="Закрыть тьютор"
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Табы режимов в шапке */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1.5 text-xs">
              <button
                type="button"
                onClick={() => setMode('tutor')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition-all ${
                  mode === 'tutor'
                    ? 'bg-gradient-to-r from-blue-600/90 to-sky-600/90 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💡</span>
                <span>Тьютор</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('quiz')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition-all ${
                  mode === 'quiz'
                    ? 'bg-gradient-to-r from-blue-600/90 to-sky-600/90 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>⚡</span>
                <span>Экспресс-квиз</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('theory')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-semibold transition-all ${
                  mode === 'theory'
                    ? 'bg-gradient-to-r from-blue-600/90 to-sky-600/90 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>📖</span>
                <span>Теория</span>
              </button>
            </div>

            {/* Содержимое в зависимости от выбранного таба */}
            <div className="flex-1 overflow-hidden">
              {mode === 'tutor' && (
                <div className="flex h-full flex-col justify-between">
                  {/* Область сообщений */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                    {messages.map((msg) => (
                      <ChatMessageItem
                        key={msg.id}
                        message={msg}
                        onQuickReplyClick={(reply) => handleSendMessage(reply)}
                        onActionClick={(actionType, payload) => {
                          if (actionType === 'start_quiz') setMode('quiz');
                          if (actionType === 'open_theory') setMode('theory');
                          if (actionType === 'ask_hint' && payload) handleSendMessage(payload);
                        }}
                      />
                    ))}

                    {/* Индикатор набора ответа */}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-xs text-sky-400">
                        <span className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400" />
                        </span>
                        <span>Digital Mentor AI думает над наводящим вопросом...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Быстрые чипсы над полем ввода */}
                  <div className="flex gap-1.5 overflow-x-auto border-t border-slate-800/60 bg-slate-950/30 px-4 py-2 text-xs scrollbar-none sm:px-5">
                    {QUICK_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(chip)}
                        className="whitespace-nowrap rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-sky-500/50 hover:bg-slate-800 hover:text-white"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Поле ввода сообщения */}
                  <div className="border-t border-slate-800/80 bg-slate-900/60 p-3 sm:p-4">
                    <div className="relative flex items-end rounded-2xl border border-slate-700/80 bg-slate-950/80 p-2 shadow-inner focus-within:border-sky-500/80 focus-within:ring-1 focus-within:ring-sky-500/50">
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Спроси о задаче, формуле или шаге..."
                        className="max-h-28 flex-1 resize-none bg-transparent px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={!inputValue.trim() || isTyping}
                        onClick={() => handleSendMessage()}
                        aria-label="Отправить сообщение"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-md shadow-sky-500/20 transition-all hover:brightness-110 disabled:opacity-30 disabled:hover:brightness-100"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1.5 text-center text-[10px] text-slate-500">
                      Сократовский метод · Без готовых списываний · Enter для отправки
                    </div>
                  </div>
                </div>
              )}

              {mode === 'quiz' && (
                <QuizModeView
                  onAskTutorAboutQuestion={(qText) => {
                    setMode('tutor');
                    setTimeout(() => {
                      handleSendMessage(`Помоги разобрать вопрос из квиза: «${qText}». С чего начать рассуждение?`);
                    }, 300);
                  }}
                />
              )}

              {mode === 'theory' && (
                <TheoryModeView
                  onAskAboutFormula={(title, latex) => {
                    setMode('tutor');
                    setTimeout(() => {
                      handleSendMessage(`Объясни формулу «${title}»: $$${latex}$$. Где она применяется и как её запомнить?`);
                    }, 300);
                  }}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
