import type { Metadata } from 'next';
import { AppLayout } from '../src/components/Layout/AppLayout';

export const metadata: Metadata = {
  title: 'Digital Mentor — Академическое наставничество',
  description: 'Платформа соединения школьников-волонтёров с учениками для подготовки к СОР/СОЧ и наставничества.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#080E1E' }}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
