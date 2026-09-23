const STORAGE_KEY = "digitalMentor_userProfile";

const DEFAULT_PROFILE = {
  name: "Алина Касымова",
  grade: "10 класс",
  subject: "Информатика",
  role: "Ученик",
};

// Загрузка данных профиля
function getProfile() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
    // Если есть данные в sessionStorage от входа
    const sessionMentor = sessionStorage.getItem("mentorProfile");
    if (sessionMentor) {
      const parsed = JSON.parse(sessionMentor);
      return {
        name: parsed.name || DEFAULT_PROFILE.name,
        grade: DEFAULT_PROFILE.grade,
        subject: parsed.subject ? parsed.subject.split(",")[0].trim() : DEFAULT_PROFILE.subject,
        role: parsed.role || DEFAULT_PROFILE.role,
      };
    }
  } catch (e) {
    console.error("Ошибка чтения профиля", e);
  }
  return { ...DEFAULT_PROFILE };
}

// Сохранение данных профиля
function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Ошибка сохранения профиля", e);
  }
}

// Расчет инициалов
function getInitials(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "DM";
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// Уведомление о сохранении
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("status-toast");
  const textEl = document.getElementById("toast-text");
  if (!toast || !textEl) return;

  textEl.textContent = message;
  toast.hidden = false;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

// Текущее состояние профиля и редактирования строк
const currentProfile = getProfile();
const editingState = {
  name: false,
  grade: false,
  subject: false,
  role: false,
};

// SVG-иконки
const ICONS = {
  edit: `
    <svg class="action-icon edit-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>`,
  confirm: `
    <svg class="action-icon confirm-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`,
};

// Первичная отрисовка данных
function renderProfile() {
  document.getElementById("val-name").textContent = currentProfile.name;
  document.getElementById("val-grade").textContent = currentProfile.grade;
  document.getElementById("val-subject").textContent = currentProfile.subject;
  document.getElementById("val-role").textContent = currentProfile.role;

  document.getElementById("profile-display-name").textContent = currentProfile.name;
  document.getElementById("profile-display-role").textContent = currentProfile.role;
  document.getElementById("avatar-initials").textContent = getInitials(currentProfile.name);
}

// Настройка кнопок редактирования / подтверждения
function setupField(fieldKey, getValueFromInput, setInputFromValue) {
  const row = document.getElementById(`row-${fieldKey}`);
  const viewEl = document.getElementById(`view-${fieldKey}`);
  const editEl = document.getElementById(`edit-${fieldKey}`);
  const btn = document.getElementById(`btn-${fieldKey}`);

  if (!row || !btn || !viewEl || !editEl) return;

  // Роль фиксируется лишь 1 раз при регистрации и не может быть изменена
  if (fieldKey === "role" && (currentProfile.roleLocked || currentProfile.isConfigured)) {
    btn.innerHTML = `<span style="font-size:14px; margin-right:4px;">🔒</span><span class="action-text">Зафиксировано</span>`;
    btn.style.opacity = "0.75";
    btn.style.cursor = "not-allowed";
    btn.title = "Роль определена при регистрации и не может быть изменена";
    btn.addEventListener("click", () => {
      showToast("Роль определена при регистрации и не может быть изменена");
    });
    return;
  }

  btn.addEventListener("click", () => {
    const isEditing = editingState[fieldKey];

    if (!isEditing) {
      // Переход в режим редактирования
      editingState[fieldKey] = true;
      row.classList.add("is-editing");
      viewEl.hidden = true;
      editEl.hidden = false;

      setInputFromValue(currentProfile[fieldKey]);

      btn.classList.add("btn-confirm");
      btn.innerHTML = `${ICONS.confirm}<span class="action-text">Подтвердить</span>`;

      // Фокус на поле ввода
      const firstInput = editEl.querySelector("input, select");
      if (firstInput) firstInput.focus();
    } else {
      // Подтверждение и сохранение
      const newValue = getValueFromInput();
      if (typeof newValue === "string" && !newValue.trim()) {
        alert("Поле не может быть пустым");
        return;
      }

      currentProfile[fieldKey] = newValue;
      saveProfile(currentProfile);

      // Обновление интерфейса
      editingState[fieldKey] = false;
      row.classList.remove("is-editing");
      viewEl.hidden = false;
      editEl.hidden = true;

      btn.classList.remove("btn-confirm");
      btn.innerHTML = `${ICONS.edit}<span class="action-text">Редактировать</span>`;

      renderProfile();
      showToast(`Поле «${getFieldTitle(fieldKey)}» обновлено`);
    }
  });
}

function getFieldTitle(key) {
  switch (key) {
    case "name":
      return "Имя пользователя";
    case "grade":
      return "Класс";
    case "subject":
      return "Предмет";
    case "role":
      return "Выбор ментор/ученик";
    default:
      return "Поле";
  }
}

// Инициализация строк
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();

  // 1. Имя пользователя
  setupField(
    "name",
    () => document.getElementById("input-name").value.trim(),
    (val) => {
      document.getElementById("input-name").value = val;
    }
  );

  // Нажатие Enter в поле имени подтверждает изменения
  document.getElementById("input-name").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("btn-name").click();
    }
  });

  // 2. Класс (если ученик)
  setupField(
    "grade",
    () => document.getElementById("select-grade").value,
    (val) => {
      const select = document.getElementById("select-grade");
      if ([...select.options].some((o) => o.value === val)) {
        select.value = val;
      } else {
        select.value = "10 класс";
      }
    }
  );

  // 3. Предмет
  setupField(
    "subject",
    () => document.getElementById("select-subject").value,
    (val) => {
      const select = document.getElementById("select-subject");
      if ([...select.options].some((o) => o.value === val)) {
        select.value = val;
      } else {
        select.value = "Информатика";
      }
    }
  );

  // 4. Выбор ментор/ученик
  setupField(
    "role",
    () => {
      const checked = document.querySelector('input[name="input-role"]:checked');
      return checked ? checked.value : "Ученик";
    },
    (val) => {
      const radio = document.querySelector(`input[name="input-role"][value="${val}"]`);
      if (radio) radio.checked = true;
    }
  );

  // 5. Выход из аккаунта (строка в красной палитре с подтверждением)
  const rowLogout = document.getElementById("row-logout");
  const btnLogoutInit = document.getElementById("btn-logout-init");
  const viewLogout = document.getElementById("view-logout");
  const confirmLogoutView = document.getElementById("confirm-logout-view");
  const logoutConfirmGroup = document.getElementById("logout-confirm-group");
  const btnLogoutCancel = document.getElementById("btn-logout-cancel");
  const btnLogoutConfirm = document.getElementById("btn-logout-confirm");

  if (btnLogoutInit && rowLogout) {
    btnLogoutInit.addEventListener("click", () => {
      rowLogout.classList.add("is-confirming");
      if (viewLogout) viewLogout.hidden = true;
      if (confirmLogoutView) confirmLogoutView.hidden = false;
      btnLogoutInit.hidden = true;
      if (logoutConfirmGroup) logoutConfirmGroup.hidden = false;
    });

    if (btnLogoutCancel) {
      btnLogoutCancel.addEventListener("click", () => {
        rowLogout.classList.remove("is-confirming");
        if (viewLogout) viewLogout.hidden = false;
        if (confirmLogoutView) confirmLogoutView.hidden = true;
        btnLogoutInit.hidden = false;
        if (logoutConfirmGroup) logoutConfirmGroup.hidden = true;
      });
    }

    if (btnLogoutConfirm) {
      btnLogoutConfirm.addEventListener("click", () => {
        sessionStorage.removeItem("mentorProfile");
        window.location.href = "../главный экран/index.html";
      });
    }
  }
});
