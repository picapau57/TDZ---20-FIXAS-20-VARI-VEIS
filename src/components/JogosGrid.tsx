import React, { useState, useMemo } from 'react';
import { Game, FilterOption, GameMode } from '../types';
import { Copy, Download, Filter, Search, Trophy, Award, Sparkles, Check } from 'lucide-react';

interface JogosGridProps {
  games: Game[];
  gameMode: GameMode;
  drawnNumbers: string[];
  totalTernos: number;
  totalDuques: number;
  onOpenExportModal: () => void;
}

export const JogosGrid: React.FC<JogosGridProps> = ({
  games,
  gameMode,
  drawnNumbers,
  totalTernos,
  totalDuques,
  onOpenExportModal,
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchDezena, setSearchDezena] = useState<string>('');

  // Filter games based on selection & search
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Filter by hit status
      if (filter === 'ternos' && game.hits !== 3) return false;
      if (filter === 'duques' && game.hits !== 2) return false;
      if (filter === 'any_hit' && game.hits === 0) return false;

      // Filter by search number
      if (searchDezena.trim()) {
        const query = searchDezena.trim();
        const hasMatch = game.numbers.some(num => num.includes(query));
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [games, filter, searchDezena]);

  const hasDrawnNumbers = drawnNumbers.some(d => d.trim().length > 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Title & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="title-jogos-gerados" className="text-lg sm:text-xl font-black uppercase text-white tracking-wider">
              JOGOS GERADOS ({games.length} JOGOS)
            </h2>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {filteredGames.length} exibidos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Combinações automáticas formadas por 1 Par Fixo + 1 Dezena Variável
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-center lg:justify-end">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial min-w-[140px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-dezena"
              type="text"
              maxLength={2}
              value={searchDezena}
              onChange={(e) => setSearchDezena(e.target.value)}
              placeholder="Buscar dezena..."
              className="w-full bg-slate-950 text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
            />
            {searchDezena && (
              <button
                onClick={() => setSearchDezena('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="bg-slate-950 p-1 rounded-xl flex items-center border border-slate-800 text-xs font-bold">
            <button
              id="filter-btn-all"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({games.length})
            </button>
            <button
              id="filter-btn-ternos"
              onClick={() => setFilter('ternos')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                filter === 'ternos'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Trophy className="w-3 h-3" />
              Ternos ({totalTernos})
            </button>
            <button
              id="filter-btn-duques"
              onClick={() => setFilter('duques')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${
                filter === 'duques'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Award className="w-3 h-3" />
              Duques ({totalDuques})
            </button>
          </div>

          {/* Export Action Button */}
          <button
            id="btn-export-modal"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-lg active:scale-95 shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar / Baixar</span>
          </button>
        </div>
      </div>

      {/* Notice if no games match search/filter */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm font-medium">
            Nenhum jogo encontrado para os filtros selecionados.
          </p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchDezena('');
            }}
            className="mt-2 text-xs text-amber-400 hover:underline font-bold"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        /* Games Grid styled like spreadsheet table columns! */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filteredGames.map((game) => {
            const isTerno = game.hits === 3;
            const isDuque = game.hits === 2;
            const matchedSet = new Set(game.matchedNumbers);

            return (
              <div
                key={game.id}
                id={`game-card-${game.id}`}
                className={`flex flex-col rounded-xl overflow-hidden border transition-all duration-200 shadow-md ${
                  isTerno
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 z-10'
                    : isDuque
                    ? 'border-emerald-400 ring-1 ring-emerald-400/40'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                {/* Header Cell (Black like spreadsheet image) */}
                <div
                  className={`px-2 py-1 text-center font-black text-xs flex items-center justify-between ${
                    isTerno
                      ? 'bg-amber-400 text-slate-950'
                      : isDuque
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black text-amber-300'
                  }`}
                >
                  <span>{game.label}</span>
                  {isTerno && (
                    <span className="text-[10px] bg-slate-950 text-amber-400 px-1 rounded font-black">
                      TERNO 🏆
                    </span>
                  )}
                  {isDuque && (
                    <span className="text-[10px] bg-emerald-900 text-white px-1 rounded font-black">
                      DUQUE 🎯
                    </span>
                  )}
                </div>

                {/* 3 Number Cells (Yellow like spreadsheet image) */}
                <div className="grid grid-cols-3 gap-0.5 bg-slate-900 p-0.5">
                  {game.numbers.map((num, nIdx) => {
                    const isHit = num && matchedSet.has(num);

                    return (
                      <div
                        key={nIdx}
                        className={`text-center py-2 px-0.5 text-sm sm:text-base font-black transition-all ${
                          isHit
                            ? 'bg-emerald-500 text-white animate-pulse shadow-inner font-extrabold'
                            : 'bg-amber-300 text-slate-950'
                        }`}
                      >
                        {num || '--'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
