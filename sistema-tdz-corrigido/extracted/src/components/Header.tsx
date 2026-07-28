import React from 'react';
import { Trophy, Award, RefreshCw, FileSpreadsheet, CheckCircle2, ShieldCheck, UserCheck, LogOut, User } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  totalTernos: number;
  totalDuques: number;
  gameMode: 120 | 200;
  onGameModeChange: (mode: 120 | 200) => void;
  onResetToDefaults: () => void;
  onClearAll: () => void;
  currentUser: UserType | null;
  onOpenAdminPanel: () => void;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalTernos,
  totalDuques,
  gameMode,
  onGameModeChange,
  onResetToDefaults,
  onClearAll,
  currentUser,
  onOpenAdminPanel,
  onLogout,
  onOpenLogin,
}) => {
  return (
    <header className="w-full bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800">
      {/* Top Banner styled like the spreadsheet image */}
      <div className="bg-red-600 px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-red-700">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm hidden sm:block">
            <FileSpreadsheet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 id="app-header-title" className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-white drop-shadow-md">
              TDZ - 20-FIXAS 20-VARIÁVEIS = {gameMode} JOGOS
            </h1>
            <p className="text-xs sm:text-sm text-red-100 font-medium">
              Fechamento Automático de Ternos e Duques de Dezenas
            </p>
          </div>
        </div>

        {/* Mode Selector & Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="bg-red-800/80 p-1 rounded-xl flex items-center border border-red-500/30">
            <button
              id="btn-mode-120"
              onClick={() => onGameModeChange(120)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                gameMode === 120
                  ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                  : 'text-white hover:bg-red-700'
              }`}
            >
              120 Jogos
            </button>
            <button
              id="btn-mode-200"
              onClick={() => onGameModeChange(200)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                gameMode === 200
                  ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                  : 'text-white hover:bg-red-700'
              }`}
            >
              200 Jogos
            </button>
          </div>

          <button
            id="btn-reload-planilha"
            onClick={onResetToDefaults}
            title="Carregar dezenas originais da planilha"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl transition border border-white/20 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exemplo Planilha</span>
          </button>

          <button
            id="btn-clear-all"
            onClick={onClearAll}
            title="Limpar todos os campos"
            className="flex items-center gap-1.5 px-3 py-2 bg-red-900/60 hover:bg-red-950 text-white text-xs font-semibold rounded-xl transition border border-red-700 active:scale-95"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* User Login & Admin Toolbar Bar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">
                Jogador Logado:{' '}
                <strong className="text-amber-400 font-black">{currentUser.name}</strong> (@{currentUser.username})
              </span>
              {currentUser.role === 'admin' && (
                <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                  ADMINISTRADOR
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400">
              🔒 Acesso restrito a jogadores cadastrados e autorizados (R$ 50,00).
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold rounded-lg transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel do Administrador</span>
            </button>
          )}

          {currentUser ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition"
              title="Sair do sistema"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition shadow-md"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Counters Bar matching the exact yellow and red boxes in the spreadsheet image */}
      <div className="px-4 py-4 sm:px-6 bg-slate-950/80 grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
        {/* Logo / Mascot Avatar */}
        <div className="col-span-2 sm:col-span-2 flex items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 font-black text-xl flex items-center justify-center border-2 border-amber-300 shadow-lg shrink-0">
            🐤
          </div>
          <div>
            <span className="text-amber-400 font-extrabold text-sm sm:text-base tracking-wide block">
              PICA-PAU JOGOS
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
              100% Automático e Sem Repetição
            </span>
          </div>
        </div>

        {/* TERNOS Counter Box */}
        <div id="counter-box-ternos" className="bg-slate-900 p-2.5 rounded-xl border-2 border-amber-500/40 text-center shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-bl">
            3 ACERTOS
          </div>
          <div className="text-slate-300 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            TERNOS
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 drop-shadow">
            {totalTernos}
          </div>
        </div>

        {/* DUQUES Counter Box */}
        <div id="counter-box-duques" className="bg-slate-900 p-2.5 rounded-xl border-2 border-amber-500/40 text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-bl">
            2 ACERTOS
          </div>
          <div className="text-slate-300 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            DUQUES
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 drop-shadow">
            {totalDuques}
          </div>
        </div>
      </div>
    </header>
  );
};

