import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../src/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Digital Mentor — IT-платформа курсов и практики',
  description: 'Интерактивные курсы, онлайн-практика и отслеживание академических достижений.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen font-sans">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
