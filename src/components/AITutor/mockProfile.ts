import { UserProfile } from './types';

/**
 * Моковые данные профиля ученика, автоматически передаваемые в контекст AI-агента
 */
export const mockStudentProfile: UserProfile = {
  name: 'Матвей',
  role: 'Ученик',
  grade: '11 класс',
  subject: 'Алгебра',
};

/**
 * Получить профиль из локального хранилища с откатом на моковый
 */
export function getActiveStudentProfile(): UserProfile {
  try {
    const raw = localStorage.getItem('digitalMentor_userProfile');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        name: parsed.name || mockStudentProfile.name,
        role: parsed.role || mockStudentProfile.role,
        grade: parsed.grade || mockStudentProfile.grade,
        subject: parsed.subject || mockStudentProfile.subject,
      };
    }
  } catch (e) {
    console.warn('Не удалось загрузить профиль из localStorage', e);
  }
  return mockStudentProfile;
}
