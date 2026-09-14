const googleLoginBtn = document.getElementById("google-login-btn");
const headerLoginBtn = document.getElementById("header-login-btn");
const statusEl = document.getElementById("auth-status");

async function handleGoogleLogin() {
  if (statusEl) {
    statusEl.hidden = false;
    statusEl.style.color = "#72f2a5";
    statusEl.textContent = "Подключение к Google...";
  }

  // Проверка протокола запуска (Google OAuth не работает по file://)
  if (window.location.protocol === "file:") {
    if (statusEl) {
      statusEl.style.color = "#fbbf24";
      statusEl.innerHTML =
        "⚠️ <strong>Google OAuth требует запуск через веб-сервер:</strong><br>" +
        "Браузеры блокируют авторизацию Google при открытии страницы из папки (протокол <code>file://</code>).<br><br>" +
        "1. Запустите проект через локальный сервер (например, в VS Code / Antigravity через расширение <strong>Live Server</strong> или команду <code>npx serve</code>).<br>" +
        "2. Либо опубликуйте проект в интернете (Vercel / Cloudflare Pages).<br><br>" +
        "<a href='../главный экран 2/index.html' style='color:#6ec8ff;font-weight:700;text-decoration:underline;'>Перейти в приложение без входа (демо-режим) →</a>";
    }
    return;
  }

  if (googleLoginBtn) {
    googleLoginBtn.disabled = true;
    googleLoginBtn.style.opacity = "0.75";
  }
  if (headerLoginBtn) {
    headerLoginBtn.disabled = true;
    headerLoginBtn.style.opacity = "0.75";
  }

  try {
    if (!window.SupabaseService) {
      throw new Error("Supabase сервис не загрузился. Проверьте интернет-соединение.");
    }

    if (statusEl) {
      statusEl.textContent = "Перенаправление на страницу входа Google...";
    }

    await window.SupabaseService.signInWithGoogle();
  } catch (err) {
    console.error("Ошибка входа через Google:", err);
    if (statusEl) {
      statusEl.style.color = "#f87171";
      statusEl.textContent = "Ошибка авторизации: " + (err.message || err);
    }
    if (googleLoginBtn) {
      googleLoginBtn.disabled = false;
      googleLoginBtn.style.opacity = "1";
    }
    if (headerLoginBtn) {
      headerLoginBtn.disabled = false;
      headerLoginBtn.style.opacity = "1";
    }
  }
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", handleGoogleLogin);
}

if (headerLoginBtn) {
  headerLoginBtn.addEventListener("click", handleGoogleLogin);
}
