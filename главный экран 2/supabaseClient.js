// ============================================================
// Supabase Service: Облачная база данных и Realtime-синхронизация
// ============================================================

const SUPABASE_URL = "https://tltankihglovzfvveyif.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdGFua2loZ2xvdnpmdnZleWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMzk4MDEsImV4cCI6MjEwNDcxNTgwMX0.yrmziZFnKC95DBDhYdS20CslpWV4l-BtzkWSV4WG0so";

// Инициализация официального клиента Supabase
let supabaseClient = null;
try {
  if (window.supabase && typeof window.supabase.createClient === "function") {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase успешно инициализирован:", SUPABASE_URL);
  } else {
    console.warn("Библиотека Supabase не найдена на странице, fallback на локальный режим.");
  }
} catch (err) {
  console.error("Ошибка инициализации Supabase:", err);
}

// Начальные демо-уроки на случай первого запуска с пустой базой
const INITIAL_DEMO_LESSONS = [
  {
    subject: "Информатика",
    grade: "10 класс",
    title: "Алгоритмы поиска и структуры данных на Python",
    mentor_name: "Данияр Нургалиев",
    mentor_id: "default_mentor",
    day_key: "tue",
    lesson_date: "2026-09-15",
    start_time: "16:30",
    end_time: "17:30",
    duration_hours: 1.0,
    meet_url: "https://meet.google.com",
    status: "live",
  },
  {
    subject: "Алгебра",
    grade: "10 класс",
    title: "Тригонометрические формулы и решение уравнений",
    mentor_name: "Алия Сарсенова",
    mentor_id: "default_mentor",
    day_key: "wed",
    lesson_date: "2026-09-16",
    start_time: "15:00",
    end_time: "16:15",
    duration_hours: 1.25,
    meet_url: "https://meet.google.com",
    status: "scheduled",
  },
  {
    subject: "Английский язык",
    grade: "11 класс",
    title: "IELTS Speaking Part 2 & 3: Стратегии высоких баллов",
    mentor_name: "Малика Серикова",
    mentor_id: "default_mentor",
    day_key: "fri",
    lesson_date: "2026-09-18",
    start_time: "17:00",
    end_time: "18:00",
    duration_hours: 1.0,
    meet_url: "https://meet.google.com",
    status: "scheduled",
  },
];

