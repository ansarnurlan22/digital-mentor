'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../src/lib/store';

export default function PracticeRoutePage() {
  const router = useRouter();
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  useEffect(() => {
    setActiveTab('practice');
    router.replace('/');
  }, [router, setActiveTab]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-mono text-xs text-[var(--muted)]">
      Загрузка тренажера практики...
    </div>
  );
}
