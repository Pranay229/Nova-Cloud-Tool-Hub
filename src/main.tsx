import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvironment } from './lib/envValidation';
import { ErrorBoundary } from './components/ErrorBoundary';

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

function renderError(error: unknown) {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found!');
    return;
  }
  
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
  errorMsg.style.cssText = 'color: #6b7280; font-size: 14px; word-break: break-word;';
  errorMsg.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  
  card.appendChild(title);
  card.appendChild(message);
  card.appendChild(errorMsg);
  container.appendChild(card);
  root.appendChild(container);
}

try {
  validateEnvironment();
  
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element with id "root" not found in the DOM');
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  console.error('Application initialization failed:', error);
  renderError(error);
}
