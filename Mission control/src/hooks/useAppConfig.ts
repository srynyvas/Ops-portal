import { useState, useEffect } from 'react';
import type { AppConfig } from '../types';

const DEFAULT_CONFIG: AppConfig = {
  version: '1.0.0',
  environment: 'development',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  features: {
    enableWorkflows: true,
    enableReleases: true,
    enableAnalytics: true,
    enableCollaboration: true,
    enableNotifications: true,
    enableExport: true,
    enableTemplates: true,
    betaFeatures: [],
  },
  theme: {
    mode: 'light',
    primaryColor: 'blue',
    accentColor: 'purple',
    borderRadius: 'medium',
    fontSize: 'medium',
    density: 'comfortable',
  },
};

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to load config from localStorage first
        const savedConfig = localStorage.getItem('mission-control-config');
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          setConfig(prev => ({ ...prev, ...parsed }));
        }

        // In a real app, you would fetch from an API
        // const response = await fetch('/api/config');
        // const remoteConfig = await response.json();
        // setConfig(prev => ({ ...prev, ...remoteConfig }));

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load config'));
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = (updates: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    localStorage.setItem('mission-control-config', JSON.stringify(newConfig));
  };

  return {
    config,
    isLoading,
    error,
    updateConfig,
  };
};
