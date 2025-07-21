import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const SimpleApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#111' }}>
          ✅ React is Working!
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Mission Control is loading...
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1rem', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          Basic setup complete. Ready for full app!
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<SimpleApp />);
