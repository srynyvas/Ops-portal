import React, { useState } from 'react';
import {
  Home, Rocket, Database, GitBranch, Activity, Book, Users, AlertTriangle,
  Search, Bell, ChevronLeft, ChevronRight, Menu, X, Package, Shield,
  TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle,
  Calendar, Tag, Settings, HelpCircle, LogOut, User, Key, UserPlus,
  Filter, Grid, List, BarChart3, Server, FileText, Zap, Globe,
  Cpu, HardDrive, Wifi, Lock, Unlock, RefreshCw, Download, Upload
} from 'lucide-react';

// Import IntegratedReleaseManager directly
import IntegratedReleaseManager from './releases/IntegratedReleaseManager';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  subItems?: { id: string; label: string; icon?: React.ElementType }[];
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface Pipeline {
  id: string;
  name: string;
  status: 'running' | 'succeeded' | 'failed' | 'queued';
  branch: string;
  commit: string;
  author: string;
  duration: string;
  timestamp: string;
}

interface Service {
  id: string;
  name: string;
  category: 'microservices' | 'apis' | 'infrastructure';
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  uptime: string;
  responseTime: string;
  errorRate: string;
}

interface Release {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'completed' | 'upcoming' | 'draft';
  progress: number;
  date: string;
  environment: string;
  team: string;
}

interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  assignee: string;
  duration: string;
  affectedServices: number;
}

interface Team {
  id: string;
  name: string;
  lead: string;
  members: number;
  projects: number;
  performance: number;
}

interface AccessRequest {
  id: string;
  user: string;
  resource: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

const EnterpriseDevPortal: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTeamTab, setActiveTeamTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(5);

