import { BaseEntity, Priority, Status, StatusHistory, Environment } from './common';

export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix' | 'beta' | 'alpha';
export type ReleaseNodeType = 'release' | 'feature' | 'task';
export type ReleaseStatus = 'planning' | 'in-development' | 'testing' | 'ready-for-release' | 'released' | 'blocked' | 'on-hold';

export interface ReleaseNode {
  id: string;
  title: string;
  type: ReleaseNodeType;
  color: string;
  icon: string;
  expanded: boolean;
  properties: ReleaseNodeProperties;
  children: ReleaseNode[];
}

export interface ReleaseNodeProperties {
  version: string;
  assignee: string;
  targetDate: string;
  environment: Environment;
  description: string;
  tags: string[];
  priority: Priority;
  status: ReleaseStatus;
  storyPoints: string;
  dependencies: string[];
  notes: string;
  releaseNotes: string;
  estimatedHours?: number;
  actualHours?: number;
  testCases: TestCase[];
  deploymentConfig?: DeploymentConfig;
  rollbackPlan?: string;
  securityReview?: SecurityReview;
  performanceMetrics?: PerformanceMetrics;
}

export interface Release extends BaseEntity {
  name: string;
  version: string;
  description: string;
  category: ReleaseType;
  tags: string[];
  targetDate: string;
  environment: Environment;
  status: 'active' | 'closed' | 'archived';
  statusHistory: StatusHistory[];
  nodeCount: number;
  completion: number;
  owner: string;
  stakeholders: Stakeholder[];
  preview: ReleasePreview;
  nodes: ReleaseNode[];
  changelog: ChangelogEntry[];
  metrics: ReleaseMetrics;
  approvals: Approval[];
  notifications: NotificationSettings;
}

export interface ReleasePreview {
  centralNode: string;
  branches: string[];
  totalFeatures: number;
  totalTasks: number;
  completedTasks: number;
  blockedTasks: number;
}

export interface Stakeholder {
  userId: string;
  role: 'owner' | 'approver' | 'reviewer' | 'contributor' | 'observer';
  addedAt: string;
  addedBy: string;
  notifications: boolean;
}

export interface ChangelogEntry {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  ticketId?: string;
  author: string;
  timestamp: string;
  breaking: boolean;
}

export interface ReleaseMetrics {
  leadTime: number; // in hours
  cycleTime: number; // in hours
  deploymentFrequency: number;
  meanTimeToRecovery: number;
  changeFailureRate: number;
  throughput: number;
  velocityTrend: VelocityPoint[];
  bugCount: number;
  testCoverage: number;
}

export interface VelocityPoint {
  date: string;
  storyPoints: number;
  tasksCompleted: number;
}

export interface Approval {
  id: string;
  type: 'technical' | 'business' | 'security' | 'legal' | 'compliance';
  approver: string;
  status: 'pending' | 'approved' | 'rejected' | 'conditional';
  comments?: string;
  conditions?: string[];
  approvedAt?: string;
  requiredFor: Environment[];
}

export interface NotificationSettings {
  emailUpdates: boolean;
  slackUpdates: boolean;
  webhookUrl?: string;
  recipients: string[];
  events: NotificationEvent[];
}

export interface NotificationEvent {
  type: 'status_change' | 'milestone' | 'blocker' | 'deployment' | 'rollback';
  enabled: boolean;
  channels: ('email' | 'slack' | 'webhook')[];
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  automationLevel: 'manual' | 'automated' | 'semi-automated';
  priority: Priority;
  estimatedDuration: number;
  actualDuration?: number;
  lastRun?: string;
  testResults?: TestResult[];
}

export interface TestResult {
  id: string;
  runDate: string;
  status: 'passed' | 'failed' | 'error';
  duration: number;
  environment: Environment;
  logs?: string;
  screenshots?: string[];
  coverage?: number;
}

export interface DeploymentConfig {
  strategy: 'blue-green' | 'rolling' | 'canary' | 'recreate';
  environments: Environment[];
  prerequisites: string[];
  rollbackTriggers: string[];
  healthChecks: string[];
  timeout: number;
  batchSize?: number;
  canaryPercentage?: number;
}

export interface SecurityReview {
  id: string;
  reviewer: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  findings: SecurityFinding[];
  reviewedAt?: string;
  approvedAt?: string;
  comments?: string;
}

export interface SecurityFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'vulnerability' | 'compliance' | 'best-practice';
  description: string;
  remediation?: string;
  status: 'open' | 'mitigated' | 'accepted' | 'fixed';
  cveId?: string;
}

export interface PerformanceMetrics {
  beforeRelease: PerformanceBenchmark;
  afterRelease?: PerformanceBenchmark;
  improvementTargets: ImprovementTarget[];
}

export interface PerformanceBenchmark {
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskIO: number;
  measuredAt: string;
}

export interface ImprovementTarget {
  metric: string;
  currentValue: number;
  targetValue: number;
  tolerance: number;
  achieved?: boolean;
}

export interface ReleasePipeline {
  id: string;
  releaseId: string;
  name: string;
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  artifacts: Artifact[];
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  environment?: Environment;
  commands: string[];
  dependencies: string[];
  timeout: number;
  retryCount: number;
  artifacts: string[];
  logs?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PipelineTrigger {
  type: 'manual' | 'webhook' | 'schedule' | 'dependency';
  config: object;
  enabled: boolean;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'binary' | 'documentation' | 'configuration' | 'test-results';
  path: string;
  size: number;
  checksum: string;
  createdAt: string;
  downloadUrl?: string;
}