/**
 * Comprehensive TypeScript interfaces for Release Management System
 * Includes enterprise-grade features for release planning, deployment, and analytics
 */

// ============================================================================
// Core Release Interfaces
// ============================================================================

export interface Release {
  id: string;
  name: string;
  version: string;
  description: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  status: ReleaseStatus;
  priority: Priority;
  plannedDate: Date;
  actualDate?: Date;
  createdBy: string;
  assignedTo: string[];
  environments: EnvironmentDeployment[];
  features: Feature[];
  riskAssessment: RiskAssessment;
  approvals: Approval[];
  metadata: ReleaseMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: string;
  releaseId: string;
  title: string;
  description: string;
  type: 'feature' | 'enhancement' | 'bugfix' | 'security';
  status: FeatureStatus;
  priority: Priority;
  storyPoints: number;
  assignedTo: string;
  tasks: Task[];
  dependencies: string[];
  testCases: TestCase[];
  pullRequests: PullRequest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  featureId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  estimatedHours: number;
  actualHours?: number;
  assignedTo: string;
  dueDate?: Date;
  completedAt?: Date;
  blockers?: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Deployment and Environment Interfaces
// ============================================================================

export interface EnvironmentDeployment {
  id: string;
  releaseId: string;
  environment: Environment;
  status: DeploymentStatus;
  deployedVersion?: string;
  deployedAt?: Date;
  deployedBy?: string;
  rollbackVersion?: string;
  healthChecks: HealthCheck[];
  metrics: DeploymentMetrics;
  logs: DeploymentLog[];
}

export interface Environment {
  id: string;
  name: string;
  type: 'development' | 'testing' | 'staging' | 'production';
  url: string;
  description: string;
  requiresApproval: boolean;
  approvers: string[];
  healthCheckUrl: string;
  config: EnvironmentConfig;
  restrictions?: DeploymentRestriction[];
}

export interface EnvironmentConfig {
  apiUrl: string;
  databaseUrl?: string;
  features?: Record<string, boolean>;
  secrets?: string[];
  scaling?: {
    min: number;
    max: number;
    targetCPU?: number;
  };
}

export interface DeploymentRestriction {
  type: 'time' | 'approval' | 'health' | 'dependency';
  description: string;
  config: Record<string, any>;
}

// ============================================================================
// Approval and Workflow Interfaces
// ============================================================================

export interface Approval {
  id: string;
  releaseId: string;
  environmentId: string;
  type: 'deployment' | 'rollback' | 'hotfix' | 'emergency';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedBy: string;
  requestedAt: Date;
  approvers: ApprovalUser[];
  comments?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface ApprovalUser {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  respondedAt?: Date;
  comments?: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  stages: ApprovalStage[];
  conditions: WorkflowCondition[];
  notifications: NotificationConfig[];
}

export interface ApprovalStage {
  id: string;
  name: string;
  order: number;
  approvers: string[];
  minApprovals: number;
  timeout?: number; // in hours
  escalation?: string[];
}

// ============================================================================
// Risk and Assessment Interfaces
// ============================================================================

export interface RiskAssessment {
  id: string;
  releaseId: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigations: RiskMitigation[];
  assessedBy: string;
  assessedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface RiskFactor {
  id: string;
  category: 'technical' | 'business' | 'security' | 'compliance' | 'operational';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain';
  impact: string;
  score: number;
}

export interface RiskMitigation {
  id: string;
  riskFactorId: string;
  strategy: string;
  owner: string;
  status: 'planned' | 'in-progress' | 'completed';
  dueDate?: Date;
  effectiveness?: 'low' | 'medium' | 'high';
}

// ============================================================================
// Monitoring and Metrics Interfaces
// ============================================================================

export interface HealthCheck {
  id: string;
  name: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastChecked: Date;
  details?: Record<string, any>;
}

export interface DeploymentMetrics {
  deploymentDuration: number;
  rollbackCount: number;
  errorRate: number;
  successRate: number;
  affectedUsers?: number;
  performanceImpact?: PerformanceMetric[];
  resourceUsage?: ResourceMetric[];
}

export interface PerformanceMetric {
  name: string;
  baseline: number;
  current: number;
  unit: string;
  status: 'improved' | 'stable' | 'degraded';
}

export interface ResourceMetric {
  resource: 'cpu' | 'memory' | 'disk' | 'network';
  usage: number;
  limit: number;
  unit: string;
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
  source?: string;
}

// ============================================================================
// Analytics and Reporting Interfaces
// ============================================================================

export interface ReleaseAnalytics {
  releaseId: string;
  metrics: {
    velocity: number;
    leadTime: number;
    cycleTime: number;
    deploymentFrequency: number;
    mttr: number; // Mean Time To Recovery
    changeFailureRate: number;
    bugEscapeRate: number;
  };
  trends: {
    velocityTrend: TrendData[];
    deploymentTrend: TrendData[];
    qualityTrend: TrendData[];
  };
  comparisons: {
    previousRelease?: ComparisonData;
    teamAverage?: ComparisonData;
    targetMetrics?: ComparisonData;
  };
}

export interface TrendData {
  date: Date;
  value: number;
  label?: string;
}

export interface ComparisonData {
  metric: string;
  current: number;
  comparison: number;
  difference: number;
  percentageChange: number;
}

// ============================================================================
// Supporting Interfaces
// ============================================================================

export interface ReleaseMetadata {
  tags: string[];
  links: ExternalLink[];
  customFields?: Record<string, any>;
  attachments?: Attachment[];
  stakeholders?: Stakeholder[];
}

export interface TestCase {
  id: string;
  featureId: string;
  title: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  automationStatus: 'manual' | 'automated' | 'partially-automated';
  executedBy?: string;
  executedAt?: Date;
  duration?: number;
  results?: TestResult[];
}

export interface TestResult {
  id: string;
  testCaseId: string;
  environment: string;
  status: 'passed' | 'failed' | 'skipped';
  executedAt: Date;
  duration: number;
  errorMessage?: string;
  stackTrace?: string;
  screenshots?: string[];
}

export interface PullRequest {
  id: string;
  featureId: string;
  title: string;
  description: string;
  status: 'open' | 'merged' | 'closed';
  sourceRef: string;
  targetRef: string;
  author: string;
  reviewers: string[];
  createdAt: Date;
  mergedAt?: Date;
  url: string;
}

export interface Comment {
  id: string;
  entityId: string;
  entityType: 'release' | 'feature' | 'task' | 'deployment';
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  mentions?: string[];
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'issue' | 'pr' | 'monitoring' | 'other';
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'approver' | 'contributor' | 'observer';
  department?: string;
}

export interface WorkflowCondition {
  id: string;
  type: 'time' | 'approval' | 'metric' | 'custom';
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'between';
  value: any;
  action: 'proceed' | 'block' | 'notify' | 'escalate';
}

export interface NotificationConfig {
  id: string;
  type: 'email' | 'slack' | 'teams' | 'webhook';
  recipients: string[];
  template: string;
  triggers: string[];
  config?: Record<string, any>;
}

// ============================================================================
// Status and Type Enums
// ============================================================================

export type ReleaseStatus =
  | 'draft'
  | 'planning'
  | 'in-development'
  | 'code-complete'
  | 'testing'
  | 'ready-for-staging'
  | 'staging'
  | 'ready-for-production'
  | 'deploying'
  | 'deployed'
  | 'rolled-back'
  | 'cancelled'
  | 'archived';

export type FeatureStatus =
  | 'backlog'
  | 'ready'
  | 'in-progress'
  | 'code-review'
  | 'testing'
  | 'done'
  | 'blocked'
  | 'cancelled';

export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'testing'
  | 'done'
  | 'blocked'
  | 'cancelled';

export type DeploymentStatus =
  | 'pending'
  | 'queued'
  | 'in-progress'
  | 'validating'
  | 'success'
  | 'failed'
  | 'rolled-back'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// Filter and Query Interfaces
// ============================================================================

export interface ReleaseFilter {
  status?: ReleaseStatus[];
  type?: string[];
  priority?: Priority[];
  assignedTo?: string[];
  environment?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  search?: string;
}

export interface ReleaseSortOptions {
  field: 'name' | 'version' | 'status' | 'priority' | 'plannedDate' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total?: number;
}

// ============================================================================
// Response Interfaces for API
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: {
    timestamp: Date;
    version: string;
    requestId: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PagedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// User and Permission Interfaces
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: Role[];
  teams: Team[];
  preferences?: UserPreferences;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  lead: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: NotificationPreference[];
  dashboard?: DashboardPreference;
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  channels: string[];
}

export interface DashboardPreference {
  layout: string;
  widgets: string[];
  refreshInterval?: number;
}