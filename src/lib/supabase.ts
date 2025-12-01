import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL. Please set it in your .env file.');
}

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY. Please set it in your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
export default supabase;
