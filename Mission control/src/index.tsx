import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Mission Control: Starting application...');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found. Please check index.html');
}

console.log('Mission Control: Creating React root...');
const root = createRoot(container);

console.log('Mission Control: Rendering main application...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('Mission Control: Application render complete!');

// Force remove loading screen after React renders
setTimeout(() => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    console.log('Force removing loading screen from React');
    loadingScreen.style.display = 'none';
    document.body.classList.remove('loading');
  }
}, 100);
