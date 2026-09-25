// ============================================================
// Управление цветовой темой интерфейса (Dark / Light Theme)
// ============================================================
const THEME_KEY = "digitalMentor_theme";

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}

function applyTheme(theme) {
  const finalTheme = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", finalTheme);
  if (document.body) {
    document.body.classList.toggle("light-theme", finalTheme === "light");
  }
  
  const darkCard = document.getElementById("theme-card-dark");
  const lightCard = document.getElementById("theme-card-light");
  if (darkCard && lightCard) {
    darkCard.classList.toggle("active", finalTheme === "dark");
    lightCard.classList.toggle("active", finalTheme === "light");
  }
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  if (typeof showToast === "function") {
    showToast(`Тема интерфейса: ${theme === "light" ? "Светлая" : "Тёмная"}`, "info");
  }
}

// Применяем тему немедленно при инициализации скрипта
try {
  applyTheme(getSavedTheme());
} catch (e) {}

// Начальные демонстрационные курсы в стиле Schoolhouse/SAT
const DEFAULT_COURSES = [
  {
    id: "course-sat-alg-11",
    name: "Алгебра 11 класс (СОР/СОЧ Prep)",
    grade: "11",
    program: "sor-soch",
    programName: "СОР/СОЧ Prep",
    mentor: "Айбек С. · Старшеклассник-призёр олимпиад",
    description: "Интенсивный разбор типовых заданий четверти, сложных логарифмических и показательных неравенств, а также критериев оценивания СОР/СОЧ.",
    topics: ["Логарифмы", "Показательные уравнения", "Стереометрия", "Критерии оценивания"],
    durationWeeks: "4 недели",
    frequency: "2 раза в неделю",
    lessonDuration: "60 минут",
    maxStudents: 4,
    startDate: "2026-10-01"
  },
  {
    id: "course-sat-geom-10",
    name: "Геометрия 10 класс (СОР/СОЧ Prep)",
    grade: "10",
    program: "sor-soch",
    programName: "СОР/СОЧ Prep",
    mentor: "Дана М. · Победитель республиканской олимпиады",
    description: "Аксиомы стереометрии, взаимное расположение прямых и плоскостей, вычисление расстояний и углов в пространстве к текущим четвертным срезам.",
    topics: ["Векторы", "Перпендикулярность плоскостей", "Многогранники", "Разбор типовых задач"],
    durationWeeks: "3 недели",
    frequency: "2 раза в неделю",
    lessonDuration: "60 минут",
    maxStudents: 5,
    startDate: "2026-10-05"
  },
  {
    id: "course-sat-chem-10",
    name: "Химия 10 класс (Органическая химия & СОР/СОЧ)",
    grade: "10",
    program: "sor-soch",
    programName: "СОР/СОЧ Prep",
    mentor: "Камила Р. · Призёр Менделеевской олимпиады",
    description: "Углеводороды, механизмы органических реакций, составление уравнений и расчетные задачи повышенной сложности к четвертным срезам.",
    topics: ["Алканы и алкены", "Изомерия", "Химическое равновесие", "СОР/СОЧ тренинг"],
    durationWeeks: "4 недели",
    frequency: "2 раза в неделю",
    lessonDuration: "60 минут",
    maxStudents: 5,
    startDate: "2026-10-08"
  },
  {
    id: "course-sat-phys-11",
    name: "Физика 10–11 класс (1-на-1 Наставничество)",
    grade: "10-11",
    program: "mentoring",
    programName: "1-на-1 Наставничество",
    mentor: "Алихан К. · Студент НУ / Выпускник НИШ",
    description: "Индивидуальные сессии в комфортном темпе: законы сохранения, термодинамика и электродинамика без зубрежки сложных формул.",
    topics: ["Механика", "Электромагнетизм", "Термодинамика", "Практические расчеты"],
    durationWeeks: "8 недель",
    frequency: "1–2 раза в неделю",
    lessonDuration: "75 минут",
    maxStudents: 1,
    startDate: "2026-10-03"
  },
  {
    id: "course-sat-bio-11",
    name: "Биология 11 класс (Генетика & Молекулярная)",
    grade: "11",
    program: "mentoring",
    programName: "1-на-1 Наставничество",
    mentor: "Амина Б. · Выпускница РФМШ / Ментор",
    description: "Индивидуальный разбор молекулярных механизмов биосинтеза белка, законов Менделя и генетических задач к выпускным экзаменам.",
    topics: ["ДНК и РНК", "Сцепленное наследование", "Генетические карты", "Эволюция"],
    durationWeeks: "6 недель",
    frequency: "1–2 раза в неделю",
    lessonDuration: "60 минут",
    maxStudents: 1,
    startDate: "2026-10-07"
  },
  {
    id: "course-sat-digital-math",
    name: "Digital SAT Math: Hard Module & Desmos Prep",
    grade: "10-11",
    program: "mentoring",
    programName: "1-на-1 Наставничество",
    mentor: "Ернар Н. · SAT Math 800 / Ментор",
    description: "Стратегии сдачи Digital SAT: скрытые функции калькулятора Desmos, задачи 2-го сложного модуля, Advanced Math и Geometry & Trig.",
    topics: ["Desmos Regression & Sliders", "Quadratic & Exponential", "Circle Theorems", "Pacing & Timing"],
    durationWeeks: "6 недель",
    frequency: "2 раза в неделю",
    lessonDuration: "75 минут",
    maxStudents: 1,
    startDate: "2026-10-12"
  },
  {
    id: "course-sat-cs-workshop",
    name: "Информатика & Python (Практический Воркшоп)",
    grade: "9-11",
    program: "workshops",
    programName: "Воркшоп",
    mentor: "Арман Т. · Разработчик & Ментор",
    description: "Интерактивный командный воркшоп: разбор олимпиадных алгоритмов, динамического программирования и решение задач на скорость.",
    topics: ["Алгоритмы и структуры", "Динамическое программирование", "Графы", "Live-coding"],
    durationWeeks: "2 недели",
    frequency: "3 раза в неделю",
    lessonDuration: "90 минут",
    maxStudents: 12,
    startDate: "2026-10-10"
  },
  {
    id: "course-sat-ai-data",
    name: "Data Science & Введение в AI (Интерактивный буткемп)",
    grade: "9-11",
    program: "workshops",
    programName: "Воркшоп",
    mentor: "Султан Ж. · AI Researcher",
    description: "Практический воркшоп по машинному обучению: анализ реальных датасетов с Pandas, визуализация данных и работа с нейросетями.",
    topics: ["Pandas & NumPy", "Data Visualization", "Machine Learning основы", "Проект с Ment AI"],
    durationWeeks: "3 недели",
    frequency: "2 раза в неделю",
    lessonDuration: "90 минут",
    maxStudents: 10,
    startDate: "2026-10-15"
  },
  {
    id: "course-sat-ielts",
    name: "English Academic Writing & IELTS Speaking (Воркшоп)",
    grade: "10-11",
    program: "workshops",
    programName: "Воркшоп",
    mentor: "Мадина К. · IELTS 8.5 / Ментор",
    description: "Интенсивный тренинг академического английского: структура эссе Task 2, беглость разговорной речи и разбор типовых ошибок.",
    topics: ["Academic Essay Writing", "Speaking Fluency", "Vocabulary Boost", "Peer Reviews"],
    durationWeeks: "3 недели",
    frequency: "3 раза в неделю",
    lessonDuration: "75 минут",
    maxStudents: 8,
    startDate: "2026-10-14"
  }
];

// Текущий фильтр программы (по умолчанию 'all' — отображаются все 9 курсов на всех устройствах)
let currentProgramFilter = "all";

const STORAGE_KEY = "digitalMentor_activeCourses";
const USER_PROFILE_KEY = "digitalMentor_userProfile";

// Получить ключ профиля для текущего аккаунта
function getAccountProfileKey(userId = null) {
  const uid = userId || (window.currentAuthUser ? window.currentAuthUser.id : null);
  return uid ? `digitalMentor_profile_${uid}` : USER_PROFILE_KEY;
}

// Список Root-администраторов платформы (безусловный статус role: "admin")
const SUPER_ADMIN_EMAILS = [
  "ansarnurlan2@gmail.com",
  "ansarnurlan22@gmail.com",
  "alikhan.seidaliev@gmail.com"
];

// Получить текущую роль пользователя (Администратор, Ментор или Ученик)
function getUserRole() {
  try {
    // 0. Высший приоритет: проверка авторизованного аккаунта Google по email
    if (window.currentAuthUser && window.currentAuthUser.email) {
      if (SUPER_ADMIN_EMAILS.includes(window.currentAuthUser.email.toLowerCase().trim())) {
        return "Администратор";
      }
    }

    // 1. Проверка сохранённого профиля аккаунта на email супер-администратора
    const accountKey = getAccountProfileKey();
    const accountData = localStorage.getItem(accountKey);
    if (accountData) {
      const parsed = JSON.parse(accountData);
      if (parsed && parsed.email && SUPER_ADMIN_EMAILS.includes(parsed.email.toLowerCase().trim())) {
        return "Администратор";
      }
    }

    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    if (profileData) {
      const parsed = JSON.parse(profileData);
      if (parsed && parsed.email && SUPER_ADMIN_EMAILS.includes(parsed.email.toLowerCase().trim())) {
        return "Администратор";
      }
    }

    // 2. Тестовый переключатель роли (если был активирован вручную в интерфейсе)
    const testRole = localStorage.getItem("digitalMentor_testRole");
    if (testRole) {
      if (testRole === "admin" || testRole === "Администратор") return "Администратор";
      if (testRole === "mentor" || testRole === "Ментор") return "Ментор";
      if (testRole === "student" || testRole === "Ученик") return "Ученик";
      return testRole;
    }

    if (accountData) {
      const parsed = JSON.parse(accountData);
      if (parsed && parsed.role) return parsed.role;
    }

    if (profileData) {
      const parsed = JSON.parse(profileData);
      // Если авторизован пользователь Google, проверяем совпадение email
      if (window.currentAuthUser && parsed.email && parsed.email !== window.currentAuthUser.email) {
        return "Ученик";
      }
      if (parsed && parsed.role) {
        return parsed.role;
      }
    }
    const sessionData = sessionStorage.getItem("mentorProfile");
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      if (parsed && parsed.role) {
        return parsed.role;
      }
    }
  } catch (e) {
    console.error("Ошибка чтения роли пользователя", e);
  }
  return "Администратор"; // По умолчанию в среде разработки предоставляем роль Администратора
}

// Получить курсы из localStorage или вернуть дефолтные 9 курсов
function getCourses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      const parsed = JSON.parse(data);
      // Возвращаем только если массив не пустой!
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Ошибка чтения localStorage курсов", e);
  }
  // Всегда сохраняем и гарантированно возвращаем полный каталог из 9 курсов
  saveCourses(DEFAULT_COURSES);
  return DEFAULT_COURSES;
}

// Сохранить курсы в localStorage и синхронизировать с облаком Supabase
function saveCourses(courses) {
  try {
    const listToSave = Array.isArray(courses) && courses.length > 0 ? courses : DEFAULT_COURSES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listToSave));
    if (window.SupabaseService && typeof window.SupabaseService.saveCloudCourses === "function") {
      window.SupabaseService.saveCloudCourses(listToSave);
    }
  } catch (e) {
    console.error("Ошибка записи в localStorage", e);
  }
}

// Синхронизация курсов из облака Supabase (гарантирует одинаковое отображение на всех компьютерах)
async function syncCoursesFromCloud() {
  if (window.SupabaseService && typeof window.SupabaseService.getCloudCourses === "function") {
    try {
      const cloudCourses = await window.SupabaseService.getCloudCourses();
      if (Array.isArray(cloudCourses) && cloudCourses.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudCourses));
        if (typeof renderCourses === "function") {
          renderCourses();
        }
      } else {
        // Если в облаке пусто, отправляем 9 дефолтных курсов
        await window.SupabaseService.saveCloudCourses(DEFAULT_COURSES);
      }
    } catch (e) {
      console.warn("syncCoursesFromCloud error:", e);
    }
  }
}

// Форматирование даты
function formatDateDisplay(dateStr) {
  if (!dateStr) return "Уточняется";
  try {
    const parts = String(dateStr).split("-");
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
  } catch (e) {
    console.error(e);
  }
  return dateStr;
}

// Обновление интерфейса в зависимости от роли (Администратор, Ментор или Ученик)
function updateRoleUI() {
  const role = getUserRole();
  const isAdmin = role === "Администратор" || role === "admin";
  const isMentor = role === "Ментор" || isAdmin;

  const openModalBtn = document.getElementById("open-modal-btn");
  const viewOnlyBadge = document.getElementById("view-only-badge");
  const rolePill = document.getElementById("role-pill");
  const rolePillText = document.getElementById("role-pill-text");
  const emptyStateText = document.querySelector("#empty-state p");

  if (rolePillText) {
    if (isAdmin) {
      rolePillText.textContent = "Роль: Администратор";
    } else if (isMentor) {
      rolePillText.textContent = "Роль: Ментор";
    } else {
      rolePillText.textContent = "Роль: Ученик";
    }
  }

  if (rolePill) {
    rolePill.classList.toggle("is-admin", isAdmin);
    rolePill.classList.toggle("is-mentor", isMentor && !isAdmin);
    if (isAdmin) {
      rolePill.title = "Вы вошли как Администратор — полный доступ к системе, ролям и верификации часов";
    } else if (isMentor) {
      rolePill.title = "Вы вошли как ментор — вам доступно добавление и управление курсами";
    } else {
      rolePill.title = "Вы вошли как ученик — доступен только просмотр курсов";
    }
  }

  // Обновляем состояние кнопок переключения ролей в админке
  document.querySelectorAll(".btn-role-toggle").forEach((btn) => {
    const btnRole = btn.getAttribute("data-set-role");
    const active =
      (isAdmin && btnRole === "admin") ||
      (!isAdmin && isMentor && btnRole === "mentor") ||
      (!isAdmin && !isMentor && btnRole === "student");
    btn.classList.toggle("active", active);
  });

  const openScheduleModalBtn = document.getElementById("open-schedule-modal-btn");

  if (isMentor) {
    // Ментор или Администратор: может добавлять курсы и планировать уроки
    if (openModalBtn) openModalBtn.hidden = false;
    if (openScheduleModalBtn) {
      openScheduleModalBtn.hidden = false;
      openScheduleModalBtn.style.display = "inline-flex";
    }
    if (viewOnlyBadge) viewOnlyBadge.hidden = true;
    if (emptyStateText) {
      emptyStateText.textContent =
        "Нажмите на кнопку «+ Добавить курс» в правом верхнем углу, чтобы выбрать дисциплину.";
    }
  } else {
    // Ученик: может ТОЛЬКО смотреть
    if (openModalBtn) openModalBtn.hidden = true;
    if (openScheduleModalBtn) {
      openScheduleModalBtn.hidden = true;
      openScheduleModalBtn.style.display = "none";
    }
    if (viewOnlyBadge) viewOnlyBadge.hidden = false;
    if (emptyStateText) {
      emptyStateText.textContent =
        "Пока нет активных курсов. Ожидайте добавления предметов вашим ментором.";
    }
  }
}

