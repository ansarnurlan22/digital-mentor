'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRoutePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-mono text-xs text-[var(--muted)]">
      Перенаправление в учебный кабинет...
    </div>
  );
}
