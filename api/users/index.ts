import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_supabase.js';

function mapUser(row: any) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    phone: row.phone,
    password: row.password,
    status: row.status,
    role: row.role,
    createdAt: row.created_at,
    approvedAt: row.approved_at || undefined,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json((data || []).map(mapUser));
  }

  if (req.method === 'POST') {
    const { name, username, phone, password, status, role } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const cleanUsername = String(username).trim().toLowerCase();

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'Este nome de usuário já está cadastrado.' });
    }

    const newUser = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      name: name ? String(name).trim() : cleanUsername,
      username: cleanUsername,
      phone: phone ? String(phone).trim() : '',
      password: String(password).trim(),
      status: status || 'pending',
      role: role || 'user',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('users').insert(newUser).select().single();
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(mapUser(data));
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
