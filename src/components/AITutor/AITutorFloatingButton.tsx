import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface AITutorFloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const AITutorFloatingButton: React.FC<AITutorFloatingButtonProps> = ({
  isOpen,
  onClick,
  unreadCount = 0,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Приветственный бейдж-подсказка для ученика */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            onClick={onClick}
            className="hidden cursor-pointer items-center gap-2 rounded-2xl border border-sky-400/30 bg-slate-900/90 py-2 pl-3.5 pr-4 text-xs shadow-xl shadow-sky-500/10 backdrop-blur-md transition-transform hover:scale-105 sm:flex"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold text-white">AI-тьютор</span>
            <span className="text-slate-400">· онлайн 24/7</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основная плавающая кнопка */}
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? 'Закрыть AI-тьютор' : 'Открыть AI-тьютор'}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white shadow-xl shadow-sky-500/35 ring-4 ring-sky-400/20 transition-all focus:outline-none"
      >
        {/* Пульсирующее свечение позади кнопки */}
        <span className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 opacity-40 blur-md transition-opacity group-hover:opacity-75" />

        {/* Анимация трансформации Sparkles -> X */}
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          {isOpen ? (
            <X className="h-6 w-6 stroke-[2.5]" />
          ) : (
            <Sparkles className="h-6 w-6 stroke-[2.2]" />
          )}
        </motion.div>

        {/* Бейдж непрочитанных сообщений */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-rose-500 text-[10px] font-bold text-white shadow-md">
            {unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};
