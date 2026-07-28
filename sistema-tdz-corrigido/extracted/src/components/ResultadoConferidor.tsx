import React from 'react';
import { Search, RotateCcw, Dices } from 'lucide-react';
import { SAMPLE_RESULTADO } from '../constants/defaultData';

interface ResultadoConferidorProps {
  drawnNumbers: string[];
  onChange: (index: number, value: string) => void;
  onClear: () => void;
  onLoadSample: () => void;
}

export const ResultadoConferidor: React.FC<ResultadoConferidorProps> = ({
  drawnNumbers,
  onChange,
  onClear,
  onLoadSample,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Description */}
        <div className="flex items-center gap-3">
          <div className="bg-black px-4 py-2 rounded-xl border border-slate-700 shadow flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-white font-black uppercase text-sm sm:text-base tracking-wider">
              RESULTADO
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden lg:inline">
            Digite até 5 dezenas sorteadas para conferir os acertos
          </span>
        </div>

        {/* 5 Result Input Boxes */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                {idx + 1}º
              </span>
              <input
                id={`input-resultado-${idx}`}
                type="text"
                maxLength={2}
                value={drawnNumbers[idx] || ''}
                onChange={(e) => onChange(idx, e.target.value)}
                placeholder="00"
                className="w-12 sm:w-14 h-11 sm:h-12 text-center text-lg sm:text-xl font-black bg-white text-slate-950 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none shadow-md transition-all placeholder:text-slate-300"
              />
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-sample-resultado"
            onClick={onLoadSample}
            title="Preencher com resultado de exemplo para testar o conferidor"
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <Dices className="w-4 h-4" />
            <span>Simular Sorteio</span>
          </button>

          <button
            id="btn-clear-resultado"
            onClick={onClear}
            title="Limpar resultado"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
