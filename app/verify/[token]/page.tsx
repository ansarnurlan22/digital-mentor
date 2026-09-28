'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, Award, Clock, ArrowLeft, CheckCircle2, QrCode, FileText } from 'lucide-react';
import { ThemeToggle } from '../../../src/components/ThemeToggle';

export default function VerificationPage() {
  const params = useParams();
  const token = (params?.token as string) || 'DM-MENTOR-2026';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Digital Mentor Platform</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Certificate Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top verified ribbon */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight">
                  Официальный сертификат верификации
                </h1>
                <p className="text-xs text-[var(--muted)] font-mono">
                  Digital Mentor Academic Volunteering Registry
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified 100%</span>
            </span>
          </div>

          {/* Certificate Body */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)]">
                    Волонтер-наставник
                  </span>
                  <div className="text-lg font-bold text-[var(--foreground)] mt-0.5">
                    Ансар Нурлан
                  </div>
                  <div className="text-xs text-blue-400 font-mono mt-0.5">
                    Статус: Старший академический ментор (SAT & СОР/СОЧ)
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)]">
                    Подтвержденные часы
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    24.5 ч.
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">
                    98 решенных микро-тикетов
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-3 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[var(--muted)] text-[10px] block uppercase">Идентификатор токена:</span>
                  <span className="font-semibold text-[var(--foreground)]">{token}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] text-[10px] block uppercase">Дата выдачи:</span>
                  <span className="font-semibold text-[var(--foreground)]">28.09.2026 18:00 UTC</span>
                </div>
              </div>
            </div>

            {/* Architecture description */}
            <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)] space-y-2 text-xs text-[var(--muted)] leading-relaxed">
              <div className="flex items-center gap-2 text-[var(--foreground)] font-semibold font-mono text-[11px] uppercase">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Методология начисления волонтёрских часов</span>
              </div>
              <p>
                Часы начислены за разрешение академических микро-тикетов в рамках открытой образовательной платформы Digital Mentor. Каждый закрытый тикет представляет собой индивидуальный разбор математического решения ученика и тарифицируется по 15 минут академического волонтерского вклада.
              </p>
            </div>
          </div>

          {/* Footer with Cryptographic Seal */}
          <div className="border-t border-[var(--border)] pt-4 flex items-center justify-between text-xs text-[var(--muted)] font-mono">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>SHA256: 9b2d8e41a... verified</span>
            </div>
            <Link
              href="/mentors/tickets"
              className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>К очереди тикетов</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
