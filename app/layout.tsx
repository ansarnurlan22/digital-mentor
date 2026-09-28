import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../src/components/ThemeProvider';
import { UserProvider } from '../src/context/UserContext';

export const metadata: Metadata = {
  title: 'Digital Mentor — Академическая платформа',
  description: 'Интерактивная практика, менторская поддержка и верифицированные волонтерские часы в строгом минималистичном стиле.',
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
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
