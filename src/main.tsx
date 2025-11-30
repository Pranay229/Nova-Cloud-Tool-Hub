import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvironment } from './lib/envValidation';

// Browser navigation functions
function goBack() {
  window.history.back();
}

function goForward() {
  window.history.forward();
}

// Make functions available globally
(window as any).goBack = goBack;
(window as any).goForward = goForward;

try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
  const root = document.getElementById('root')!;
  root.innerHTML = ''; // Clear existing content safely
  
  const container = document.createElement('div');
  container.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: #f5f5f5;';
  
  const card = document.createElement('div');
  card.style.cssText = 'max-width: 600px; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);';
  
  const title = document.createElement('h1');
  title.style.cssText = 'color: #dc2626; margin-bottom: 16px;';
  title.textContent = 'Configuration Error';
  
  const message = document.createElement('p');
  message.style.cssText = 'color: #374151; margin-bottom: 16px;';
  message.textContent = 'The application is not properly configured. Please contact support.';
  
  const errorMsg = document.createElement('p');
  errorMsg.style.cssText = 'color: #6b7280; font-size: 14px;';
  errorMsg.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  
  card.appendChild(title);
  card.appendChild(message);
  card.appendChild(errorMsg);
  container.appendChild(card);
  root.appendChild(container);
  
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