  const navigationItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'releases', label: 'Release Management', icon: Rocket, badge: 3 },
    { id: 'services', label: 'Service Catalog', icon: Database },
    { id: 'pipelines', label: 'CI/CD Pipelines', icon: GitBranch, badge: 2 },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, badge: 7 },
    { id: 'documentation', label: 'Documentation', icon: Book },
    { 
      id: 'teams', 
      label: 'Teams', 
      icon: Users,
      subItems: [
        { id: 'overview', label: 'Team Overview' },
        { id: 'access', label: 'Access Management' }
      ]
    },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: 4 }
  ];

  const metrics: MetricCard[] = [
    { title: 'Total Services', value: 42, change: 5.2, icon: Server, color: 'blue' },
    { title: 'Active Deployments', value: 8, change: -2.1, icon: Rocket, color: 'green' },
    { title: 'System Health', value: '98.5%', change: 0.5, icon: Activity, color: 'emerald' },
    { title: 'Open Incidents', value: 4, change: -33.3, icon: AlertTriangle, color: 'orange' }
  ];

  const recentPipelines: Pipeline[] = [
    { id: '1', name: 'Frontend Build', status: 'succeeded', branch: 'main', commit: '7f3a2b1', author: 'John Doe', duration: '5m 32s', timestamp: '2 mins ago' },
    { id: '2', name: 'API Tests', status: 'running', branch: 'develop', commit: '9e1c4d8', author: 'Jane Smith', duration: '2m 15s', timestamp: '5 mins ago' },
    { id: '3', name: 'Database Migration', status: 'failed', branch: 'feature/auth', commit: '3b7f9a2', author: 'Bob Johnson', duration: '1m 45s', timestamp: '10 mins ago' },
    { id: '4', name: 'Security Scan', status: 'queued', branch: 'main', commit: '5d2e8f1', author: 'Alice Brown', duration: '-', timestamp: '15 mins ago' }
  ];

  const services: Service[] = [
    { id: '1', name: 'User Service', category: 'microservices', status: 'healthy', version: 'v2.1.0', uptime: '99.99%', responseTime: '45ms', errorRate: '0.01%' },
    { id: '2', name: 'Payment Gateway', category: 'apis', status: 'healthy', version: 'v1.8.3', uptime: '99.95%', responseTime: '120ms', errorRate: '0.05%' },
    { id: '3', name: 'Database Cluster', category: 'infrastructure', status: 'degraded', version: 'v5.7.2', uptime: '99.90%', responseTime: '15ms', errorRate: '0.1%' },
    { id: '4', name: 'Auth API', category: 'apis', status: 'healthy', version: 'v3.0.1', uptime: '99.98%', responseTime: '35ms', errorRate: '0.02%' },
    { id: '5', name: 'Notification Service', category: 'microservices', status: 'down', version: 'v1.2.5', uptime: '98.5%', responseTime: '-', errorRate: '2.5%' },
    { id: '6', name: 'CDN', category: 'infrastructure', status: 'healthy', version: 'v4.1.0', uptime: '100%', responseTime: '5ms', errorRate: '0%' }
  ];

  const releases: Release[] = [
    { id: '1', name: 'Q4 Feature Release', version: 'v2024.4.0', status: 'active', progress: 75, date: '2024-12-15', environment: 'Production', team: 'Platform Team' },
    { id: '2', name: 'Security Patch', version: 'v2024.3.1', status: 'completed', progress: 100, date: '2024-11-30', environment: 'All', team: 'Security Team' },
    { id: '3', name: 'API v3 Launch', version: 'v3.0.0', status: 'upcoming', progress: 45, date: '2024-12-30', environment: 'Staging', team: 'API Team' },
    { id: '4', name: 'Mobile App Update', version: 'v5.2.0', status: 'draft', progress: 15, date: '2025-01-15', environment: 'Development', team: 'Mobile Team' }
  ];

  const incidents: Incident[] = [
    { id: '1', title: 'Database Connection Timeout', severity: 'critical', status: 'investigating', assignee: 'DevOps Team', duration: '15m', affectedServices: 3 },
    { id: '2', title: 'High API Latency', severity: 'high', status: 'open', assignee: 'Backend Team', duration: '45m', affectedServices: 2 },
    { id: '3', title: 'SSL Certificate Expiring', severity: 'medium', status: 'open', assignee: 'Infrastructure', duration: '2h', affectedServices: 1 },
    { id: '4', title: 'Memory Leak in Service', severity: 'low', status: 'resolved', assignee: 'Platform Team', duration: '1h 30m', affectedServices: 1 }
  ];

  const teams: Team[] = [
    { id: '1', name: 'Platform Team', lead: 'Sarah Connor', members: 12, projects: 5, performance: 92 },
    { id: '2', name: 'Mobile Team', lead: 'John Smith', members: 8, projects: 3, performance: 88 },
    { id: '3', name: 'Security Team', lead: 'Alice Johnson', members: 6, projects: 4, performance: 95 },
    { id: '4', name: 'DevOps Team', lead: 'Bob Wilson', members: 10, projects: 7, performance: 90 }
  ];

  const accessRequests: AccessRequest[] = [
    { id: '1', user: 'mike@company.com', resource: 'Production Database', type: 'Read Access', status: 'pending', requestDate: '2024-12-10' },
    { id: '2', user: 'sarah@company.com', resource: 'AWS Console', type: 'Admin Access', status: 'pending', requestDate: '2024-12-09' },
    { id: '3', user: 'john@company.com', resource: 'GitHub Repo', type: 'Write Access', status: 'approved', requestDate: '2024-12-08' },
    { id: '4', user: 'alice@company.com', resource: 'Kubernetes Cluster', type: 'Deploy Access', status: 'rejected', requestDate: '2024-12-07' }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      succeeded: 'text-green-600 bg-green-100',
      running: 'text-blue-600 bg-blue-100',
      failed: 'text-red-600 bg-red-100',
      queued: 'text-gray-600 bg-gray-100',
      healthy: 'text-green-600 bg-green-100',
      degraded: 'text-orange-600 bg-orange-100',
      down: 'text-red-600 bg-red-100',
      active: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      upcoming: 'text-purple-600 bg-purple-100',
      draft: 'text-gray-600 bg-gray-100',
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-blue-600 bg-blue-100',
      open: 'text-orange-600 bg-orange-100',
      investigating: 'text-yellow-600 bg-yellow-100',
      resolved: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <metric.icon className={`h-8 w-8 text-${metric.color}-500`} />
              <span className={`flex items-center text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {Math.abs(metric.change)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Activity</h3>
          <div className="space-y-4">
            {recentPipelines.slice(0, 3).map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <GitBranch className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{pipeline.name}</p>
                    <p className="text-sm text-gray-500">{pipeline.branch} • {pipeline.author}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                  {pipeline.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">CPU Usage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm text-gray-600">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Memory</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm text-gray-600">72%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <span className="text-sm text-gray-600">28%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReleases = () => (
    <IntegratedReleaseManager />
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          All Services
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Microservices
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          APIs
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Infrastructure
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">{service.version}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium">{service.uptime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response Time</span>
                <span className="font-medium">{service.responseTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Error Rate</span>
                <span className="font-medium">{service.errorRate}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
              <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPipelines = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Running</h3>
            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Succeeded</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">47</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Failed</h3>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Queued</h3>
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Pipeline Runs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Pipeline</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Branch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Commit</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Author</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentPipelines.map((pipeline) => (
                <tr key={pipeline.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{pipeline.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}>
                      {pipeline.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pipeline.branch}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono">{pipeline.commit}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pipeline.author}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pipeline.duration}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{pipeline.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-red-900">High CPU Usage</span>
              </div>
              <span className="text-xs text-red-600">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-900">Memory Warning</span>
              </div>
              <span className="text-xs text-yellow-600">15m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-900">Slow Response</span>
              </div>
              <span className="text-xs text-blue-600">1h ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">API Gateway</span>
                <span className="text-sm font-medium">45ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium">120ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Cache</span>
                <span className="text-sm font-medium">5ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Rates</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">4xx Errors</span>
              <span className="text-sm font-medium text-yellow-600">2.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">5xx Errors</span>
              <span className="text-sm font-medium text-red-600">0.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-green-600">97.4%</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">1.2M</p>
              <p className="text-sm text-gray-600">Total Requests (24h)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <BarChart3 className="h-12 w-12" />
          <span className="ml-3">Performance chart visualization would go here</span>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">API Documentation</h3>
          </div>
          <p className="text-gray-600 mb-4">REST API references, endpoints, and examples</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">24 documents</span>
            <span className="text-blue-600 font-medium">View →</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Book className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Developer Guides</h3>
          </div>
          <p className="text-gray-600 mb-4">Getting started, tutorials, and how-to guides</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">18 guides</span>
            <span className="text-blue-600 font-medium">View →</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Best Practices</h3>
          </div>
          <p className="text-gray-600 mb-4">Coding standards, patterns, and conventions</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">12 articles</span>
            <span className="text-blue-600 font-medium">View →</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Authentication API v2.0</p>
                <p className="text-sm text-gray-500">Updated OAuth2 implementation guide</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Book className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Microservices Architecture</p>
                <p className="text-sm text-gray-500">New guide for service decomposition</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Performance Optimization</p>
                <p className="text-sm text-gray-500">Best practices for database queries</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTeamTab('overview')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTeamTab === 'overview' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Team Overview
          </button>
          <button
            onClick={() => setActiveTeamTab('access')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTeamTab === 'access' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Access Management
          </button>
        </div>
      </div>

      {activeTeamTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Performance</span>
                  <span className="text-lg font-bold text-green-600">{team.performance}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Lead:</span>
                  <span className="text-sm font-medium text-gray-900">{team.lead}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Members:</span>
                  <span className="text-sm font-medium text-gray-900">{team.members}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Active Projects:</span>
                  <span className="text-sm font-medium text-gray-900">{team.projects}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Details</button>
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">Contact Team</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">245</p>
              <p className="text-sm text-gray-500 mt-1">Active accounts</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Admin Users</h3>
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500 mt-1">With full access</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Pending Requests</h3>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Resource</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accessRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{request.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.resource}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{request.requestDate}</td>
                      <td className="py-3 px-4">
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Incident Stats</h3>
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">4</p>
              <p className="text-sm text-gray-600">Open</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600">Resolved Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Severity Breakdown</h3>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Critical</span>
              <span className="text-sm font-bold text-red-600">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High</span>
              <span className="text-sm font-bold text-orange-600">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium</span>
              <span className="text-sm font-bold text-yellow-600">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low</span>
              <span className="text-sm font-bold text-blue-600">1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Incidents</h3>
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{incident.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Assignee:</span> {incident.assignee}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {incident.duration}
                </div>
                <div>
                  <span className="font-medium">Affected:</span> {incident.affectedServices} services
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'releases':
        return renderReleases();
      case 'services':
        return renderServices();
      case 'pipelines':
        return renderPipelines();
      case 'monitoring':
        return renderMonitoring();
      case 'documentation':
        return renderDocumentation();
      case 'teams':
        return renderTeams();
      case 'incidents':
        return renderIncidents();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && <h1 className="text-xl font-bold">Dev Portal</h1>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors ${
                  activeSection === item.id ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
              {item.subItems && activeSection === item.id && !sidebarCollapsed && (
                <div className="ml-8">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveTeamTab(subItem.id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@company.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>

              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EnterpriseDevPortal;