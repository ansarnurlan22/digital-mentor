/**
 * Digital Mentor AI-Tutor (Quizlet Q-Chat Style)
 * Полноценная интеграция с Google Gemini API
 * Генерирует выжимку теории + интерактивный мини-тест из 3–4 вопросов
 */

(function () {
  const GEMINI_API_KEY = window.GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';

  // Профиль ученика
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

  const QUICK_TOPICS = [
    'Логарифмические неравенства',
    'Формулы приведения',
    'Производная сложной функции',
    'Показательные уравнения',
    'Теорема синусов и косинусов',
  ];

  // Состояние виджета
  let isOpen = false;
  let isLoading = false;
  let currentLesson = null; // { topic, theorySummary, quiz: [...] }
  let activeTab = 'theory'; // 'theory' | 'quiz' | 'chat'

  // Состояние теста
  let currentQuestionIdx = 0;
  let selectedAnswers = {}; // { [questionIdx]: optionIdx }
  let isCopied = false;

  // История чата Сократа
  let messages = [
    {
      sender: 'assistant',
      content: `Привет, **${profile.name}**! 👋\nЯ твой академический AI-тьютор по **${profile.subject}** (${profile.grade}) на базе Google Gemini.\n\nВведи любую тему (например, *«Логарифмические неравенства»* или *«Формулы приведения»*) — и я сгенерирую для тебя **сжатую выжимку теории** с формулами и **интерактивный мини-тест** с разбором!`,
      time: 'Сейчас',
    },
  ];

  // Запрос генерации урока в Gemini
  async function generateLessonFromGemini(topic) {
    if (!topic || isLoading) return;

    isLoading = true;
    currentLesson = null;
    selectedAnswers = {};
    currentQuestionIdx = 0;
    activeTab = 'theory';
    renderDrawerContent();

    const systemPrompt = `Ты — академический AI-тьютор платформы Digital Mentor для школьников Казахстана (11 класс, Алгебра/Геометрия).
Объясняй строго, понятно, без лишней воды.
Все математические формулы, переменные и выражения ВСЕГДА оборачивай в синтаксис LaTeX $...$ (для блочных используй $$...$$).
Вопросы для квиза делай практическими, проверяющими ключевые ловушки и правила.
Ответ верни СТРОГО в формате JSON без дополнительного текста.`;

    const userPrompt = `Составь компактную академическую выжимку теории и интерактивный мини-тест из 3–4 практических вопросов по теме: «${topic}».

Требования к JSON:
{
  "topic": "${topic}",
  "theorySummary": "Краткая суть, алгоритм решения и ключевые формулы в синтаксисе LaTeX $...$. Разбивай на понятные абзацы и списки.",
  "quiz": [
    {
      "id": 1,
      "question": "Текст практического вопроса с формулами в $...$",
      "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
      "correctIndex": 0,
      "explanation": "Математическое пояснение, почему этот вариант верный."
    }
  ]
}`;

    try {
      // 1. Пробуем серверный эндпоинт Next.js/Vercel /api/tutor
      try {
        const serverResp = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic }),
        });
        if (serverResp.ok) {
          const data = await serverResp.json();
          if (data && data.topic && data.theorySummary) {
            currentLesson = data;
            isLoading = false;
            renderDrawerContent();
            return;
          }
        }
      } catch (e) {
        console.warn('Серверный эндпоинт /api/tutor недоступен, прямой запрос в Gemini:', e);
      }

      // 2. Прямой вызов Gemini API
      const models = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
      let lastErr = null;
      let resultData = null;

      for (const m of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${GEMINI_API_KEY}`;
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2,
              },
            }),
          });

          if (resp.ok) {
            const resJson = await resp.json();
            const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              resultData = JSON.parse(rawText);
              break;
            }
          } else {
            const errTxt = await resp.text();
            lastErr = new Error(`Gemini ${m} status ${resp.status}: ${errTxt}`);
          }
        } catch (err) {
          lastErr = err;
        }
      }

      if (!resultData) {
        throw lastErr || new Error('Не удалось получить ответ от Google Gemini API.');
      }

      currentLesson = resultData;
    } catch (err) {
      console.error('Ошибка Gemini:', err);
      alert('Ошибка при генерации урока: ' + (err.message || err));
    } finally {
      isLoading = false;
      renderDrawerContent();
    }
  }

  // Отрисовка LaTeX формул через KaTeX
  function renderLatex(container) {
    if (window.renderMathInElement && container) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
  }

  // Парсинг базового Markdown (жирный, списки, переносы)
  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // Инициализация виджета в DOM
  function initWidgetDOM() {
    if (document.getElementById('ai-tutor-root')) return;

    const root = document.createElement('div');
    root.id = 'ai-tutor-root';
    root.innerHTML = `
      <div class="ai-tutor-overlay" id="ai-tutor-overlay"></div>

      <!-- Плавающая кнопка (FAB) -->
      <div class="ai-tutor-fab-wrap">
        <div class="ai-tutor-fab-badge" id="ai-tutor-fab-badge" title="Открыть персонального AI-тьютора">
          <span class="ai-tutor-fab-dot"></span>
          <span>AI-тьютор Gemini · 24/7</span>
        </div>
        <button type="button" class="ai-tutor-fab-btn" id="ai-tutor-fab-btn" aria-label="Открыть AI-тьютора">
          <svg class="ai-tutor-fab-icon" id="ai-tutor-fab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </button>
      </div>

      <!-- Выдвижная панель -->
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
                <span class="ai-tutor-tag">Gemini API</span>
              </h4>
              <p class="ai-tutor-subtitle">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#34d399;"></span>
                <span>${profile.subject}</span>
                <span>·</span>
                <span>${profile.grade}</span>
                <span>·</span>
                <span>${profile.name}</span>
              </p>
            </div>
          </div>
          <div class="ai-tutor-actions">
            <button type="button" class="ai-tutor-icon-btn" id="ai-tutor-close-btn" title="Закрыть">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Контейнер контента -->
        <div class="ai-tutor-tab-content" id="ai-tutor-body"></div>
      </div>
    `;

    document.body.appendChild(root);
    setupEvents();
    renderDrawerContent();
  }

  // Отрисовка внутреннего содержимого панели
  function renderDrawerContent() {
    const body = document.getElementById('ai-tutor-body');
    if (!body) return;

    // 1. Состояние загрузки
    if (isLoading) {
      body.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;text-align:center;">
          <div style="position:relative;width:64px;height:64px;margin-bottom:20px;">
            <div style="width:64px;height:64px;border:3px solid rgba(56,189,248,0.2);border-top-color:#38bdf8;border-radius:50%;animation:spin 1s linear infinite;"></div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;">✨</div>
          </div>
          <h4 style="color:#ffffff;font-size:15px;margin:0 0 8px;font-weight:700;">Gemini анализирует тему и составляет задания...</h4>
          <p style="color:#94a3b8;font-size:12px;max-width:280px;line-height:1.5;margin:0;">
            Формируем выжимку теории с формулами в LaTeX и мини-тест с разбором решений
          </p>
        </div>
      `;
      return;
    }

    // 2. Экран ввода темы (если урок ещё не сгенерирован)
    if (!currentLesson) {
      body.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:18px;">
          <div>
            <div style="background:rgba(15,23,42,0.8);border:1px solid rgba(148,163,184,0.2);border-radius:20px;padding:16px;box-shadow:0 8px 24px rgba(0,0,0,0.3);">
              <label style="display:block;font-size:12px;font-weight:600;color:#cbd5e1;margin-bottom:10px;">
                Какую тему или вопрос разобрать?
              </label>
              <div style="display:flex;gap:8px;">
                <input type="text" id="ai-topic-input" placeholder="Например: Логарифмические неравенства..." 
                  style="flex:1;background:rgba(4,10,24,0.85);border:1px solid rgba(148,163,184,0.25);border-radius:12px;padding:10px 14px;color:#ffffff;font-size:13px;outline:none;" />
                <button type="button" id="ai-generate-btn" class="ai-btn-primary" style="flex:none;padding:10px 16px;white-space:nowrap;">
                  <span>Сформировать урок</span>
                </button>
              </div>
            </div>

            <div style="margin-top:20px;">
              <span style="font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">
                Быстрые подсказки:
              </span>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
                ${QUICK_TOPICS.map(
                  (t) => `
                  <button type="button" class="ai-chip-btn ai-topic-chip" data-topic="${t}">
                    ${t}
                  </button>
                `
                ).join('')}
              </div>
            </div>
          </div>

          <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:16px;padding:14px;font-size:12px;color:#7dd3fc;line-height:1.5;">
            <strong>⚡ Что генерирует Gemini API:</strong>
            <ul style="margin:6px 0 0 16px;padding:0;">
              <li>Краткую суть и строгий алгоритм решения</li>
              <li>Ключевые формулы в чистом синтаксисе LaTeX</li>
              <li>3–4 практических тестовых вопроса с детальным разбором</li>
            </ul>
          </div>
        </div>
      `;

      // Привязка слушателей экрана ввода
      document.getElementById('ai-generate-btn')?.addEventListener('click', () => {
        const val = document.getElementById('ai-topic-input')?.value;
        generateLessonFromGemini(val);
      });

      document.getElementById('ai-topic-input')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          generateLessonFromGemini(e.target.value);
        }
      });

      body.querySelectorAll('.ai-topic-chip').forEach((btn) => {
        btn.addEventListener('click', () => {
          generateLessonFromGemini(btn.getAttribute('data-topic'));
        });
      });

      return;
    }

    // 3. Экран результатов урока
    const totalQ = currentLesson.quiz?.length || 0;
    const answeredCount = Object.keys(selectedAnswers).length;
    const correctCount = currentLesson.quiz
      ? currentLesson.quiz.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length
      : 0;

    body.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
        <!-- Карточка темы -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(15,23,42,0.9);border-bottom:1px solid rgba(148,163,184,0.15);">
          <div>
            <div style="font-size:10px;font-weight:700;color:#38bdf8;text-transform:uppercase;">Тема урока</div>
            <div style="font-size:14px;font-weight:700;color:#ffffff;">${currentLesson.topic}</div>
          </div>
          <button type="button" id="ai-change-topic-btn" class="ai-btn-secondary" style="flex:none;padding:6px 12px;font-size:11px;">
            Другая тема ↺
          </button>
        </div>

        <!-- Табы -->
        <div class="ai-tutor-tabs">
          <button type="button" class="ai-tutor-tab-btn ${activeTab === 'theory' ? 'is-active' : ''}" id="ai-tab-theory-btn">
            <span>📖</span><span>Теория и формулы</span>
          </button>
          <button type="button" class="ai-tutor-tab-btn ${activeTab === 'quiz' ? 'is-active' : ''}" id="ai-tab-quiz-btn">
            <span>⚡</span><span>Интерактивный тест (${totalQ})</span>
          </button>
        </div>

        <!-- Тело таба -->
        <div style="flex:1;overflow-y:auto;padding:16px 18px;" id="ai-tab-body">
          ${
            activeTab === 'theory'
              ? `
            <div class="ai-theory-card" style="margin-bottom:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(148,163,184,0.15);padding-bottom:8px;margin-bottom:12px;">
                <span style="font-size:12px;font-weight:700;color:#e2e8f0;">Выжимка теории от Gemini AI</span>
                <button type="button" id="ai-copy-theory-btn" style="background:none;border:none;color:#38bdf8;font-size:11px;cursor:pointer;">
                  ${isCopied ? '✓ Скопировано' : '📋 Копировать'}
                </button>
              </div>
              <div id="ai-theory-content" style="font-size:12.5px;color:#cbd5e1;line-height:1.6;">
                ${formatMarkdown(currentLesson.theorySummary)}
              </div>
            </div>

            <button type="button" id="ai-to-quiz-btn" class="ai-btn-primary" style="width:100%;padding:12px;">
              Перейти к интерактивному тесту (${totalQ} вопроса) →
            </button>
          `
              : `
            <!-- Вкладка Интерактивный тест -->
            ${
              currentLesson.quiz && currentLesson.quiz[currentQuestionIdx]
                ? `
              <div class="ai-quiz-card">
                <div class="ai-quiz-header-row">
                  <span class="ai-quiz-topic">Вопрос ${currentQuestionIdx + 1} из ${totalQ}</span>
                  <span class="ai-quiz-progress">Счёт: ${correctCount}/${answeredCount}</span>
                </div>

                <div id="ai-quiz-q-text" style="font-size:13.5px;font-weight:600;color:#f8fafc;margin:10px 0;">
                  ${formatMarkdown(currentLesson.quiz[currentQuestionIdx].question)}
                </div>

                <div class="ai-quiz-options">
                  ${currentLesson.quiz[currentQuestionIdx].options
                    .map((opt, oIdx) => {
                      const isAnswered = selectedAnswers[currentQuestionIdx] !== undefined;
                      const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                      const isCorrect = oIdx === currentLesson.quiz[currentQuestionIdx].correctIndex;

                      let cls = '';
                      if (isAnswered) {
                        if (isCorrect) cls = 'correct';
                        else if (isSelected) cls = 'wrong';
                      }

                      return `
                      <button type="button" class="ai-quiz-opt-btn ${cls}" data-opt="${oIdx}" ${isAnswered ? 'disabled' : ''}>
                        <span><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</span>
                        ${isAnswered && isCorrect ? '<span>✓</span>' : ''}
                        ${isAnswered && isSelected && !isCorrect ? '<span>✕</span>' : ''}
                      </button>
                    `;
                    })
                    .join('')}
                </div>

                ${
                  selectedAnswers[currentQuestionIdx] !== undefined
                    ? `
                  <div class="ai-quiz-feedback ${selectedAnswers[currentQuestionIdx] === currentLesson.quiz[currentQuestionIdx].correctIndex ? 'correct' : 'wrong'}">
                    <strong>Разбор ответа:</strong>
                    <div id="ai-quiz-explanation" style="margin-top:4px;">
                      ${formatMarkdown(currentLesson.quiz[currentQuestionIdx].explanation)}
                    </div>
                  </div>
                `
                    : ''
                }
              </div>

              <!-- Навигация по квизу -->
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;">
                <button type="button" id="ai-quiz-prev-btn" class="ai-btn-secondary" style="padding:8px 14px;" ${currentQuestionIdx === 0 ? 'disabled' : ''}>
                  ← Предыдущий
                </button>

                <span style="font-size:11px;color:#94a3b8;">${currentQuestionIdx + 1} / ${totalQ}</span>

                ${
                  currentQuestionIdx < totalQ - 1
                    ? `
                  <button type="button" id="ai-quiz-next-btn" class="ai-btn-primary" style="padding:8px 16px;">
                    Следующий →
                  </button>
                `
                    : `
                  <button type="button" id="ai-quiz-finish-btn" class="ai-btn-primary" style="padding:8px 16px;background:#10b981;">
                    Завершить тест
                  </button>
                `
                }
              </div>

              ${
                answeredCount === totalQ
                  ? `
                <div style="margin-top:16px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:14px;text-align:center;font-size:12px;color:#6ee7b7;">
                  <strong>🎉 Итог теста: ${correctCount} из ${totalQ} верно!</strong>
                  <p style="margin:4px 0 0;color:#cbd5e1;">Тема отлично усвоена перед созвоном с ментором.</p>
                </div>
              `
                  : ''
              }
            `
                : ''
            }
          `
          }
        </div>
      </div>
    `;

    renderLatex(body);

    // Слушатели экрана результатов
    document.getElementById('ai-change-topic-btn')?.addEventListener('click', () => {
      currentLesson = null;
      renderDrawerContent();
    });

    document.getElementById('ai-tab-theory-btn')?.addEventListener('click', () => {
      activeTab = 'theory';
      renderDrawerContent();
    });

    document.getElementById('ai-tab-quiz-btn')?.addEventListener('click', () => {
      activeTab = 'quiz';
      renderDrawerContent();
    });

    document.getElementById('ai-to-quiz-btn')?.addEventListener('click', () => {
      activeTab = 'quiz';
      renderDrawerContent();
    });

    document.getElementById('ai-copy-theory-btn')?.addEventListener('click', () => {
      if (currentLesson?.theorySummary) {
        navigator.clipboard?.writeText(currentLesson.theorySummary);
        isCopied = true;
        renderDrawerContent();
        setTimeout(() => {
          isCopied = false;
          renderDrawerContent();
        }, 1800);
      }
    });

    // Ответы на вопросы квиза
    body.querySelectorAll('.ai-quiz-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (selectedAnswers[currentQuestionIdx] !== undefined) return;
        const opt = parseInt(btn.getAttribute('data-opt'), 10);
        selectedAnswers[currentQuestionIdx] = opt;
        renderDrawerContent();
      });
    });

    document.getElementById('ai-quiz-prev-btn')?.addEventListener('click', () => {
      currentQuestionIdx = Math.max(0, currentQuestionIdx - 1);
      renderDrawerContent();
    });

    document.getElementById('ai-quiz-next-btn')?.addEventListener('click', () => {
      currentQuestionIdx = Math.min(totalQ - 1, currentQuestionIdx + 1);
      renderDrawerContent();
    });

    document.getElementById('ai-quiz-finish-btn')?.addEventListener('click', () => {
      alert(`Квиз завершен: ${correctCount} из ${totalQ} верно! Возвращаемся к конспекту.`);
      activeTab = 'theory';
      renderDrawerContent();
    });
  }

  // Переключение открытия Drawer
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
  }

  function setupEvents() {
    document.getElementById('ai-tutor-fab-btn')?.addEventListener('click', () => toggleDrawer());
    document.getElementById('ai-tutor-fab-badge')?.addEventListener('click', () => toggleDrawer(true));
    document.getElementById('ai-tutor-close-btn')?.addEventListener('click', () => toggleDrawer(false));
    document.getElementById('ai-tutor-overlay')?.addEventListener('click', () => toggleDrawer(false));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgetDOM);
  } else {
    initWidgetDOM();
  }
})();