// Иконки и оформление для каждого предмета
function getSubjectIcon(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("информ") || n.includes("python") || n.includes("код") || n.includes("web") || n.includes("алгоритм")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>`;
  }
  if (n.includes("data") || n.includes("ai") || n.includes("ии") || n.includes("интеллект")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="14" x2="23" y2="14"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="14" x2="4" y2="14"></line>
      </svg>`;
  }
  if (n.includes("физик")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="2"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
        <path d="M4.93 4.93c4.24 4.24 9.9 4.24 14.14 0"></path>
        <path d="M19.07 19.07c-4.24-4.24-9.9-4.24-14.14 0"></path>
      </svg>`;
  }
  if (n.includes("хим")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 2v7.31L4.2 19.34A2 2 0 0 0 5.92 22h12.16a2 2 0 0 0 1.72-2.66L14 9.31V2"></path>
        <line x1="8" y1="2" x2="16" y2="2"></line>
        <line x1="6.8" y1="15" x2="17.2" y2="15"></line>
      </svg>`;
  }
  if (n.includes("биолог")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 22s5.5-2.5 8-8 12-6 12-6-2.5 5.5-8 8-12 6-12 6z"></path>
        <path d="M10 14L4 8"></path>
      </svg>`;
  }
  if (n.includes("англ") || n.includes("ielts") || n.includes("english")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>`;
  }
  if (n.includes("геометр")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 2 22 22 22"></polygon>
      </svg>`;
  }
  if (n.includes("sat") || n.includes("алгебр") || n.includes("матем")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="19" x2="20" y2="19"></line>
        <line x1="4" y1="5" x2="20" y2="5"></line>
        <line x1="18" y1="5" x2="6" y2="19"></line>
      </svg>`;
  }
  if (n.includes("язык") || n.includes("литератур") || n.includes("чтени")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>`;
  }
  if (n.includes("истор")) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="21" x2="21" y2="21"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <polyline points="12 3 2 10 22 10 12 3"></polyline>
        <line x1="6" y1="10" x2="6" y2="21"></line>
        <line x1="10" y1="10" x2="10" y2="21"></line>
        <line x1="14" y1="10" x2="14" y2="21"></line>
        <line x1="18" y1="10" x2="18" y2="21"></line>
      </svg>`;
  }
  return `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>`;
}

// Склонение слова «курс»
function pluralizeCourses(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${count} курсов`;
  if (mod10 === 1) return `${count} курс`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} курса`;
  return `${count} курсов`;
}

// Отрисовка списка курсов в стиле Schoolhouse/SAT
function renderCourses() {
  const allCourses = getCourses();
  const role = getUserRole();
  const isMentor = role === "Ментор";
  const grid = document.getElementById("courses-grid");
  const countEl = document.getElementById("courses-count");
  const emptyState = document.getElementById("empty-state");

  // Фильтрация по текущей выбранной программе
  let filteredCourses = allCourses;
  if (currentProgramFilter && currentProgramFilter !== "all") {
    filteredCourses = allCourses.filter((course) => {
      const prog = course.program || "sor-soch";
      return prog === currentProgramFilter;
    });
  }

  if (countEl) {
    countEl.textContent = pluralizeCourses(filteredCourses.length);
  }

  if (filteredCourses.length === 0) {
    if (grid) grid.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  if (grid) {
    grid.innerHTML = filteredCourses
      .map((course) => {
        const iconSvg = getSubjectIcon(course.name);
        const enrolledKey = `digitalMentor_enrolled_${course.id}`;
        const isEnrolled = !isMentor && localStorage.getItem(enrolledKey) === "true";

        // Программа курса
        const programPill = course.programName || (
          course.program === "mentoring"
            ? "1-на-1"
            : course.program === "workshops"
            ? "Воркшоп"
            : "СОР/СОЧ Prep"
        );

        // Список тем (чипы)
        const topics = Array.isArray(course.topics) && course.topics.length > 0
          ? course.topics
          : ["Базовые формулы", "Практикум", "Разбор типовых заданий"];

        const topicsHtml = `
          <div class="card-sat-topics">
            <span class="topics-title">Ключевые темы</span>
            <div class="topics-chips">
              ${topics.map((t) => `<span class="topic-chip">${escapeHtml(t)}</span>`).join("")}
            </div>
          </div>
        `;

        // Кнопка удаления курса
        const deleteButtonHtml = `
          <button class="btn-card-delete" onclick="removeCourse(event, '${course.id}')" type="button" title="Удалить курс" aria-label="Удалить курс">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;

        // Кнопка действия (Ментор: Посмотреть расписание, Ученик: Зарегистрироваться)
        const actionButtonText = isMentor
          ? "Посмотреть расписание"
          : isEnrolled
          ? "Вы записаны ✓"
          : "Зарегистрироваться";

        const actionButtonClass = isEnrolled ? "btn-sat-action is-enrolled" : "btn-sat-action";

        return `
          <article class="course-card-sat" data-id="${escapeHtml(course.id)}">
            <div class="card-sat-header">
              <div class="card-sat-title-block">
                <div class="card-sat-subject-icon" aria-hidden="true">
                  ${iconSvg}
                </div>
                <div>
                  <h4 class="card-sat-title">${escapeHtml(course.name)}</h4>
                  <div class="card-sat-mentor-row">
                    <span class="mentor-badge-indicator" aria-hidden="true"></span>
                    <span>${escapeHtml(course.mentor || "Школьник-волонтёр · Ментор назначен")}</span>
                  </div>
                </div>
              </div>

              <div class="card-sat-badges">
                <span class="card-pill card-pill--grade">${escapeHtml(course.grade || "10-11")} класс</span>
                <span class="card-pill card-pill--program">${escapeHtml(programPill)}</span>
                ${deleteButtonHtml}
              </div>
            </div>

            <p class="card-sat-desc">${escapeHtml(course.description || "Углубленная программа подготовки и наставничества для школьников.")}</p>

            ${topicsHtml}

            <div class="card-sat-meta-row">
              <div class="meta-item">
                <span class="meta-icon" aria-hidden="true">⌚</span>
                <span class="meta-label">Срок:</span>
                <span class="meta-val">${escapeHtml(course.durationWeeks || "4 недели")}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon" aria-hidden="true">🔄</span>
                <span class="meta-label">Частота:</span>
                <span class="meta-val">${escapeHtml(course.frequency || "2 раза в неделю")}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon" aria-hidden="true">⏳</span>
                <span class="meta-label">Длительность:</span>
                <span class="meta-val">${escapeHtml(course.lessonDuration || "60 минут")}</span>
              </div>
            </div>

            <div class="card-sat-footer">
              <div class="card-sat-status">
                <span class="status-pulse-dot" aria-hidden="true"></span>
                <span>${isEnrolled ? "Вы записаны на курс" : "Идёт набор учеников"}</span>
              </div>
              <button class="${actionButtonClass}" type="button" onclick="handleCourseAction('${course.id}')">
                ${actionButtonText}
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }
  if (typeof updateDashboardDynamicStats === "function") {
    updateDashboardDynamicStats();
  }
}

// Обработка клика по кнопке действия курса
window.handleCourseAction = function (courseId) {
  const role = getUserRole();
  if (role === "Ментор") {
    window.location.hash = "#/schedule";
    return;
  }

  // Роль: Ученик -> Регистрация на курс или отмена
  const enrolledKey = `digitalMentor_enrolled_${courseId}`;
  const isEnrolled = localStorage.getItem(enrolledKey) === "true";

  if (isEnrolled) {
    localStorage.removeItem(enrolledKey);
    showToast("Вы отменили регистрацию на курс.", "info");
    renderCourses();
    if (typeof updateDashboardDynamicStats === "function") {
      updateDashboardDynamicStats();
    }
    return;
  }

  localStorage.setItem(enrolledKey, "true");
  showToast("Вы успешно зарегистрировались на курс! Ментор свяжется с вами.", "success");
  renderCourses();
  if (typeof updateDashboardDynamicStats === "function") {
    updateDashboardDynamicStats();
  }
};

// Инициализация фильтров учебных программ (Schoolhouse/SAT)
function initProgramFilters() {
  const programCards = document.querySelectorAll(".program-card");
  const allBtn = document.getElementById("btn-show-all-courses");
  const filterLabel = document.getElementById("current-program-filter-label");
  const headingLabel = document.getElementById("current-program-heading");

  function setProgram(progId) {
    currentProgramFilter = progId;
    programCards.forEach((c) => {
      const isSelected = c.dataset.program === progId;
      c.classList.toggle("is-active", isSelected);
    });

    if (allBtn) {
      allBtn.classList.toggle("is-active", progId === "all");
    }

    if (progId === "sor-soch") {
      if (filterLabel) filterLabel.textContent = "Фильтр: Подготовка к СОР/СОЧ";
      if (headingLabel) headingLabel.textContent = "Курсы: Подготовка к СОР/СОЧ";
    } else if (progId === "mentoring") {
      if (filterLabel) filterLabel.textContent = "Фильтр: Наставничество 1-на-1";
      if (headingLabel) headingLabel.textContent = "Курсы: Индивидуальное наставничество";
    } else if (progId === "workshops") {
      if (filterLabel) filterLabel.textContent = "Фильтр: Воркшопы";
      if (headingLabel) headingLabel.textContent = "Курсы: Практические воркшопы";
    } else {
      if (filterLabel) filterLabel.textContent = "Фильтр: Все направления";
      if (headingLabel) headingLabel.textContent = "Все доступные курсы";
    }

    renderCourses();
  }

  programCards.forEach((card) => {
    card.addEventListener("click", () => {
      const prog = card.getAttribute("data-program");
      setProgram(prog);
    });
  });

  if (allBtn) {
    allBtn.addEventListener("click", () => {
      setProgram("all");
    });
  }

  // Устанавливаем изначальное состояние (по умолчанию - Все курсы)
  setProgram(currentProgramFilter || "all");
}

// Защита от XSS
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================
// Динамический расчёт взаимосвязанных метрик Дашборда (Dynamic Interconnected Dashboard)
// ============================================================

function isLessonEnded(lesson) {
  if (!lesson) return false;
  if (lesson.status === "completed") return true;
  if (!lesson.lesson_date) return false;
  const timeStr = lesson.end_time || lesson.start_time || "23:59";
  const endDateTime = new Date(`${lesson.lesson_date}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`);
  return !isNaN(endDateTime.getTime()) && endDateTime < new Date();
}

function updateDashboardDynamicStats() {
  const allCourses = getCourses();
  const isMentor = getUserRole() === "Ментор";

  // 1. Активные программы и курсы
  const enrolledCourses = allCourses.filter(
    (c) => localStorage.getItem(`digitalMentor_enrolled_${c.id}`) === "true"
  );
  const activeCount = isMentor
    ? allCourses.length
    : enrolledCourses.length > 0
    ? enrolledCourses.length
    : allCourses.length;

  const dashCoursesVal = document.getElementById("dash-stat-courses");
  const dashCoursesNote = document.getElementById("dash-stat-courses-note");

  if (dashCoursesVal) {
    dashCoursesVal.textContent = pluralizeCourses(activeCount);
  }
  if (dashCoursesNote) {
    if (activeCount === 0) {
      dashCoursesNote.textContent = "Нет активных курсов";
    } else if (!isMentor && enrolledCourses.length > 0) {
      const names = enrolledCourses.map((c) => c.name.split(" ")[0]).slice(0, 2).join(" + ");
      dashCoursesNote.textContent = names + (enrolledCourses.length > 2 ? ` (+${enrolledCourses.length - 2})` : "");
    } else {
      const progs = [...new Set(allCourses.map((c) => c.programName || "Курсы"))].slice(0, 2).join(" + ");
      dashCoursesNote.textContent = progs || "Активная подготовка";
    }
  }

  // 2. Уроки на неделе и Ближайший онлайн-урок (зависит от расписания)
  const lessons = Array.isArray(currentLessonsData) ? currentLessonsData : [];
  const now = new Date();

  // Границы текущей недели (Понедельник - Воскресенье)
  let curDay = now.getDay();
  if (curDay === 0) curDay = 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - curDay + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weeklyLessons = lessons.filter((l) => {
    if (!l.lesson_date) return false;
    const lDate = new Date(l.lesson_date + "T00:00:00");
    return lDate >= monday && lDate <= sunday;
  });

  const dashLessonsVal = document.getElementById("dash-stat-lessons");
  const dashLessonsNote = document.getElementById("dash-stat-lessons-note");

  function pluralizeLessonsCount(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 19) return `${count} уроков`;
    if (mod10 === 1) return `${count} урок`;
    if (mod10 >= 2 && mod10 <= 4) return `${count} урока`;
    return `${count} уроков`;
  }

  // Ближайший предстоящий урок (еще не завершенный)
  const upcomingLessons = lessons
    .filter((l) => {
      if (l.status === "completed") return false;
      if (!l.lesson_date) return false;
      const timeStr = l.start_time || "23:59";
      const dt = new Date(`${l.lesson_date}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`);
      return dt >= new Date(now.getTime() - 45 * 60 * 1000);
    })
    .sort((a, b) => {
      const dtA = new Date(`${a.lesson_date}T${a.start_time || '00:00'}`);
      const dtB = new Date(`${b.lesson_date}T${b.start_time || '00:00'}`);
      return dtA - dtB;
    });

  const nearestLesson = upcomingLessons[0] || null;

  if (dashLessonsVal) {
    dashLessonsVal.textContent = pluralizeLessonsCount(weeklyLessons.length);
  }
  if (dashLessonsNote) {
    if (nearestLesson) {
      const dayKey = nearestLesson.day_key || getDayKeyFromDate(nearestLesson.lesson_date);
      const dayNames = { mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс" };
      dashLessonsNote.textContent = `Ближайший: ${dayNames[dayKey] || "Скоро"}, ${nearestLesson.start_time || '17:00'}`;
    } else if (weeklyLessons.length > 0) {
      dashLessonsNote.textContent = "Все уроки недели завершены";
    } else {
      dashLessonsNote.textContent = "Нет уроков на этой неделе";
    }
  }

  // Карточка "Ближайший онлайн-урок"
  const meetTag = document.getElementById("dash-next-meeting-tag");
  const meetTitle = document.getElementById("dash-next-meeting-title");
  const meetMentor = document.getElementById("dash-next-meeting-mentor");
  const meetBtn = document.getElementById("dash-next-meeting-btn");

  if (nearestLesson) {
    const dayKey = nearestLesson.day_key || getDayKeyFromDate(nearestLesson.lesson_date);
    const formattedDate = formatLessonDateText(nearestLesson.lesson_date, dayKey);
    if (meetTag) meetTag.textContent = `Ближайшая онлайн-встреча · ${formattedDate}, ${nearestLesson.start_time || '17:00'}`;
    if (meetTitle) meetTitle.textContent = `${nearestLesson.subject || 'Предмет'} ${nearestLesson.grade ? nearestLesson.grade + ' класс' : ''} · ${nearestLesson.title || 'Тематическое занятие'}`;
    if (meetMentor) meetMentor.innerHTML = `Ментор: <strong>${escapeHtml(nearestLesson.mentor_name || 'Волонтёр')}</strong> · Длительность: ${nearestLesson.duration_hours || 1} ч`;
    if (meetBtn) {
      meetBtn.href = nearestLesson.meet_url || "https://meet.google.com";
      meetBtn.textContent = "Войти в Google Meet →";
    }
  } else {
    if (meetTag) meetTag.textContent = "Онлайн-сессии завершены";
    if (meetTitle) meetTitle.textContent = "Нет предстоящих уроков в расписании";
    if (meetMentor) meetMentor.innerHTML = "Запланируйте новое занятие в разделе <strong>Расписание</strong>.";
    if (meetBtn) {
      meetBtn.href = "#/schedule";
      meetBtn.textContent = "Перейти к расписанию →";
    }
  }

  // 3. Продуктивность с Ment (динамические часы занятий)
  let mentMinutes = parseInt(localStorage.getItem("digitalMentor_mentMinutes"), 10);
  if (isNaN(mentMinutes) || mentMinutes < 60) {
    mentMinutes = 120;
    localStorage.setItem("digitalMentor_mentMinutes", String(mentMinutes));
  }
  const mentHours = (mentMinutes / 60).toFixed(1);
  const dashMentVal = document.getElementById("dash-stat-ment");
  const dashMentNote = document.getElementById("dash-stat-ment-note");

  if (dashMentVal) {
    dashMentVal.textContent = `${mentHours} ч`;
  }
  if (dashMentNote) {
    const weeklyAdd = Math.min((mentMinutes / 60) * 0.4, 4.8).toFixed(1);
    dashMentNote.textContent = `+${weeklyAdd} ч за 7 дней`;
  }

  // 4. Посещаемость (строго зависит от расписания и того, закончился ли урок)
  const endedLessons = lessons.filter((l) => isLessonEnded(l));
  const completedLessons = lessons.filter((l) => l.status === "completed");

  const dashAttendanceVal = document.getElementById("dash-stat-attendance");
  const dashAttendanceNote = document.getElementById("dash-stat-attendance-note");

  let attendancePercent = 100;
  let attendanceNoteText = "Все уроки впереди · Без пропусков";

  if (endedLessons.length > 0) {
    attendancePercent = Math.round((completedLessons.length / endedLessons.length) * 100);
    if (attendancePercent > 100) attendancePercent = 100;

    if (attendancePercent === 100) {
      attendanceNoteText = `Завершено ${completedLessons.length} из ${endedLessons.length} уроков`;
    } else {
      attendanceNoteText = `Посещено ${completedLessons.length} из ${endedLessons.length} завершённых`;
    }
  } else if (lessons.length === 0) {
    attendancePercent = 100;
    attendanceNoteText = "Расписание формируется";
  }

  if (dashAttendanceVal) {
    dashAttendanceVal.textContent = `${attendancePercent}%`;
  }
  if (dashAttendanceNote) {
    dashAttendanceNote.textContent = attendanceNoteText;
  }
}
window.updateDashboardDynamicStats = updateDashboardDynamicStats;

// Слушатель активности с ИИ Ment для мгновенного обновления продуктивности
window.addEventListener("ment-activity", () => {
  updateDashboardDynamicStats();
});

// Удаление курса (мгновенно и перманентно)
window.removeCourse = function (event, id) {
  if (event) {
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  const targetId = String(id);
  const current = getCourses();
  const courses = current.filter((c) => String(c.id) !== targetId);
  saveCourses(courses);

  try {
    localStorage.removeItem(`digitalMentor_enrolled_${targetId}`);
  } catch (e) {}

  renderCourses();
  updateDashboardDynamicStats();
  showToast("Курс успешно удалён", "info");
};

// Элементы модального окна
const modalOverlay = document.getElementById("modal-overlay");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cancelModalBtn = document.getElementById("cancel-modal-btn");
const addCourseForm = document.getElementById("add-course-form");
const courseNameSelect = document.getElementById("course-name-select");
const courseGradeSelect = document.getElementById("course-grade-select");
const courseMaxStudentsSelect = document.getElementById("course-max-students");
const courseStartDateInput = document.getElementById("course-start-date");

function openModal() {
  if (getUserRole() !== "Ментор") {
    showToast("Ученики не могут добавлять курсы. Только менторы.", "error");
    return;
  }
  modalOverlay.hidden = false;
  modalOverlay.classList.remove("is-hidden");
  addCourseForm.reset();

  if (courseMaxStudentsSelect) courseMaxStudentsSelect.value = "3";
  if (courseStartDateInput) {
    const today = new Date().toISOString().split("T")[0];
    courseStartDateInput.min = today;
    courseStartDateInput.value = today;
  }

  courseNameSelect.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  modalOverlay.classList.add("is-hidden");
}

if (openModalBtn) {
  openModalBtn.addEventListener("click", openModal);
}
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

// Закрытие при клике по фону
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Закрытие по Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlay.hidden) {
    closeModal();
  }
});

// Обработка добавления курса (только для ментора)
addCourseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (getUserRole() !== "Ментор") {
    showToast("Добавление курсов разрешено только менторам.", "error");
    closeModal();
    return;
  }

  const name = courseNameSelect.value.trim();
  const grade = courseGradeSelect.value.trim();
  const maxStudents = parseInt(courseMaxStudentsSelect ? courseMaxStudentsSelect.value : "3", 10);
  const startDate = courseStartDateInput ? courseStartDateInput.value : "";

  if (!name || !grade) {
    showToast("Пожалуйста, выберите название курса и класс.", "error");
    return;
  }

  if (isNaN(maxStudents) || maxStudents < 2 || maxStudents > 5) {
    showToast("Количество учеников должно быть от 2 до 5.", "error");
    return;
  }

  if (!startDate) {
    showToast("Пожалуйста, укажите дату начала курса.", "error");
    return;
  }

  const newCourse = {
    id: Date.now(),
    name,
    grade,
    maxStudents,
    startDate,
    mentor: "Школьник-волонтёр · Ментор назначен",
  };

  const courses = getCourses();
  courses.unshift(newCourse);
  saveCourses(courses);

  renderCourses();
  if (typeof updateDashboardDynamicStats === "function") {
    updateDashboardDynamicStats();
  }
  showToast("Курс успешно создан и добавлен в программу!", "success");
  closeModal();
});

