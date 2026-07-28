import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_supabase';

const DEFAULT_PIX = '(62) 98428-9911';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'pix_key')
      .maybeSingle();

    return res.status(200).json({ pixKey: data?.value || DEFAULT_PIX });
  }

  if (req.method === 'POST') {
    const { pixKey } = req.body || {};

    if (pixKey) {
      await supabase.from('settings').upsert({ key: 'pix_key', value: pixKey });
    }

    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'pix_key')
      .maybeSingle();

    return res.status(200).json({ pixKey: data?.value || DEFAULT_PIX });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
