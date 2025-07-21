import { BaseEntity, Priority, Status, Environment, StatusHistory, User } from './common';

export interface SystemMetrics {
  activeServices: number;
  deploymentsToday: number;
  systemHealth: number;
  openIncidents: number;
  cpuUsage: number;
  memoryUsage: number;
  networkIO: number;
}

export interface Service {
  id: string;
  name: string;
  version: string;
  status: 'healthy' | 'degraded' | 'down';
  type: 'microservice' | 'api' | 'database' | 'queue';
  environment: Environment;
  url?: string;
  description?: string;
  owner?: string;
  lastDeployed?: string;
  healthChecks: HealthCheck[];
}

export interface HealthCheck {
  id: string;
  name: string;
  status: 'passing' | 'warning' | 'critical';
  lastCheck: string;
  responseTime: number;
  message?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  branch: string;
  status: 'running' | 'success' | 'failed' | 'queued' | 'cancelled';
  duration: string;
  startedAt: string;
  finishedAt?: string;
  triggeredBy: string;
  commit?: {
    id: string;
    message: string;
    author: string;
  };
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration?: string;
  logs?: string;
  artifacts?: string[];
}

export interface Deployment {
  id: string;
  service: string;
  version: string;
  environment: Environment;
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolled-back';
  deployedBy: string;
  deployedAt: string;
  duration?: string;
  rollbackVersion?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  lead: User;
  members: User[];
  focus: string;
  slackChannel?: string;
  emailGroup?: string;
  permissions: TeamPermission[];
}

export interface TeamPermission {
  id: string;
  resource: string;
  actions: ('read' | 'write' | 'admin')[];
  environment?: Environment;
}

export interface Incident extends BaseEntity {
  title: string;
  description: string;
  severity: Priority;
  status: 'open' | 'investigating' | 'in-progress' | 'monitoring' | 'resolved';
  assignee?: User;
  reporter: User;
  affectedServices: string[];
  timeline: IncidentTimelineEntry[];
  resolution?: string;
  postmortemUrl?: string;
}

export interface IncidentTimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  user: User;
  type: 'created' | 'updated' | 'assigned' | 'commented' | 'resolved';
}

export interface Documentation {
  id: string;
  title: string;
  type: 'api' | 'guide' | 'best-practice' | 'tutorial';
  category: string;
  content: string;
  author: User;
  lastUpdated: string;
  tags: string[];
  version: string;
  status: 'draft' | 'published' | 'archived';
  url?: string;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters: ApiParameter[];
  responses: ApiResponse[];
  examples: ApiExample[];
  deprecated?: boolean;
  version: string;
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
  enum?: string[];
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: object;
  example?: any;
}

export interface ApiExample {
  name: string;
  description: string;
  request: object;
  response: object;
}