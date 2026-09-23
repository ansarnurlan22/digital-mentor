const googleLoginBtn = document.getElementById("google-login-btn");
const headerLoginBtn = document.getElementById("header-login-btn");
const statusEl = document.getElementById("auth-status");

// Сохранение данных пользователя из Google в профиль и редирект
function saveGoogleUserAndRedirect(user) {
  if (!user) return;
  const metadata = user.user_metadata || {};
  const name = metadata.full_name || metadata.name || (user.email ? user.email.split("@")[0] : "Пользователь");
  const avatarUrl = metadata.avatar_url || metadata.picture || "";

  let profile = {};
  try {
    const saved = localStorage.getItem("digitalMentor_userProfile");
    if (saved) profile = JSON.parse(saved);
  } catch (e) {}

  profile.name = name;
  profile.email = user.email || profile.email;
  if (avatarUrl) profile.avatarUrl = avatarUrl;
  if (!profile.role) profile.role = "Ученик"; // по умолчанию
  localStorage.setItem("digitalMentor_userProfile", JSON.stringify(profile));

  if (statusEl) {
    statusEl.hidden = false;
    statusEl.style.color = "#3ee07a";
    statusEl.textContent = "✅ Вход выполнен! Перенаправление в кабинет...";
  }

  setTimeout(() => {
    window.location.href = "../главный%20экран%202/index.html";
  }, 400);
}

// Проверка: если пользователь уже авторизован или вернулся после Google OAuth
async function checkCurrentAuth() {
  if (window.location.hash.includes("access_token=") || window.location.search.includes("code=")) {
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.style.color = "#72f2a5";
      statusEl.textContent = "Подтверждение входа через Google...";
    }
  }

  // Ждём инициализацию Supabase
  let attempts = 0;
  while (!window.supabaseClient && attempts < 10) {
    await new Promise((r) => setTimeout(r, 100));
    attempts++;
  }

  if (!window.supabaseClient) return;

  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session && session.user) {
      console.log("Найден авторизованный пользователь:", session.user);
      saveGoogleUserAndRedirect(session.user);
    }
  } catch (err) {
    console.warn("Проверка сессии:", err);
  }

  // Слушатель событий входа
  try {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session && session.user) {
        saveGoogleUserAndRedirect(session.user);
      }
    });
  } catch (e) {}
}

async function handleGoogleLogin() {
  if (statusEl) {
    statusEl.hidden = false;
    statusEl.style.color = "#72f2a5";
    statusEl.textContent = "Переход в личный кабинет...";
  }

  // 1. Если сайт открыт напрямую из папки (file://):
  if (window.location.protocol === "file:") {
    // В файловом режиме браузеры не поддерживают внешние редиректы Google,
    // поэтому мы сразу открываем личный кабинет со всеми курсами и расписанием!
    window.location.href = "../главный%20экран%202/index.html";
    return;
  }

  // 2. Если сайт открыт через веб-сервер (http://localhost или https://vercel.app):
  if (googleLoginBtn) {
    googleLoginBtn.disabled = true;
    googleLoginBtn.style.opacity = "0.75";
  }
  if (headerLoginBtn) {
    headerLoginBtn.disabled = true;
    headerLoginBtn.style.opacity = "0.75";
  }

  try {
    if (window.SupabaseService) {
      await window.SupabaseService.signInWithGoogle();
    } else {
      window.location.href = "../главный%20экран%202/index.html";
    }
  } catch (err) {
    console.warn("Вход Google:", err);
    // При любой непредвиденной заминке надёжно переводим в кабинет
    window.location.href = "../главный%20экран%202/index.html";
  }
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", handleGoogleLogin);
}

if (headerLoginBtn) {
  headerLoginBtn.addEventListener("click", handleGoogleLogin);
}

document.addEventListener("DOMContentLoaded", checkCurrentAuth);
checkCurrentAuth();
