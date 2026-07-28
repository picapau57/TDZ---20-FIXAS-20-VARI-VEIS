import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const updates: Record<string, any> = { status };
  if (status === 'approved') {
    updates.approved_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'User not found' });

  return res.status(200).json(data);
}
