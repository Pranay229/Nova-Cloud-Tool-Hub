const requiredEnvVars = [
  'VITE_SUPABASE_KEY',
] as const;

export function validateEnvironment(): void {
  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    const isDev = import.meta.env.MODE === 'development';
    
    if (isDev) {
      console.warn(
        `⚠️ Missing Supabase environment variables: ${missing.join(', ')}\n` +
        'The app will run but Supabase features will not work.\n' +
        'Please create a .env file with VITE_SUPABASE_KEY.\n' +
        'Get your key from: Supabase Dashboard > Settings > API > anon/public key'
      );
      // Don't throw in development - allow app to start
      return;
    }
    
    // In production, provide helpful error message for deployment platforms
    const errorMessage = `Missing required Supabase environment variables: ${missing.join(', ')}\n\n` +
      'To fix this:\n' +
      '**Netlify:** Site settings → Environment variables → Add VITE_SUPABASE_KEY → Trigger new deploy\n' +
      '**Vercel:** Settings → Environment Variables → Add VITE_SUPABASE_KEY → Redeploy\n' +
      '**Other platforms:** Add VITE_SUPABASE_KEY in your platform\'s environment settings\n\n' +
      'Get your key from: Supabase Dashboard > Settings > API > anon/public key';
    
    throw new Error(errorMessage);
  }
}

export function isProduction(): boolean {
  return import.meta.env.MODE === 'production';
}

export function isDevelopment(): boolean {
  return import.meta.env.MODE === 'development';
}
