import React from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';
import { formatDezena } from '../utils/tdzGenerator';

interface VariaveisInputProps {
  variaveis: string[];
  drawnNumbers: string[];
  acertosCount: number;
  onChange: (index: number, value: string) => void;
  onRandomizeVariaveis: () => void;
  onClearVariaveis: () => void;
}

export const VariaveisInput: React.FC<VariaveisInputProps> = ({
  variaveis,
  drawnNumbers,
  acertosCount,
  onChange,
  onRandomizeVariaveis,
  onClearVariaveis,
}) => {
  const drawnSet = new Set(drawnNumbers.map(formatDezena).filter(Boolean));

  // Check duplicates in variaveis
  const formattedVars = variaveis.map(formatDezena).filter(Boolean);
  const counts: Record<string, number> = {};
  formattedVars.forEach(v => {
    counts[v] = (counts[v] || 0) + 1;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
        <h2 id="title-variaveis" className="text-sm sm:text-base md:text-lg font-black uppercase text-white tracking-wider text-center sm:text-left">
          DIGITE AQUI SUAS 20 DEZENAS VARIÁVEIS
        </h2>

        <div className="flex items-center gap-3">
          <button
            id="btn-random-variaveis"
            onClick={onRandomizeVariaveis}
            title="Gerar 20 dezenas variáveis aleatórias"
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Aleatório</span>
          </button>

          <button
            id="btn-clear-variaveis"
            onClick={onClearVariaveis}
            title="Limpar dezenas variáveis"
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Red Acertos Box matching the spreadsheet image */}
          <div id="box-acertos-variaveis" className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow">
            <span className="px-2.5 py-1 text-xs font-bold uppercase text-slate-300 bg-slate-800">
              Acertos
            </span>
            <span className="px-3 py-1 text-lg font-black bg-red-600 text-white min-w-[40px] text-center">
              {acertosCount}
            </span>
          </div>
        </div>
      </div>

      {/* 20 Variable Input Fields arranged in 2 rows of 10 */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[640px] flex flex-col gap-2">
          {/* Row 1 (V1 to V10) */}
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }).map((_, idx) => {
              const val = variaveis[idx] || '';
              const formatted = formatDezena(val);
              const isHit = formatted && drawnSet.has(formatted);
              const isDup = formatted && (counts[formatted] || 0) > 1;

              return (
                <div key={idx} className="flex flex-col gap-1 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    V{idx + 1}
                  </span>
                  <input
                    id={`input-var-${idx}`}
                    type="text"
                    maxLength={2}
                    value={val}
                    onChange={(e) => onChange(idx, e.target.value)}
                    placeholder="00"
                    className={`w-full text-center py-2 px-1 text-sm sm:text-base font-black rounded-lg transition-all outline-none border ${
                      isHit
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                        : isDup
                        ? 'bg-rose-950 text-rose-300 border-rose-500'
                        : 'bg-slate-950 text-white border-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Row 2 (V11 to V20) */}
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 10 }).map((_, idx) => {
              const realIdx = idx + 10;
              const val = variaveis[realIdx] || '';
              const formatted = formatDezena(val);
              const isHit = formatted && drawnSet.has(formatted);
              const isDup = formatted && (counts[formatted] || 0) > 1;

              return (
                <div key={realIdx} className="flex flex-col gap-1 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    V{realIdx + 1}
                  </span>
                  <input
                    id={`input-var-${realIdx}`}
                    type="text"
                    maxLength={2}
                    value={val}
                    onChange={(e) => onChange(realIdx, e.target.value)}
                    placeholder="00"
                    className={`w-full text-center py-2 px-1 text-sm sm:text-base font-black rounded-lg transition-all outline-none border ${
                      isHit
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/50'
                        : isDup
                        ? 'bg-rose-950 text-rose-300 border-rose-500'
                        : 'bg-slate-950 text-white border-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
