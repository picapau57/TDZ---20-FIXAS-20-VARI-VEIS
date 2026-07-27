import React, { useState } from 'react';
import { User, UserStatus } from '../types';
import { ShieldCheck, UserCheck, UserX, Trash2, Phone, Search, DollarSign, Clock, CheckCircle, Key, Save, UserPlus, X, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  onUpdateUserStatus: (userId: string, newStatus: UserStatus) => void;
  onDeleteUser: (userId: string) => void;
  pixKey: string;
  onUpdatePixKey: (newPixKey: string) => void;
  onCloseAdmin: () => void;
  onAddManualUser: (newUser: Omit<User, 'id' | 'createdAt'>) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  onUpdateUserStatus,
  onDeleteUser,
  pixKey,
  onUpdatePixKey,
  onCloseAdmin,
  onAddManualUser,
}) => {
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPixKey, setEditingPixKey] = useState(pixKey);
  const [pixSavedMessage, setPixSavedMessage] = useState(false);

  // Manual Add Player State
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addUsername, setAddUsername] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addPassword, setAddPassword] = useState('123456');
  const [addStatus, setAddStatus] = useState<UserStatus>('approved');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const pendingCount = users.filter(u => u.status === 'pending').length;
  const approvedCount = users.filter(u => u.status === 'approved' && u.role !== 'admin').length;
  const totalRevenue = approvedCount * 50;

  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false; // Hide admin from list
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.phone.includes(term)
      );
    }
    return true;
  });

  const handleSavePix = () => {
    onUpdatePixKey(editingPixKey.trim());
    setPixSavedMessage(true);
    setTimeout(() => setPixSavedMessage(false), 2500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!addUsername.trim() || !addPassword.trim()) {
      setAddError('Nome de usuário e senha são obrigatórios.');
      return;
    }

    const cleanUsername = addUsername.trim().toLowerCase();
    const existing = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      setAddError(`O usuário "${cleanUsername}" já existe no sistema.`);
      return;
    }

    onAddManualUser({
      name: addName.trim() || cleanUsername,
      username: cleanUsername,
      phone: addPhone.trim() || '(62) 98428-9911',
      password: addPassword.trim(),
      status: addStatus,
      role: 'user',
    });

    setAddSuccess(`Jogador "${cleanUsername}" cadastrado com sucesso (${addStatus === 'approved' ? 'Acesso Liberado' : 'Aguardando'}).`);
    setAddName('');
    setAddUsername('');
    setAddPhone('');
    setAddPassword('123456');

    setTimeout(() => {
      setAddSuccess('');
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-wider">
              Painel de Administração do Sistema
            </h2>
            <p className="text-xs text-slate-400">
              Gerencie cadastros, pagamentos de R$ 50,00 e autorize acessos dos jogadores.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition shadow-lg flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Cadastrar Jogador</span>
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            Voltar para Jogos
          </button>
        </div>
      </div>

      {/* Manual Add Player Form Box */}
      {showAddForm && (
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-black text-emerald-400 uppercase flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Cadastrar Jogador Manuais (Aprovação Imediata ou Pendente)
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {addError && (
            <div className="p-2.5 bg-rose-950/80 border border-rose-500/50 rounded-lg text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{addError}</span>
            </div>
          )}

          {addSuccess && (
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{addSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Nome Completo</label>
              <input
                type="text"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="ex: Dona"
                className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Usuário (Login) *</label>
              <input
                type="text"
                value={addUsername}
                onChange={(e) => setAddUsername(e.target.value)}
                placeholder="ex: dona"
                className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                placeholder="(62) 98428-9911"
                className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Senha *</label>
              <input
                type="text"
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Acesso Inicial</label>
              <select
                value={addStatus}
                onChange={(e) => setAddStatus(e.target.value as UserStatus)}
                className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-800 outline-none focus:border-amber-400"
              >
                <option value="approved">Aprovado (Liberado)</option>
                <option value="pending">Pendente (Aguardando PIX)</option>
              </select>
            </div>

            <div className="sm:col-span-2 md:col-span-5 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg transition shadow-md"
              >
                Salvar e Cadastrar Jogador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">
              Aguardando Liberação
            </span>
            <span className="text-2xl font-black text-amber-400">
              {pendingCount} jogadores
            </span>
          </div>
          <Clock className="w-8 h-8 text-amber-400/40" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">
              Jogadores Aprovados
            </span>
            <span className="text-2xl font-black text-emerald-400">
              {approvedCount} ativos
            </span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-400/40" />
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">
              Receita Arrecadada (R$ 50/cada)
            </span>
            <span className="text-2xl font-black text-blue-400">
              R$ {totalRevenue},00
            </span>
          </div>
          <DollarSign className="w-8 h-8 text-blue-400/40" />
        </div>
      </div>

      {/* PIX Key Configuration Box */}
      <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Key className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-slate-300 uppercase shrink-0">
            Sua Chave PIX do Sistema:
          </span>
          <input
            type="text"
            value={editingPixKey}
            onChange={(e) => setEditingPixKey(e.target.value)}
            className="bg-slate-900 text-amber-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-slate-700 outline-none w-full sm:w-64"
          />
        </div>

        <button
          onClick={handleSavePix}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg transition shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{pixSavedMessage ? 'Salvo!' : 'Salvar Chave PIX'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, usuário ou telefone..."
            className="w-full bg-slate-950 text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:border-amber-400 outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'all'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({users.length - 1})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'pending'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-amber-400/90 hover:text-amber-300'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === 'approved'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'text-emerald-400/90 hover:text-emerald-300'
            }`}
          >
            Aprovados ({approvedCount})
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
            Nenhum jogador encontrado com os filtros aplicados.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isPending = user.status === 'pending';
            const isApproved = user.status === 'approved';
            const cleanPhone = user.phone.replace(/\D/g, '');

            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isPending
                    ? 'bg-amber-500/5 border-amber-500/40'
                    : isApproved
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                {/* User details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white text-sm">
                      {user.name}
                    </span>
                    <span className="text-xs text-amber-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      @{user.username}
                    </span>
                    {isPending && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                        Aguardando PIX R$ 50,00
                      </span>
                    )}
                    {isApproved && (
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-black uppercase">
                        Acesso Liberado 🎯
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {user.phone}
                    </span>
                    <span>
                      Cadastrado em:{' '}
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                  {cleanPhone && (
                    <a
                      href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                        `Olá ${user.name}! Sou o administrador do Sistema TDZ PICA-PAU.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition"
                      title="Abrir conversa no WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {user.status !== 'approved' && (
                    <button
                      onClick={() => onUpdateUserStatus(user.id, 'approved')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg transition shadow-md flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Aprovar (R$ 50 Recebido)</span>
                    </button>
                  )}

                  {user.status !== 'rejected' && (
                    <button
                      onClick={() => onUpdateUserStatus(user.id, 'rejected')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950 text-rose-300 text-xs font-bold rounded-lg border border-slate-700 hover:border-rose-500/50 transition flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Bloquear</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="p-1.5 bg-slate-900 hover:bg-rose-900 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition"
                    title="Excluir do cadastro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