// ============================================================
// Облачное расписание, планирование уроков и учёт волонтёрских часов (Supabase)
// ============================================================

let currentLessonsData = [];
window.selectedScheduleDay = "all";

// Элементы модального окна планирования урока
const scheduleModalOverlay = document.getElementById("schedule-modal-overlay");
const openScheduleModalBtn = document.getElementById("open-schedule-modal-btn");
const closeScheduleModalBtn = document.getElementById("close-schedule-modal-btn");
const cancelScheduleModalBtn = document.getElementById("cancel-schedule-modal-btn");
const addLessonForm = document.getElementById("add-lesson-form");
const lessonSubjectSelect = document.getElementById("lesson-subject-select");
const lessonGradeSelect = document.getElementById("lesson-grade-select");
const lessonTitleInput = document.getElementById("lesson-title-input");
const lessonDateInput = document.getElementById("lesson-date-input");
const lessonDurationSelect = document.getElementById("lesson-duration-select");
const lessonStartTimeInput = document.getElementById("lesson-start-time");
const lessonEndTimeInput = document.getElementById("lesson-end-time");
const lessonMeetInput = document.getElementById("lesson-meet-input");

function openScheduleModal() {
  if (getUserRole() !== "Ментор") {
    showToast("Планировать уроки могут только менторы.", "error");
    return;
  }
  if (!scheduleModalOverlay) return;

  scheduleModalOverlay.hidden = false;
  scheduleModalOverlay.classList.remove("is-hidden");
  if (addLessonForm) addLessonForm.reset();

  const today = new Date().toISOString().split("T")[0];
  if (lessonDateInput) {
    lessonDateInput.min = today;
    lessonDateInput.value = today;
  }
  if (lessonMeetInput) lessonMeetInput.value = "https://meet.google.com";
  if (lessonStartTimeInput) lessonStartTimeInput.value = "16:00";
  if (lessonEndTimeInput) lessonEndTimeInput.value = "17:00";

  if (lessonSubjectSelect) lessonSubjectSelect.focus();
}

function closeScheduleModal() {
  if (!scheduleModalOverlay) return;
  scheduleModalOverlay.hidden = true;
  scheduleModalOverlay.classList.add("is-hidden");
}

if (openScheduleModalBtn) {
  openScheduleModalBtn.addEventListener("click", openScheduleModal);
}
if (closeScheduleModalBtn) {
  closeScheduleModalBtn.addEventListener("click", closeScheduleModal);
}
if (cancelScheduleModalBtn) {
  cancelScheduleModalBtn.addEventListener("click", closeScheduleModal);
}

if (scheduleModalOverlay) {
  scheduleModalOverlay.addEventListener("click", (e) => {
    if (e.target === scheduleModalOverlay) closeScheduleModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && scheduleModalOverlay && !scheduleModalOverlay.hidden) {
    closeScheduleModal();
  }
});

// Определение дня недели для чипов фильтра (mon, tue, wed, ...)
function getDayKeyFromDate(dateStr) {
  if (!dateStr) return "tue";
  const d = new Date(dateStr);
  const day = d.getDay();
  const map = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" };
  return map[day] || "tue";
}

// Форматирование даты на русском
function formatLessonDateText(dateStr, dayKey) {
  const daysNames = {
    mon: "Понедельник",
    tue: "Вторник",
    wed: "Среда",
    thu: "Четверг",
    fri: "Пятница",
    sat: "Суббота",
    sun: "Воскресенье",
  };
  const dayName = daysNames[dayKey] || "День урока";
  if (!dateStr) return dayName;

  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
      const dayNum = parseInt(parts[2], 10);
      const monthNum = parseInt(parts[1], 10) - 1;
      return `${dayName}, ${dayNum} ${months[monthNum] || ""}`;
    }
  } catch (e) {}
  return dayName;
}

