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
    window.supabaseClient = supabaseClient;
    console.log("✅ Supabase успешно инициализирован:", SUPABASE_URL);
  } else {
    console.warn("Библиотека Supabase не найдена на странице, fallback на локальный режим.");
  }
} catch (err) {
  console.error("Ошибка инициализации Supabase:", err);
}

// Начальные демо-уроки на случай первого запуска с пустой базой
function getInitialDemoLessons() {
  const now = new Date();
  const formatYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDayKey = (d) => {
    const map = { 0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat" };
    return map[d.getDay()] || "mon";
  };

  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 1);

  const nextDate1 = new Date(now);
  nextDate1.setDate(now.getDate() + 1);

  const nextDate2 = new Date(now);
  nextDate2.setDate(now.getDate() + 3);

  return [
    {
      id: "lesson-demo-1",
      subject: "Алгебра",
      grade: "11",
      title: "Логарифмические неравенства и ОДЗ",
      mentor_name: "Айбек С. (Олимпиадник)",
      mentor_id: "mentor-aibek",
      day_key: getDayKey(pastDate),
      lesson_date: formatYMD(pastDate),
      start_time: "16:00",
      end_time: "17:00",
      duration_hours: 1.0,
      meet_url: "https://meet.google.com",
      status: "completed"
    },
    {
      id: "lesson-demo-2",
      subject: "Алгебра",
      grade: "11",
      title: "Подготовка к СОР №2 (Показательные уравнения)",
      mentor_name: "Айбек С. (Олимпиадник)",
      mentor_id: "mentor-aibek",
      day_key: getDayKey(nextDate1),
      lesson_date: formatYMD(nextDate1),
      start_time: "17:00",
      end_time: "18:00",
      duration_hours: 1.0,
      meet_url: "https://meet.google.com",
      status: "scheduled"
    },
    {
      id: "lesson-demo-3",
      subject: "Информатика",
      grade: "9-11",
      title: "Олимпиадные алгоритмы на Python: Графы и DFS",
      mentor_name: "Арман Т. (Разработчик)",
      mentor_id: "mentor-arman",
      day_key: getDayKey(nextDate2),
      lesson_date: formatYMD(nextDate2),
      start_time: "15:00",
      end_time: "16:30",
      duration_hours: 1.5,
      meet_url: "https://meet.google.com",
      status: "scheduled"
    }
  ];
}

