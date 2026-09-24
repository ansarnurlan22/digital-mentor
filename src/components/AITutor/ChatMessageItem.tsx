import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from './types';
import { FormulaRenderer } from './FormulaRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
  onQuickReplyClick?: (text: string) => void;
  onActionClick?: (actionType: string, payload?: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onQuickReplyClick,
  onActionClick,
}) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex w-full gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {/* Аватар ассистента */}
      {isAssistant && (
        <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1px] shadow-lg shadow-sky-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
            <Sparkles className="h-4 w-4 text-sky-400" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
        </div>
      )}

      <div className={`flex max-w-[85%] flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        {/* Пузырь сообщения */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm shadow-md transition-all ${
            isAssistant
              ? 'border border-slate-700/60 bg-slate-900/80 text-slate-100 backdrop-blur-md'
              : 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sky-500/20'
          }`}
        >
          <FormulaRenderer content={message.content} />

          {/* Индикатор стриминга (курсор) */}
          {message.isStreaming && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-1 inline-block h-3 w-1.5 rounded-sm bg-sky-400 align-middle"
            />
          )}

          {/* Метка времени */}
          <div
            className={`mt-1.5 text-[10px] ${
              isAssistant ? 'text-slate-400' : 'text-sky-100/75'
            } text-right`}
          >
            {message.timestamp}
          </div>
        </div>

        {/* Быстрые чипсы-ответы от ассистента */}
        {message.quickReplies && message.quickReplies.length > 0 && !message.isStreaming && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickReplyClick?.(reply)}
                className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300 transition-colors hover:border-sky-400/60 hover:bg-sky-500/20 hover:text-white"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Кнопка рекомендованного действия */}
        {message.suggestedAction && !message.isStreaming && (
          <button
            type="button"
            onClick={() =>
              onActionClick?.(
                message.suggestedAction!.actionType,
                message.suggestedAction?.payload
              )
            }
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {message.suggestedAction.label}
          </button>
        )}
      </div>

      {/* Аватар пользователя */}
      {!isAssistant && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-sky-400/40 bg-slate-800 text-sky-300 shadow-md">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
};