window.SupabaseService = {
  client: supabaseClient,

  // 1. Получить список всех уроков
  async getLessons() {
    if (!supabaseClient) return this.getLocalLessons();
    try {
      const { data, error } = await supabaseClient
        .from("lessons")
        .select("*")
        .order("lesson_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;

      // Если база ещё пустая — заполним начальными демо-уроками
      if (!data || data.length === 0) {
        await this.seedInitialLessons();
        return this.getLessons();
      }

      return data;
    } catch (err) {
      console.error("Ошибка получения уроков из Supabase:", err);
      return this.getLocalLessons();
    }
  },

  // Заполнить пустую базу начальными уроками
  async seedInitialLessons() {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from("lessons").insert(INITIAL_DEMO_LESSONS);
      console.log("База данных наполнена начальными уроками");
    } catch (e) {
      console.warn("Не удалось инициализировать демо-уроки:", e);
    }
  },

  // 2. Добавить новый урок от ментора
  async createLesson(lessonData) {
    if (!supabaseClient) {
      const local = this.getLocalLessons();
      const newLesson = { id: Date.now(), ...lessonData };
      local.push(newLesson);
      localStorage.setItem("dm_cloud_lessons_cache", JSON.stringify(local));
      return newLesson;
    }

    const { data, error } = await supabaseClient
      .from("lessons")
      .insert([lessonData])
      .select();

    if (error) {
      console.error("Ошибка добавления урока в Supabase:", error);
      throw error;
    }
    return data && data[0] ? data[0] : lessonData;
  },

  // 3. Завершить урок и АВТОМАТИЧЕСКИ начислить часы ментору
  async completeLesson(lessonId, durationHours = 1.0) {
    const duration = parseFloat(durationHours) || 1.0;

    // А) Обновляем статус урока на 'completed'
    if (supabaseClient) {
      const { error: lessonErr } = await supabaseClient
        .from("lessons")
        .update({ status: "completed" })
        .eq("id", lessonId);

      if (lessonErr) console.error("Ошибка обновления статуса урока:", lessonErr);

      // Б) Получаем текущие часы и прибавляем duration
      const { data: statsData, error: statsErr } = await supabaseClient
        .from("mentor_stats")
        .select("*")
        .eq("id", "default_mentor")
        .single();

      const currentHours = statsData ? parseFloat(statsData.volunteer_hours) || 0 : 0;
      const currentCompleted = statsData ? parseInt(statsData.lessons_completed, 10) || 0 : 0;
      const newHours = Math.round((currentHours + duration) * 10) / 10;
      const newCompleted = currentCompleted + 1;

      const { error: updateErr } = await supabaseClient
        .from("mentor_stats")
        .update({
          volunteer_hours: newHours,
          lessons_completed: newCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq("id", "default_mentor");

      if (updateErr) console.error("Ошибка начисления часов ментора:", updateErr);

      return { volunteer_hours: newHours, lessons_completed: newCompleted };
    } else {
      // Fallback на локальный кэш
      const localStats = this.getLocalStats();
      localStats.volunteer_hours = (parseFloat(localStats.volunteer_hours) || 0) + duration;
      localStats.lessons_completed = (parseInt(localStats.lessons_completed, 10) || 0) + 1;
      localStorage.setItem("dm_cloud_stats_cache", JSON.stringify(localStats));
      return localStats;
    }
  },

  // 4. Получить статистику волонтёрских часов ментора
  async getMentorStats() {
    if (!supabaseClient) return this.getLocalStats();
    try {
      const { data, error } = await supabaseClient
        .from("mentor_stats")
        .select("*")
        .eq("id", "default_mentor")
        .single();

      if (error) throw error;
      return data || { volunteer_hours: 0, lessons_completed: 0, students_count: 0, rating: 5.0 };
    } catch (err) {
      console.warn("Ошибка чтения mentor_stats, используем кэш:", err);
      return this.getLocalStats();
    }
  },

  // 5. Подписка на Realtime-изменения (уроки и часы)
  subscribe(onChangeCallback) {
    if (!supabaseClient) {
      // Локальная подписка между вкладками
      window.addEventListener("storage", (e) => {
        if (e.key === "dm_cloud_lessons_cache" || e.key === "dm_cloud_stats_cache") {
          onChangeCallback();
        }
      });
      return;
    }

    try {
      supabaseClient
        .channel("digital-mentor-realtime-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "lessons" },
          (payload) => {
            console.log("⚡ Realtime обновление уроков:", payload);
            onChangeCallback({ table: "lessons", payload });
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "mentor_stats" },
          (payload) => {
            console.log("⚡ Realtime обновление часов ментора:", payload);
            onChangeCallback({ table: "mentor_stats", payload });
          }
        )
        .subscribe((status) => {
          console.log("Статус подключения Realtime WebSockets:", status);
        });
    } catch (e) {
      console.error("Ошибка подписки на Realtime:", e);
    }
  },

  // Локальные методы fallback
  getLocalLessons() {
    try {
      const cached = localStorage.getItem("dm_cloud_lessons_cache");
      return cached ? JSON.parse(cached) : INITIAL_DEMO_LESSONS;
    } catch (e) {
      return INITIAL_DEMO_LESSONS;
    }
  },

  getLocalStats() {
    try {
      const cached = localStorage.getItem("dm_cloud_stats_cache");
      return cached
        ? JSON.parse(cached)
        : { volunteer_hours: 0, lessons_completed: 0, students_count: 0, rating: 5.0 };
    } catch (e) {
      return { volunteer_hours: 0, lessons_completed: 0, students_count: 0, rating: 5.0 };
    }
  },

  // Авторизация через Google OAuth
  async signInWithGoogle(customRedirect) {
    if (!supabaseClient) {
      throw new Error("Supabase не инициализирован. Проверьте подключение к интернету.");
    }

    if (window.location.protocol === "file:") {
      throw new Error(
        "Google OAuth не поддерживает открытие страницы как файла (file://).\n\n" +
        "Google требует запуска через веб-сервер: например, http://localhost:5500 или http://127.0.0.1:5500 (Live Server в VS Code / Antigravity), либо через опубликованный домен на Vercel."
      );
    }

    let targetUrl = customRedirect;
    if (!targetUrl) {
      const current = window.location.href;
      if (current.includes("главный%20экран/index.html") || current.includes("главный экран/index.html")) {
        targetUrl = current.replace(/главный(%20| )экран\/index\.html/, "главный$1экран 2/index.html");
      } else {
        targetUrl = window.location.origin + window.location.pathname;
      }
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: targetUrl,
      },
    });

    if (error) throw error;
    return data;
  },

  // Получить текущего авторизованного пользователя
  async getCurrentUser() {
    if (!supabaseClient) return null;
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session || !session.user) return null;
      return session.user;
    } catch (e) {
      return null;
    }
  },

  // Подписка на изменения состояния авторизации
  onAuthStateChange(callback) {
    if (!supabaseClient) return;
    try {
      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (typeof callback === "function") {
          callback(event, session);
        }
      });
    } catch (e) {
      console.error("Ошибка onAuthStateChange:", e);
    }
  },

  // Выход из аккаунта
  async signOut() {
    if (!supabaseClient) return;
    try {
      await supabaseClient.auth.signOut();
    } catch (e) {
      console.error("Ошибка signOut:", e);
    }
  },
};
