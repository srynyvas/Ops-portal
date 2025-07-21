import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { WorkflowManager } from './components/workflows/WorkflowManager';
import { ReleaseManager } from './components/releases/ReleaseManager';
import { useAppConfig } from './hooks/useAppConfig';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { APP_CONFIG } from './constants';
import type { NavigationItem, ViewState } from './types';

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    path: '/dashboard',
    description: 'Overview and metrics',
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'Server',
    path: '/services',
    description: 'Service catalog and health',
  },
  {
    id: 'pipelines',
    label: 'Pipelines',
    icon: 'GitBranch',
    path: '/pipelines',
    description: 'CI/CD status',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: 'Activity',
    path: '/workflows',
    description: 'Mind map workflows',
  },
  {
    id: 'releases',
    label: 'Releases',
    icon: 'Package',
    path: '/releases',
    description: 'Release planning',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: 'Activity',
    path: '/monitoring',
    description: 'Alerts and performance',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    icon: 'Book',
    path: '/documentation',
    description: 'Guides and APIs',
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: 'Users',
    path: '/teams',
    description: 'Management and access',
  },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: 'AlertTriangle',
    path: '/incidents',
    description: 'Tracking and resolution',
  },
];

const INITIAL_VIEW_STATE: ViewState = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  activeFilters: {},
  searchQuery: '',
  selectedItems: [],
  viewMode: 'grid',
  sortBy: 'updated',
  sortOrder: 'desc',
};

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [isLoading, setIsLoading] = useState(true);
  
  const { config, isLoading: configLoading, error: configError } = useAppConfig();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => {
      console.log('Global search triggered');
    },
    onNewWorkflow: () => {
      setViewState(prev => ({ ...prev, currentPage: 'workflows' }));
    },
    onNewRelease: () => {
      setViewState(prev => ({ ...prev, currentPage: 'releases' }));
    },
    onToggleSidebar: () => {
      setViewState(prev => ({ 
        ...prev, 
        sidebarCollapsed: !prev.sidebarCollapsed 
      }));
    },
  });

  // Load application state from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('mission-control-view-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setViewState(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to parse saved view state:', error);
    }
    setIsLoading(false);
  }, []);

  // Save view state to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('mission-control-view-state', JSON.stringify(viewState));
      } catch (error) {
        console.warn('Failed to save view state:', error);
      }
    }
  }, [viewState, isLoading]);

  const handleNavigate = (pageId: string) => {
    setViewState(prev => ({ 
      ...prev, 
      currentPage: pageId,
      selectedItems: [],
      searchQuery: '',
    }));
  };

  const updateViewState = (updates: Partial<ViewState>) => {
    setViewState(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentPage = () => {
    try {
      switch (viewState.currentPage) {
        case 'dashboard':
          return <Dashboard viewState={viewState} onUpdateViewState={updateViewState} />;
        case 'workflows':
          return <WorkflowManager viewState={viewState} onUpdateViewState={updateViewState} />;
        case 'releases':
          return <ReleaseManager viewState={viewState} onUpdateViewState={updateViewState} />;
        case 'services':
        case 'pipelines':
        case 'monitoring':
        case 'documentation':
        case 'teams':
        case 'incidents':
          return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-center max-w-md">
                The {NAVIGATION_ITEMS.find(item => item.id === viewState.currentPage)?.label} section 
                is currently under development. Check back soon for updates!
              </p>
            </div>
          );
        default:
          return <Dashboard viewState={viewState} onUpdateViewState={updateViewState} />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="flex flex-col items-center justify-center h-96 text-red-500">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p className="text-center max-w-md">
            Something went wrong loading this page. Please try refreshing.
          </p>
        </div>
      );
    }
  };

  if (configLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" message="Loading Mission Control..." />
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Configuration Error
          </h1>
          <p className="text-gray-600 mb-4">
            Failed to load application configuration.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Layout
          navigationItems={NAVIGATION_ITEMS}
          currentPage={viewState.currentPage}
          sidebarCollapsed={viewState.sidebarCollapsed}
          onNavigate={handleNavigate}
          onToggleSidebar={() => updateViewState({ 
            sidebarCollapsed: !viewState.sidebarCollapsed 
          })}
          appConfig={{
            name: APP_CONFIG.name,
            version: APP_CONFIG.version,
          }}
        >
          <main className="flex-1 overflow-auto">
            {renderCurrentPage()}
          </main>
        </Layout>
      </div>
    </ErrorBoundary>
  );
};

export default App;
