'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Settings,
  Check,
  CheckCircle2,
  X,
  Flame,
  Award,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Volume2,
  Bell,
  LogOut,
  Code2,
  Globe,
  Cpu,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Terminal,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface Step {
  id: number;
  theory: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  aiHint: string;
}

interface Course {
  id: string;
  title: string;
  icon: 'python' | 'web' | 'algo';
  description: string;
  steps: Step[];
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  progress: number;
  current: number;
  target: number;
  unlocked: boolean;
}

interface UserData {
  name: string;
  email: string;
  status: string;
  level: string;
  xp: number;
  streak: number;
  completedLessons: number;
}

// ============================================================================
// Data: Courses & Interactive Lessons
// ============================================================================

const COURSES: Course[] = [
  {
    id: 'python',
    title: 'Python',
    icon: 'python',
    description: 'Синтаксис, структуры данных, функции и логика',
    steps: [
      {
        id: 1,
        theory:
          'В Python функция print() выводит данные в стандартный поток вывода, а строковые литералы обрамляются одинарными или двойными кавычками.',
        question: 'Какая строчка кода корректно выводит значение текстовой переменной в консоль?',
        codeSnippet: 'greeting = "Привет, Digital Mentor!"\n# Выберите корректную инструкцию вывода',
        options: ['print(greeting)', 'echo greeting', 'console.log(greeting)', 'System.out.println(greeting)'],
        correctIndex: 0,
        aiHint: 'В Python для печати значений используется встроенная функция print(). Команды вроде echo или console.log характерны для Bash и JavaScript.',
      },
      {
        id: 2,
        theory:
          'Списки (list) в Python индексируются с нуля. Первый элемент всегда имеет индекс [0], а последний доступен по отрицательному индексу [-1].',
        question: 'Как получить первый элемент списка чисел nums = [10, 20, 30]?',
        codeSnippet: 'nums = [10, 20, 30]\nfirst_item = nums[?]',
        options: ['nums[0]', 'nums[1]', 'nums.first()', 'nums[-1]'],
        correctIndex: 0,
        aiHint: 'Индексация в Python начинается с 0. Индекс 1 вернет второй элемент (число 20).',
      },
      {
        id: 3,
        theory:
          'Цикл for i in range(n) последовательно проходит числа от 0 до n-1, выполняя блок кода ровно n раз.',
        question: 'Сколько раз суммарно выполнится блок кода внутри цикла for i in range(5)?',
        codeSnippet: 'for i in range(5):\n    process(i)',
        options: ['Ровно 5 раз (0, 1, 2, 3, 4)', '4 раза', '6 раз', 'Бесконечное число раз'],
        correctIndex: 0,
        aiHint: 'range(5) генерирует последовательность из 5 элементов: 0, 1, 2, 3, 4. Цикл совершит ровно 5 итераций.',
      },
      {
        id: 4,
        theory:
          'Для логического сравнения двух значений на равенство применяется оператор ==. Одинарный знак = зарезервирован для присваивания.',
        question: 'Какое выражение проверяет, что переменная score равна 100?',
        codeSnippet: 'if score ? 100:\n    print("Максимальный балл!")',
        options: ['score == 100', 'score = 100', 'score === 100', 'score equals 100'],
        correctIndex: 0,
        aiHint: 'Оператор = присваивает значение, а для проверки равенства в Python используется только двойной знак ==.',
      },
      {
        id: 5,
        theory:
          'Функции объявляются через ключевое слово def, а для возврата вычисленного значения вызывающему коду используется директива return.',
        question: 'Какое ключевое слово передает результат работы функции обратно в программу?',
        codeSnippet: 'def add(a, b):\n    ? a + b',
        options: ['return', 'yield', 'export', 'send'],
        correctIndex: 0,
        aiHint: 'Директива return завершает выполнение функции и возвращает результат ее вычислений.',
      },
    ],
  },
  {
    id: 'web',
    title: 'Web-разработка',
    icon: 'web',
    description: 'HTML5, flexbox-верстка, селекторы и DOM-события',
    steps: [
      {
        id: 1,
        theory:
          'HTML формирует семантический каркас веб-страницы: тег <h1> определяет главный заголовок верхнего уровня, а тег <p> — абзац текста.',
        question: 'Какой HTML-тег обозначает основной заголовок первого уровня документа?',
        codeSnippet: '<h1>Главный заголовок документа</h1>\n<p>Текст вводного параграфа.</p>',
        options: ['<h1>', '<heading>', '<header>', '<title>'],
        correctIndex: 0,
        aiHint: 'В стандарте HTML заголовки нумеруются от <h1> (наивысший приоритет) до <h6>.',
      },
      {
        id: 2,
        theory:
          'CSS Flexbox позволяет легко центрировать контент: свойство justify-content: center выравнивает элементы по главной оси.',
        question: 'Какое свойство CSS отвечает за выравнивание элементов по главной оси во flex-контейнере?',
        codeSnippet: '.wrapper {\n  display: flex;\n  justify-content: center;\n}',
        options: ['justify-content: center;', 'align-content: middle;', 'text-align: center;', 'float: center;'],
        correctIndex: 0,
        aiHint: 'В CSS Flexbox свойство justify-content управляет положением элементов вдоль главной оси.',
      },
      {
        id: 3,
        theory:
          'В таблицах стилей CSS селекторы классов начинаются с символа точки (.card), а селекторы идентификаторов — со знака решетки (#hero).',
        question: 'Какой селектор стилизует блок с атрибутом class="btn-primary"?',
        codeSnippet: '/* CSS правило */\n.btn-primary {\n  background-color: #2563EB;\n}',
        options: ['.btn-primary', '#btn-primary', 'btn-primary', '*btn-primary'],
        correctIndex: 0,
        aiHint: 'Стилизация классов в CSS всегда начинается с префикса точки (например, .btn-primary).',
      },
      {
        id: 4,
        theory:
          'Атрибут href тега <a> указывает целевой адрес веб-страницы или ресурса, на который ведет ссылка.',
        question: 'Какой атрибут тега <a> задает URL ссылки для перехода пользователя?',
        codeSnippet: '<a href="https://digital-mentor.org">Открыть платформу</a>',
        options: ['href', 'src', 'link', 'to'],
        correctIndex: 0,
        aiHint: 'Атрибут src применяется для встроенных медиафайлов (картинки, скрипты), а для ссылок используется href (Hypertext Reference).',
      },
      {
        id: 5,
        theory:
          'Метод addEventListener регистрирует функцию обратного вызова на событие элемента (например, click).',
        question: 'Как подписаться на событие клика по кнопке в современном JavaScript?',
        codeSnippet: "button.addEventListener('click', () => {\n  console.log('Клик зарегистрирован');\n});",
        options: [
          "button.addEventListener('click', handler)",
          "button.attach('click', handler)",
          'button.onClick(handler)',
          'button.trigger(handler)',
        ],
        correctIndex: 0,
        aiHint: 'Стандартный метод интерфейса EventTarget в браузере — addEventListener(type, listener).',
      },
    ],
  },
  {
    id: 'algo',
    title: 'Алгоритмика',
    icon: 'algo',
    description: 'Оценка O(n), бинарный поиск и базовые структуры',
    steps: [
      {
        id: 1,
        theory:
          'Временная сложность O(1) описывает операцию константной сложности, длительность которой не зависит от объема входных данных.',
        question: 'Какова алгоритмическая сложность прямого доступа к элементу массива по его индексу?',
        codeSnippet: 'element = array[42]  # Индекс известен заранее',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctIndex: 0,
        aiHint: 'Поскольку память под массив выделяется непрерывным блоком, смещение до ячейки вычисляется мгновенно за константное время O(1).',
      },
      {
        id: 2,
        theory:
          'Бинарный поиск делит область поиска пополам на каждой итерации, обеспечивая логарифмическое время O(log n).',
        question: 'Какое условие является обязательным для корректной работы классического алгоритма бинарного поиска?',
        codeSnippet: '# Бинарный поиск: mid = (left + right) // 2',
        options: [
          'Массив обязательно должен быть отсортирован',
          'Все числа массива должны быть целыми и положительными',
          'Длина массива обязана быть степенью двойки',
          'В массиве не должно быть нулевых элементов',
        ],
        correctIndex: 0,
        aiHint: 'Бинарный поиск отсекает половину элементов именно на основе их упорядоченности. Без сортировки алгоритм неприменим.',
      },
      {
        id: 3,
        theory:
          'Стек (Stack) работает по принципу LIFO (Last In, First Out): элемент, добавленный последним, извлекается первым.',
        question: 'Какой принцип обработки данных лежит в основе структуры «Стек»?',
        codeSnippet: 'stack.append(x)  # push\nitem = stack.pop()  # pop',
        options: ['LIFO (Last In, First Out)', 'FIFO (First In, First Out)', 'Random Access', 'Round Robin'],
        correctIndex: 0,
        aiHint: 'Стек напоминает стопку книг: вы можете снять только верхнюю книгу, которую положили последней (LIFO).',
      },
      {
        id: 4,
        theory:
          'Очередь (Queue) работает по принципу FIFO (First In, First Out): первый пришедший элемент обрабатывается первым.',
        question: 'Какая структура данных используется для обработки задач в порядке их поступления?',
        codeSnippet: '# Первый элемент в очереди обслуживается первым',
        options: ['Очередь (Queue - FIFO)', 'Стек (Stack - LIFO)', 'Бинарное дерево поиска', 'Граф смежности'],
        correctIndex: 0,
        aiHint: 'Очередь работает ровно так же, как реальная очередь людей: первый пришел — первый обслужен.',
      },
      {
        id: 5,
        theory:
          'Хеш-таблица вычисляет позицию значения с помощью хеш-функции, обеспечивая в среднем константную скорость поиска O(1).',
        question: 'Какова средняя временная сложность поиска элемента по ключу в хеш-таблице (dict в Python)?',
        codeSnippet: 'val = cache.get("auth_token")',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctIndex: 0,
        aiHint: 'Хеш-функция преобразует ключ в индекс ячейки памяти, поэтому среднее время поиска равно O(1).',
      },
    ],
  },
];

