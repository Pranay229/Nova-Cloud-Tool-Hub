import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvlptpzwtdjznbkgdhrj.supabase.co';

// Note: In Vite, use import.meta.env instead of process.env
// For client-side, use VITE_SUPABASE_KEY in .env file
// For server-side/Node.js, use SUPABASE_KEY
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Please set VITE_SUPABASE_KEY or SUPABASE_KEY in your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
export default supabase;
