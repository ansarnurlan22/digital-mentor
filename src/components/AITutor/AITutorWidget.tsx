import React, { useState } from 'react';
import { UserProfile } from './types';
import { mockStudentProfile, getActiveStudentProfile } from './mockProfile';
import { AITutorFloatingButton } from './AITutorFloatingButton';
import { AITutorDrawer } from './AITutorDrawer';

interface AITutorWidgetProps {
  customProfile?: Partial<UserProfile>;
}

/**
 * Главный корневой компонент AI-тьютора в стиле Quizlet Q-Chat
 * Включает плавающую кнопку (FAB) и выдвижную панель (Drawer) с тремя режимами:
 * 1. 💡 Тьютор (Сократовский диалог без готовых ответов)
 * 2. ⚡ Экспресс-квиз (1 вопрос за раз с валидацией)
 * 3. 📖 Теория и формулы (интерактивная шпаргалка)
 */
export const AITutorWidget: React.FC<AITutorWidgetProps> = ({ customProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Профиль ученика: пропсы -> localStorage -> моковый профиль Матвея (11 класс, Алгебра)
  const baseProfile = getActiveStudentProfile();
  const profile: UserProfile = {
    ...baseProfile,
    ...customProfile,
  };

  return (
    <>
      <AITutorFloatingButton
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      <AITutorDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        profile={profile}
      />
    </>
  );
};