const INITIAL_DEMO_LESSONS = getInitialDemoLessons();

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

      return data || [];
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

  // 2.1. Удалить предстоящий урок (доступно менторам)
  async deleteLesson(lessonId) {
    // Удаляем из локального кэша
    const local = this.getLocalLessons();
    const updated = local.filter((l) => String(l.id) !== String(lessonId));
    localStorage.setItem("dm_cloud_lessons_cache", JSON.stringify(updated));

    if (!supabaseClient) {
      return true;
    }

    try {
      const { error } = await supabaseClient
        .from("lessons")
        .delete()
        .eq("id", lessonId);

      if (error) {
        console.error("Ошибка удаления урока из Supabase:", error);
        throw error;
      }
      return true;
    } catch (err) {
      console.error("Ошибка в deleteLesson:", err);
      throw err;
    }
  },

  // 3. Завершить урок и АВТОМАТИЧЕСКИ начислить часы конкретному ментору
  async completeLesson(lessonId, durationHours = 1.0, targetMentorId = null) {
    const duration = parseFloat(durationHours) || 1.0;
    const currentUserId = await this.getCurrentUserId();
    const mentorId = targetMentorId || currentUserId;

    // А) Обновляем статус урока на 'completed'
    if (supabaseClient) {
      const { error: lessonErr } = await supabaseClient
        .from("lessons")
        .update({ status: "completed" })
        .eq("id", lessonId);

      if (lessonErr) console.error("Ошибка обновления статуса урока:", lessonErr);

      // Б) Получаем статистику именно этого ментора (по его Google ID / mentorId)
      const { data: statsData, error: statsErr } = await supabaseClient
        .from("mentor_stats")
        .select("*")
        .eq("id", mentorId)
        .maybeSingle();

      const currentHours = statsData ? parseFloat(statsData.volunteer_hours) || 0 : 0;
      const currentCompleted = statsData ? parseInt(statsData.lessons_completed, 10) || 0 : 0;
      const newHours = Math.round((currentHours + duration) * 10) / 10;
      const newCompleted = currentCompleted + 1;

      let mentorName = "Волонтёр-наставник";
      try {
        const user = await this.getCurrentUser();
        if (user) {
          mentorName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email.split("@")[0];
        }
      } catch (e) {}

      if (statsData) {
        const { error: updateErr } = await supabaseClient
          .from("mentor_stats")
          .update({
            volunteer_hours: newHours,
            lessons_completed: newCompleted,
            updated_at: new Date().toISOString(),
          })
          .eq("id", mentorId);

        if (updateErr) console.error("Ошибка обновления часов ментора:", updateErr);
      } else {
        const { error: insertErr } = await supabaseClient
          .from("mentor_stats")
          .insert([
            {
              id: mentorId,
              mentor_name: mentorName,
              volunteer_hours: newHours,
              lessons_completed: newCompleted,
              students_count: 0,
              rating: 5.0,
              updated_at: new Date().toISOString(),
            },
          ]);

        if (insertErr) console.error("Ошибка создания статистики ментора:", insertErr);
      }

      const result = {
        volunteer_hours: newHours,
        lessons_completed: newCompleted,
        students_count: 0,
        rating: 5.0,
      };
      this.setLocalStats(mentorId, result);
      return result;
    } else {
      // Fallback на локальный кэш пользователя
      const localStats = this.getLocalStats(mentorId);
      localStats.volunteer_hours =
        Math.round(((parseFloat(localStats.volunteer_hours) || 0) + duration) * 10) / 10;
      localStats.lessons_completed =
        (parseInt(localStats.lessons_completed, 10) || 0) + 1;
      this.setLocalStats(mentorId, localStats);
      return localStats;
    }
  },

  // 4. Получить статистику волонтёрских часов конкретного ментора
  async getMentorStats(customUserId = null) {
    const userId = customUserId || (await this.getCurrentUserId());
    if (!supabaseClient) return this.getLocalStats(userId);

    try {
      const { data, error } = await supabaseClient
        .from("mentor_stats")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Если для данного Google-аккаунта ещё нет записи в базе — создаём чистую запись с 0 часов
        let mentorName = "Волонтёр-наставник";
        try {
          const user = await this.getCurrentUser();
          if (user) {
            mentorName =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email.split("@")[0];
          }
        } catch (e) {}

        const initialStats = {
          id: userId,
          mentor_name: mentorName,
          volunteer_hours: 0,
          lessons_completed: 0,
          students_count: 0,
          rating: 5.0,
          updated_at: new Date().toISOString(),
        };

        try {
          await supabaseClient.from("mentor_stats").insert([initialStats]);
        } catch (err) {
          console.warn("Авто-инициализация mentor_stats:", err);
        }

        this.setLocalStats(userId, initialStats);
        return initialStats;
      }

      this.setLocalStats(userId, data);
      return data;
    } catch (err) {
      console.warn(`Ошибка чтения mentor_stats для пользователя ${userId}:`, err);
      return this.getLocalStats(userId);
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

  // Получить ID текущего пользователя (Google Auth UUID или локальный гостевой ID)
  async getCurrentUserId() {
    const user = await this.getCurrentUser();
    if (user && user.id) return user.id;

    let guestId = localStorage.getItem("dm_local_user_id");
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("dm_local_user_id", guestId);
    }
    return guestId;
  },

  // Локальные методы fallback с привязкой к ID аккаунта
  getLocalLessons() {
    try {
      const cached = localStorage.getItem("dm_cloud_lessons_cache");
      if (cached !== null) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
      const initial = getInitialDemoLessons();
      localStorage.setItem("dm_cloud_lessons_cache", JSON.stringify(initial));
      return initial;
    } catch (e) {
      return getInitialDemoLessons();
    }
  },

  getLocalStats(userId = "default") {
    try {
      const key = `dm_cloud_stats_${userId}`;
      const cached = localStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return { volunteer_hours: 0, lessons_completed: 0, students_count: 0, rating: 5.0 };
  },

  setLocalStats(userId = "default", stats) {
    try {
      localStorage.setItem(`dm_cloud_stats_${userId}`, JSON.stringify(stats));
    } catch (e) {}
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
      // Всегда направляем в основной интерфейс приложения
      const origin = window.location.origin;
      targetUrl = origin + "/главный%20экран%202/index.html";
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: targetUrl,
      },
    });

    if (error) throw error;
    if (data && data.url) {
      window.location.href = data.url;
    }
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

  // 6. Облачная синхронизация профилей пользователей для панели администратора
  async syncCloudProfile(userProfile) {
    if (!supabaseClient || !userProfile || !userProfile.email) return;
    try {
      const email = userProfile.email.toLowerCase().trim();
      const profileId = "usr_" + email.replace(/[^a-zA-Z0-9_-]/g, "_");
      const payload = {
        id: profileId,
        google_id: userProfile.google_id || userProfile.id || "",
        name: userProfile.name || (email.split("@")[0]),
        email: email,
        role: userProfile.role || "Ученик",
        grade: userProfile.grade || "10 класс",
        subject: userProfile.subject || "Алгебра",
        mentor: userProfile.mentor || "",
        status: userProfile.status || "active",
        hours: Number(userProfile.hours) || 0,
        loginDate: userProfile.loginDate || new Date().toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      };

      await supabaseClient
        .from("mentor_stats")
        .upsert(
          [
            {
              id: profileId,
              mentor_name: JSON.stringify(payload),
              volunteer_hours: Number(userProfile.hours) || 0,
              lessons_completed: 0,
              students_count: 0,
              rating: 5.0
            }
          ],
          { onConflict: "id" }
        );
      console.log("☁️ Профиль пользователя успешно синхронизирован с Supabase:", email);
    } catch (e) {
      console.warn("syncCloudProfile error:", e);
    }
  },

  // Получить всех пользователей, зарегистрированных через Google или сохранённых в облаке
  async getCloudUsers() {
    if (!supabaseClient) return [];
    try {
      const { data, error } = await supabaseClient
        .from("mentor_stats")
        .select("*");

      if (error || !Array.isArray(data)) return [];

      const users = [];
      data.forEach((row) => {
        if (!row.id || !row.mentor_name) return;
        if (row.id === "global_active_courses" || row.id.startsWith("global_")) return;

        try {
          const parsed = JSON.parse(row.mentor_name);
          if (parsed && (parsed.email || parsed.name)) {
            users.push({
              id: parsed.id || row.id,
              name: parsed.name || "Пользователь",
              email: parsed.email || (row.id.includes("@") ? row.id : `${row.id.slice(0, 8)}@google.user`),
              role: parsed.role || "Ученик",
              grade: parsed.grade || "10 класс",
              subject: parsed.subject || "Алгебра",
              mentor: parsed.mentor || "",
              hours: typeof parsed.hours === "number" ? parsed.hours : (Number(row.volunteer_hours) || 0),
              status: parsed.status || "active",
              loginDate: parsed.loginDate || (row.updated_at ? new Date(row.updated_at).toLocaleDateString("ru-RU") : "Недавно")
            });
            return;
          }
        } catch (e) {}

        if (row.mentor_name && row.mentor_name.trim() && !row.mentor_name.startsWith("{") && !row.mentor_name.startsWith("[")) {
          users.push({
            id: row.id,
            name: row.mentor_name,
            email: row.id.includes("@") ? row.id : `${row.id.slice(0, 8)}@google.user`,
            role: Number(row.volunteer_hours) > 0 ? "Ментор" : "Ученик",
            grade: "10 класс",
            subject: "Общий курс",
            mentor: "",
            hours: Number(row.volunteer_hours) || 0,
            status: "active",
            loginDate: row.updated_at ? new Date(row.updated_at).toLocaleDateString("ru-RU") : "Недавно"
          });
        }
      });
      return users;
    } catch (e) {
      console.warn("getCloudUsers error:", e);
      return [];
    }
  },

  // 7. Облачная синхронизация курсов между всеми устройствами
  async saveCloudCourses(courses) {
    if (!supabaseClient || !Array.isArray(courses)) return;
    try {
      await supabaseClient
        .from("mentor_stats")
        .upsert(
          [
            {
              id: "global_active_courses",
              mentor_name: JSON.stringify(courses),
              volunteer_hours: courses.length,
              lessons_completed: 0,
              students_count: 0,
              rating: 5.0
            }
          ],
          { onConflict: "id" }
        );
      console.log("☁️ Все курсы синхронизированы в облако Supabase:", courses.length);
    } catch (e) {
      console.warn("saveCloudCourses error:", e);
    }
  },

  async getCloudCourses() {
    if (!supabaseClient) return null;
    try {
      const { data, error } = await supabaseClient
        .from("mentor_stats")
        .select("mentor_name")
        .eq("id", "global_active_courses")
        .maybeSingle();

      if (!error && data && data.mentor_name) {
        const parsed = JSON.parse(data.mentor_name);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("getCloudCourses error:", e);
    }
    return null;
  },

  // Выход из аккаунта
  async signOut() {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.error("Ошибка signOut:", e);
      }
    }
    sessionStorage.removeItem("mentorProfile");
    window.location.href = "../главный%20экран/index.html";
  },
};
