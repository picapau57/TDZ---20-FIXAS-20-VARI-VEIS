import React, { useState } from 'react';
import { User } from '../types';
import { UserCheck, Lock, UserPlus, LogIn, QrCode, Copy, Check, ShieldCheck, AlertCircle, Phone, ArrowRight, ExternalLink } from 'lucide-react';

interface AuthScreenProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterUser: (newUser: Omit<User, 'id' | 'status' | 'role' | 'createdAt'>) => void;
  pixKey: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  users,
  onLoginSuccess,
  onRegisterUser,
  pixKey,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState<User | null>(null);

  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setPendingUser(null);

    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanUser || !cleanPass) {
      setLoginError('Por favor, informe seu usuário e senha.');
      return;
    }

    const found = users.find(
      u => u.username.toLowerCase() === cleanUser || u.phone.replace(/\D/g, '') === cleanUser.replace(/\D/g, '')
    );

    if (!found) {
      setLoginError('Usuário não encontrado. Verifique se digitou corretamente ou faça o cadastro.');
      return;
    }

    if (found.password !== cleanPass) {
      setLoginError('Senha incorreta. Tente novamente.');
      return;
    }

    if (found.role === 'admin') {
      onLoginSuccess(found);
      return;
    }

    if (found.status === 'pending') {
      setPendingUser(found);
      return;
    }

    if (found.status === 'rejected') {
      setLoginError('Seu acesso foi recusado ou suspenso pelo administrador.');
      return;
    }

    // Approved player
    onLoginSuccess(found);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regUsername.trim() || !regPhone.trim() || !regPassword) {
      setRegError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('As senhas não coincidem.');
      return;
    }

    const cleanUsername = regUsername.trim().toLowerCase();
    const existing = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      setRegError('Este nome de usuário já está em uso. Escolha outro.');
      return;
    }

    onRegisterUser({
      name: regName.trim(),
      username: cleanUsername,
      phone: regPhone.trim(),
      password: regPassword,
    });

    // Find the newly registered user structure
    const newCreatedUser: User = {
      id: Date.now().toString(),
      name: regName.trim(),
      username: cleanUsername,
      phone: regPhone.trim(),
      password: regPassword,
      status: 'pending',
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setRegSuccess(newCreatedUser);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de me cadastrar no Sistema Pica-Pau TDZ (Usuário: ${
      pendingUser?.username || regSuccess?.username || ''
    }) e fiz o pagamento do PIX de R$ 50,00. Pode liberar meu acesso?`
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 p-6 text-center text-white relative">
          <div className="w-16 h-16 bg-amber-400 text-slate-950 rounded-full font-black text-3xl flex items-center justify-center mx-auto shadow-xl border-4 border-white/20 mb-2">
            🐤
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider">
            SISTEMA TDZ PICA-PAU
          </h2>
          <p className="text-xs text-red-100 font-medium mt-1">
            20 Fixas & 20 Variáveis • Acesso Exclusivo
          </p>
        </div>

        {/* Custom Tabs */}
        {!pendingUser && !regSuccess && (
          <div className="grid grid-cols-2 bg-black/60 border-b border-white/10 text-sm font-bold">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
              }}
              className={`py-3.5 flex items-center justify-center gap-2 transition ${
                activeTab === 'login'
                  ? 'bg-[#111] text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setRegError('');
              }}
              className={`py-3.5 flex items-center justify-center gap-2 transition ${
                activeTab === 'register'
                  ? 'bg-[#111] text-amber-400 border-b-2 border-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Criar Conta
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {/* PENDING APPROVAL SCREEN */}
          {(pendingUser || regSuccess) ? (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300">
                <AlertCircle className="w-10 h-10 mx-auto text-amber-400 mb-2 animate-bounce" />
                <h3 className="text-base font-black uppercase">
                  Aguardando Liberação do Administrador
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Seu cadastro foi realizado com sucesso para o usuário:{' '}
                  <strong className="text-amber-400">{pendingUser?.username || regSuccess?.username}</strong>.
                </p>
              </div>

              {/* PIX Payment Box */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">
                    Taxa de Acesso (Única)
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    R$ 50,00
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Chave PIX Celular do Administrador:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixKey}
                      className="w-full bg-slate-900 text-amber-300 text-xs font-mono font-bold px-3 py-2 rounded-lg border border-slate-700 outline-none"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-2 rounded-lg text-xs transition shrink-0"
                      title="Copiar Chave PIX"
                    >
                      {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Realize o PIX de <strong>R$ 50,00</strong> e envie o comprovante via WhatsApp para liberação imediata do seu login.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/5562984289911?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  Enviar Comprovante pelo WhatsApp
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setPendingUser(null);
                    setRegSuccess(null);
                    setActiveTab('login');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Voltar para Tela de Login
                </button>
              </div>
            </div>
          ) : activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Usuário ou Telefone
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Seu nome de usuário"
                    className="w-full bg-slate-950 text-white text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Logins Info */}
              <div className="mt-6 pt-4 border-t border-white/10 text-left">
                <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">
                  💡 Acessos de Demonstração para Teste:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold block">ADMIN:</span>
                    <span>admin / admin123</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold block">JOGADOR:</span>
                    <span>jogador1 / 123456</span>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {regError && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Nome de Usuário (Login)
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="ex: joaosilva"
                  className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  WhatsApp / Celular com DDD
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200 leading-tight">
                <strong>Atenção:</strong> A liberação do acesso ocorre manualmente pelo administrador mediante o pagamento da taxa única de <strong>R$ 50,00</strong>.
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-lg mt-2"
              >
                Cadastrar e Solicitar Acesso
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
