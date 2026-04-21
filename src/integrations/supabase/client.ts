import { createClient } from '@supabase/supabase-js';

// Estos son los datos de tu nuevo proyecto "wcqy..."
const supabaseUrl = "https://wcqywnwkimetbovdjgpo.supabase.co";
const supabaseKey = "sb_publishable_is18FTnBnQMkkcEqrctxOA_4YLT21Dl";

// Aquí creamos la conexión oficial con schema 'public' explícito
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});