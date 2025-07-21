import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { WorkflowManager } from './components/workflows/WorkflowManager';
import ReleaseManager from './components/releases/ReleaseManager';
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
