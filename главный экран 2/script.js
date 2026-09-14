// Начальные демонстрационные курсы
const DEFAULT_COURSES = [
  {
    id: 1,
    name: "Алгебра",
    grade: "10",
    maxStudents: 4,
    startDate: "2026-09-15",
    mentor: "Школьник-волонтёр · Ментор назначен",
  },
  {
    id: 2,
    name: "Английский язык",
    grade: "11",
    maxStudents: 5,
    startDate: "2026-09-18",
    mentor: "Школьник-волонтёр · Ментор назначен",
  },
  {
    id: 3,
    name: "Информатика",
    grade: "9",
    maxStudents: 3,
    startDate: "2026-09-20",
    mentor: "Школьник-волонтёр · Ментор назначен",
  },
];

const STORAGE_KEY = "digitalMentor_activeCourses";
const USER_PROFILE_KEY = "digitalMentor_userProfile";

// Получить текущую роль пользователя (Ментор или Ученик)
function getUserRole() {
  try {
    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    if (profileData) {
      const parsed = JSON.parse(profileData);
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
  return "Ученик"; // По умолчанию — ученик
}

// Получить курсы из localStorage или вернуть дефолтные
function getCourses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Ошибка чтения localStorage", e);
  }
  return DEFAULT_COURSES;
}