// Обработка отправки формы создания урока ментором
if (addLessonForm) {
  addLessonForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (getUserRole() !== "Ментор") {
      showToast("Планирование уроков доступно только менторам.", "error");
      closeScheduleModal();
      return;
    }

    const subject = lessonSubjectSelect.value;
    const grade = lessonGradeSelect.value;
    const title = lessonTitleInput.value.trim();
    const lesson_date = lessonDateInput.value;
    const duration_hours = parseFloat(lessonDurationSelect.value) || 1.0;
    const start_time = lessonStartTimeInput.value;
    const end_time = lessonEndTimeInput.value;
    const meet_url = lessonMeetInput.value.trim() || "https://meet.google.com";

    if (!subject || !grade || !title || !lesson_date) {
      showToast("Пожалуйста, заполните все обязательные поля урока.", "error");
      return;
    }

    const day_key = getDayKeyFromDate(lesson_date);

    // Получаем ID и имя текущего ментора из Google-аккаунта / локального профиля
    let currentUserId = "default_mentor";
    let mentorName = "Волонтёр-наставник";
    try {
      if (window.currentAuthUser && window.currentAuthUser.id) {
        currentUserId = window.currentAuthUser.id;
        mentorName =
          window.currentAuthUser.user_metadata?.full_name ||
          window.currentAuthUser.user_metadata?.name ||
          window.currentAuthUser.email.split("@")[0];
      } else if (window.SupabaseService && window.SupabaseService.getCurrentUserId) {
        currentUserId = await window.SupabaseService.getCurrentUserId();
      }

      const accountKey = getAccountProfileKey(currentUserId);
      const p = localStorage.getItem(accountKey) || localStorage.getItem(USER_PROFILE_KEY);
      if (p) {
        const parsed = JSON.parse(p);
        if (parsed.name) mentorName = parsed.name;
      }
    } catch (err) {}

    const newLesson = {
      subject,
      grade,
      title,
      mentor_name: mentorName,
      mentor_id: currentUserId,
      day_key,
      lesson_date,
      start_time,
      end_time,
      duration_hours,
      meet_url,
      status: "scheduled",
    };

    try {
      const submitBtn = document.getElementById("submit-lesson-btn");
      if (submitBtn) submitBtn.disabled = true;

      if (window.SupabaseService) {
        await window.SupabaseService.createLesson(newLesson);
      }

      closeScheduleModal();
      showToast("Урок успешно запланирован и добавлен в расписание!", "success");
      await loadAndRenderAllScheduleAndStats();
    } catch (err) {
      showToast("Ошибка при создании урока: " + (err.message || err), "error");
    } finally {
      const submitBtn = document.getElementById("submit-lesson-btn");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Завершение урока и отметка посещения (привязано к ID ментора урока)
window.handleCompleteLesson = async function (event, lessonId, durationHours, lessonMentorId) {
  if (event) {
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  const duration = parseFloat(durationHours) || 1.0;

  // Визуальная индикация выполнения на кнопке
  const clickedBtn = event && event.currentTarget ? event.currentTarget : null;
  if (clickedBtn) {
    clickedBtn.disabled = true;
    clickedBtn.textContent = "Обновление...";
  }

  try {
    if (window.SupabaseService) {
      await window.SupabaseService.completeLesson(lessonId, duration, lessonMentorId);
    }
    // Бесшовное мгновенное обновление расписания и волонтёрских часов
    await loadAndRenderAllScheduleAndStats();
    if (typeof updateDashboardDynamicStats === "function") {
      updateDashboardDynamicStats();
    }
    showToast("Урок завершён / посещение зафиксировано!", "success");
  } catch (err) {
    console.error("Ошибка при начислении часов:", err);
    if (clickedBtn) {
      clickedBtn.disabled = false;
      clickedBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Завершить урок
      `;
    }
  }
};

// Удаление предстоящего урока ментором
window.handleDeleteLesson = async function (event, lessonId) {
  if (event) {
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  showConfirmDialog(
    "Отмена и удаление урока",
    "Вы действительно хотите отменить этот урок и удалить его из общего расписания?",
    async () => {
      const clickedBtn = event && event.currentTarget ? event.currentTarget : null;
      if (clickedBtn) {
        clickedBtn.disabled = true;
        clickedBtn.textContent = "Удаление...";
      }

      try {
        if (window.SupabaseService) {
          await window.SupabaseService.deleteLesson(lessonId);
        }
        // Мгновенное удаление из локального списка на экране
        currentLessonsData = currentLessonsData.filter((l) => String(l.id) !== String(lessonId));
        renderScheduleLessons(currentLessonsData);
        if (typeof updateDashboardDynamicStats === "function") {
          updateDashboardDynamicStats();
        }
        showToast("Урок успешно удален из расписания", "info");
      } catch (err) {
        console.error("Ошибка при удалении урока:", err);
        showToast("Не удалось удалить урок: " + (err.message || err), "error");
        if (clickedBtn) {
          clickedBtn.disabled = false;
          clickedBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Удалить</span>
          `;
        }
      }
    },
    null,
    { danger: true, confirmText: "Удалить урок" }
  );
};

// Отрисовка списка уроков расписания
function renderScheduleLessons(lessons) {
  const container = document.getElementById("schedule-cards-list");
  const countEl = document.getElementById("schedule-lessons-count");
  if (!container) return;

  const isMentor = getUserRole() === "Ментор";
  const selectedDay = window.selectedScheduleDay || "all";

  // Фильтруем по выбранному дню недели
  const visibleLessons = lessons.filter((l) => {
    if (selectedDay === "all") return true;
    return l.day_key === selectedDay;
  });

  if (countEl) {
    const c = visibleLessons.length;
    let word = "занятий";
    if (c === 1) word = "занятие";
    else if (c >= 2 && c <= 4) word = "занятия";
    countEl.textContent = `${c} ${word}`;
  }

  // Обновление количества на кнопке "Вся неделя"
  const allChipNum = document.querySelector('.day-chip[data-day="all"] .day-num');
  if (allChipNum) {
    allChipNum.textContent = lessons.length;
  }

  // Обновление точек на днях недели
  const dayChips = document.querySelectorAll('.day-chip[data-day]:not([data-day="all"])');
  dayChips.forEach(chip => {
    const day = chip.getAttribute('data-day');
    const dotsContainer = chip.querySelector('.day-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      const dayLessons = lessons.filter(l => l.day_key === day);
      if (dayLessons.length > 0) {
        dayLessons.slice(0, 3).forEach(l => {
          const dot = document.createElement('span');
          dot.className = 'dot-lesson';
          if (l.status === 'live') dot.classList.add('dot-live');
          dotsContainer.appendChild(dot);
        });
      }
    }
  });

  if (visibleLessons.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--muted); border-radius: 16px; background: rgba(8, 20, 56, 0.4); border: 1px dashed rgba(170, 205, 255, 0.2);">
        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #ffffff;">На выбранный день занятий пока нет</p>
        <p style="margin: 0; font-size: 13px;">${isMentor ? "Вы можете запланировать урок, нажав кнопку «+ Запланировать урок» выше." : "Ожидайте публикации занятий вашими менторами."}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = visibleLessons
    .map((lesson) => {
      const isCompleted = lesson.status === "completed";
      const isLive = lesson.status === "live";
      const dayKey = lesson.day_key || getDayKeyFromDate(lesson.lesson_date);
      const dateText = formatLessonDateText(lesson.lesson_date, dayKey);

      let subjectClass = "subject-it";
      if (lesson.subject === "Алгебра") subjectClass = "subject-math";
      if (lesson.subject === "Английский язык") subjectClass = "subject-eng";

      const initials = (lesson.mentor_name || "М")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      // Статусная плашка времени
      let statusPillHtml = `<span class="upcoming-pill">${escapeHtml(dateText)}</span>`;
      if (isCompleted) {
        statusPillHtml = `<span class="lesson-status-completed">✓ Проведён · Часы начислены</span>`;
      } else if (isLive) {
        statusPillHtml = `
          <span class="live-pill">
            <span class="live-pulse-dot"></span>
            Урок идёт сейчас
          </span>`;
      }

      // Кнопки действия
      let actionButtonsHtml = "";
      if (isCompleted) {
        actionButtonsHtml = `
          <button class="btn-lesson-materials" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>Материалы</span>
          </button>
        `;
      } else {
        const completeBtnHtml = isMentor
          ? `
            <button class="btn-complete-lesson" onclick="handleCompleteLesson(event, '${lesson.id}', ${lesson.duration_hours || 1.0}, '${lesson.mentor_id || ''}')" type="button" title="Отметить проведение и получить волонтёрские часы">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Завершить урок</span>
            </button>
          `
          : `
            <button class="btn-complete-lesson" onclick="handleCompleteLesson(event, '${lesson.id}', ${lesson.duration_hours || 1.0}, '${lesson.mentor_id || ''}')" type="button" title="Отметить посещение занятия">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Я посетил(а)</span>
            </button>
          `;

        const deleteBtnHtml = isMentor
          ? `
            <button class="btn-delete-lesson" onclick="handleDeleteLesson(event, '${lesson.id}')" type="button" title="Отменить и удалить предстоящий урок">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <span>Удалить</span>
            </button>
          `
          : "";

        actionButtonsHtml = `
          <a class="btn-join-meet" href="${escapeHtml(lesson.meet_url || "https://meet.google.com")}" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <span>Подключиться</span>
          </a>
          ${completeBtnHtml}
          ${deleteBtnHtml}
          <button class="btn-lesson-materials" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>Материалы</span>
          </button>
        `;
      }

      return `
        <div class="schedule-card ${isLive ? "is-live" : ""}" data-day="${escapeHtml(dayKey)}" data-id="${lesson.id}">
          <div class="schedule-card-time">
            <span class="time-main">${escapeHtml(lesson.start_time || "16:00")} – ${escapeHtml(lesson.end_time || "17:00")}</span>
            ${statusPillHtml}
          </div>
          <div class="schedule-card-body">
            <div class="schedule-subject-row">
              <span class="subject-badge ${subjectClass}">${escapeHtml(lesson.subject)}</span>
              <span class="grade-badge">${escapeHtml(lesson.grade)}</span>
              <span class="room-badge">${lesson.duration_hours ? lesson.duration_hours + " ч." : "1 ч."}</span>
            </div>
            <h4 class="schedule-lesson-title">${escapeHtml(lesson.title)}</h4>
            <div class="schedule-mentor-meta">
              <div class="mentor-mini-avatar">${escapeHtml(initials)}</div>
              <div class="mentor-meta-text">
                <span class="mentor-role-label">Ментор урока:</span>
                <strong>${escapeHtml(lesson.mentor_name || "Волонтёр-наставник")}</strong>
              </div>
            </div>
          </div>
          <div class="schedule-card-action">
            ${actionButtonsHtml}
          </div>
        </div>
      `;
    })
    .join("");

  // Навешиваем клики на скачивание материалов
  container.querySelectorAll(".btn-lesson-materials").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Учебные и методические материалы к уроку подготовлены для скачивания", "info");
    });
  });

  if (typeof updateDashboardDynamicStats === "function") {
    updateDashboardDynamicStats();
  }
}

// Обновление UI волонтёрских часов и достижений в реальном времени
function updateVolunteerStatsUI(stats) {
  const hours = parseFloat(stats.volunteer_hours) || 0;
  const completedCount = parseInt(stats.lessons_completed, 10) || 0;
  const rating = parseFloat(stats.rating) || 5.0;
  const studentsCount = parseInt(stats.students_count, 10) || (completedCount > 0 ? 1 : 0);

  const hoursDisplay = document.getElementById("volunteer-hours-display");
  const progressFill = document.getElementById("volunteer-progress-fill");
  const lessonsCount = document.getElementById("stat-lessons-count");
  const studentsDisplay = document.getElementById("stat-students-count");
  const ratingDisplay = document.getElementById("stat-rating-display");
  const unlockedPill = document.getElementById("achievements-unlocked-pill");
  const passportName = document.getElementById("passport-mentor-name");
  const passportRank = document.getElementById("passport-rank-text");

  // Имя наставника на паспорте
  if (passportName) {
    let name = "Личный прогресс";
    if (window.currentAuthUser) {
      name =
        window.currentAuthUser.user_metadata?.full_name ||
        window.currentAuthUser.user_metadata?.name ||
        (window.currentAuthUser.email ? window.currentAuthUser.email.split("@")[0] : "Волонтёр-наставник");
    } else {
      const role = getUserRole();
      name = role === "Ментор" ? "Кабинет наставника" : "Личный прогресс";
    }
    passportName.textContent = name;
  }

  // Ранг наставника
  if (passportRank) {
    if (hours >= 40) {
      passportRank.textContent = "Мастер-наставник (Высший уровень)";
    } else if (hours >= 20) {
      passportRank.textContent = "Опытный волонтёр (Продвинутый)";
    } else if (hours >= 1) {
      passportRank.textContent = "Активный волонтёр";
    } else {
      passportRank.textContent = "Старт волонтёрской практики";
    }
  }

  if (hoursDisplay) {
    hoursDisplay.innerHTML = `<strong>${hours}</strong> / 50 ч.`;
  }

  if (progressFill) {
    const percent = Math.min(100, Math.round((hours / 50) * 100));
    progressFill.style.width = `${percent}%`;
  }

  if (lessonsCount) {
    lessonsCount.textContent = String(completedCount);
  }

  if (studentsDisplay) {
    studentsDisplay.textContent = String(studentsCount);
  }

  if (ratingDisplay) {
    ratingDisplay.textContent = completedCount > 0 ? `★ ${rating.toFixed(1)}` : `★ —`;
  }

  // Обновление карточек достижений (все 6 бейджей)
  const badgeCards = document.querySelectorAll(".badges-grid .badge-card");
  let unlocked = 0;

  function updateBadge(card, isUnlocked, statusText, progressPercent = null) {
    if (!card) return;
    if (isUnlocked) {
      card.classList.add("is-unlocked");
      card.classList.remove("is-in-progress");
      unlocked++;
    } else {
      card.classList.remove("is-unlocked");
      card.classList.add("is-in-progress");
    }
    const tag = card.querySelector(".badge-status-tag");
    if (tag) {
      tag.textContent = statusText;
      if (isUnlocked) {
        tag.className = "badge-status-tag status-done";
      } else {
        tag.className = "badge-status-tag status-progress";
      }
    }
    const miniFill = card.querySelector(".mini-progress-fill");
    if (miniFill && progressPercent !== null) {
      miniFill.style.width = `${progressPercent}%`;
    }
  }

  if (badgeCards && badgeCards.length >= 6) {
    // 1. Первый наставник (1 урок)
    updateBadge(
      badgeCards[0],
      completedCount >= 1,
      completedCount >= 1 ? "Получено ✓" : `${completedCount} / 1`
    );

    // 2. Мастер кода (10 уроков)
    const codePercent = Math.min(100, Math.round((completedCount / 10) * 100));
    updateBadge(
      badgeCards[1],
      completedCount >= 10,
      completedCount >= 10 ? "Получено ✓" : `${Math.min(completedCount, 10)} / 10`,
      codePercent
    );

    // 3. Звезда доверия (10 уроков / рейтинг)
    updateBadge(
      badgeCards[2],
      completedCount >= 10,
      completedCount >= 10 ? "Получено ✓" : `${Math.min(completedCount, 10)} / 10`
    );

    // 4. Марафонец знаний (40 часов)
    updateBadge(
      badgeCards[3],
      hours >= 40,
      hours >= 40 ? "Получено ✓" : `${hours} / 40 ч.`
    );

    // 5. Надёжное плечо (100% дисциплины)
    updateBadge(
      badgeCards[4],
      completedCount >= 1,
      completedCount >= 1 ? "Получено ✓" : "0%"
    );

    // 6. Олимпиец (2 ученика)
    const olympPercent = Math.min(100, Math.round((studentsCount / 2) * 100));
    updateBadge(
      badgeCards[5],
      studentsCount >= 2,
      studentsCount >= 2 ? "Получено ✓" : `${Math.min(studentsCount, 2)} / 2`,
      olympPercent
    );
  }

  if (unlockedPill) {
    unlockedPill.textContent = `${unlocked} из 6 получено`;
  }
}

