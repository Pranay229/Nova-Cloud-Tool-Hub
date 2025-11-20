const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

export function validateEnvironment(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    console.warn('Warning: Supabase URL should use HTTPS in production');
  }

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (anonKey && anonKey.length < 100) {
    throw new Error('Invalid Supabase anonymous key format');
  }
}

export function isProduction(): boolean {
  return import.meta.env.MODE === 'production';
}

export function isDevelopment(): boolean {
  return import.meta.env.MODE === 'development';
}