const INITIAL_USER: UserData = {
  name: 'Ансар Нурлан',
  email: 'ansarnurlan2@gmail.com',
  status: 'Ученик',
  level: 'Уровень 4 (Senior Trainee)',
  xp: 1550,
  streak: 7,
  completedLessons: 14,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    desc: 'Успешно решен первый интерактивный шаг на платформе',
    progress: 100,
    current: 1,
    target: 1,
    unlocked: true,
  },
  {
    id: 'streak-fire',
    title: 'Ударный режим',
    desc: '7 дней непрерывных занятий без пропусков',
    progress: 100,
    current: 7,
    target: 7,
    unlocked: true,
  },
  {
    id: 'code-master',
    title: 'Мастер кода',
    desc: '15 практических задач решены с первой попытки',
    progress: 80,
    current: 12,
    target: 15,
    unlocked: false,
  },
  {
    id: 'algorithmist',
    title: 'Алгоритмист',
    desc: 'Освоение базовых структур данных и оценки O(n)',
    progress: 60,
    current: 3,
    target: 5,
    unlocked: false,
  },
  {
    id: 'sprinter',
    title: 'Спринтер',
    desc: '5 верных ответов подряд без вызова подсказок ИИ',
    progress: 100,
    current: 5,
    target: 5,
    unlocked: true,
  },
  {
    id: 'polyglot',
    title: 'Архитектор систем',
    desc: 'Успешное прохождение нескольких направлений разработки',
    progress: 67,
    current: 2,
    target: 3,
    unlocked: false,
  },
];

