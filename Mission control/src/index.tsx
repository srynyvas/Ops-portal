import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Simple test component
const TestApp: React.FC = () => {
  console.log('TestApp is rendering');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 Mission Control Test
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this, React is working!
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">
            Basic setup is functional. Loading main app...
          </p>
        </div>
      </div>
    </div>
  );
};

// Try to load main app, fall back to test
let AppComponent: React.FC;

try {
  console.log('Attempting to load main App...');
  const MainApp = require('./App').default;
  AppComponent = MainApp;
  console.log('Main App loaded successfully');
} catch (error) {
  console.error('Failed to load main App, using test component:', error);
  AppComponent = TestApp;
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

console.log('Creating React root...');
const root = createRoot(container);

console.log('Rendering app...');
root.render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>
);

console.log('App render complete');
