import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../src/components/ThemeProvider';

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
      <body className="bg-[#090A0F] text-[#FFFFFF] antialiased min-h-screen font-sans">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
