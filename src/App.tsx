import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FixasInput } from './components/FixasInput';
import { VariaveisInput } from './components/VariaveisInput';
import { ResultadoConferidor } from './components/ResultadoConferidor';
import { JogosGrid } from './components/JogosGrid';
import { ExportModal } from './components/ExportModal';
import { StatsSummary } from './components/StatsSummary';
import { AuthScreen } from './components/AuthScreen';
import { AdminPanel } from './components/AdminPanel';
import { GameMode, User, UserStatus } from './types';
import {
  DEFAULT_FIXAS_ROW1,
  DEFAULT_FIXAS_ROW2,
  DEFAULT_VARIAVEIS,
  SAMPLE_RESULTADO,
} from './constants/defaultData';
import { generateTDZGames, checkTDZResults, formatDezena } from './utils/tdzGenerator';

const STORAGE_KEY = 'tdz_jogos_app_state_v2';

const DEFAULT_USERS: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'Administrador Pica-Pau',
    phone: '(62) 98428-9911',
    password: 'admin123',
    status: 'approved',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-1',
    username: 'jogador1',
    name: 'Carlos Eduardo',
    phone: '(11) 98888-7777',
    password: '123456',
    status: 'approved',
    role: 'user',
    createdAt: '2026-01-02T10:00:00.000Z',
  },
  {
    id: 'user-2',
    username: 'novo_jogador',
    name: 'Roberto Alves',
    phone: '(21) 97777-6666',
    password: '123456',
    status: 'pending',
    role: 'user',
    createdAt: '2026-01-03T14:30:00.000Z',
  },
];