// Главная функция загрузки данных из облака и отрисовки
async function loadAndRenderAllScheduleAndStats() {
  if (!window.SupabaseService) return;

  try {
    let currentUserId = "default_mentor";
    if (typeof window.SupabaseService.getCurrentUserId === "function") {
      currentUserId = await window.SupabaseService.getCurrentUserId();
    }

    const [lessons, stats] = await Promise.all([
      window.SupabaseService.getLessons(),
      window.SupabaseService.getMentorStats(currentUserId),
    ]);

    currentLessonsData = lessons || [];
    renderScheduleLessons(currentLessonsData);

    if (stats) {
      updateVolunteerStatsUI(stats);
    }
    if (typeof updateDashboardDynamicStats === "function") {
      updateDashboardDynamicStats();
    }
  } catch (err) {
    console.error("Ошибка обновления расписания и часов:", err);
  }
}

// Динамическое обновление текущей недели
function initDynamicWeek() {
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const now = new Date();
  let currentDayOfWeek = now.getDay();
  if (currentDayOfWeek === 0) currentDayOfWeek = 7; // Сделаем воскресенье 7-м днем, чтобы Пн был 1
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeek + 1);

  const monthTag = document.querySelector(".calendar-month-tag");
  if (monthTag) {
    monthTag.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
  }

  const dayChips = document.querySelectorAll(".day-chip[data-day]:not([data-day='all'])");
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  
  dayChips.forEach((chip) => {
    const dayKey = chip.getAttribute("data-day");
    const dayIndexOffset = dayKeys.indexOf(dayKey);
    if (dayIndexOffset !== -1) {
      const chipDate = new Date(startOfWeek);
      chipDate.setDate(startOfWeek.getDate() + dayIndexOffset);
      
      const numSpan = chip.querySelector(".day-num");
      if (numSpan) {
        numSpan.textContent = chipDate.getDate();
      }

      if (
        chipDate.getDate() === now.getDate() &&
        chipDate.getMonth() === now.getMonth() &&
        chipDate.getFullYear() === now.getFullYear()
      ) {
        chip.classList.add("is-today");
        let badge = chip.querySelector(".day-badge-today");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "day-badge-today";
          badge.textContent = "Сегодня";
          chip.insertBefore(badge, chip.firstChild);
        }
      } else {
        chip.classList.remove("is-today");
        const badge = chip.querySelector(".day-badge-today");
        if (badge) badge.remove();
      }
    }
  });
}

// Инициализация интерактивных чипов дней
function initScheduleInteractivity() {
  const dayChips = document.querySelectorAll(".day-chip");
  const filterAllBtn = document.getElementById("filter-all-days");

  dayChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      dayChips.forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      const day = chip.getAttribute("data-day");
      window.selectedScheduleDay = day;
      renderScheduleLessons(currentLessonsData);

      if (filterAllBtn) {
        filterAllBtn.classList.toggle("is-active", day === "all");
      }
    });
  });

  if (filterAllBtn) {
    filterAllBtn.addEventListener("click", () => {
      dayChips.forEach((c) => c.classList.remove("is-selected"));
      const allChip = document.querySelector('.day-chip[data-day="all"]');
      if (allChip) allChip.classList.add("is-selected");
      window.selectedScheduleDay = "all";
      renderScheduleLessons(currentLessonsData);
      filterAllBtn.classList.add("is-active");
    });
  }
}

// ============================================================
// Онбординг: Первичная регистрация пользователя (Google / Новый вход)
// ============================================================
function selectOnboardingRole(role) {
  const roleInput = document.getElementById("onboarding-role-input");
  const roleCards = document.querySelectorAll(".onboarding-role-card");
  const subjectLabel = document.getElementById("onboarding-subject-label");

  if (roleInput) roleInput.value = role;
  roleCards.forEach((card) => {
    if (card.getAttribute("data-role") === role) {
      card.classList.add("is-active");
    } else {
      card.classList.remove("is-active");
    }
  });

  if (subjectLabel) {
    subjectLabel.textContent =
      role === "Ментор" ? "Предмет преподавания" : "Предмет изучения";
  }
}

function openOnboardingModal(currentUser, existingProfile) {
  const modal = document.getElementById("onboarding-modal-overlay");
  if (!modal) return;

  // Предзаполняем имя пользователя
  const nameInput = document.getElementById("onboarding-name-input");
  if (nameInput) {
    let defaultName = "";
    if (currentUser) {
      defaultName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        (currentUser.email ? currentUser.email.split("@")[0] : "");
    } else if (
      existingProfile &&
      existingProfile.name &&
      existingProfile.name !== "Алина Касымова"
    ) {
      defaultName = existingProfile.name;
    }
    nameInput.value = defaultName;
  }

  // Роль
  const defaultRole = (existingProfile && existingProfile.role) || "Ученик";
  selectOnboardingRole(defaultRole);

  // Класс
  const gradeSelect = document.getElementById("onboarding-grade-select");
  if (gradeSelect && existingProfile && existingProfile.grade) {
    gradeSelect.value = existingProfile.grade;
  }

  // Предмет
  const subjectSelect = document.getElementById("onboarding-subject-select");
  if (subjectSelect && existingProfile && existingProfile.subject) {
    subjectSelect.value = existingProfile.subject;
  }

  modal.classList.remove("is-hidden");
  modal.removeAttribute("hidden");
  modal.style.display = "grid";
}

function closeOnboardingModal() {
  const modal = document.getElementById("onboarding-modal-overlay");
  if (!modal) return;
  modal.classList.add("is-hidden");
  modal.setAttribute("hidden", "true");
  modal.style.display = "none";
}

function initOnboarding() {
  const form = document.getElementById("onboarding-form");
  const roleCards = document.querySelectorAll(".onboarding-role-card");
  const confirmOverlay = document.getElementById("onboarding-confirm-overlay");
  const confirmRoleName = document.getElementById("confirm-role-name");
  const btnBack = document.getElementById("btn-onboarding-back");
  const btnProceed = document.getElementById("btn-onboarding-proceed");

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      const role = card.getAttribute("data-role");
      selectOnboardingRole(role);
    });
  });

  // Кнопка возврата к редактированию
  if (btnBack && confirmOverlay) {
    btnBack.addEventListener("click", () => {
      confirmOverlay.style.display = "none";
    });
  }

  // Временные данные перед окончательным подтверждением
  let pendingProfileData = null;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("onboarding-name-input");
      const gradeSelect = document.getElementById("onboarding-grade-select");
      const subjectSelect = document.getElementById("onboarding-subject-select");
      const roleInput = document.getElementById("onboarding-role-input");

      const name = nameInput ? nameInput.value.trim() : "";
      const grade = gradeSelect ? gradeSelect.value : "10 класс";
      const subject = subjectSelect ? subjectSelect.value : "Информатика";
      const role = roleInput ? roleInput.value : "Ученик";

      if (!name) {
        showToast("Пожалуйста, укажите имя и фамилию.", "error");
        return;
      }

      pendingProfileData = { name, grade, subject, role };

      // Показываем плашку подтверждения: "Вы уверены? Роль можно определить лишь 1 раз"
      if (confirmRoleName) {
        confirmRoleName.textContent = role;
      }
      if (confirmOverlay) {
        confirmOverlay.style.display = "flex";
      }
    });
  }

  // Окончательное подтверждение выбора роли
  if (btnProceed) {
    btnProceed.addEventListener("click", async () => {
      if (!pendingProfileData) return;

      let currentUser = null;
      if (window.SupabaseService) {
        try {
          currentUser = await window.SupabaseService.getCurrentUser();
          window.currentAuthUser = currentUser;
        } catch (err) {}
      }

      const newProfile = {
        name: pendingProfileData.name || (currentUser?.email ? currentUser.email.split("@")[0] : "Пользователь"),
        role: pendingProfileData.role,
        grade: pendingProfileData.grade,
        subject: pendingProfileData.subject,
        email: currentUser?.email || "",
        google_id: currentUser?.id || "",
        isConfigured: true,
        roleLocked: true, // Роль зафиксирована навсегда
        configured_at: new Date().toISOString(),
      };

      // Сохраняем в персональный ключ аккаунта и глобальный ключ
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      if (currentUser && currentUser.id) {
        localStorage.setItem(getAccountProfileKey(currentUser.id), JSON.stringify(newProfile));
      }

      // Немедленная синхронизация профиля в Supabase Cloud (чтобы администратор видел нового пользователя)
      if (window.SupabaseService && typeof window.SupabaseService.syncCloudProfile === "function") {
        window.SupabaseService.syncCloudProfile(newProfile).catch(console.warn);
      }

      if (confirmOverlay) {
        confirmOverlay.style.display = "none";
      }
      closeOnboardingModal();
      updateRoleUI();
      await loadAndRenderAllScheduleAndStats();

      if (typeof showToast === "function") {
        showToast(`Вы вошли как «${newProfile.role}» (роль зафиксирована)`);
      }
    });
  }
}

async function checkFirstTimeUser() {
  let currentUser = null;
  if (window.SupabaseService) {
    try {
      currentUser = await window.SupabaseService.getCurrentUser();
      window.currentAuthUser = currentUser;
    } catch (err) {}
  }

  let profile = null;
  try {
    const accountKey = getAccountProfileKey(currentUser ? currentUser.id : null);
    const rawAccount = localStorage.getItem(accountKey);
    if (rawAccount) {
      profile = JSON.parse(rawAccount);
    } else {
      const raw = localStorage.getItem(USER_PROFILE_KEY);
      if (raw) profile = JSON.parse(raw);
    }
  } catch (e) {}

  // Если авторизован ansarnurlan2@gmail.com — автоматически назначаем права Администратора
  if (currentUser && currentUser.email && currentUser.email.toLowerCase().trim() === "ansarnurlan2@gmail.com") {
    const adminProfile = {
      name: (currentUser.user_metadata && (currentUser.user_metadata.full_name || currentUser.user_metadata.name)) || "Ансар Нурлан",
      role: "Администратор",
      grade: "11 класс",
      subject: "SAT Math & Руководитель проекта",
      email: "ansarnurlan2@gmail.com",
      google_id: currentUser.id,
      isConfigured: true
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(adminProfile));
    localStorage.setItem(getAccountProfileKey(currentUser.id), JSON.stringify(adminProfile));
    if (window.SupabaseService && typeof window.SupabaseService.syncCloudProfile === "function") {
      window.SupabaseService.syncCloudProfile(adminProfile).catch(console.warn);
    }
    updateRoleUI();
    return;
  }

  // При любом входе через Google сразу фиксируем пользователя в Supabase Cloud (друг сразу появляется в панели админа)
  if (currentUser && currentUser.email && window.SupabaseService && typeof window.SupabaseService.syncCloudProfile === "function") {
    const cloudSyncPayload = {
      name: (currentUser.user_metadata && (currentUser.user_metadata.full_name || currentUser.user_metadata.name)) || profile?.name || currentUser.email.split("@")[0],
      email: currentUser.email,
      google_id: currentUser.id,
      role: profile?.role || "Ученик",
      grade: profile?.grade || "10 класс",
      subject: profile?.subject || "Алгебра",
      status: "active"
    };
    window.SupabaseService.syncCloudProfile(cloudSyncPayload).catch(console.warn);
  }

  // Если профиль уже настроен и роль зафиксирована — никогда не открываем онбординг повторно!
  if (profile && profile.isConfigured) {
    return;
  }

  // Пользователь считается новым, если профиль ещё не настроен
  const isNewGoogleUser =
    currentUser && currentUser.email && (!profile || profile.email !== currentUser.email || profile.google_id !== currentUser.id);
  const isProfileUnconfigured = !profile || !profile.isConfigured;

  if (isNewGoogleUser || isProfileUnconfigured) {
    openOnboardingModal(currentUser, profile);
  }
}

// Инициализация кнопки выхода из аккаунта
function initHeaderLogout() {
  const logoutBtns = [
    document.getElementById("header-logout-btn"),
    document.getElementById("sidebar-logout-btn"),
  ].filter(Boolean);

  logoutBtns.forEach((btn) => {
    if (!btn.dataset.bound) {
      btn.dataset.bound = "true";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showConfirmDialog(
          "Выход из аккаунта",
          "Вы действительно хотите выйти из своего профиля на платформе?",
          async () => {
            if (window.SupabaseService && typeof window.SupabaseService.signOut === "function") {
              await window.SupabaseService.signOut();
            } else {
              sessionStorage.removeItem("mentorProfile");
              window.location.href = "../главный%20экран/index.html";
            }
          },
          null,
          { danger: true, confirmText: "Выйти" }
        );
      });
    }
  });
}

// Инициализация кнопок шапки (Чат с Ment, Уведомления)
function initHeaderControls() {
  const chatBtn = document.getElementById("header-chat-btn");
  if (chatBtn && !chatBtn.dataset.bound) {
    chatBtn.dataset.bound = "true";
    chatBtn.addEventListener("click", () => {
      if (typeof window.toggleAiTutor === "function") {
        window.toggleAiTutor(true);
      } else {
        const fab = document.getElementById("ai-tutor-fab-btn");
        if (fab) fab.click();
      }
    });
  }

  const notifBtn = document.getElementById("header-notifications-btn");
  if (notifBtn && !notifBtn.dataset.bound) {
    notifBtn.dataset.bound = "true";
    notifBtn.addEventListener("click", () => {
      showToast("У вас нет новых уведомлений. Все системы в норме!", "info");
    });
  }
}

