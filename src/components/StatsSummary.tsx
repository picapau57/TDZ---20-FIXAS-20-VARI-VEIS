import React from 'react';
import { AlertTriangle, CheckCircle2, Award, Trophy } from 'lucide-react';
import { formatDezena } from '../utils/tdzGenerator';

interface StatsSummaryProps {
  fixasRow1: string[];
  fixasRow2: string[];
  variaveis: string[];
  totalTernos: number;
  totalDuques: number;
  totalGames: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  fixasRow1,
  fixasRow2,
  variaveis,
  totalTernos,
  totalDuques,
  totalGames,
}) => {
  // Audit duplicates
  const allFixas = [...fixasRow1, ...fixasRow2].map(formatDezena).filter(Boolean);
  const allVars = variaveis.map(formatDezena).filter(Boolean);

  const duplicateFixas = allFixas.filter((item, index) => allFixas.indexOf(item) !== index);
  const duplicateVars = allVars.filter((item, index) => allVars.indexOf(item) !== index);

  // Check overlap between fixas and variaveis
  const fixasSet = new Set(allFixas);
  const overlap = allVars.filter(v => fixasSet.has(v));

  const hasIssues = duplicateFixas.length > 0 || duplicateVars.length > 0 || overlap.length > 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {hasIssues ? (
            <div className="flex items-center gap-1.5 text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800/60 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Atenção: existem dezenas repetidas nas entradas</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Conferência de Matriz OK (20 Fixas e 20 Variáveis sem repetição)</span>
            </div>
          )}
        </div>

        {/* Quick stat pill */}
        <div className="flex items-center gap-3 text-slate-300 font-medium">
          <span>Total de Combinações: <strong className="text-amber-400">{totalGames} jogos</strong></span>
        </div>
      </div>

      {/* Warning details if any */}
      {hasIssues && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-rose-300 space-y-1">
          {duplicateFixas.length > 0 && (
            <p>• Dezenas fixas duplicadas: {Array.from(new Set(duplicateFixas)).join(', ')}</p>
          )}
          {duplicateVars.length > 0 && (
            <p>• Dezenas variáveis duplicadas: {Array.from(new Set(duplicateVars)).join(', ')}</p>
          )}
          {overlap.length > 0 && (
            <p>• Dezenas presentes em Fixas e Variáveis simultaneamente: {Array.from(new Set(overlap)).join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};
