'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '../Navigation/Sidebar';
import { Header } from '../Navigation/Header';
import { GeminiTutorWidget } from '../AITutor/GeminiTutorWidget';
import { UserProvider } from '../../context/UserContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMentOpen, setIsMentOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#080E1E',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Постоянный статичный сайдбар слева */}
      <Sidebar />

      {/* 2. Основная область (Хедер + Динамический роутинг) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Постоянный статичный хедер */}
        <Header onToggleMentTutor={() => setIsMentOpen((prev) => !prev)} />

        {/* Динамическая область контента маршрута с плавной анимацией fade/slide (0.2s) */}
        <main
          key={pathname}
          style={{
            flex: 1,
            padding: '36px',
            maxWidth: '1440px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            animation: 'routeFadeSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {children}
        </main>
      </div>

      {/* 3. Постоянный плавающий виджет академического напарника Ment (сохраняет диалог между переходами) */}
      <GeminiTutorWidget
        isOpenControlled={isMentOpen}
        onCloseControlled={() => setIsMentOpen(false)}
      />

      {/* Глобальные стили анимации для SPA-переходов */}
      <style jsx global>{`
        @keyframes routeFadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <UserProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </UserProvider>
  );
};

export default AppLayout;
