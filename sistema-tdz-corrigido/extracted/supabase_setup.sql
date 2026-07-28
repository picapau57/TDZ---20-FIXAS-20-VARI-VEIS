-- ============================================================
-- Sistema TDZ Pica-Pau — Setup do banco de dados no Supabase
-- Rode este script em: Supabase > SQL Editor > New Query > Run
-- ============================================================

-- Tabela de usuários (clientes + admin)
create table if not exists public.users (
  id text primary key,
  name text not null,
  username text not null unique,
  phone text,
  password text not null,
  status text not null default 'pending',
  role text not null default 'user',
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

-- Tabela de configurações (chave PIX)
create table if not exists public.settings (
  key text primary key,
  value text
);

-- Usuários iniciais (iguais aos que já existiam no sistema)
insert into public.users (id, name, username, phone, password, status, role, created_at)
values
  ('admin-1', 'Administrador Pica-Pau', 'admin', '(62) 98428-9911', 'admin123', 'approved', 'admin', '2026-01-01T00:00:00.000Z'),
  ('user-dona', 'Dona', 'dona', '(62) 98428-9911', '123456', 'approved', 'user', now()),
  ('user-1', 'Carlos Eduardo', 'jogador1', '(11) 98888-7777', '123456', 'approved', 'user', '2026-01-02T10:00:00.000Z')
on conflict (username) do nothing;

-- Chave PIX inicial
insert into public.settings (key, value)
values ('pix_key', '(62) 98428-9911')
on conflict (key) do nothing;

-- Observação: como as funções da API usam a "service_role key" (acesso total,
-- só usada no servidor, nunca no navegador), não é necessário criar políticas
-- de Row Level Security (RLS) para este projeto funcionar.