// ============================================================================
// Main Single Page Application Component
// ============================================================================

export default function SinglePageApp() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Navigation State (SPA Tabs)
  const [activeTab, setActiveTab] = useState<'practice' | 'profile'>('practice');

  // Course Player State
  const [selectedCourseId, setSelectedCourseId] = useState<string>('python');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAiHint, setShowAiHint] = useState<boolean>(false);

  // User Profile State
  const [user, setUser] = useState<UserData>(INITIAL_USER);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Hydration & Storage sync
  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem('dm_spa_user_v4');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedCourse = localStorage.getItem('dm_spa_course_v4');
      if (savedCourse) setSelectedCourseId(savedCourse);

      const savedStep = localStorage.getItem('dm_spa_step_v4');
      if (savedStep) setCurrentStepIndex(Number(savedStep) || 0);
    } catch {
      // Local storage fallback
    }
  }, []);

  const saveUserData = (updated: UserData) => {
    setUser(updated);
    try {
      localStorage.setItem('dm_spa_user_v4', JSON.stringify(updated));
    } catch {}
  };

  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const currentStep = currentCourse.steps[currentStepIndex] || currentCourse.steps[0];

  // Course selection handler
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(null);
    setShowAiHint(false);
    try {
      localStorage.setItem('dm_spa_course_v4', courseId);
      localStorage.setItem('dm_spa_step_v4', '0');
    } catch {}
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (selectedOption === null) return;

    setIsChecked(true);
    const correct = selectedOption === currentStep.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setShowAiHint(false);
      // Award +50 XP
      const updatedUser = {
        ...user,
        xp: user.xp + 50,
        completedLessons: user.completedLessons + 1,
      };
      saveUserData(updatedUser);

      // Toast feedback
      setFeedbackToast('+50 XP! Ответ абсолютно верен.');
      setTimeout(() => setFeedbackToast(null), 3000);
    } else {
      setShowAiHint(true);
    }
  };

  // Next Step Handler
  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < currentCourse.steps.length) {
      setCurrentStepIndex(nextIndex);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(null);
      setShowAiHint(false);
      try {
        localStorage.setItem('dm_spa_step_v4', String(nextIndex));
      } catch {}
    } else {
      // Course finished! Loop or reset
      setFeedbackToast(`Поздравляем! Курс «${currentCourse.title}» полностью пройден!`);
      setTimeout(() => setFeedbackToast(null), 4000);
      setCurrentStepIndex(0);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(null);
      setShowAiHint(false);
    }
  };

  // Reset current question
  const handleResetStep = () => {
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(null);
    setShowAiHint(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col selection:bg-blue-600/20">
      {/* ===================================================================== */}
      {/* 1. NAVBAR (48px Fixed, 1px Border)                                    */}
      {/* ===================================================================== */}
      <header className="h-[48px] border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--background)] sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
        {/* Left: Minimal Monochrome Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[var(--surface-raised)] border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center font-mono font-bold text-xs tracking-wider text-[var(--foreground)]">
            DM
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--foreground)] hidden sm:inline">
            Digital Mentor
          </span>
        </div>

        {/* Center: Switcher between 2 Tabs («Курсы и практика» и «Профиль») */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 text-[var(--foreground)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Курсы и практика
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 text-[var(--foreground)] font-semibold'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            Профиль
          </button>
        </nav>

        {/* Right: Settings Gear Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded-md border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[var(--surface-raised)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            title="Настройки"
            aria-label="Настройки"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121620] border border-[#10B981]/50 text-[#10B981] px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-medium">{feedbackToast}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. MAIN CONTENT (SPA)                                                 */}
      {/* ===================================================================== */}
      <main className="flex-1 flex flex-col justify-start">
        {/* =================================================================== */}
        {/* TAB 1: «КУРСЫ И ПРАКТИКА»                                           */}
        {/* =================================================================== */}
        {activeTab === 'practice' && (
          <div className="w-full max-w-[760px] mx-auto px-4 py-8 md:py-10 flex flex-col gap-6">
            {/* Course Selector (3 Minimal Cards) */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-3">
                Выберите направление
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {COURSES.map((course) => {
                  const isSelected = course.id === selectedCourseId;
                  const Icon =
                    course.icon === 'python' ? Code2 : course.icon === 'web' ? Globe : Cpu;

                  return (
                    <button
                      key={course.id}
                      onClick={() => handleSelectCourse(course.id)}
                      className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB]/10'
                          : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded flex items-center justify-center border ${
                            isSelected
                              ? 'border-[#2563EB] text-[#2563EB]'
                              : 'border-[#1F2430] dark:border-[#1F2430] border-slate-300 text-[var(--muted)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-[#2563EB] font-bold px-1.5 py-0.5 rounded bg-[#2563EB]/15">
                            Активен
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-sm text-[var(--foreground)]">
                        {course.title}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] mt-1 line-clamp-2">
                        {course.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Lesson Player */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-6 space-y-6">
              {/* Lesson Step Progress */}
              <div className="flex items-center justify-between border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                    {currentCourse.title}
                  </span>
                  <span className="text-xs text-[var(--muted)]">/</span>
                  <span className="text-xs font-mono text-[var(--muted)]">
                    Шаг {currentStepIndex + 1} из {currentCourse.steps.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentCourse.steps.map((s, idx) => (
                    <span
                      key={s.id}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentStepIndex
                          ? 'w-6 bg-[#2563EB]'
                          : idx < currentStepIndex
                          ? 'w-2 bg-[#10B981]'
                          : 'w-2 bg-[#1F2430] dark:bg-[#1F2430] bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Brief Theory Box (1–2 sentences) */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] rounded-md p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#2563EB] font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Краткая теория</span>
                </div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  {currentStep.theory}
                </p>
              </div>

              {/* Question Statement */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-[var(--foreground)] leading-snug">
                  {currentStep.question}
                </div>

                {/* Code Snippet Box if available */}
                {currentStep.codeSnippet && (
                  <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[#06070B] dark:bg-[#06070B] bg-slate-950 rounded-md p-3 font-mono text-xs text-slate-300 overflow-x-auto">
                    <pre>{currentStep.codeSnippet}</pre>
                  </div>
                )}
              </div>

              {/* Options Cards */}
              <div className="space-y-2.5">
                {currentStep.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswerChecked = isChecked;
                  const isThisCorrect = isAnswerChecked && idx === currentStep.correctIndex;
                  const isThisWrong = isAnswerChecked && isSelected && !isCorrect;

                  let borderClass = 'border-[#1F2430] dark:border-[#1F2430] border-slate-200';
                  let bgClass = 'bg-[var(--surface-raised)] hover:border-slate-400 dark:hover:border-slate-600';

                  if (isThisCorrect) {
                    borderClass = 'border-[#10B981]';
                    bgClass = 'bg-[#10B981]/10 text-emerald-400 font-medium';
                  } else if (isThisWrong) {
                    borderClass = 'border-[#EF4444]';
                    bgClass = 'bg-[#EF4444]/10 text-red-400';
                  } else if (isSelected) {
                    borderClass = 'border-[#2563EB]';
                    bgClass = 'bg-[#2563EB]/10 text-[var(--foreground)] font-medium';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isCorrect === true}
                      onClick={() => {
                        setSelectedOption(idx);
                        setIsChecked(false);
                        setShowAiHint(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-md border ${borderClass} ${bgClass} text-xs transition-all flex items-center justify-between cursor-pointer disabled:cursor-default`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center font-mono text-[10px] text-[var(--muted)]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isThisCorrect && <Check className="w-4 h-4 text-[#10B981]" />}
                      {isThisWrong && <X className="w-4 h-4 text-[#EF4444]" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Проверить / Следующий шаг */}
              <div className="pt-2 flex items-center justify-between gap-3">
                {isCorrect ? (
                  <div className="w-full flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Отлично! +50 XP начислено.</span>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="py-2.5 px-5 rounded-md bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Следующий шаг</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between gap-3">
                    <button
                      disabled={selectedOption === null}
                      onClick={handleCheckAnswer}
                      className="w-full py-2.5 px-4 rounded-md bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Проверить</span>
                    </button>

                    {isChecked && !isCorrect && (
                      <button
                        onClick={handleResetStep}
                        className="py-2.5 px-3 rounded-md border border-[#1F2430] dark:border-[#1F2430] border-slate-200 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                        title="Попробовать снова"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Compact AI Hint (Appears ONLY on incorrect answer) */}
              {showAiHint && (
                <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[#06070B] dark:bg-[#06070B] bg-slate-900 rounded-md p-3 text-xs font-mono text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>[ИИ-подсказка]:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-5">
                    {currentStep.aiHint}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: «ПРОФИЛЬ» (Личный кабинет + ВСЕ достижения в единой сетке)    */}
        {/* =================================================================== */}
        {activeTab === 'profile' && (
          <div className="w-full max-w-[760px] mx-auto px-4 py-8 md:py-10 flex flex-col gap-6">
            {/* User Info Card */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--surface-raised)] border border-[#1F2430] dark:border-[#1F2430] border-slate-300 flex items-center justify-center font-bold text-sm text-[var(--foreground)] font-mono">
                  АН
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[var(--foreground)]">
                      {user.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2563EB]/15 text-blue-400 border border-[#2563EB]/30">
                      {user.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[var(--muted)] mt-0.5">
                    {user.level} · {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Metric Cards in a Row: XP, Streak (🔥 дни), Пройдено уроков */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Metric 1: XP */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-4 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Опыт (XP)
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                  {user.xp} XP
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Накоплено за практику
                </div>
              </div>

              {/* Metric 2: Streak (🔥 дни) */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-4 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Ударный режим
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--foreground)] flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                  <span>{user.streak} дней</span>
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  Ежедневный ритм занятий
                </div>
              </div>

              {/* Metric 3: Пройдено уроков */}
              <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-4 space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Пройдено шагов
                </span>
                <div className="text-2xl font-bold font-mono text-[var(--foreground)]">
                  {user.completedLessons}
                </div>
                <div className="text-[11px] font-mono text-[#10B981] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Успешный темп</span>
                </div>
              </div>
            </div>

            {/* Unified Grid of ALL Achievements directly on this page */}
            <div className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface)] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Все академические достижения
                  </h3>
                </div>

                <span className="text-xs font-mono text-[var(--muted)]">
                  {achievements.filter((a) => a.unlocked).length} из {achievements.length} открыто
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="border border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] rounded-md p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[var(--foreground)]">
                          {ach.title}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] leading-tight mt-0.5">
                          {ach.desc}
                        </div>
                      </div>

                      {ach.unlocked && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 shrink-0">
                          100%
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full space-y-1">
                      <div className="w-full h-1.5 bg-[#1F2430] dark:bg-[#1F2430] bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            ach.unlocked ? 'bg-[#10B981]' : 'bg-[#2563EB]'
                          }`}
                          style={{ width: `${ach.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[var(--muted)]">
                        <span>
                          {ach.current} / {ach.target}
                        </span>
                        <span>{ach.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* 3. SETTINGS MODAL (По клику на шестеренку)                            */}
      {/* ===================================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-[#1F2430] dark:border-[#1F2430] border-slate-300 bg-[var(--surface)] p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1F2430] dark:border-[#1F2430] border-slate-200 pb-3">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Параметры и профиль
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selector (Темная / Светлая / Системная via next-themes) */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--muted)] block">
                Тема оформления интерфейса
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2 px-3 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mounted && theme === 'light'
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-blue-400'
                      : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Светлая</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`py-2 px-3 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mounted && theme === 'dark'
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-blue-400'
                      : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Тёмная</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`py-2 px-3 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mounted && theme === 'system'
                      ? 'border-[#2563EB] bg-[#2563EB]/10 text-blue-400'
                      : 'border-[#1F2430] dark:border-[#1F2430] border-slate-200 bg-[var(--surface-raised)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Системная</span>
                </button>
              </div>
            </div>

            {/* Checkboxes: Notifications & Sounds */}
            <div className="space-y-3 pt-1 border-t border-[#1F2430] dark:border-[#1F2430] border-slate-200">
              <label className="flex items-center justify-between text-xs text-[var(--foreground)] cursor-pointer">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[var(--muted)]" />
                  <span>Звуковые эффекты</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded border-[#1F2430] dark:border-[#1F2430] border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-[var(--foreground)] cursor-pointer">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[var(--muted)]" />
                  <span>Уведомления о прогрессе</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="rounded border-[#1F2430] dark:border-[#1F2430] border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>

            {/* Account Info & Red Logout Button */}
            <div className="space-y-3 pt-2 border-t border-[#1F2430] dark:border-[#1F2430] border-slate-200">
              <div className="text-xs">
                <span className="text-[var(--muted)] block">Почта аккаунта:</span>
                <span className="font-mono text-[var(--foreground)] font-medium">
                  {user.email}
                </span>
              </div>

              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('dm_spa_user_v4');
                    localStorage.removeItem('dm_spa_course_v4');
                    localStorage.removeItem('dm_spa_step_v4');
                  } catch {}
                  setIsSettingsOpen(false);
                  window.location.reload();
                }}
                className="w-full py-2.5 px-4 rounded-md border border-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Выйти из аккаунта</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