// ============================================================
// Multi-page SPA Routing System
// ============================================================
function initSpaRouter() {
  function handleRoute(route, pushState = true) {
    const validRoutes = ["dashboard", "courses", "schedule", "achievements", "profile", "admin"];
    const targetRoute = validRoutes.includes(route) ? route : "dashboard";

    // 0. Контроль доступа и безопасность (RBAC Middleware):
    // Доступ к роуту /admin разрешён исключительно пользователям со статусом role: "admin"
    if (targetRoute === "admin") {
      const currentRole = String(getUserRole() || "").toLowerCase();
      const isAdmin = currentRole.includes("админ") || currentRole === "admin";
      if (!isAdmin) {
        showToast(
          `403 Forbidden: Доступ запрещён. Вы авторизованы со статусом «${getUserRole()}». Раздел администратора доступен исключительно администраторам платформы.`,
          "error"
        );
        // Неавторизованных пользователей или обычных учеников/менторов перенаправляем на / (dashboard)
        handleRoute("dashboard", pushState);
        return;
      }
    }

    // 1. Скрываем все страницы
    document.querySelectorAll(".page-view").forEach((view) => {
      view.hidden = true;
    });

    // 2. Отображаем активную страницу с плавной анимацией fade/slide (0.2s)
    const targetEl = document.getElementById(`page-${targetRoute}`);
    if (targetEl) {
      targetEl.hidden = false;
      targetEl.style.animation = "none";
      void targetEl.offsetWidth; // trigger reflow
      targetEl.style.animation = "pageFadeSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    }

    // 3. Подсвечиваем активный пункт в вертикальном сайдбаре
    document.querySelectorAll(".sidebar-nav-item[data-route]").forEach((item) => {
      const isCurrent = item.getAttribute("data-route") === targetRoute;
      item.classList.toggle("is-active", isCurrent);
    });

    // 4. Обновляем данные страниц при переходе
    if (targetRoute === "profile") {
      renderProfilePage();
    } else if (targetRoute === "courses") {
      renderCourses();
    } else if (targetRoute === "schedule") {
      loadAndRenderAllScheduleAndStats();
    } else if (targetRoute === "admin") {
      if (typeof syncAdminUsersFromCloud === "function") {
        syncAdminUsersFromCloud();
      }
      if (typeof renderAdminDashboard === "function") {
        renderAdminDashboard();
      }
    }

    // 5. Обновляем URL в адресной строке без перезагрузки всей страницы
    if (pushState) {
      if (window.location.hash !== `#/${targetRoute}`) {
        history.pushState({ route: targetRoute }, "", `#/${targetRoute}`);
      }
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function getRouteFromUrl() {
    const hash = window.location.hash.replace(/^#\/?/, "").trim();
    if (hash) {
      const clean = hash.split("/")[0].split("?")[0];
      if (["dashboard", "courses", "schedule", "achievements", "profile", "admin"].includes(clean)) {
        return clean;
      }
    }
    const params = new URLSearchParams(window.location.search);
    const p = params.get("page");
    if (p && ["dashboard", "courses", "schedule", "achievements", "profile", "admin"].includes(p)) {
      return p;
    }
    return "dashboard";
  }

  // Перехватываем клики по ссылкам с data-route (SPA переход)
  document.addEventListener("click", (e) => {
    const routeTrigger = e.target.closest("[data-route]");
    if (routeTrigger) {
      e.preventDefault();
      const route = routeTrigger.getAttribute("data-route");
      handleRoute(route, true);
    }
  });

  // Обработка кнопок Вперёд / Назад браузера (popstate и hashchange)
  window.addEventListener("hashchange", () => {
    handleRoute(getRouteFromUrl(), false);
  });
  window.addEventListener("popstate", () => {
    handleRoute(getRouteFromUrl(), false);
  });

  // Запуск начального роута
  handleRoute(getRouteFromUrl(), false);
}

// Рендеринг и логика страницы профиля
function renderProfilePage() {
  let profile = null;
  try {
    const accountKey = getAccountProfileKey();
    const raw = localStorage.getItem(accountKey) || localStorage.getItem(USER_PROFILE_KEY);
    if (raw) profile = JSON.parse(raw);
  } catch (e) {}

  if (!profile) {
    profile = {
      name: "Ансар Нурлан",
      role: "Администратор",
      grade: "11 класс",
      subject: "SAT Math & Руководитель",
      email: "ansarnurlan2@gmail.com",
    };
  } else if (profile.email && profile.email.toLowerCase().trim() === "ansarnurlan2@gmail.com") {
    profile.role = "Администратор";
  }

  const avatarEl = document.getElementById("profile-page-avatar");
  const nameEl = document.getElementById("profile-page-name");
  const rolePill = document.getElementById("profile-page-role-pill");
  const gradeSubjEl = document.getElementById("profile-page-grade-subject");
  const emailEl = document.getElementById("profile-page-email");
  const inputName = document.getElementById("profile-input-name");
  const selectGrade = document.getElementById("profile-select-grade");
  const selectSubj = document.getElementById("profile-select-subject");
  const greetingEl = document.getElementById("dashboard-user-greeting");

  const initials = (profile.name || "Матвей").slice(0, 2).toUpperCase();
  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = profile.name || "Матвей";
  if (greetingEl) greetingEl.textContent = `Привет, ${profile.name || "Матвей"}! 👋`;
  if (rolePill) rolePill.textContent = `Роль: ${profile.role || "Ученик"}`;
  if (gradeSubjEl) gradeSubjEl.textContent = `${profile.grade || "11 класс"} · ${profile.subject || "Алгебра"}`;
  if (emailEl) emailEl.textContent = profile.email || "matvey.student@gmail.com";

  if (inputName) inputName.value = profile.name || "Матвей";
  if (selectGrade && profile.grade) selectGrade.value = profile.grade;
  if (selectSubj && profile.subject) selectSubj.value = profile.subject;

  // Обновляем визуальное выделение карточек тем в профиле
  const currentTheme = getSavedTheme();
  const darkCard = document.getElementById("theme-card-dark");
  const lightCard = document.getElementById("theme-card-light");
  if (darkCard) darkCard.classList.toggle("active", currentTheme === "dark");
  if (lightCard) lightCard.classList.toggle("active", currentTheme === "light");
}

function initProfilePage() {
  renderProfilePage();

  // Привязка переключателя тем оформления
  const darkCard = document.getElementById("theme-card-dark");
  const lightCard = document.getElementById("theme-card-light");
  if (darkCard && !darkCard.dataset.bound) {
    darkCard.dataset.bound = "true";
    darkCard.addEventListener("click", () => setTheme("dark"));
  }
  if (lightCard && !lightCard.dataset.bound) {
    lightCard.dataset.bound = "true";
    lightCard.addEventListener("click", () => setTheme("light"));
  }

  const editForm = document.getElementById("profile-edit-form");
  if (editForm && !editForm.dataset.bound) {
    editForm.dataset.bound = "true";
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputName = document.getElementById("profile-input-name");
      const selectGrade = document.getElementById("profile-select-grade");
      const selectSubj = document.getElementById("profile-select-subject");

      let currentProfile = {};
      try {
        const raw = localStorage.getItem(USER_PROFILE_KEY);
        if (raw) currentProfile = JSON.parse(raw);
      } catch (err) {}

      const updated = {
        ...currentProfile,
        name: inputName ? inputName.value.trim() : "Матвей",
        grade: selectGrade ? selectGrade.value : "11 класс",
        subject: selectSubj ? selectSubj.value : "Алгебра",
      };

      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      const accountKey = getAccountProfileKey();
      localStorage.setItem(accountKey, JSON.stringify(updated));

      renderProfilePage();
      updateRoleUI();
      showToast("Профиль успешно обновлён!", "success");
    });
  }

  const profileLogoutBtn = document.getElementById("profile-page-logout-btn");
  if (profileLogoutBtn && !profileLogoutBtn.dataset.bound) {
    profileLogoutBtn.dataset.bound = "true";
    profileLogoutBtn.addEventListener("click", () => {
      showConfirmDialog(
        "Выход из аккаунта",
        "Вы действительно хотите выйти из своего профиля на платформе?",
        async () => {
          if (window.SupabaseService && typeof window.SupabaseService.signOut === "function") {
            await window.SupabaseService.signOut();
          } else {
            sessionStorage.removeItem("mentorProfile");
            window.location.href = "../главный%20экран/index.html";
          }
        },
        null,
        { danger: true, confirmText: "Выйти" }
      );
    });
  }
}

// Главная функция инициализации приложения
async function initApp() {
  if (window.SupabaseService) {
    try {
      const user = await window.SupabaseService.getCurrentUser();
      window.currentAuthUser = user;
    } catch (e) {}
  }

  // Облачная синхронизация курсов и пользователей Supabase
  if (typeof syncCoursesFromCloud === "function") {
    await syncCoursesFromCloud();
  }
  if (typeof syncAdminUsersFromCloud === "function") {
    syncAdminUsersFromCloud();
  }

  updateRoleUI();
  initSpaRouter();
  initAdminDashboard();
  initProfilePage();
  initProgramFilters();
  renderCourses();
  initDynamicWeek();
  initScheduleInteractivity();
  initHeaderLogout();
  initHeaderControls();
  await loadAndRenderAllScheduleAndStats();
  initOnboarding();
  await checkFirstTimeUser();
  if (typeof updateDashboardDynamicStats === "function") {
    updateDashboardDynamicStats();
  }
}

// Инициализация при загрузке страницы (единственное место вызова)
let _appInitialized = false;
document.addEventListener("DOMContentLoaded", () => {
  if (_appInitialized) return;
  _appInitialized = true;
  initApp();

  // Живая подписка на обновления Supabase Realtime
  if (window.SupabaseService) {
    window.SupabaseService.subscribe(() => {
      loadAndRenderAllScheduleAndStats();
      if (typeof syncCoursesFromCloud === "function") syncCoursesFromCloud();
      if (typeof syncAdminUsersFromCloud === "function") syncAdminUsersFromCloud();
    });

    if (typeof window.SupabaseService.onAuthStateChange === "function") {
      window.SupabaseService.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          window.currentAuthUser = session.user;
          updateRoleUI();
          await loadAndRenderAllScheduleAndStats();
          await checkFirstTimeUser();
        }
      });
    }
  }
});

// Синхронизация между вкладками при изменении профиля (только UI, без перезагрузки данных)
window.addEventListener("storage", (e) => {
  if (
    e.key === USER_PROFILE_KEY ||
    e.key === STORAGE_KEY ||
    (e.key && e.key.startsWith("digitalMentor_profile_")) ||
    e.key === "digitalMentor_mentMinutes" ||
    e.key === "dm_cloud_lessons_cache"
  ) {
    updateRoleUI();
    renderCourses();
    if (typeof updateDashboardDynamicStats === "function") {
      updateDashboardDynamicStats();
    }
  }
});



// ============================================================
// Функции для кастомных уведомлений (Toast) и диалогов (Modal)
// ============================================================
function showToast(message, type = 'error') {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'custom-toast';
    document.body.appendChild(toast);
  }
  
  toast.className = 'custom-toast';
  if (type === 'error') {
    toast.classList.add('toast-error');
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
  } else if (type === 'success') {
    toast.classList.add('toast-success');
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
  } else if (type === 'info') {
    toast.classList.add('toast-info');
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
  } else {
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  }

  // Сброс и запуск анимации
  toast.classList.remove('show');
  void toast.offsetWidth; // trigger reflow
  toast.classList.add('show');
  
  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Диалог подтверждения действий (Schoolhouse/SAT style)
function showConfirmDialog(title, message, onConfirm, onCancel = null, options = {}) {
  let overlay = document.getElementById('custom-confirm-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'custom-confirm-overlay';
    overlay.className = 'custom-confirm-overlay';
    document.body.appendChild(overlay);
  }

  const isDanger = options.danger !== false;
  const confirmBtnText = options.confirmText || (isDanger ? 'Подтвердить' : 'Продолжить');
  const cancelBtnText = options.cancelText || 'Отмена';

  overlay.innerHTML = `
    <div class="custom-confirm-box" role="dialog" aria-modal="true">
      <div class="custom-confirm-header">
        <div class="custom-confirm-icon ${isDanger ? '' : 'custom-confirm-icon--info'}">
          ${isDanger ? `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          `}
        </div>
        <h4 class="custom-confirm-title">${escapeHtml(title)}</h4>
      </div>
      <p class="custom-confirm-msg">${escapeHtml(message)}</p>
      <div class="custom-confirm-actions">
        <button type="button" class="btn-confirm-cancel" id="btn-dialog-cancel">${escapeHtml(cancelBtnText)}</button>
        <button type="button" class="btn-confirm-accept ${isDanger ? '' : 'btn-confirm-accept--primary'}" id="btn-dialog-accept">${escapeHtml(confirmBtnText)}</button>
      </div>
    </div>
  `;

  function closeDialog() {
    overlay.classList.remove('show');
    setTimeout(() => {
      if (!overlay.classList.contains('show')) {
        overlay.innerHTML = '';
      }
    }, 250);
  }

  const cancelBtn = overlay.querySelector('#btn-dialog-cancel');
  const acceptBtn = overlay.querySelector('#btn-dialog-accept');

  cancelBtn.addEventListener('click', () => {
    closeDialog();
    if (typeof onCancel === 'function') onCancel();
  });

  acceptBtn.addEventListener('click', () => {
    closeDialog();
    if (typeof onConfirm === 'function') onConfirm();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
      if (typeof onCancel === 'function') onCancel();
    }
  });

  requestAnimationFrame(() => {
    overlay.classList.add('show');
  });
}

window.showToast = showToast;
window.showConfirmDialog = showConfirmDialog;

// ============================================================
// МОДУЛЬ АДМИНИСТРАТОРА (ADMIN DASHBOARD MODULE)
// ============================================================

const ADMIN_USERS_STORAGE_KEY = "digitalMentor_adminUsers";
const ADMIN_HOURS_STORAGE_KEY = "digitalMentor_adminHours";