// Сохранить курсы в localStorage
function saveCourses(courses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error("Ошибка записи в localStorage", e);
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

// Обновление интерфейса в зависимости от роли (Ментор или Ученик)
function updateRoleUI() {
  const role = getUserRole();
  const isMentor = role === "Ментор";

  const openModalBtn = document.getElementById("open-modal-btn");
  const viewOnlyBadge = document.getElementById("view-only-badge");
  const rolePill = document.getElementById("role-pill");
  const rolePillText = document.getElementById("role-pill-text");
  const emptyStateText = document.querySelector("#empty-state p");

  if (rolePillText) {
    rolePillText.textContent = isMentor ? "Роль: Ментор" : "Роль: Ученик";
  }

  if (rolePill) {
    rolePill.classList.toggle("is-mentor", isMentor);
    rolePill.title = isMentor
      ? "Вы вошли как ментор — вам доступно добавление и управление курсами"
      : "Вы вошли как ученик — доступен только просмотр курсов";
  }

  const openScheduleModalBtn = document.getElementById("open-schedule-modal-btn");

  if (isMentor) {
    // Ментор: может добавлять курсы и планировать уроки
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
  switch (name) {
    case "Алгебра":
      return `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="19" x2="20" y2="19"></line>
          <line x1="4" y1="5" x2="20" y2="5"></line>
          <line x1="18" y1="5" x2="6" y2="19"></line>
        </svg>`;
    case "Английский язык":
      return `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>`;
    case "Информатика":
      return `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>`;
    default:
      return `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>`;
  }
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

// Отрисовка списка курсов
function renderCourses() {
  const courses = getCourses();
  const isMentor = getUserRole() === "Ментор";
  const grid = document.getElementById("courses-grid");
  const countEl = document.getElementById("courses-count");
  const emptyState = document.getElementById("empty-state");

  countEl.textContent = pluralizeCourses(courses.length);

  if (courses.length === 0) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  grid.innerHTML = courses
    .map((course) => {
      const iconSvg = getSubjectIcon(course.name);

      // Крестик удаления виден только ментору
      const deleteButtonHtml = isMentor
        ? `
            <button class="btn-card-delete" onclick="removeCourse(event, '${course.id}')" type="button" title="Удалить курс" aria-label="Удалить курс">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          `
        : "";

      const maxStudents = course.maxStudents || 3;
      const startDateFormatted = formatDateDisplay(course.startDate);

      return `
        <article class="course-card" data-id="${course.id}">
          <div class="course-card-top">
            <div class="course-subject-icon" aria-hidden="true">
              ${iconSvg}
            </div>
            <span class="course-badge-grade">${escapeHtml(course.grade)} класс</span>
            ${deleteButtonHtml}
          </div>

          <div class="course-card-body">
            <h3>${escapeHtml(course.name)}</h3>
            <p>${escapeHtml(course.mentor || "Школьник-волонтёр · Ментор назначен")}</p>
            
            <div class="course-meta-tags">
              <span class="meta-tag meta-students">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                до ${maxStudents} учеников
              </span>
              <span class="meta-tag meta-date">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Старт: ${startDateFormatted}
              </span>
            </div>
          </div>

          <div class="course-card-footer">
            <div class="course-status">
              <span class="course-status-dot"></span>
              Активен
            </div>
            <button class="btn-course-action" type="button">Материалы</button>
          </div>
        </article>
      `;
    })
    .join("");
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

// Удаление курса (только для ментора)
window.removeCourse = function (event, id) {
  if (event) {
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  if (getUserRole() !== "Ментор") {
    alert("Удаление курсов доступно только менторам.");
    return;
  }

  const targetId = String(id);
  const courses = getCourses().filter((c) => String(c.id) !== targetId);
  saveCourses(courses);
  renderCourses();
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
    alert("Добавлять активные курсы может только ментор. В профиле переключите роль на «Ментор», чтобы управлять курсами.");
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
    alert("Добавление курсов разрешено только менторам.");
    closeModal();
    return;
  }

  const name = courseNameSelect.value.trim();
  const grade = courseGradeSelect.value.trim();
  const maxStudents = parseInt(courseMaxStudentsSelect ? courseMaxStudentsSelect.value : "3", 10);
  const startDate = courseStartDateInput ? courseStartDateInput.value : "";

  if (!name || !grade) {
    alert("Пожалуйста, выберите название курса и класс.");
    return;
  }

  if (isNaN(maxStudents) || maxStudents < 2 || maxStudents > 5) {
    alert("Количество учеников должно быть от 2 до 5.");
    return;
  }

  if (!startDate) {
    alert("Пожалуйста, укажите дату начала курса.");
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
    alert("Планировать уроки могут только менторы.");
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
      alert("Планирование уроков доступно только менторам.");
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
      alert("Пожалуйста, заполните все обязательные поля урока.");
      return;
    }

    const day_key = getDayKeyFromDate(lesson_date);

    // Получаем имя текущего ментора из профиля
    let mentorName = "Данияр Нургалиев";
    try {
      const p = localStorage.getItem(USER_PROFILE_KEY);
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
      mentor_id: "default_mentor",
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
      alert("✅ Урок успешно запланирован и появился в общем расписании!");
      await loadAndRenderAllScheduleAndStats();
    } catch (err) {
      alert("Ошибка при создании урока: " + err.message);
    } finally {
      const submitBtn = document.getElementById("submit-lesson-btn");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Завершение урока ментором и начисление часов (без всплывающих окон)
window.handleCompleteLesson = async function (event, lessonId, durationHours) {
  if (event) {
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
  }

  if (getUserRole() !== "Ментор") return;

  const duration = parseFloat(durationHours) || 1.0;

  // Визуальная индикация выполнения на кнопке
  const clickedBtn = event && event.currentTarget ? event.currentTarget : null;
  if (clickedBtn) {
    clickedBtn.disabled = true;
    clickedBtn.textContent = "Обновление...";
  }

  try {
    if (window.SupabaseService) {
      await window.SupabaseService.completeLesson(lessonId, duration);
    }
    // Бесшовное мгновенное обновление расписания и волонтёрских часов
    await loadAndRenderAllScheduleAndStats();
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
            <button class="btn-complete-lesson" onclick="handleCompleteLesson(event, '${lesson.id}', ${lesson.duration_hours || 1.0})" type="button" title="Отметить проведение и получить волонтёрские часы">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Завершить урок</span>
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
      alert("📚 Презентация и методические материалы к уроку открыты для скачивания.");
    });
  });
}

// Обновление UI волонтёрских часов и достижений в реальном времени
function updateVolunteerStatsUI(stats) {
  const hours = parseFloat(stats.volunteer_hours) || 0;
  const completedCount = parseInt(stats.lessons_completed, 10) || 0;
  const rating = parseFloat(stats.rating) || 5.0;

  const hoursDisplay = document.getElementById("volunteer-hours-display");
  const progressFill = document.getElementById("volunteer-progress-fill");
  const lessonsCount = document.getElementById("stat-lessons-count");
  const ratingDisplay = document.getElementById("stat-rating-display");
  const unlockedPill = document.getElementById("achievements-unlocked-pill");

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

  if (ratingDisplay) {
    ratingDisplay.textContent = completedCount > 0 ? `★ ${rating.toFixed(1)}` : `★ —`;
  }

  // Расчёт открытых бейджей
  let unlocked = 0;
  if (completedCount >= 1) unlocked++;
  if (completedCount >= 10) unlocked++;
  if (hours >= 40) unlocked++;

  if (unlockedPill) {
    unlockedPill.textContent = `${unlocked} из 6 получено`;
  }
}

// Главная функция загрузки данных из облака и отрисовки
async function loadAndRenderAllScheduleAndStats() {
  if (!window.SupabaseService) return;

  try {
    const [lessons, stats] = await Promise.all([
      window.SupabaseService.getLessons(),
      window.SupabaseService.getMentorStats(),
    ]);

    currentLessonsData = lessons || [];
    renderScheduleLessons(currentLessonsData);

    if (stats) {
      updateVolunteerStatsUI(stats);
    }
  } catch (err) {
    console.error("Ошибка обновления расписания и часов:", err);
  }
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

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  updateRoleUI();
  renderCourses();
  initScheduleInteractivity();
  loadAndRenderAllScheduleAndStats();

  // Живая подписка на обновления Supabase Realtime
  if (window.SupabaseService) {
    window.SupabaseService.subscribe(() => {
      loadAndRenderAllScheduleAndStats();
    });
  }
});

// Обновление при возврате со страницы профиля (bfcache)
window.addEventListener("pageshow", () => {
  updateRoleUI();
  renderCourses();
  loadAndRenderAllScheduleAndStats();
});

// Синхронизация между вкладками при изменении профиля
window.addEventListener("storage", (e) => {
  if (e.key === USER_PROFILE_KEY || e.key === STORAGE_KEY) {
    updateRoleUI();
    renderCourses();
    loadAndRenderAllScheduleAndStats();
  }
});

updateRoleUI();
renderCourses();
initScheduleInteractivity();
loadAndRenderAllScheduleAndStats();

