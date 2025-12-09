import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvironment } from './lib/envValidation';

// Validate environment (non-blocking in development)
validateEnvironment();

// Always render the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" not found in the DOM');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
