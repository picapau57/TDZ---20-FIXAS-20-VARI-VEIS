import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Faltam as variáveis de ambiente SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY. ' +
    'Configure-as no painel da Vercel em Project Settings > Environment Variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
