export interface ApiEndpoints {
  releases: {
    list: string;
    get: string;
    create: string;
    update: string;
    delete: string;
    deploy: string;
    rollback: string;
    approve: string;
    reject: string;
    metrics: string;
    history: string;
    analytics: string;
  };
  workflows: {
    list: string;
    get: string;
    create: string;
    update: string;
    delete: string;
    execute: string;
    status: string;
    logs: string;
  };
  dashboard: {
    stats: string;
    activities: string;
    metrics: string;
    health: string;
  };
  environments: {
    list: string;
    get: string;
    status: string;
    health: string;
  };
  teams: {
    list: string;
    get: string;
    members: string;
  };
  auth: {
    login: string;
    logout: string;
    refresh: string;
    profile: string;
  };
}

export interface ApiConfig {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers: Record<string, string>;
  endpoints: ApiEndpoints;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const apiConfig: ApiConfig = {
  baseUrl: API_BASE_URL,
  apiVersion: API_VERSION,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  endpoints: {
    releases: {
      list: '/releases',
      get: '/releases/:id',
      create: '/releases',
      update: '/releases/:id',
      delete: '/releases/:id',
      deploy: '/releases/:id/deploy',
      rollback: '/releases/:id/rollback',
      approve: '/releases/:id/approve',
      reject: '/releases/:id/reject',
      metrics: '/releases/:id/metrics',
      history: '/releases/:id/history',
      analytics: '/releases/analytics',
    },
    workflows: {
      list: '/workflows',
      get: '/workflows/:id',
      create: '/workflows',
      update: '/workflows/:id',
      delete: '/workflows/:id',
      execute: '/workflows/:id/execute',
      status: '/workflows/:id/status',
      logs: '/workflows/:id/logs',
    },
    dashboard: {
      stats: '/dashboard/stats',
      activities: '/dashboard/activities',
      metrics: '/dashboard/metrics',
      health: '/dashboard/health',
    },
    environments: {
      list: '/environments',
      get: '/environments/:id',
      status: '/environments/:id/status',
      health: '/environments/:id/health',
    },
    teams: {
      list: '/teams',
      get: '/teams/:id',
      members: '/teams/:id/members',
    },
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },
  },
};

export const getApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${apiConfig.baseUrl}/api/${apiConfig.apiVersion}${endpoint}`;
  
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
};

export const updateApiConfig = (updates: Partial<ApiConfig>): void => {
  Object.assign(apiConfig, updates);
};