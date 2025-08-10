/**
 * Comprehensive React hooks for Release Management data operations
 * Provides CRUD operations, real-time updates, and analytics
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Release,
  Feature,
  Task,
  EnvironmentDeployment,
  Approval,
  ReleaseStatus,
  FeatureStatus,
  TaskStatus,
  DeploymentStatus,
  ReleaseFilter,
  ReleaseSortOptions,
  PaginationOptions,
  PagedResponse,
  ApiResponse,
  ReleaseAnalytics,
  Priority,
  User,
  RiskAssessment
} from '../types/release-management';

// ============================================================================
// useReleaseData Hook - Main release CRUD operations
// ============================================================================

interface UseReleaseDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  filter?: ReleaseFilter;
  sort?: ReleaseSortOptions;
  pagination?: PaginationOptions;
}

interface UseReleaseDataReturn {
  releases: Release[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  createRelease: (release: Partial<Release>) => Promise<Release>;
  updateRelease: (id: string, updates: Partial<Release>) => Promise<Release>;
  deleteRelease: (id: string) => Promise<void>;
  getRelease: (id: string) => Promise<Release>;
  refreshReleases: () => Promise<void>;
  setFilter: (filter: ReleaseFilter) => void;
  setSort: (sort: ReleaseSortOptions) => void;
  setPagination: (pagination: PaginationOptions) => void;
}

export const useReleaseData = (options: UseReleaseDataOptions = {}): UseReleaseDataReturn => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState(options.filter || {});
  const [sort, setSort] = useState(options.sort || { field: 'updatedAt', direction: 'desc' });
  const [pagination, setPagination] = useState(options.pagination || { page: 1, pageSize: 20 });

  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  // Fetch releases with filters, sorting, and pagination
  const fetchReleases = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual service call
      const response = await mockFetchReleases(filter, sort, pagination);
      setReleases(response.items);
      setTotalCount(response.pagination.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filter, sort, pagination]);

  // Create a new release
  const createRelease = useCallback(async (releaseData: Partial<Release>): Promise<Release> => {
    try {
      const newRelease = await mockCreateRelease(releaseData);
      setReleases(prev => [newRelease, ...prev]);
      return newRelease;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Update an existing release
  const updateRelease = useCallback(async (id: string, updates: Partial<Release>): Promise<Release> => {
    try {
      const updatedRelease = await mockUpdateRelease(id, updates);
      setReleases(prev => prev.map(r => r.id === id ? updatedRelease : r));
      return updatedRelease;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Delete a release
  const deleteRelease = useCallback(async (id: string): Promise<void> => {
    try {
      await mockDeleteRelease(id);
      setReleases(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Get a single release by ID
  const getRelease = useCallback(async (id: string): Promise<Release> => {
    try {
      return await mockGetRelease(id);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Manual refresh
  const refreshReleases = useCallback(async () => {
    await fetchReleases();
  }, [fetchReleases]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchReleases();

    if (options.autoRefresh && options.refreshInterval) {
      refreshIntervalRef.current = setInterval(fetchReleases, options.refreshInterval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchReleases, options.autoRefresh, options.refreshInterval]);

  return {
    releases,
    loading,
    error,
    totalCount,
    createRelease,
    updateRelease,
    deleteRelease,
    getRelease,
    refreshReleases,
    setFilter,
    setSort,
    setPagination
  };
};

// ============================================================================
// useFeatureData Hook - Feature management within releases
// ============================================================================

interface UseFeatureDataReturn {
  features: Feature[];
  loading: boolean;
  error: Error | null;
  createFeature: (releaseId: string, feature: Partial<Feature>) => Promise<Feature>;
  updateFeature: (id: string, updates: Partial<Feature>) => Promise<Feature>;
  deleteFeature: (id: string) => Promise<void>;
  moveFeature: (featureId: string, newReleaseId: string) => Promise<void>;
  updateFeatureStatus: (id: string, status: FeatureStatus) => Promise<void>;
  bulkUpdateFeatures: (ids: string[], updates: Partial<Feature>) => Promise<void>;
}

export const useFeatureData = (releaseId?: string): UseFeatureDataReturn => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch features for a release
  const fetchFeatures = useCallback(async () => {
    if (!releaseId) return;
    
    setLoading(true);
    try {
      const fetchedFeatures = await mockFetchFeatures(releaseId);
      setFeatures(fetchedFeatures);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [releaseId]);

  // Create a new feature
  const createFeature = useCallback(async (releaseId: string, featureData: Partial<Feature>): Promise<Feature> => {
    try {
      const newFeature = await mockCreateFeature(releaseId, featureData);
      setFeatures(prev => [...prev, newFeature]);
      return newFeature;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Update feature
  const updateFeature = useCallback(async (id: string, updates: Partial<Feature>): Promise<Feature> => {
    try {
      const updatedFeature = await mockUpdateFeature(id, updates);
      setFeatures(prev => prev.map(f => f.id === id ? updatedFeature : f));
      return updatedFeature;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Delete feature
  const deleteFeature = useCallback(async (id: string): Promise<void> => {
    try {
      await mockDeleteFeature(id);
      setFeatures(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Move feature to different release
  const moveFeature = useCallback(async (featureId: string, newReleaseId: string): Promise<void> => {
    try {
      await mockMoveFeature(featureId, newReleaseId);
      setFeatures(prev => prev.filter(f => f.id !== featureId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Update feature status
  const updateFeatureStatus = useCallback(async (id: string, status: FeatureStatus): Promise<void> => {
    await updateFeature(id, { status });
  }, [updateFeature]);

  // Bulk update features
  const bulkUpdateFeatures = useCallback(async (ids: string[], updates: Partial<Feature>): Promise<void> => {
    try {
      await Promise.all(ids.map(id => updateFeature(id, updates)));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [updateFeature]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return {
    features,
    loading,
    error,
    createFeature,
    updateFeature,
    deleteFeature,
    moveFeature,
    updateFeatureStatus,
    bulkUpdateFeatures
  };
};

// ============================================================================
// useDeploymentData Hook - Deployment operations and monitoring
// ============================================================================

interface UseDeploymentDataReturn {
  deployments: EnvironmentDeployment[];
  loading: boolean;
  error: Error | null;
  deployRelease: (releaseId: string, environmentId: string) => Promise<EnvironmentDeployment>;
  rollbackDeployment: (deploymentId: string) => Promise<void>;
  getDeploymentStatus: (deploymentId: string) => Promise<DeploymentStatus>;
  getDeploymentLogs: (deploymentId: string) => Promise<string[]>;
  monitorDeployment: (deploymentId: string, onUpdate: (status: DeploymentStatus) => void) => () => void;
}

export const useDeploymentData = (releaseId?: string): UseDeploymentDataReturn => {
  const [deployments, setDeployments] = useState<EnvironmentDeployment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Deploy release to environment
  const deployRelease = useCallback(async (releaseId: string, environmentId: string): Promise<EnvironmentDeployment> => {
    setLoading(true);
    try {
      const deployment = await mockDeployRelease(releaseId, environmentId);
      setDeployments(prev => [...prev, deployment]);
      return deployment;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rollback deployment
  const rollbackDeployment = useCallback(async (deploymentId: string): Promise<void> => {
    setLoading(true);
    try {
      await mockRollbackDeployment(deploymentId);
      setDeployments(prev => 
        prev.map(d => d.id === deploymentId ? { ...d, status: 'rolled-back' } : d)
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get deployment status
  const getDeploymentStatus = useCallback(async (deploymentId: string): Promise<DeploymentStatus> => {
    try {
      return await mockGetDeploymentStatus(deploymentId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Get deployment logs
  const getDeploymentLogs = useCallback(async (deploymentId: string): Promise<string[]> => {
    try {
      return await mockGetDeploymentLogs(deploymentId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Monitor deployment with real-time updates
  const monitorDeployment = useCallback((deploymentId: string, onUpdate: (status: DeploymentStatus) => void) => {
    const interval = setInterval(async () => {
      try {
        const status = await getDeploymentStatus(deploymentId);
        onUpdate(status);
        
        if (status === 'success' || status === 'failed' || status === 'rolled-back') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error monitoring deployment:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [getDeploymentStatus]);

  return {
    deployments,
    loading,
    error,
    deployRelease,
    rollbackDeployment,
    getDeploymentStatus,
    getDeploymentLogs,
    monitorDeployment
  };
};

// ============================================================================
// useReleaseAnalytics Hook - Analytics and metrics
// ============================================================================

interface UseReleaseAnalyticsReturn {
  analytics: ReleaseAnalytics | null;
  loading: boolean;
  error: Error | null;
  fetchAnalytics: (releaseId: string) => Promise<void>;
  compareReleases: (releaseIds: string[]) => Promise<any>;
  getTeamMetrics: (teamId: string) => Promise<any>;
  exportAnalytics: (format: 'pdf' | 'excel' | 'csv') => Promise<Blob>;
}

export const useReleaseAnalytics = (): UseReleaseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<ReleaseAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch analytics for a release
  const fetchAnalytics = useCallback(async (releaseId: string): Promise<void> => {
    setLoading(true);
    try {
      const data = await mockFetchAnalytics(releaseId);
      setAnalytics(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compare multiple releases
  const compareReleases = useCallback(async (releaseIds: string[]): Promise<any> => {
    try {
      return await mockCompareReleases(releaseIds);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Get team metrics
  const getTeamMetrics = useCallback(async (teamId: string): Promise<any> => {
    try {
      return await mockGetTeamMetrics(teamId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Export analytics
  const exportAnalytics = useCallback(async (format: 'pdf' | 'excel' | 'csv'): Promise<Blob> => {
    try {
      return await mockExportAnalytics(analytics!, format);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [analytics]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    compareReleases,
    getTeamMetrics,
    exportAnalytics
  };
};

// ============================================================================
// useApprovalWorkflow Hook - Approval process management
// ============================================================================

interface UseApprovalWorkflowReturn {
  approvals: Approval[];
  loading: boolean;
  error: Error | null;
  requestApproval: (releaseId: string, environmentId: string) => Promise<Approval>;
  approveRelease: (approvalId: string, comments?: string) => Promise<void>;
  rejectRelease: (approvalId: string, reason: string) => Promise<void>;
  getPendingApprovals: () => Promise<Approval[]>;
  escalateApproval: (approvalId: string) => Promise<void>;
}

export const useApprovalWorkflow = (): UseApprovalWorkflowReturn => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Request approval for deployment
  const requestApproval = useCallback(async (releaseId: string, environmentId: string): Promise<Approval> => {
    setLoading(true);
    try {
      const approval = await mockRequestApproval(releaseId, environmentId);
      setApprovals(prev => [...prev, approval]);
      return approval;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approve release
  const approveRelease = useCallback(async (approvalId: string, comments?: string): Promise<void> => {
    try {
      await mockApproveRelease(approvalId, comments);
      setApprovals(prev => 
        prev.map(a => a.id === approvalId ? { ...a, status: 'approved' } : a)
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Reject release
  const rejectRelease = useCallback(async (approvalId: string, reason: string): Promise<void> => {
    try {
      await mockRejectRelease(approvalId, reason);
      setApprovals(prev => 
        prev.map(a => a.id === approvalId ? { ...a, status: 'rejected', comments: reason } : a)
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Get pending approvals
  const getPendingApprovals = useCallback(async (): Promise<Approval[]> => {
    try {
      const pending = await mockGetPendingApprovals();
      setApprovals(pending);
      return pending;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Escalate approval
  const escalateApproval = useCallback(async (approvalId: string): Promise<void> => {
    try {
      await mockEscalateApproval(approvalId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return {
    approvals,
    loading,
    error,
    requestApproval,
    approveRelease,
    rejectRelease,
    getPendingApprovals,
    escalateApproval
  };
};

// ============================================================================
// Mock Functions - Replace with actual API calls
// ============================================================================

async function mockFetchReleases(filter: ReleaseFilter, sort: ReleaseSortOptions, pagination: PaginationOptions): Promise<PagedResponse<Release>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return empty data - no mock releases
  return {
    items: [],
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: 0,
      totalPages: 0
    }
  };
}

async function mockCreateRelease(releaseData: Partial<Release>): Promise<Release> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: `release-${Date.now()}`,
    name: releaseData.name || 'New Release',
    version: releaseData.version || '1.0.0',
    description: releaseData.description || '',
    type: releaseData.type || 'minor',
    status: 'planning',
    priority: releaseData.priority || 'medium',
    plannedDate: releaseData.plannedDate || new Date(),
    createdBy: 'current-user',
    assignedTo: releaseData.assignedTo || [],
    environments: [],
    features: [],
    riskAssessment: {} as RiskAssessment,
    approvals: [],
    metadata: { tags: [], links: [] },
    createdAt: new Date(),
    updatedAt: new Date()
  } as Release;
}

async function mockUpdateRelease(id: string, updates: Partial<Release>): Promise<Release> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { id, ...updates, updatedAt: new Date() } as Release;
}

async function mockDeleteRelease(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

async function mockGetRelease(id: string): Promise<Release> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {} as Release;
}

async function mockFetchFeatures(releaseId: string): Promise<Feature[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
}

async function mockCreateFeature(releaseId: string, featureData: Partial<Feature>): Promise<Feature> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: `feature-${Date.now()}`,
    releaseId,
    ...featureData
  } as Feature;
}

async function mockUpdateFeature(id: string, updates: Partial<Feature>): Promise<Feature> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { id, ...updates } as Feature;
}

async function mockDeleteFeature(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

async function mockMoveFeature(featureId: string, newReleaseId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

async function mockDeployRelease(releaseId: string, environmentId: string): Promise<EnvironmentDeployment> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: `deployment-${Date.now()}`,
    releaseId,
    status: 'in-progress'
  } as EnvironmentDeployment;
}

async function mockRollbackDeployment(deploymentId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function mockGetDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return 'success';
}

async function mockGetDeploymentLogs(deploymentId: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return ['Deployment started', 'Building application', 'Deploying to server'];
}

async function mockFetchAnalytics(releaseId: string): Promise<ReleaseAnalytics> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    releaseId,
    metrics: {
      velocity: 85,
      leadTime: 14,
      cycleTime: 7,
      deploymentFrequency: 4,
      mttr: 2,
      changeFailureRate: 5,
      bugEscapeRate: 3
    },
    trends: {
      velocityTrend: [],
      deploymentTrend: [],
      qualityTrend: []
    },
    comparisons: {}
  };
}

async function mockCompareReleases(releaseIds: string[]): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {};
}

async function mockGetTeamMetrics(teamId: string): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {};
}

async function mockExportAnalytics(analytics: ReleaseAnalytics, format: string): Promise<Blob> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return new Blob(['analytics data'], { type: 'application/octet-stream' });
}

async function mockRequestApproval(releaseId: string, environmentId: string): Promise<Approval> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: `approval-${Date.now()}`,
    releaseId,
    environmentId,
    type: 'deployment',
    status: 'pending',
    requestedBy: 'current-user',
    requestedAt: new Date(),
    approvers: []
  } as Approval;
}

async function mockApproveRelease(approvalId: string, comments?: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function mockRejectRelease(approvalId: string, reason: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function mockGetPendingApprovals(): Promise<Approval[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
}

async function mockEscalateApproval(approvalId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
}