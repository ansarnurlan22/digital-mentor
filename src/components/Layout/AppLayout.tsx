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

  // If on practice or verify page, render standalone focused view
  const isFocusedPage = pathname?.startsWith('/practice') || pathname?.startsWith('/verify');

  if (isFocusedPage) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans relative overflow-x-hidden transition-colors">
      {/* 1. Постоянный статичный сайдбар слева */}
      <Sidebar />

      {/* 2. Основная область (Хедер + Динамический роутинг) */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMentTutor={() => setIsMentOpen((prev) => !prev)} />

        <main
          key={pathname}
          className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full box-border animate-in fade-in duration-200"
        >
          {children}
        </main>
      </div>

      {/* 3. Постоянный плавающий виджет академического напарника Ment */}
      <GeminiTutorWidget
        isOpenControlled={isMentOpen}
        onCloseControlled={() => setIsMentOpen(false)}
      />
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
