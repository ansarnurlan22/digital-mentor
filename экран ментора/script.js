const DEFAULT_PROFILE = {
  name: "Алина Касымова",
  telegram: "alina_mentor",
  school: "Школа-лицей №1",
  subject: "Математика, Информатика, Английский",
  role: "Ментор",
};

function fromQuery() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("name")) return null;
  return {
    name: params.get("name") || "",
    school: params.get("school") || "",
    subject: params.get("subject") || "",
    role: params.get("role") || "",
    telegram: params.get("telegram") || "",
  };
}

function fromStorage() {
  try {
    const raw = sessionStorage.getItem("mentorProfile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readProfile() {
  return { ...DEFAULT_PROFILE, ...(fromQuery() || fromStorage() || {}) };
}

function initials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "М";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function telegramHandle(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const withoutUrl = raw.replace(/^https?:\/\/t\.me\//i, "");
  return withoutUrl.startsWith("@") ? withoutUrl : `@${withoutUrl}`;
}

function subjectsList(subject) {
  return String(subject)
    .split(/[,;/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const profile = readProfile();
const handle = telegramHandle(profile.telegram);
const subjects = subjectsList(profile.subject);
const isMentor = /ментор/i.test(profile.role);

document.getElementById("avatar-initials").textContent = initials(profile.name);
document.getElementById("profile-name").textContent = profile.name;
document.getElementById("profile-name-value").textContent = profile.name;
document.getElementById("profile-school").textContent = profile.school;
document.getElementById("profile-role").textContent = isMentor
  ? "Школьник-волонтёр · Астана"
  : `${profile.role} · Астана`;
document.querySelector(".eyebrow").textContent = isMentor
  ? "Профиль ментора"
  : `Профиль: ${profile.role}`;

const telegramEl = document.getElementById("profile-telegram");
if (handle) {
  telegramEl.textContent = handle;
  telegramEl.href = `https://t.me/${handle.slice(1)}`;
} else {
  telegramEl.replaceWith(
    Object.assign(document.createElement("span"), { textContent: "Не указано" })
  );
}

const list = document.getElementById("profile-subjects");
list.replaceChildren(
  ...subjects.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  })
);
