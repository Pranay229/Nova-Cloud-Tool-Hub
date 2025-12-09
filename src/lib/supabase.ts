import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvlptpzwtdjznbkgdhrj.supabase.co';

// Note: In Vite, use import.meta.env instead of process.env
// For client-side, use VITE_SUPABASE_KEY in .env file
// For server-side/Node.js, use SUPABASE_KEY
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || import.meta.env.SUPABASE_KEY;

// Create a safe Supabase client that won't crash if key is missing
let supabase: SupabaseClient;

if (!supabaseKey) {
  if (import.meta.env.MODE === 'development') {
    console.warn(
      '⚠️ Missing Supabase key. Please set VITE_SUPABASE_KEY in your .env file.\n' +
      'The app will run but Supabase features will not work.\n' +
      'Get your key from: Supabase Dashboard > Settings > API > anon/public key'
    );
  }
  // Create a client with empty key - it will fail on actual calls but won't crash the app
  supabase = createClient(supabaseUrl, '');
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
export default supabase;