export default function App() {
  // Load users list
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as User;
    // ensure parsed user still exists in users list with updated status
    const matched = DEFAULT_USERS.find(u => u.id === parsed.id) || parsed;
    return matched;
  });

  // Chave PIX configuration
  const [pixKey, setPixKey] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pix_key`);
    if (!saved || saved === 'picapauinformatica@gmail.com') return '(62) 98428-9911';
    return saved;
  });

  // View state: 'games' | 'admin' | 'auth'
  const [viewMode, setViewMode] = useState<'games' | 'admin' | 'auth'>(() => {
    const savedUser = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    return savedUser ? 'games' : 'auth';
  });

  // Game data state
  const [fixasRow1, setFixasRow1] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_row1`);
    return saved ? JSON.parse(saved) : DEFAULT_FIXAS_ROW1;
  });

  const [fixasRow2, setFixasRow2] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_row2`);
    return saved ? JSON.parse(saved) : DEFAULT_FIXAS_ROW2;
  });

  const [variaveis, setVariaveis] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vars`);
    return saved ? JSON.parse(saved) : DEFAULT_VARIAVEIS;
  });

  const [drawnNumbers, setDrawnNumbers] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_drawn`);
    return saved ? JSON.parse(saved) : ['', '', '', '', ''];
  });

  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_mode`);
    return saved ? (parseInt(saved, 10) as GameMode) : 120;
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pix_key`, pixKey);
  }, [pixKey]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_row1`, JSON.stringify(fixasRow1));
    localStorage.setItem(`${STORAGE_KEY}_row2`, JSON.stringify(fixasRow2));
    localStorage.setItem(`${STORAGE_KEY}_vars`, JSON.stringify(variaveis));
    localStorage.setItem(`${STORAGE_KEY}_drawn`, JSON.stringify(drawnNumbers));
    localStorage.setItem(`${STORAGE_KEY}_mode`, gameMode.toString());
  }, [fixasRow1, fixasRow2, variaveis, drawnNumbers, gameMode]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setViewMode('admin');
    } else {
      setViewMode('games');
    }
  };

  const handleRegisterUser = (newUser: Omit<User, 'id' | 'status' | 'role' | 'createdAt'>) => {
    const created: User = {
      ...newUser,
      id: Date.now().toString(),
      status: 'pending',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, created]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setViewMode('auth');
  };

  // Admin User Management Handlers
  const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: newStatus,
            approvedAt: newStatus === 'approved' ? new Date().toISOString() : undefined,
          };
        }
        return u;
      })
    );

    // If updating current logged in user
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Generate games automatically
  const rawGames = useMemo(() => {
    return generateTDZGames(fixasRow1, fixasRow2, variaveis, gameMode);
  }, [fixasRow1, fixasRow2, variaveis, gameMode]);

  // Calculate check results automatically
  const checkResult = useMemo(() => {
    return checkTDZResults(rawGames, fixasRow1, fixasRow2, variaveis, drawnNumbers);
  }, [rawGames, fixasRow1, fixasRow2, variaveis, drawnNumbers]);

  // Handlers for Fixas edits
  const handleFixasRow1Change = (index: number, val: string) => {
    const newRow = [...fixasRow1];
    newRow[index] = val;
    setFixasRow1(newRow);
  };

  const handleFixasRow2Change = (index: number, val: string) => {
    const newRow = [...fixasRow2];
    newRow[index] = val;
    setFixasRow2(newRow);
  };

  // Handler for Variaveis edits
  const handleVariaveisChange = (index: number, val: string) => {
    const newVars = [...variaveis];
    newVars[index] = val;
    setVariaveis(newVars);
  };

  // Handler for Result edits
  const handleDrawnChange = (index: number, val: string) => {
    const newDrawn = [...drawnNumbers];
    newDrawn[index] = val;
    setDrawnNumbers(newDrawn);
  };

  // Helper function to generate N unique random 2-digit dezenas (00-99)
  const generateRandomDezenas = (count: number, exclude: Set<string> = new Set()): string[] => {
    const result: string[] = [];
    const used = new Set(exclude);

    while (result.length < count) {
      const rand = Math.floor(Math.random() * 100);
      const formatted = rand < 10 ? `0${rand}` : `${rand}`;
      if (!used.has(formatted)) {
        used.add(formatted);
        result.push(formatted);
      }
    }
    return result;
  };

  const handleRandomizeFixas = () => {
    const randoms = generateRandomDezenas(20);
    setFixasRow1(randoms.slice(0, 10));
    setFixasRow2(randoms.slice(10, 20));
  };

  const handleRandomizeVariaveis = () => {
    const currentFixasSet = new Set(
      [...fixasRow1, ...fixasRow2].map(formatDezena).filter(Boolean)
    );
    const randoms = generateRandomDezenas(20, currentFixasSet);
    setVariaveis(randoms);
  };

  const handleClearFixas = () => {
    setFixasRow1(Array(10).fill(''));
    setFixasRow2(Array(10).fill(''));
  };

  const handleClearVariaveis = () => {
    setVariaveis(Array(20).fill(''));
  };

  const handleClearResultado = () => {
    setDrawnNumbers(['', '', '', '', '']);
  };

  const handleLoadSampleResultado = () => {
    setDrawnNumbers(SAMPLE_RESULTADO);
  };

  const handleResetToDefaults = () => {
    setFixasRow1(DEFAULT_FIXAS_ROW1);
    setFixasRow2(DEFAULT_FIXAS_ROW2);
    setVariaveis(DEFAULT_VARIAVEIS);
    setDrawnNumbers(['', '', '', '', '']);
    setGameMode(120);
  };

  const handleClearAll = () => {
    handleClearFixas();
    handleClearVariaveis();
    handleClearResultado();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-3 sm:p-6 md:p-8 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Header
          totalTernos={checkResult.totalTernos}
          totalDuques={checkResult.totalDuques}
          gameMode={gameMode}
          onGameModeChange={setGameMode}
          onResetToDefaults={handleResetToDefaults}
          onClearAll={handleClearAll}
          currentUser={currentUser}
          onOpenAdminPanel={() => setViewMode('admin')}
          onLogout={handleLogout}
          onOpenLogin={() => setViewMode('auth')}
        />

        {/* CONDITION 1: AUTH SCREEN */}
        {(!currentUser || viewMode === 'auth') && (
          <AuthScreen
            users={users}
            onLoginSuccess={handleLoginSuccess}
            onRegisterUser={handleRegisterUser}
            pixKey={pixKey}
          />
        )}

        {/* CONDITION 2: ADMIN PANEL */}
        {currentUser?.role === 'admin' && viewMode === 'admin' && (
          <AdminPanel
            users={users}
            onUpdateUserStatus={handleUpdateUserStatus}
            onDeleteUser={handleDeleteUser}
            pixKey={pixKey}
            onUpdatePixKey={setPixKey}
            onCloseAdmin={() => setViewMode('games')}
          />
        )}

        {/* CONDITION 3: MAIN TDZ APP (GAMES) */}
        {currentUser && (currentUser.status === 'approved' || currentUser.role === 'admin') && viewMode === 'games' && (
          <>
            {/* Input Sections */}
            <div className="space-y-6">
              {/* 20 Dezenas Fixas */}
              <FixasInput
                row1={fixasRow1}
                row2={fixasRow2}
                drawnNumbers={drawnNumbers}
                acertosCount={checkResult.fixasAcertos}
                onRow1Change={handleFixasRow1Change}
                onRow2Change={handleFixasRow2Change}
                onRandomizeFixas={handleRandomizeFixas}
                onClearFixas={handleClearFixas}
              />

              {/* 20 Dezenas Variáveis */}
              <VariaveisInput
                variaveis={variaveis}
                drawnNumbers={drawnNumbers}
                acertosCount={checkResult.variaveisAcertos}
                onChange={handleVariaveisChange}
                onRandomizeVariaveis={handleRandomizeVariaveis}
                onClearVariaveis={handleClearVariaveis}
              />

              {/* Conferidor de Resultado */}
              <ResultadoConferidor
                drawnNumbers={drawnNumbers}
                onChange={handleDrawnChange}
                onClear={handleClearResultado}
                onLoadSample={handleLoadSampleResultado}
              />
            </div>

            {/* Matrix & Duplicate Validation Audit */}
            <StatsSummary
              fixasRow1={fixasRow1}
              fixasRow2={fixasRow2}
              variaveis={variaveis}
              totalTernos={checkResult.totalTernos}
              totalDuques={checkResult.totalDuques}
              totalGames={checkResult.games.length}
            />

            {/* Generated Games Grid */}
            <JogosGrid
              games={checkResult.games}
              gameMode={gameMode}
              drawnNumbers={drawnNumbers}
              totalTernos={checkResult.totalTernos}
              totalDuques={checkResult.totalDuques}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />

            {/* Export / Copy Modal */}
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              games={checkResult.games}
              gameMode={gameMode}
            />
          </>
        )}

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-900 flex flex-col items-center gap-1">
          <p className="font-semibold text-slate-400">
            Sistema TDZ PICA-PAU - Fechamento de Ternos e Duques de Dezenas
          </p>
          <p>
            Sistema de Cadastro de Jogadores com Liberação Manual de Acesso (R$ 50,00).
          </p>
        </footer>
      </div>
    </div>
  );
}
