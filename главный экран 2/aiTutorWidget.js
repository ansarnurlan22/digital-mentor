/**
 * Digital Mentor AI-Tutor (Quizlet Q-Chat Style)
 * Круглосуточный академический напарник школьника по Сократовскому методу
 */

(function () {
  // Профиль ученика: Матвей, 11 класс, Алгебра (с синхронизацией из профиля пользователя)
  function getStudentProfile() {
    try {
      const raw = localStorage.getItem('digitalMentor_userProfile');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          name: parsed.name || 'Матвей',
          role: parsed.role || 'Ученик',
          grade: parsed.grade || '11 класс',
          subject: parsed.subject || 'Алгебра',
        };
      }
    } catch (e) {}
    return {
      name: 'Матвей',
      role: 'Ученик',
      grade: '11 класс',
      subject: 'Алгебра',
    };
  }

  const profile = getStudentProfile();

  // Банк вопросов для Экспресс-квиза (11 класс, Алгебра)
  const QUIZ_QUESTIONS = [
    {
      topic: 'Логарифмические уравнения',
      question: 'Каково ОДЗ для логарифмического уравнения:',
      formula: '\\log_2(x - 4) + \\log_2(x + 2) = 4',
      options: ['x > -2', 'x > 4', 'x < 4', 'x ∈ ℝ'],
      correct: 1,
      explanation: 'Аргументы обоих логарифмов должны быть строго положительными: x - 4 > 0 и x + 2 > 0. Пересечение дает x > 4.',
      hint: 'Под знаком логарифма могут стоять только строго положительные числа. Какое общее ограничение получится для x - 4 > 0 и x + 2 > 0?',
    },
    {
      topic: 'Тригонометрия',
      question: 'Чему равен синус двойного угла при любом x:',
      formula: '\\sin(2x) = ?',
      options: ['2\\sin(x)', '\\sin^2(x) - \\cos^2(x)', '2\\sin(x)\\cos(x)', '\\cos(2x) + 1'],
      correct: 2,
      explanation: 'По формуле двойного угла: \\sin(2x) = 2\\sin(x)\\cos(x).',
      hint: 'Вспомни сложение синусов: sin(x + x) = sin(x)cos(x) + cos(x)sin(x). Что получится в сумме?',
    },
    {
      topic: 'Производная функции',
      question: 'Найдите производную многочлена в точке x:',
      formula: 'f(x) = x^3 - 4x^2 + 7',
      options: ['3x^2 - 8x', '3x^2 - 8x + 7', 'x^2 - 4x', '3x^2 - 4x'],
      correct: 0,
      explanation: 'Производная степени (x^n)\' = n·x^(n-1), а производная константы 7\' = 0: (x^3)\' = 3x^2, (-4x^2)\' = -8x.',
      hint: 'Чему равна производная константы 7? И как дифференцируется x^n?',
    },
    {
      topic: 'Свойства логарифмов',
      question: 'Чему равно значение выражения:',
      formula: '\\log_3(18) - \\log_3(2)',
      options: ['\\log_3(16)', '2', '3', '9'],
      correct: 1,
      explanation: 'Разность логарифмов равна логарифму частного: \\log_3(18 / 2) = \\log_3(9) = 2.',
      hint: 'Разность логарифмов с одинаковым основанием сворачивается делением аргументов: log_a(b) - log_a(c) = log_a(b / c).',
    },
    {
      topic: 'Касательная к графику',
      question: 'Чему равен угловой коэффициент k касательной к графику y = f(x) в точке x_0?',
      formula: 'k = ?',
      options: ['f(x_0)', 'f\'(x_0)', '\\frac{f(x_0)}{x_0}', 'f\'\'(x_0)'],
      correct: 1,
      explanation: 'Геометрический смысл производной: значение производной в точке касания f\'(x_0) в точности равно тангенсу угла наклона (угловому коэффициенту) касательной.',
      hint: 'Вспомни геометрический смысл производной: производная функции в точке касания равна угловому коэффициенту касательной.',
    },
  ];

  // Теория и формулы
  const THEORY_DATA = [
    {
      title: 'Основное тригонометрическое тождество',
      latex: '\\sin^2(x) + \\cos^2(x) = 1',
      desc: 'Связывает синус и косинус одного и того же угла. Позволяет выразить одну функцию через другую: \\cos(x) = \\pm \\sqrt{1 - \\sin^2(x)}.',
    },
    {
      title: 'Синус и косинус двойного угла',
      latex: '\\sin(2x) = 2\\sin(x)\\cos(x), \\quad \\cos(2x) = \\cos^2(x) - \\sin^2(x)',
      desc: 'Формулы кратных углов незаменимы для упрощения тригонометрических уравнений.',
    },
    {
      title: 'Свойства и ОДЗ логарифма',
      latex: '\\log_a(u) + \\log_a(v) = \\log_a(u \\cdot v) \\quad (u > 0, v > 0, a > 0, a \\neq 1)',
      desc: 'При сложении логарифмов с одинаковым основанием аргументы перемножаются. Помни про ОДЗ!',
    },
    {
      title: 'Таблица производных элементарных функций',
      latex: '(x^n)\' = n x^{n-1}, \\quad (\\sin x)\' = \\cos x, \\quad (\\ln x)\' = \\frac{1}{x}',
      desc: 'Базовые формулы дифференцирования для нахождения скорости изменения функции и экстремумов.',
    },
    {
      title: 'Уравнение касательной к графику',
      latex: 'y = f(x_0) + f\'(x_0)(x - x_0)',
      desc: 'Где k = f\'(x_0) — угловой коэффициент наклона касательной прямой в точке x_0.',
    },
  ];

  // Состояние виджета
  let isOpen = false;
  let currentMode = 'tutor'; // 'tutor' | 'quiz' | 'theory'
  let isGenerating = false;
  let messages = [
    {
      sender: 'assistant',
      content: `Привет, **${profile.name}**! 👋\nЯ твой круглосуточный AI-тьютор по **${profile.subject}** (${profile.grade}).\n\nМоя задача — помочь тебе дойти до верного решения самостоятельно по шагам, без готовых списываний. Какую задачу или формулу разберём сегодня?`,
      time: 'Сейчас',
    },
  ];

  // Состояние квиза
  let quizIndex = 0;
  let quizSelected = null;
  let quizAnswered = false;
  let quizScore = 0;

  // Инициализация HTML структуры
  function initWidgetDOM() {
    if (document.getElementById('ai-tutor-root')) return;

    const root = document.createElement('div');
    root.id = 'ai-tutor-root';
    root.innerHTML = `
      <!-- Оверлей для мобильных -->
      <div class="ai-tutor-overlay" id="ai-tutor-overlay"></div>

      <!-- Плавающая кнопка (FAB) -->
      <div class="ai-tutor-fab-wrap">
        <div class="ai-tutor-fab-badge" id="ai-tutor-fab-badge" title="Открыть персонального AI-тьютора">
          <span class="ai-tutor-fab-dot"></span>
          <span>AI-тьютор · 24/7</span>
        </div>
        <button type="button" class="ai-tutor-fab-btn" id="ai-tutor-fab-btn" aria-label="Открыть AI-тьютора">
          <svg class="ai-tutor-fab-icon" id="ai-tutor-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </button>
      </div>

      <!-- Выдвижная панель чата -->
      <div class="ai-tutor-drawer" id="ai-tutor-drawer">
        <!-- Шапка -->
        <div class="ai-tutor-header">
          <div class="ai-tutor-profile">
            <div class="ai-tutor-avatar">
              <div class="ai-tutor-avatar-inner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span class="ai-tutor-avatar-status" title="Онлайн"></span>
            </div>
            <div class="ai-tutor-title-wrap">
              <h4>
                <span>Digital Mentor AI</span>
                <span class="ai-tutor-tag">Q-Chat</span>
              </h4>
              <p class="ai-tutor-subtitle">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#34d399;"></span>
                <span>${profile.subject}</span>
                <span>·</span>
                <span>${profile.grade}</span>
              </p>
            </div>
          </div>
          <div class="ai-tutor-actions">
            <button type="button" class="ai-tutor-icon-btn" id="ai-tutor-clear-btn" title="Очистить диалог">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
              </svg>
            </button>
            <button type="button" class="ai-tutor-icon-btn" id="ai-tutor-close-btn" title="Закрыть">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Табы режимов -->
        <div class="ai-tutor-tabs">
          <button type="button" class="ai-tutor-tab-btn is-active" data-tab="tutor">
            <span>💡</span><span>Тьютор</span>
          </button>
          <button type="button" class="ai-tutor-tab-btn" data-tab="quiz">
            <span>⚡</span><span>Экспресс-квиз</span>
          </button>
          <button type="button" class="ai-tutor-tab-btn" data-tab="theory">
            <span>📖</span><span>Теория</span>
          </button>
        </div>

        <!-- Контент табов -->
        <div class="ai-tutor-tab-content">
          <!-- Режим 1: Тьютор -->
          <div id="ai-tab-tutor" style="display:flex;flex-direction:column;height:100%;">
            <div class="ai-tutor-messages" id="ai-tutor-messages"></div>

            <!-- Быстрые подсказки-чипсы -->
            <div class="ai-quick-chips">
              <button type="button" class="ai-chip-btn" data-query="Разбери ошибку">Разбери ошибку</button>
              <button type="button" class="ai-chip-btn" data-query="Дай подсказку к первому шагу">Подсказка к 1 шагу</button>
              <button type="button" class="ai-chip-btn" data-query="Какую формулу здесь применить?">Какая формула?</button>
              <button type="button" class="ai-chip-btn" data-query="Проверь мое ОДЗ">Проверь мое ОДЗ</button>
            </div>

            <!-- Поле ввода -->
            <div class="ai-tutor-input-box">
              <div class="ai-input-wrap">
                <textarea class="ai-textarea" id="ai-textarea" rows="1" placeholder="Задай вопрос по алгебре, задаче или шагу..."></textarea>
                <button type="button" class="ai-send-btn" id="ai-send-btn" aria-label="Отправить">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <div class="ai-input-footer-hint">Сократовский метод · Без готовых ответов · Enter для отправки</div>
            </div>
          </div>

          <!-- Режим 2: Квиз -->
          <div id="ai-tab-quiz" class="ai-quiz-view" style="display:none;"></div>

          <!-- Режим 3: Теория -->
          <div id="ai-tab-theory" class="ai-theory-view" style="display:none;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    setupEventListeners();
    renderMessages();
    renderQuizView();
    renderTheoryView();
  }

  // Отрисовка LaTeX формул через KaTeX (если загружен)
  function renderLatex(container) {
    if (window.renderMathInElement) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
  }

  // Рендеринг списка сообщений
  function renderMessages() {
    const list = document.getElementById('ai-tutor-messages');
    if (!list) return;

    list.innerHTML = messages
      .map((msg, idx) => {
        const isAssistant = msg.sender === 'assistant';
        const formatted = formatMarkdown(msg.content);
        return `
          <div class="ai-message-row ${msg.sender}">
            ${isAssistant ? '<div class="ai-msg-avatar">✨</div>' : ''}
            <div class="ai-msg-bubble">
              <div>${formatted}</div>
              <div class="ai-msg-time">${msg.time}</div>
            </div>
            ${!isAssistant ? '<div class="ai-msg-avatar">👤</div>' : ''}
          </div>
        `;
      })
      .join('');

    renderLatex(list);
    list.scrollTop = list.scrollHeight;
  }

  // Простой Markdown парсер (жирный текст, списки)
  function formatMarkdown(text) {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return html;
  }

  // Сократовский генератор ответов AI
  function generateSocraticResponse(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('реши') || lower.includes('ответ') || lower.includes('сколько будет')) {
      return `Я не выдаю готовые числовые решения сразу — ведь на контрольной ментора рядом не будет! 😉\n\nДавай решим вместе шаг за шагом. **Шаг 1:** С чего мы всегда начинаем? Какое здесь ограничение (ОДЗ) или какую формулу применим к левой части?`;
    }
    if (lower.includes('лог') || lower.includes('log')) {
      return `Отличная задача на логарифмы! 📐\n\nВспомним главное свойство: сумма логарифмов с одинаковым основанием $\\log_a(u) + \\log_a(v)$ сворачивается в логарифм произведения $\\log_a(u \\cdot v)$.\n\nКакое у тебя основание и чему равны аргументы? И какое ограничение по ОДЗ ($u > 0, v > 0$)?`;
    }
    if (lower.includes('производн') || lower.includes('касательн')) {
      return `Разбираем производные! 📈\n\nБазовое правило для степени: $(x^n)' = n \\cdot x^{n-1}$.\nЕсли это касательная, помни: угловой коэффициент равен значению производной в точке касания $k = f'(x_0)$.\n\nКакая конкретно функция задана в твоем примере?`;
    }
    if (lower.includes('тригоном') || lower.includes('синус') || lower.includes('косинус')) {
      return `Тригонометрия! 🎯\n\nЧаще всего сложное выражение упрощается через основное тождество $\\sin^2(x) + \\cos^2(x) = 1$ или формулу двойного угла $\\sin(2x) = 2\\sin(x)\\cos(x)$.\n\nЧто именно нужно сделать: решить уравнение или упростить выражение?`;
    }
    if (lower.includes('ошибк') || lower.includes('разбери')) {
      return `Давай проверим! Напиши свой ход решения построчно. Чаще всего ошибки прячутся в трёх местах: **знаки при раскрытии скобок**, **потеря ОДЗ** или **неправильный переход между степенями**. Что у тебя получилось на втором шаге?`;
    }
    if (lower.includes('подсказк')) {
      return `Держи наводку к первому шагу: перенеси все слагаемые с неизвестной $x$ в левую часть, а числа — в правую. После этого посмотри, можно ли вынести общий множитель за скобки. Что получается?`;
    }

    return `Хорошая мысль, **${profile.name}**! Давай разложим этот шаг подробнее.\n\nКакое математическое правило связывает компоненты этой задачи? Назови формулу, которая приходит на ум первой.`;
  }

  // Потоковая выдача текста (Typewriter effect)
  function streamResponse(text) {
    isGenerating = true;
    const list = document.getElementById('ai-tutor-messages');

    const assistantRow = document.createElement('div');
    assistantRow.className = 'ai-message-row assistant';
    assistantRow.innerHTML = `
      <div class="ai-msg-avatar">✨</div>
      <div class="ai-msg-bubble">
        <span class="ai-stream-text"></span><span class="ai-cursor"></span>
        <div class="ai-msg-time">Сейчас</div>
      </div>
    `;
    list.appendChild(assistantRow);
    list.scrollTop = list.scrollHeight;

    const textSpan = assistantRow.querySelector('.ai-stream-text');
    let idx = 0;

    const interval = setInterval(() => {
      idx += 3;
      if (idx >= text.length) {
        clearInterval(interval);
        textSpan.innerHTML = formatMarkdown(text);
        const cursor = assistantRow.querySelector('.ai-cursor');
        if (cursor) cursor.remove();
        renderLatex(assistantRow);
        list.scrollTop = list.scrollHeight;
        isGenerating = false;
        messages.push({
          sender: 'assistant',
          content: text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        textSpan.innerHTML = formatMarkdown(text.slice(0, idx));
        list.scrollTop = list.scrollHeight;
      }
    }, 25);
  }

  // Отправка сообщения пользователем
  function handleSendMessage(customText) {
    const textarea = document.getElementById('ai-textarea');
    const text = (customText || textarea.value).trim();
    if (!text || isGenerating) return;

    if (!customText && textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.push({
      sender: 'user',
      content: text,
      time: timeStr,
    });
    renderMessages();

    // Показываем индикатор набора и запускаем стриминг
    setTimeout(() => {
      const response = generateSocraticResponse(text);
      streamResponse(response);
    }, 350);
  }

  // Отрисовка вкладки «Экспресс-квиз»
  function renderQuizView() {
    const container = document.getElementById('ai-tab-quiz');
    if (!container) return;

    if (quizIndex >= QUIZ_QUESTIONS.length) {
      const percent = Math.round((quizScore / QUIZ_QUESTIONS.length) * 100);
      container.innerHTML = `
        <div style="text-align:center;padding:30px 10px;">
          <div style="font-size:42px;margin-bottom:12px;">🏆</div>
          <h3 style="color:#ffffff;font-size:18px;margin:0 0 8px;">Квиз завершён!</h3>
          <p style="color:#94a3b8;font-size:13px;margin:0 0 20px;">
            Правильных ответов: <strong style="color:#38bdf8;">${quizScore}</strong> из ${QUIZ_QUESTIONS.length} (${percent}%)
          </p>
          <button type="button" class="ai-btn-primary" id="ai-quiz-restart-btn" style="margin:0 auto;max-width:200px;">
            Пройти снова
          </button>
        </div>
      `;
      document.getElementById('ai-quiz-restart-btn')?.addEventListener('click', () => {
        quizIndex = 0;
        quizScore = 0;
        quizAnswered = false;
        quizSelected = null;
        renderQuizView();
      });
      return;
    }

    const q = QUIZ_QUESTIONS[quizIndex];
    container.innerHTML = `
      <div>
        <div class="ai-quiz-header-row">
          <span class="ai-quiz-topic">${q.topic}</span>
          <span class="ai-quiz-progress">Вопрос ${quizIndex + 1} из ${QUIZ_QUESTIONS.length}</span>
        </div>

        <div class="ai-quiz-card">
          <div style="font-size:13px;color:#f1f5f9;margin-bottom:6px;">${q.question}</div>
          <div style="text-align:center;padding:6px;background:rgba(4,10,24,0.6);border-radius:10px;color:#7dd3fc;">
            $$${q.formula}$$
          </div>
        </div>

        <div class="ai-quiz-options">
          ${q.options
            .map((opt, idx) => {
              let cls = '';
              if (quizAnswered) {
                if (idx === q.correct) cls = 'correct';
                else if (idx === quizSelected) cls = 'wrong';
              }
              return `
                <button type="button" class="ai-quiz-opt-btn ${cls}" data-opt="${idx}" ${quizAnswered ? 'disabled' : ''}>
                  <span><strong>${String.fromCharCode(65 + idx)}.</strong> $${opt}$</span>
                  <span>${quizAnswered && idx === q.correct ? '✓' : ''}</span>
                </button>
              `;
            })
            .join('')}
        </div>

        ${
          quizAnswered
            ? `
          <div class="ai-quiz-feedback ${quizSelected === q.correct ? 'correct' : 'wrong'}">
            <strong>${quizSelected === q.correct ? '✅ Правильно!' : '❌ Не совсем верно.'}</strong>
            <div>${q.explanation}</div>
          </div>
        `
            : `
          <div style="margin-top:12px;text-align:center;">
            <button type="button" id="ai-quiz-hint-btn" style="background:none;border:none;color:#38bdf8;font-size:11px;cursor:pointer;">
              💡 Подсказка Сократа к вопросу
            </button>
            <div id="ai-quiz-hint-box" style="display:none;margin-top:8px;padding:8px 12px;border-radius:10px;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);font-size:11px;color:#bae6fd;">
              ${q.hint}
            </div>
          </div>
        `
        }
      </div>

      <div class="ai-quiz-nav">
        ${
          quizAnswered
            ? `
          <button type="button" class="ai-btn-secondary" id="ai-quiz-discuss-btn">Спросить тьютора</button>
          <button type="button" class="ai-btn-primary" id="ai-quiz-next-btn">Следующий вопрос →</button>
        `
            : `
          <div style="font-size:11px;color:#64748b;text-align:center;width:100%;">Выберите вариант ответа выше</div>
        `
        }
      </div>
    `;

    renderLatex(container);

    // Слушатели кнопок вариантов
    container.querySelectorAll('.ai-quiz-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (quizAnswered) return;
        const opt = parseInt(btn.getAttribute('data-opt'), 10);
        quizSelected = opt;
        quizAnswered = true;
        if (opt === q.correct) quizScore++;
        renderQuizView();
      });
    });

    // Кнопка подсказки
    document.getElementById('ai-quiz-hint-btn')?.addEventListener('click', () => {
      const box = document.getElementById('ai-quiz-hint-box');
      if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    });

    // Следующий вопрос
    document.getElementById('ai-quiz-next-btn')?.addEventListener('click', () => {
      quizIndex++;
      quizAnswered = false;
      quizSelected = null;
      renderQuizView();
    });

    // Обсудить с тьютором
    document.getElementById('ai-quiz-discuss-btn')?.addEventListener('click', () => {
      switchTab('tutor');
      handleSendMessage(`Помоги разобрать вопрос из квиза: «${q.question} $$${q.formula}$$». С чего начать рассуждение?`);
    });
  }

  // Отрисовка вкладки «Теория и формулы»
  function renderTheoryView() {
    const container = document.getElementById('ai-tab-theory');
    if (!container) return;

    container.innerHTML = THEORY_DATA.map(
      (item) => `
      <div class="ai-theory-card">
        <div class="ai-theory-header">
          <span class="ai-theory-title">${item.title}</span>
        </div>
        <div class="ai-theory-math">$$${item.latex}$$</div>
        <p class="ai-theory-desc">${item.desc}</p>
        <button type="button" class="ai-ask-formula-btn" data-latex="${encodeURIComponent(item.latex)}" data-title="${item.title}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Спросить тьютора по формуле
        </button>
      </div>
    `
    ).join('');

    renderLatex(container);

    container.querySelectorAll('.ai-ask-formula-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const latex = decodeURIComponent(btn.getAttribute('data-latex'));
        switchTab('tutor');
        handleSendMessage(`Объясни формулу «${title}»: $$${latex}$$. Где она применяется на практике?`);
      });
    });
  }

  // Переключение табов
  function switchTab(tabKey) {
    currentMode = tabKey;
    document.querySelectorAll('.ai-tutor-tab-btn').forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-tab') === tabKey);
    });

    document.getElementById('ai-tab-tutor').style.display = tabKey === 'tutor' ? 'flex' : 'none';
    document.getElementById('ai-tab-quiz').style.display = tabKey === 'quiz' ? 'flex' : 'none';
    document.getElementById('ai-tab-theory').style.display = tabKey === 'theory' ? 'flex' : 'none';
  }

  // Переключение открытия/закрытия
  function toggleDrawer(open) {
    isOpen = typeof open === 'boolean' ? open : !isOpen;
    const drawer = document.getElementById('ai-tutor-drawer');
    const overlay = document.getElementById('ai-tutor-overlay');
    const fabBtn = document.getElementById('ai-tutor-fab-btn');
    const fabIcon = document.getElementById('ai-tutor-fab-icon');

    if (drawer) drawer.classList.toggle('is-open', isOpen);
    if (overlay) overlay.classList.toggle('is-visible', isOpen);
    if (fabBtn) fabBtn.classList.toggle('is-active', isOpen);

    if (fabIcon) {
      if (isOpen) {
        fabIcon.innerHTML = `
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        `;
      } else {
        fabIcon.innerHTML = `
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        `;
      }
    }

    if (isOpen) {
      setTimeout(() => {
        document.getElementById('ai-textarea')?.focus();
      }, 300);
    }
  }

  // Привязка слушателей событий
  function setupEventListeners() {
    document.getElementById('ai-tutor-fab-btn')?.addEventListener('click', () => toggleDrawer());
    document.getElementById('ai-tutor-fab-badge')?.addEventListener('click', () => toggleDrawer(true));
    document.getElementById('ai-tutor-close-btn')?.addEventListener('click', () => toggleDrawer(false));
    document.getElementById('ai-tutor-overlay')?.addEventListener('click', () => toggleDrawer(false));

    // Очистка чата
    document.getElementById('ai-tutor-clear-btn')?.addEventListener('click', () => {
      if (confirm('Очистить историю диалога с тьютором?')) {
        messages = [
          {
            sender: 'assistant',
            content: `Диалог очищен. Какую задачу по **${profile.subject}** разберём, **${profile.name}**?`,
            time: 'Сейчас',
          },
        ];
        renderMessages();
      }
    });

    // Переключение табов
    document.querySelectorAll('.ai-tutor-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // Отправка сообщений
    document.getElementById('ai-send-btn')?.addEventListener('click', () => handleSendMessage());

    const textarea = document.getElementById('ai-textarea');
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      });
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
      });
    }

    // Быстрые чипсы
    document.querySelectorAll('.ai-chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        handleSendMessage(btn.getAttribute('data-query'));
      });
    });
  }

  // Запуск при загрузке документа
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgetDOM);
  } else {
    initWidgetDOM();
  }
})();
