const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export function validateEnvironment(): void {
  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    const isDev = import.meta.env.MODE === 'development';
    
    if (isDev) {
      console.warn(
        `⚠️ Missing Firebase environment variables: ${missing.join(', ')}\n` +
        'The app will run but Firebase features will not work.\n' +
        'Please create a .env file with the required variables.'
      );
      // Don't throw in development - allow app to start
      return;
    }
    
    // In production, provide helpful error message for deployment platforms
    const errorMessage = `Missing required Firebase environment variables: ${missing.join(', ')}\n\n` +
      'To fix this:\n' +
      '**Netlify:** Site settings → Environment variables → Add variables → Trigger new deploy\n' +
      '**Vercel:** Settings → Environment Variables → Add variables → Redeploy\n' +
      '**Other platforms:** Add VITE_FIREBASE_* variables in your platform\'s environment settings\n\n' +
      'For local development, create a .env file with these variables.';
    
    throw new Error(errorMessage);
  }
}

export function isProduction(): boolean {
  return import.meta.env.MODE === 'production';
}

export function isDevelopment(): boolean {
  return import.meta.env.MODE === 'development';
}
