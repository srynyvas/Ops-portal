// Additional dashboard types that were referenced in data file
export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  period: 'hour' | 'day' | 'week' | 'month';
  icon: string;
  color: string;
  format?: 'number' | 'percentage' | 'currency' | 'bytes';
}

export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  services: ServiceStatus[];
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  description?: string;
  lastIncident?: string;
}

export interface ActivityItem {
  id: string;
  type: 'deployment' | 'incident' | 'workflow' | 'release' | 'alert' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning' | 'info' | 'resolved';
  icon: string;
  user: string;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
  style: 'primary' | 'secondary' | 'danger';
}

export interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'status' | 'activity';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: Record<string, any>;
  refreshInterval?: number;
}

export interface ChartData {
  id: string;
  label: string;
  data: Array<{
    x: string | number;
    y: number;
    label?: string;
  }>;
  color?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SortOption {
  field: string;
  label: string;
  direction: 'asc' | 'desc';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  permissions?: string[];
}
