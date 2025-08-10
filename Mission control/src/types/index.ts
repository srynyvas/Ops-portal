// Export all types from submodules
export * from './common';
export * from './dashboard';
export * from './workflows';
export * from './releases';
export * from './release-management';

// Global application types
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  features: FeatureFlags;
  theme: ThemeConfig;
}

export interface FeatureFlags {
  enableWorkflows: boolean;
  enableReleases: boolean;
  enableAnalytics: boolean;
  enableCollaboration: boolean;
  enableNotifications: boolean;
  enableExport: boolean;
  enableTemplates: boolean;
  betaFeatures: string[];
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description?: string;
  badge?: string | number;
  children?: NavigationItem[];
  permissions?: string[];
}

export interface ViewState {
  currentPage: string;
  sidebarCollapsed: boolean;
  activeFilters: Record<string, any>;
  searchQuery: string;
  selectedItems: string[];
  viewMode: 'grid' | 'list' | 'kanban' | 'timeline';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  source: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
  scope?: 'global' | 'modal' | 'editor';
}