const INITIAL_ADMIN_USERS = [
  {
    id: "usr-admin-ansar",
    name: "Ансар Нурлан",
    email: "ansarnurlan2@gmail.com",
    role: "Администратор",
    grade: "11 класс",
    subject: "SAT Math & Руководитель проекта",
    hours: 180,
    mentor: "",
    loginDate: "Сегодня, 18:00",
    status: "active"
  },
  {
    id: "usr-admin-1",
    name: "Алихан Сейдалиев",
    email: "alikhan.seidaliev@gmail.com",
    role: "Администратор",
    grade: "11 класс",
    subject: "SAT Math",
    hours: 120,
    mentor: "",
    loginDate: "Сегодня, 17:30",
    status: "active"
  },
  {
    id: "usr-mentor-2",
    name: "Айгерим Муратова",
    email: "aigerim.m@gmail.com",
    role: "Ментор",
    grade: "11 класс",
    subject: "Алгебра",
    hours: 42,
    mentor: "",
    loginDate: "Сегодня, 16:45",
    status: "active"
  },
  {
    id: "usr-mentor-3",
    name: "Арман Тлеубаев",
    email: "arman.tleubayev@gmail.com",
    role: "Ментор",
    grade: "10 класс",
    subject: "Информатика",
    hours: 38,
    mentor: "",
    loginDate: "Сегодня, 15:10",
    status: "active"
  },
  {
    id: "usr-mentor-4",
    name: "Дильназ Каримова",
    email: "dilnaz.karimova@gmail.com",
    role: "Ментор",
    grade: "11 класс",
    subject: "Физика",
    hours: 29.5,
    mentor: "",
    loginDate: "Вчера, 19:20",
    status: "active"
  },
  {
    id: "usr-student-5",
    name: "Дамир Жумабеков",
    email: "damir.zhumabek@gmail.com",
    role: "Ученик",
    grade: "9 класс",
    subject: "Алгебра",
    hours: 0,
    mentor: "Айгерим Муратова",
    loginDate: "Сегодня, 14:05",
    status: "active"
  },
  {
    id: "usr-student-6",
    name: "София Ли",
    email: "sofia.lee@gmail.com",
    role: "Ученик",
    grade: "10 класс",
    subject: "Информатика",
    hours: 0,
    mentor: "Арман Тлеубаев",
    loginDate: "Сегодня, 11:30",
    status: "active"
  },
  {
    id: "usr-student-7",
    name: "Санжар Ибраев",
    email: "sanzhar.ibrayev@gmail.com",
    role: "Ученик",
    grade: "11 класс",
    subject: "Физика",
    hours: 0,
    mentor: "Дильназ Каримова",
    loginDate: "23.09.2026",
    status: "blocked"
  }
];

const INITIAL_ADMIN_HOURS = [
  {
    id: "req-1",
    mentorName: "Айгерим Муратова",
    mentorEmail: "aigerim.m@gmail.com",
    subject: "Алгебра & Анализ: Тригонометрические формулы",
    audience: "Дамир Жумабеков (9 класс)",
    date: "2026-09-25",
    time: "16:00 - 17:00",
    duration: 1.0,
    status: "pending"
  },
  {
    id: "req-2",
    mentorName: "Арман Тлеубаев",
    mentorEmail: "arman.tleubayev@gmail.com",
    subject: "Python: Динамическое программирование и графы",
    audience: "Группа 10-11 кл. (София Ли + 3)",
    date: "2026-09-25",
    time: "15:00 - 16:30",
    duration: 1.5,
    status: "pending"
  },
  {
    id: "req-3",
    mentorName: "Дильназ Каримова",
    mentorEmail: "dilnaz.karimova@gmail.com",
    subject: "Физика: Законы Ньютона и динамика точки",
    audience: "Санжар Ибраев (11 класс)",
    date: "2026-09-24",
    time: "18:00 - 19:00",
    duration: 1.0,
    status: "verified"
  }
];

function getAdminUsers() {
  let list = [];
  try {
    const data = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {
    console.error("Ошибка чтения пользователей админки", e);
  }

  if (list.length === 0) {
    list = [...INITIAL_ADMIN_USERS];
  }

  // Гарантируем, что ansarnurlan2@gmail.com всегда присутствует со статусом Администратора
  const ansarIdx = list.findIndex(
    (u) => u.email && u.email.toLowerCase().trim() === "ansarnurlan2@gmail.com"
  );
  if (ansarIdx !== -1) {
    list[ansarIdx].role = "Администратор";
    list[ansarIdx].status = "active";
    const ansarUser = list.splice(ansarIdx, 1)[0];
    list.unshift(ansarUser);
  } else {
    list.unshift({
      id: "usr-admin-ansar",
      name: "Ансар Нурлан",
      email: "ansarnurlan2@gmail.com",
      role: "Администратор",
      grade: "11 класс",
      subject: "SAT Math & Руководитель проекта",
      hours: 180,
      mentor: "",
      loginDate: "Сегодня, 18:00",
      status: "active"
    });
  }

  saveAdminUsers(list);
  return list;
}

function saveAdminUsers(users) {
  try {
    localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Ошибка записи пользователей админки", e);
  }
}

// Загрузка и живая синхронизация пользователей из Supabase Cloud (Google Auth)
async function syncAdminUsersFromCloud() {
  if (window.SupabaseService && typeof window.SupabaseService.getCloudUsers === "function") {
    try {
      const cloudUsers = await window.SupabaseService.getCloudUsers();
      if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        const currentList = getAdminUsers();
        let changed = false;

        cloudUsers.forEach((cu) => {
          if (!cu.email) return;
          const cleanEmail = cu.email.toLowerCase().trim();
          const existingIdx = currentList.findIndex(
            (u) => u.email && u.email.toLowerCase().trim() === cleanEmail
          );
          if (existingIdx !== -1) {
            currentList[existingIdx] = { ...currentList[existingIdx], ...cu };
            changed = true;
          } else {
            // Новый пользователь (зарегистрировался друг под Google)!
            currentList.push(cu);
            changed = true;
          }
        });

        if (changed) {
          saveAdminUsers(currentList);
          if (typeof renderAdminUsers === "function") renderAdminUsers();
          if (typeof renderAdminOverview === "function") renderAdminOverview();
        }
      }
    } catch (e) {
      console.warn("syncAdminUsersFromCloud error:", e);
    }
  }
}

function getAdminHours() {
  try {
    const data = localStorage.getItem(ADMIN_HOURS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Ошибка чтения заявок на часы", e);
  }
  saveAdminHours(INITIAL_ADMIN_HOURS);
  return INITIAL_ADMIN_HOURS;
}

function saveAdminHours(hours) {
  try {
    localStorage.setItem(ADMIN_HOURS_STORAGE_KEY, JSON.stringify(hours));
  } catch (e) {
    console.error("Ошибка записи заявок на часы", e);
  }
}

function initAdminDashboard() {
  // 1. Навигационные вкладки админ-панели
  const tabButtons = document.querySelectorAll(".admin-tab-btn[data-admin-tab]");
  tabButtons.forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-admin-tab");
      
      tabButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll(".admin-tab-content").forEach((pane) => {
        pane.classList.remove("is-active");
      });

      const activePane = document.getElementById(`admin-tab-pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add("is-active");
      }

      if (targetTab === "overview") {
        if (typeof syncAdminUsersFromCloud === "function") syncAdminUsersFromCloud();
        renderAdminOverview();
      } else if (targetTab === "users") {
        if (typeof syncAdminUsersFromCloud === "function") syncAdminUsersFromCloud();
        renderAdminUsers();
      } else if (targetTab === "hours") renderAdminHours();
      else if (targetTab === "courses") renderAdminCourses();
    });
  });

  // 2. Живой поиск и фильтр пользователей
  const searchInput = document.getElementById("admin-user-search-input");
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.addEventListener("input", () => {
      renderAdminUsers();
    });
  }

  const roleFilter = document.getElementById("admin-user-role-filter");
  if (roleFilter && !roleFilter.dataset.bound) {
    roleFilter.dataset.bound = "true";
    roleFilter.addEventListener("change", () => {
      renderAdminUsers();
    });
  }

  // 3. Добавление нового пользователя
  const addUserBtn = document.getElementById("btn-admin-add-user");
  if (addUserBtn && !addUserBtn.dataset.bound) {
    addUserBtn.dataset.bound = "true";
    addUserBtn.addEventListener("click", () => {
      openAdminUserModal(null);
    });
  }

  // 4. Закрытие модального окна пользователя
  const closeModalBtn = document.getElementById("close-admin-user-modal-btn");
  const cancelModalBtn = document.getElementById("cancel-admin-user-btn");
  const modalOverlay = document.getElementById("admin-user-modal-overlay");

  if (closeModalBtn && !closeModalBtn.dataset.bound) {
    closeModalBtn.dataset.bound = "true";
    closeModalBtn.addEventListener("click", closeAdminUserModal);
  }
  if (cancelModalBtn && !cancelModalBtn.dataset.bound) {
    cancelModalBtn.dataset.bound = "true";
    cancelModalBtn.addEventListener("click", closeAdminUserModal);
  }
  if (modalOverlay && !modalOverlay.dataset.bound) {
    modalOverlay.dataset.bound = "true";
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeAdminUserModal();
    });
  }

  // 5. Сохранение данных пользователя (CRUD)
  const userEditForm = document.getElementById("admin-user-edit-form");
  if (userEditForm && !userEditForm.dataset.bound) {
    userEditForm.dataset.bound = "true";
    userEditForm.addEventListener("submit", handleSaveAdminUser);
  }

  // 6. Пересчёт волонтёрских часов
  const recalcHoursBtn = document.getElementById("btn-admin-recalc-hours");
  if (recalcHoursBtn && !recalcHoursBtn.dataset.bound) {
    recalcHoursBtn.dataset.bound = "true";
    recalcHoursBtn.addEventListener("click", () => {
      const users = getAdminUsers();
      const totalHours = users.reduce((sum, u) => sum + (Number(u.hours) || 0), 0);
      showToast(`✓ Баланс волонтёрских часов пересчитан. Всего подтверждено: ${totalHours} ч.`, "success");
      renderAdminOverview();
      renderAdminHours();
    });
  }

  // 7. Создание курса из вкладки админки
  const createCourseBtn = document.getElementById("btn-admin-create-course");
  if (createCourseBtn && !createCourseBtn.dataset.bound) {
    createCourseBtn.dataset.bound = "true";
    createCourseBtn.addEventListener("click", () => {
      const modal = document.getElementById("modal-overlay");
      if (modal) {
        modal.hidden = false;
        modal.classList.remove("is-hidden");
      }
    });
  }

  // 8. Переключатели тестовой роли в шапке админ-панели (RBAC Testing)
  document.querySelectorAll(".btn-role-toggle[data-set-role]").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      const targetRole = btn.getAttribute("data-set-role");
      localStorage.setItem("digitalMentor_testRole", targetRole);
      updateRoleUI();

      if (targetRole !== "admin") {
        showToast(
          `Роль аккаунта изменена на «${getUserRole()}». Проверка Middleware безопасности...`,
          "info"
        );
        setTimeout(() => {
          // Запуск проверки роута: не-админ получит 403 Forbidden и будет перенаправлен на дашборд
          const currentHash = window.location.hash;
          if (currentHash.includes("admin")) {
            window.location.hash = "#/dashboard";
            showToast(
              `403 Forbidden: Доступ к /admin отклонён для роли «${getUserRole()}». Перенаправление на главную страницу.`,
              "error"
            );
          }
        }, 300);
      } else {
        showToast("✓ Включен режим Root Администратора. Полный доступ к панели открыт.", "success");
      }
    });
  });

  // 9. Клик по плашке роли в хедере: быстрое переключение ролей для удобного тестирования
  const headerRolePill = document.getElementById("role-pill");
  if (headerRolePill && !headerRolePill.dataset.boundRoleToggle) {
    headerRolePill.dataset.boundRoleToggle = "true";
    headerRolePill.style.cursor = "pointer";
    headerRolePill.addEventListener("click", () => {
      const currentRole = getUserRole();
      let nextRole = "admin";
      if (currentRole === "Администратор") nextRole = "student";
      else if (currentRole === "Ученик") nextRole = "mentor";
      else nextRole = "admin";

      localStorage.setItem("digitalMentor_testRole", nextRole);
      updateRoleUI();
      const roleName = getUserRole();
      showToast(`Роль переключена на: ${roleName}`, "info");

      if (window.location.hash.includes("admin") && nextRole !== "admin") {
        window.location.hash = "#/dashboard";
        showToast(
          `403 Forbidden: Доступ к разделу администратора закрыт для роли «${roleName}».`,
          "error"
        );
      }
    });
  }

  // Первоначальный рендер данных админки
  if (typeof syncAdminUsersFromCloud === "function") {
    syncAdminUsersFromCloud();
  }
  renderAdminDashboard();
}

function renderAdminDashboard() {
  renderAdminOverview();
  renderAdminUsers();
  renderAdminHours();
  renderAdminCourses();
}

function renderAdminOverview() {
  const users = getAdminUsers();
  const hours = getAdminHours();
  const courses = typeof getCourses === "function" ? getCourses() : [];

  const totalUsersEl = document.getElementById("admin-stat-total-users");
  const activeMentorsEl = document.getElementById("admin-stat-active-mentors");
  const totalHoursEl = document.getElementById("admin-stat-total-hours");
  const totalLessonsEl = document.getElementById("admin-stat-total-lessons");

  const mentorsCount = users.filter((u) => u.role === "Ментор").length;
  const totalHoursSum = users.reduce((acc, u) => acc + (Number(u.hours) || 0), 0);
  const verifiedRequestsCount = hours.filter((h) => h.status === "verified").length;

  if (totalUsersEl) totalUsersEl.textContent = users.length;
  if (activeMentorsEl) activeMentorsEl.textContent = mentorsCount;
  if (totalHoursEl) totalHoursEl.textContent = `${totalHoursSum.toFixed(1)} ч.`;
  if (totalLessonsEl) totalLessonsEl.textContent = Math.max(courses.length * 4 + verifiedRequestsCount, 24);

  // Список аудита событий
  const activityListEl = document.getElementById("admin-activity-list");
  if (activityListEl) {
    const activities = [
      {
        icon: "✓",
        text: "Верифицировано занятие ментора Айгерим Муратовой (+1.0 ч. в профиль)",
        time: "15 мин назад"
      },
      {
        icon: "👤",
        text: "Пользователь Дамир Жумабеков назначен к ментору Айгерим Муратова",
        time: "40 мин назад"
      },
      {
        icon: "📚",
        text: "Опубликован новый курс: Digital SAT Math Prep (модуль 2)",
        time: "2 часа назад"
      },
      {
        icon: "🛡️",
        text: "Система безопасности Middleware: аудит ролей без замечаний",
        time: "Сегодня, 10:00"
      }
    ];

    activityListEl.innerHTML = activities
      .map(
        (act) => `
        <div class="admin-activity-item">
          <div class="activity-icon-badge">${act.icon}</div>
          <div class="activity-info">
            <p>${escapeHtml(act.text)}</p>
            <span>${escapeHtml(act.time)}</span>
          </div>
        </div>
      `
      )
      .join("");
  }
}

function renderAdminUsers() {
  const users = getAdminUsers();
  const searchInput = document.getElementById("admin-user-search-input");
  const roleFilter = document.getElementById("admin-user-role-filter");
  const tbody = document.getElementById("admin-users-tbody");
  const tabCountBadge = document.getElementById("admin-users-tab-count");

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedRole = roleFilter ? roleFilter.value : "all";

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.subject && u.subject.toLowerCase().includes(query));

    const matchRole =
      selectedRole === "all" ||
      u.role.toLowerCase() === selectedRole.toLowerCase();

    return matchSearch && matchRole;
  });

  if (tabCountBadge) {
    tabCountBadge.textContent = users.length;
  }

  if (!tbody) return;

  if (filteredUsers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 32px; color: var(--muted);">
          Пользователи по заданным критериям не найдены.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredUsers
    .map((user) => {
      // Инициалы для аватара
      const parts = user.name.split(" ");
      const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : user.name.slice(0, 2).toUpperCase();

      // Класс бейджа роли
      let roleBadgeClass = "badge-role--student";
      if (user.role === "Администратор") roleBadgeClass = "badge-role--admin";
      else if (user.role === "Ментор") roleBadgeClass = "badge-role--mentor";

      // Класс статуса
      const isBlocked = user.status === "blocked";
      const statusBadgeClass = isBlocked ? "badge-status--blocked" : "badge-status--active";
      const statusText = isBlocked ? "Заблокирован" : "Активен";

      return `
        <tr data-user-id="${user.id}">
          <td>
            <div class="admin-user-cell">
              <div class="user-table-avatar">${initials}</div>
              <div>
                <strong>${escapeHtml(user.name)}</strong>
                ${user.hours ? `<span style="font-size: 11px; color: #0284C7; display: block;">Волонтёрских часов: ${user.hours} ч.</span>` : ""}
              </div>
            </div>
          </td>
          <td>
            <span style="font-family: monospace; font-size: 12.5px;">${escapeHtml(user.email)}</span>
          </td>
          <td>
            <span class="badge-role ${roleBadgeClass}">${escapeHtml(user.role)}</span>
          </td>
          <td>
            <div style="font-size: 13px;">
              <span>${escapeHtml(user.grade || "—")}</span>
              <span style="color: var(--muted); display: block; font-size: 11.5px;">${escapeHtml(user.subject || "Самостоятельно")}</span>
            </div>
          </td>
          <td>
            <span style="font-size: 12px; color: var(--muted);">${escapeHtml(user.loginDate || "Недавно")}</span>
          </td>
          <td>
            <span class="badge-status ${statusBadgeClass}">${statusText}</span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 6px; align-items: center;">
              <button type="button" class="btn-action-icon" data-edit-user-id="${user.id}" title="Редактировать пользователя">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button type="button" class="btn-action-icon ${isBlocked ? 'btn-action-icon--unblock' : 'btn-action-icon--block'}" data-toggle-user-id="${user.id}" title="${isBlocked ? 'Разблокировать' : 'Заблокировать доступ'}">
                ${isBlocked ? `
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  </svg>
                ` : `
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                `}
              </button>
              <button type="button" class="btn-action-icon btn-action-icon--delete" data-delete-user-id="${user.id}" title="Удалить аккаунт">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  // Делегирование событий на кнопки действий
  tbody.querySelectorAll("[data-edit-user-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openAdminUserModal(btn.getAttribute("data-edit-user-id"));
    });
  });

  tbody.querySelectorAll("[data-toggle-user-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleAdminUserStatus(btn.getAttribute("data-toggle-user-id"));
    });
  });

  tbody.querySelectorAll("[data-delete-user-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteAdminUser(btn.getAttribute("data-delete-user-id"));
    });
  });
}

