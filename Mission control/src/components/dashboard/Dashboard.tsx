import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Server,
  Users,
  GitBranch,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import type { ViewState } from '../../types';

interface DashboardProps {
  viewState: ViewState;
  onUpdateViewState: (updates: Partial<ViewState>) => void;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

const METRICS: MetricCard[] = [
  {
    title: 'Active Services',
    value: 47,
    change: '+3 from last week',
    trend: 'up',
    icon: Server,
    color: 'blue',
  },
  {
    title: 'Deployment Success Rate',
    value: '98.7%',
    change: '+0.3% from last week',
    trend: 'up',
    icon: CheckCircle,
    color: 'green',
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+127 from yesterday',
    trend: 'up',
    icon: Users,
    color: 'purple',
  },
  {
    title: 'Open Incidents',
    value: 3,
    change: '-2 from yesterday',
    trend: 'down',
    icon: AlertTriangle,
    color: 'red',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'deployment',
    title: 'User Service v2.3.1 deployed to production',
    time: '2 minutes ago',
    status: 'success',
    icon: GitBranch,
  },
  {
    id: '2',
    type: 'incident',
    title: 'Database connection timeout resolved',
    time: '15 minutes ago',
    status: 'resolved',
    icon: Zap,
  },
  {
    id: '3',
    type: 'workflow',
    title: 'New workflow "User Onboarding v2" created',
    time: '1 hour ago',
    status: 'info',
    icon: Activity,
  },
  {
    id: '4',
    type: 'release',
    title: 'Release 2024.1.3 planning completed',
    time: '2 hours ago',
    status: 'info',
    icon: BarChart3,
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  viewState,
  onUpdateViewState,
}) => {
  const [timeRange, setTimeRange] = useState('7d');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'resolved':
        return 'text-blue-600 bg-blue-50';
      case 'info':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your operations and system health</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input text-sm w-auto"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-${metric.color}-50`}>
                  <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
                <p className="text-xs text-gray-500 mt-2">{metric.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <button className="w-full btn btn-outline text-sm">
                View All Activities
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onUpdateViewState({ currentPage: 'workflows' })}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Activity className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">New Workflow</div>
                <div className="text-xs text-gray-500">Create mind map</div>
              </button>
              
              <button 
                onClick={() => onUpdateViewState({ currentPage: 'releases' })}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">New Release</div>
                <div className="text-xs text-gray-500">Plan deployment</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Manage Teams</div>
                <div className="text-xs text-gray-500">Access control</div>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Server className="h-6 w-6 text-orange-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Service Health</div>
                <div className="text-xs text-gray-500">Monitor status</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">All Systems Operational</h3>
              <p className="text-sm text-gray-600 mt-1">All services running normally</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.9%</div>
              <p className="text-sm text-gray-600">Uptime (30 days)</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">142ms</div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
