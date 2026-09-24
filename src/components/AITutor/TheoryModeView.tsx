import React, { useState } from 'react';
import { Search, HelpCircle, Copy, Check } from 'lucide-react';
import { ALGEBRA_THEORY_CHEATSHEET } from './mockTheoryData';
import { FormulaRenderer } from './FormulaRenderer';

interface TheoryModeViewProps {
  onAskAboutFormula?: (title: string, latex: string) => void;
}

export const TheoryModeView: React.FC<TheoryModeViewProps> = ({ onAskAboutFormula }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleCopy = (latex: string) => {
    navigator.clipboard?.writeText(latex);
    setCopiedFormula(latex);
    setTimeout(() => setCopiedFormula(null), 1800);
  };

  const filteredCategories = ALGEBRA_THEORY_CHEATSHEET.map((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) return null;
    const formulas = cat.formulas.filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        f.latex.toLowerCase().includes(search.toLowerCase())
    );
    if (!formulas.length) return null;
    return { ...cat, formulas };
  }).filter(Boolean);

  return (
    <div className="flex h-full flex-col p-4">
      {/* Поиск и категории */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск формулы (логарифм, синус, касательная)..."
            className="w-full rounded-xl border border-slate-700/60 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Чипсы категорий */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Все темы
          </button>
          {ALGEBRA_THEORY_CHEATSHEET.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Список формул */}
      <div className="mt-3 flex-1 space-y-4 overflow-y-auto pr-1">
        {filteredCategories.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            Ничего не найдено по запросу «{search}». Попробуйте другое ключевое слово.
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat!.id} className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                <span>{cat!.icon}</span>
                <span>{cat!.name}</span>
              </div>

              {cat!.formulas.map((form, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3.5 shadow-sm transition-all hover:border-slate-600/80 hover:bg-slate-900/90"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-semibold text-slate-100">{form.title}</h5>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleCopy(form.latex)}
                        title="Копировать LaTeX"
                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                      >
                        {copiedFormula === form.latex ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onAskAboutFormula?.(form.title, form.latex)}
                        title="Спросить тьютора по этой формуле"
                        className="rounded-lg p-1 text-sky-400 transition-colors hover:bg-sky-500/10 hover:text-sky-300"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Рендеринг формулы */}
                  <div className="my-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 text-center text-sm font-serif">
                    <FormulaRenderer content={`$$${form.latex}$$`} />
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-400">{form.description}</p>

                  {form.exampleLatex && (
                    <div className="mt-2 rounded-lg bg-sky-950/20 px-2 py-1 text-[11px] text-sky-200">
                      <span className="text-sky-400">Пример: </span>
                      <FormulaRenderer content={`$${form.exampleLatex}$`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
