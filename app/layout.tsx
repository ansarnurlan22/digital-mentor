import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../src/components/ThemeProvider';
import { AppLayout } from '../src/components/Layout/AppLayout';

export const metadata: Metadata = {
  title: 'Digital Mentor — Платформа 70/30 ИИ + Волонтеры',
  description: 'Швейцарский минимализм, микро-тикеты и интерактивные карточки практики для подготовки к SAT Math и СОР/СОЧ.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
