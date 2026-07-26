import React from 'react';
import { ArrowDown, Shuffle, RotateCcw } from 'lucide-react';
import { formatDezena } from '../utils/tdzGenerator';

interface FixasInputProps {
  row1: string[];
  row2: string[];
  drawnNumbers: string[];
  acertosCount: number;
  onRow1Change: (index: number, value: string) => void;
  onRow2Change: (index: number, value: string) => void;
  onRandomizeFixas: () => void;
  onClearFixas: () => void;
}

export const FixasInput: React.FC<FixasInputProps> = ({
  row1,
  row2,
  drawnNumbers,
  acertosCount,
  onRow1Change,
  onRow2Change,
  onRandomizeFixas,
  onClearFixas,
}) => {
  const drawnSet = new Set(drawnNumbers.map(formatDezena).filter(Boolean));

  // Check for duplicates across all fixas
  const allValues = [...row1, ...row2].map(formatDezena).filter(Boolean);
  const counts: Record<string, number> = {};
  allValues.forEach(val => {
    counts[val] = (counts[val] || 0) + 1;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      {/* Header section with Title and Red Acertos Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="flex text-red-500 font-extrabold text-lg sm:text-xl">
            <ArrowDown className="w-5 h-5 animate-bounce text-red-500" />
            <ArrowDown className="w-5 h-5 animate-bounce text-red-500 delay-100" />
            <ArrowDown className="w-5 h-5 animate-bounce text-red-500 delay-200" />
          </div>
          <h2 id="title-fixas" className="text-sm sm:text-base md:text-lg font-black uppercase text-white tracking-wider">
            DIGITE AQUI SUAS 20 DEZENAS FIXAS
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick actions */}
          <button
            id="btn-random-fixas"
            onClick={onRandomizeFixas}
            title="Gerar 20 dezenas fixas aleatórias"
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Aleatório</span>
          </button>

          <button
            id="btn-clear-fixas"
            onClick={onClearFixas}
            title="Limpar dezenas fixas"
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Red Acertos Box matching the spreadsheet image */}
          <div id="box-acertos-fixas" className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow">
            <span className="px-2.5 py-1 text-xs font-bold uppercase text-slate-300 bg-slate-800">
              Acertos
            </span>
            <span className="px-3 py-1 text-lg font-black bg-red-600 text-white min-w-[40px] text-center">
              {acertosCount}
            </span>
          </div>
        </div>
      </div>

      {/* 10 Columns of Pairs Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px] grid grid-cols-10 gap-2 text-center">
          {Array.from({ length: 10 }).map((_, colIdx) => {
            const val1 = row1[colIdx] || '';
            const val2 = row2[colIdx] || '';
            const formatted1 = formatDezena(val1);
            const formatted2 = formatDezena(val2);

            const isHit1 = formatted1 && drawnSet.has(formatted1);
            const isHit2 = formatted2 && drawnSet.has(formatted2);

            const isDup1 = formatted1 && (counts[formatted1] || 0) > 1;
            const isDup2 = formatted2 && (counts[formatted2] || 0) > 1;

            return (
              <div
                key={colIdx}
                className="flex flex-col gap-1.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 hover:border-amber-500/30 transition group"
              >
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-400 transition uppercase tracking-wider">
                  PAR {colIdx + 1}
                </span>

                {/* Input Row 1 */}
                <div className="relative">
                  <input
                    id={`input-fixa-r1-${colIdx}`}
                    type="text"
                    maxLength={2}
                    value={val1}
                    onChange={(e) => onRow1Change(colIdx, e.target.value)}
                    placeholder="00"
                    className={`w-full text-center py-2 px-1 text-sm sm:text-base font-black rounded-lg transition-all outline-none border ${
                      isHit1
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                        : isDup1
                        ? 'bg-rose-950 text-rose-300 border-rose-500'
                        : 'bg-slate-900 text-amber-300 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                    }`}
                  />
                </div>

                {/* Input Row 2 */}
                <div className="relative">
                  <input
                    id={`input-fixa-r2-${colIdx}`}
                    type="text"
                    maxLength={2}
                    value={val2}
                    onChange={(e) => onRow2Change(colIdx, e.target.value)}
                    placeholder="00"
                    className={`w-full text-center py-2 px-1 text-sm sm:text-base font-black rounded-lg transition-all outline-none border ${
                      isHit2
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                        : isDup2
                        ? 'bg-rose-950 text-rose-300 border-rose-500'
                        : 'bg-slate-900 text-amber-300 border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-slate-400 text-center mt-2">
        Cada coluna forma 1 Par Fixo. Total = 10 Pares (20 dezenas fixas).
      </p>
    </div>
  );
};
