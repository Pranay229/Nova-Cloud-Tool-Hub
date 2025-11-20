import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvironment } from './lib/envValidation';

try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 600px; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h1 style="color: #dc2626; margin-bottom: 16px;">Configuration Error</h1>
        <p style="color: #374151; margin-bottom: 16px;">The application is not properly configured. Please contact support.</p>
        <p style="color: #6b7280; font-size: 14px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  `;
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