function renderAdminHours() {
  const hours = getAdminHours();
  const tbody = document.getElementById("admin-hours-tbody");
  const pendingCountBadge = document.getElementById("admin-pending-hours-count");

  const pendingCount = hours.filter((h) => h.status === "pending").length;
  if (pendingCountBadge) {
    pendingCountBadge.textContent = pendingCount;
    pendingCountBadge.style.display = pendingCount > 0 ? "inline-flex" : "none";
  }

  if (!tbody) return;

  if (hours.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 32px; color: var(--muted);">
          Нет активных заявок на подтверждение волонтёрских часов.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = hours
    .map((req) => {
      const isPending = req.status === "pending";

      return `
        <tr data-req-id="${req.id}">
          <td>
            <strong>${escapeHtml(req.mentorName)}</strong>
            <span style="font-size: 11.5px; color: var(--muted); display: block;">${escapeHtml(req.mentorEmail)}</span>
          </td>
          <td>
            <span style="font-weight: 600; font-size: 13px;">${escapeHtml(req.subject)}</span>
          </td>
          <td>
            <span style="font-size: 12.5px;">${escapeHtml(req.audience)}</span>
          </td>
          <td>
            <div style="font-size: 12px;">
              <span>${escapeHtml(req.date)}</span>
              <span style="color: var(--muted); display: block;">${escapeHtml(req.time)}</span>
            </div>
          </td>
          <td>
            <span class="badge-duration">+${req.duration} ч.</span>
          </td>
          <td>
            ${isPending ? `
              <span class="badge-status badge-status--pending">Ожидает проверки</span>
            ` : `
              <span class="badge-status badge-status--verified">Подтверждено</span>
            `}
          </td>
          <td style="text-align: right;">
            ${isPending ? `
              <button type="button" class="btn-meet-primary" style="padding: 6px 12px; font-size: 12px;" data-verify-hour-id="${req.id}">
                ✓ Подтвердить (+${req.duration} ч.)
              </button>
            ` : `
              <span style="color: #10B981; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Верифицировано
              </span>
            `}
          </td>
        </tr>
      `;
    })
    .join("");

  tbody.querySelectorAll("[data-verify-hour-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      verifyAdminHour(btn.getAttribute("data-verify-hour-id"));
    });
  });
}

function verifyAdminHour(reqId) {
  const hours = getAdminHours();
  const req = hours.find((h) => h.id === reqId);
  if (!req) return;

  req.status = "verified";
  saveAdminHours(hours);

  // Добавляем подтверждённые часы в профиль ментора в списке пользователей
  const users = getAdminUsers();
  const mentor = users.find(
    (u) => u.name === req.mentorName || u.email === req.mentorEmail
  );
  if (mentor) {
    mentor.hours = Number(mentor.hours || 0) + Number(req.duration || 1);
    saveAdminUsers(users);
  }

  // Обновляем отображение часов в блоке наставника, если пользователь авторизован как этот ментор
  const hoursDisplay = document.getElementById("volunteer-hours-display");
  if (hoursDisplay && mentor) {
    hoursDisplay.textContent = `${mentor.hours} ч.`;
  }

  showToast(
    `✓ Волонтёрские часы (+${req.duration} ч.) успешно начислены ментору ${req.mentorName}!`,
    "success"
  );

  renderAdminHours();
  renderAdminOverview();
}

function renderAdminCourses() {
  const courses = typeof getCourses === "function" ? getCourses() : [];
  const tbody = document.getElementById("admin-courses-tbody");
  if (!tbody) return;

  if (courses.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 32px; color: var(--muted);">
          Нет доступных курсов. Нажмите кнопку «+ Создать новый курс».
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = courses
    .map((course) => {
      return `
        <tr data-course-id="${course.id}">
          <td>
            <strong>${escapeHtml(course.name)}</strong>
            <span style="font-size: 11.5px; color: var(--muted); display: block;">
              ${course.topics && course.topics.length ? course.topics.slice(0, 2).join(", ") : "Базовая программа"}
            </span>
          </td>
          <td>
            <span class="badge-role badge-role--mentor" style="font-size: 11px;">
              ${escapeHtml(course.programName || "1-на-1")}
            </span>
          </td>
          <td>
            <span>${escapeHtml(course.grade || "10-11")} класс</span>
          </td>
          <td>
            <span style="font-weight: 500;">${escapeHtml(course.mentor || "Назначается")}</span>
          </td>
          <td>
            <span style="font-size: 12.5px;">${course.studentsCount || 1} / ${course.maxStudents || 4} мест</span>
          </td>
          <td>
            <span class="badge-status badge-status--active">Идёт набор</span>
          </td>
          <td style="text-align: right;">
            <button type="button" class="btn-action-icon btn-action-icon--delete" data-admin-del-course-id="${course.id}" title="Удалить курс">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  tbody.querySelectorAll("[data-admin-del-course-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const courseId = btn.getAttribute("data-admin-del-course-id");
      showConfirmDialog(
        "Удаление курса",
        "Вы действительно хотите удалить данный академический курс?",
        () => {
          let updated = getCourses().filter((c) => c.id !== courseId);
          saveCourses(updated);
          showToast("Курс успешно удалён из каталога платформы", "success");
          renderAdminCourses();
          if (typeof renderCourses === "function") renderCourses();
        },
        null,
        { danger: true, confirmText: "Удалить" }
      );
    });
  });
}

function openAdminUserModal(userId = null) {
  const overlay = document.getElementById("admin-user-modal-overlay");
  const title = document.getElementById("admin-user-modal-title");
  const saveBtn = document.getElementById("save-admin-user-btn");

  const idInput = document.getElementById("admin-edit-user-id");
  const nameInput = document.getElementById("admin-edit-user-name");
  const emailInput = document.getElementById("admin-edit-user-email");
  const roleSelect = document.getElementById("admin-edit-user-role");
  const gradeSelect = document.getElementById("admin-edit-user-grade");
  const subjectSelect = document.getElementById("admin-edit-user-subject");
  const hoursInput = document.getElementById("admin-edit-user-hours");
  const mentorSelect = document.getElementById("admin-edit-user-mentor");
  const statusSelect = document.getElementById("admin-edit-user-status");

  // Заполняем список менторов для выбора
  if (mentorSelect) {
    const users = getAdminUsers();
    const mentors = users.filter((u) => u.role === "Ментор");
    mentorSelect.innerHTML = `<option value="">Не назначен (Самостоятельное обучение)</option>` +
      mentors.map((m) => `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)} (${escapeHtml(m.subject || "Ментор")})</option>`).join("");
  }

  if (userId) {
    // Режим редактирования
    const users = getAdminUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (title) title.textContent = "Редактирование профиля пользователя";
    if (saveBtn) saveBtn.textContent = "Сохранить изменения";

    if (idInput) idInput.value = user.id;
    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (roleSelect) roleSelect.value = user.role || "Ученик";
    if (gradeSelect) gradeSelect.value = user.grade || "10 класс";
    if (subjectSelect) subjectSelect.value = user.subject || "Алгебра";
    if (hoursInput) hoursInput.value = user.hours || 0;
    if (mentorSelect) mentorSelect.value = user.mentor || "";
    if (statusSelect) statusSelect.value = user.status || "active";
  } else {
    // Режим создания нового пользователя
    if (title) title.textContent = "Добавление нового пользователя";
    if (saveBtn) saveBtn.textContent = "Создать пользователя";

    if (idInput) idInput.value = "";
    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    if (roleSelect) roleSelect.value = "Ученик";
    if (gradeSelect) gradeSelect.value = "10 класс";
    if (subjectSelect) subjectSelect.value = "Алгебра";
    if (hoursInput) hoursInput.value = 0;
    if (mentorSelect) mentorSelect.value = "";
    if (statusSelect) statusSelect.value = "active";
  }

  if (overlay) {
    overlay.hidden = false;
    overlay.classList.remove("is-hidden");
  }
}

function closeAdminUserModal() {
  const overlay = document.getElementById("admin-user-modal-overlay");
  if (overlay) {
    overlay.classList.add("is-hidden");
    setTimeout(() => {
      overlay.hidden = true;
    }, 200);
  }
}

function handleSaveAdminUser(e) {
  e.preventDefault();
  const id = document.getElementById("admin-edit-user-id").value;
  const name = document.getElementById("admin-edit-user-name").value.trim();
  const email = document.getElementById("admin-edit-user-email").value.trim();
  const role = document.getElementById("admin-edit-user-role").value;
  const grade = document.getElementById("admin-edit-user-grade").value;
  const subject = document.getElementById("admin-edit-user-subject").value;
  const hours = parseFloat(document.getElementById("admin-edit-user-hours").value) || 0;
  const mentor = document.getElementById("admin-edit-user-mentor").value;
  const status = document.getElementById("admin-edit-user-status").value;

  if (!name || !email) {
    showToast("Пожалуйста, заполните имя и email пользователя", "error");
    return;
  }

  const users = getAdminUsers();

  if (id) {
    // Обновление существующего пользователя
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        name,
        email,
        role,
        grade,
        subject,
        hours,
        mentor,
        status
      };
      saveAdminUsers(users);
      showToast(`✓ Профиль пользователя «${name}» успешно обновлён`, "success");
    }
  } else {
    // Добавление нового пользователя
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      grade,
      subject,
      hours,
      mentor,
      status,
      loginDate: "Только что"
    };
    users.unshift(newUser);
    saveAdminUsers(users);
    showToast(`✓ Новый пользователь «${name}» успешно добавлен в систему`, "success");
  }

  closeAdminUserModal();
  renderAdminUsers();
  renderAdminOverview();
}

function toggleAdminUserStatus(userId) {
  const users = getAdminUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const newStatus = user.status === "blocked" ? "active" : "blocked";
  user.status = newStatus;
  saveAdminUsers(users);

  showToast(
    `Статус пользователя ${user.name} изменён: ${newStatus === "active" ? "Активен (доступ открыт)" : "Заблокирован"}`,
    newStatus === "active" ? "success" : "info"
  );

  renderAdminUsers();
}

function deleteAdminUser(userId) {
  const users = getAdminUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  showConfirmDialog(
    "Удаление пользователя",
    `Вы действительно хотите безвозвратно удалить пользователя «${user.name}» (${user.email})?`,
    () => {
      const updated = users.filter((u) => u.id !== userId);
      saveAdminUsers(updated);
      showToast(`Пользователь «${user.name}» удалён из базы платформы`, "success");
      renderAdminUsers();
      renderAdminOverview();
    },
    null,
    { danger: true, confirmText: "Удалить" }
  );
}


