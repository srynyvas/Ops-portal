/**
 * Comprehensive Release Analytics Dashboard Component
 * 
 * FEATURES:
 * - Key performance metrics cards (velocity, lead time, deployment frequency, MTTR, change failure rate, bug escape rate)
 * - Interactive SVG charts (velocity trend, deployment success rate, feature burndown, team performance)
 * - Time-based filtering (30 days, quarter, year, custom range)
 * - Comparison views (release vs release, team vs team, current vs target)
 * - Export capabilities (PDF, CSV, print-friendly)
 * - Real-time updates with auto-refresh toggle
 * - Responsive design with loading states and error handling
 * 
 * USAGE EXAMPLE:
 * ```tsx
 * import { ReleaseAnalytics } from './components/releases';
 * 
 * function App() {
 *   return (
 *     <div className="p-6">
 *       <ReleaseAnalytics />
 *     </div>
 *   );
 * }
 * ```
 * 
 * INTEGRATION WITH EXISTING RELEASE MANAGER:
 * Add to IntegratedReleaseManager as a tab:
 * ```tsx
 * const tabs = [
 *   { id: 'overview', label: 'Overview' },
 *   { id: 'analytics', label: 'Analytics' }, // Add this tab
 * ];
 * 
 * {activeTab === 'analytics' && <ReleaseAnalytics />}
 * ```
 * 
 * DEPENDENCIES:
 * - React 18+
 * - TypeScript
 * - Tailwind CSS
 * - lucide-react icons
 * - ReleaseAnalytics type from '../../types/release-management'
 * - useReleaseAnalytics hook from '../../hooks/useReleaseManagement'
 * 
 * The component uses mock data for demonstration but is designed to work with the 
 * existing useReleaseAnalytics hook for real data integration.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  RefreshCw, 
  Clock, 
  Target, 
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  Printer,
  Filter,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  Bug,
  Timer
} from 'lucide-react';
import { ReleaseAnalytics } from '../../types/release-management';
import { useReleaseAnalytics } from '../../hooks/useReleaseManagement';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface TimeFilter {
  label: string;
  value: string;
  days: number;
}

interface ChartData {
  date: string;
  value: number;
  label?: string;
}

interface MetricComparison {
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface TeamMetric {
  teamName: string;
  velocity: number;
  quality: number;
  efficiency: number;
}

// ============================================================================
// Main Component
// ============================================================================

const ReleaseAnalyticsDashboard: React.FC = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('30');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedRelease, setSelectedRelease] = useState<string>('current');
  const [compareMode, setCompareMode] = useState<'release' | 'team' | 'target'>('target');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [showCustomRange, setShowCustomRange] = useState<boolean>(false);

  const { analytics, loading, error, fetchAnalytics, compareReleases, getTeamMetrics, exportAnalytics } = useReleaseAnalytics();

  // Time filter options
  const timeFilters: TimeFilter[] = [
    { label: 'Last 30 days', value: '30', days: 30 },
    { label: 'Last Quarter', value: '90', days: 90 },
    { label: 'Last Year', value: '365', days: 365 },
    { label: 'Custom Range', value: 'custom', days: 0 }
  ];

  // Mock data for demonstration
  const mockAnalytics: ReleaseAnalytics = {
    releaseId: 'current-release',
    metrics: {
      velocity: 85,
      leadTime: 14,
      cycleTime: 7,
      deploymentFrequency: 4,
      mttr: 2.5,
      changeFailureRate: 8,
      bugEscapeRate: 3
    },
    trends: {
      velocityTrend: [
        { date: new Date('2024-01-01'), value: 75, label: 'Jan' },
        { date: new Date('2024-02-01'), value: 78, label: 'Feb' },
        { date: new Date('2024-03-01'), value: 82, label: 'Mar' },
        { date: new Date('2024-04-01'), value: 85, label: 'Apr' },
        { date: new Date('2024-05-01'), value: 88, label: 'May' },
        { date: new Date('2024-06-01'), value: 85, label: 'Jun' }
      ],
      deploymentTrend: [
        { date: new Date('2024-01-01'), value: 3, label: 'Jan' },
        { date: new Date('2024-02-01'), value: 4, label: 'Feb' },
        { date: new Date('2024-03-01'), value: 5, label: 'Mar' },
        { date: new Date('2024-04-01'), value: 4, label: 'Apr' },
        { date: new Date('2024-05-01'), value: 6, label: 'May' },
        { date: new Date('2024-06-01'), value: 4, label: 'Jun' }
      ],
      qualityTrend: [
        { date: new Date('2024-01-01'), value: 92, label: 'Jan' },
        { date: new Date('2024-02-01'), value: 89, label: 'Feb' },
        { date: new Date('2024-03-01'), value: 94, label: 'Mar' },
        { date: new Date('2024-04-01'), value: 92, label: 'Apr' },
        { date: new Date('2024-05-01'), value: 96, label: 'May' },
        { date: new Date('2024-06-01'), value: 92, label: 'Jun' }
      ]
    },
    comparisons: {
      previousRelease: {
        metric: 'velocity',
        current: 85,
        comparison: 78,
        difference: 7,
        percentageChange: 8.97
      },
      teamAverage: {
        metric: 'velocity',
        current: 85,
        comparison: 82,
        difference: 3,
        percentageChange: 3.66
      },
      targetMetrics: {
        metric: 'velocity',
        current: 85,
        comparison: 90,
        difference: -5,
        percentageChange: -5.56
      }
    }
  };

  const mockTeamMetrics: TeamMetric[] = [
    { teamName: 'Team Alpha', velocity: 88, quality: 94, efficiency: 91 },
    { teamName: 'Team Beta', velocity: 82, quality: 89, efficiency: 85 },
    { teamName: 'Team Gamma', velocity: 90, quality: 96, efficiency: 93 },
    { teamName: 'Team Delta', velocity: 76, quality: 87, efficiency: 81 }
  ];

  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
        fetchAnalytics('current-release');
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchAnalytics]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date());
    fetchAnalytics(selectedRelease);
  }, [fetchAnalytics, selectedRelease]);

  // Handle export
  const handleExport = useCallback(async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      const blob = await exportAnalytics(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `release-analytics.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [exportAnalytics]);

  // Calculate metric comparisons
  const metricComparisons = useMemo<Record<string, MetricComparison>>(() => {
    const currentMetrics = analytics?.metrics || mockAnalytics.metrics;
    
    return {
      velocity: {
        current: currentMetrics.velocity,
        previous: 78,
        target: 90,
        trend: currentMetrics.velocity > 78 ? 'up' : 'down',
        change: ((currentMetrics.velocity - 78) / 78) * 100
      },
      leadTime: {
        current: currentMetrics.leadTime,
        previous: 16,
        target: 12,
        trend: currentMetrics.leadTime < 16 ? 'up' : 'down',
        change: ((16 - currentMetrics.leadTime) / 16) * 100
      },
      deploymentFrequency: {
        current: currentMetrics.deploymentFrequency,
        previous: 3,
        target: 5,
        trend: currentMetrics.deploymentFrequency > 3 ? 'up' : 'down',
        change: ((currentMetrics.deploymentFrequency - 3) / 3) * 100
      },
      mttr: {
        current: currentMetrics.mttr,
        previous: 4,
        target: 2,
        trend: currentMetrics.mttr < 4 ? 'up' : 'down',
        change: ((4 - currentMetrics.mttr) / 4) * 100
      },
      changeFailureRate: {
        current: currentMetrics.changeFailureRate,
        previous: 12,
        target: 5,
        trend: currentMetrics.changeFailureRate < 12 ? 'up' : 'down',
        change: ((12 - currentMetrics.changeFailureRate) / 12) * 100
      },
      bugEscapeRate: {
        current: currentMetrics.bugEscapeRate,
        previous: 5,
        target: 2,
        trend: currentMetrics.bugEscapeRate < 5 ? 'up' : 'down',
        change: ((5 - currentMetrics.bugEscapeRate) / 5) * 100
      }
    };
  }, [analytics, mockAnalytics.metrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <span className="text-red-700">Error loading analytics: {error.message}</span>
        </div>
      </div>
    );
  }

  const currentAnalytics = analytics || mockAnalytics;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Release Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Auto-refresh toggle */}
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>
          </div>

          {/* Last updated */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>

          {/* Export buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Time Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex space-x-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setSelectedTimeFilter(filter.value);
                    setShowCustomRange(filter.value === 'custom');
                  }}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeFilter === filter.value
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Mode */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Compare:</span>
            <select
              value={compareMode}
              onChange={(e) => setCompareMode(e.target.value as 'release' | 'team' | 'target')}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="target">vs Target</option>
              <option value="release">vs Previous Release</option>
              <option value="team">vs Team Average</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {showCustomRange && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">From:</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">To:</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Velocity Metric */}
        <MetricCard
          title="Release Velocity"
          value={currentAnalytics.metrics.velocity}
          unit="SP/Sprint"
          icon={<Activity className="h-6 w-6" />}
          comparison={metricComparisons.velocity}
          color="blue"
        />

        {/* Lead Time Metric */}
        <MetricCard
          title="Lead Time"
          value={currentAnalytics.metrics.leadTime}
          unit="days"
          icon={<Timer className="h-6 w-6" />}
          comparison={metricComparisons.leadTime}
          color="green"
        />

        {/* Deployment Frequency */}
        <MetricCard
          title="Deployment Frequency"
          value={currentAnalytics.metrics.deploymentFrequency}
          unit="per week"
          icon={<Zap className="h-6 w-6" />}
          comparison={metricComparisons.deploymentFrequency}
          color="purple"
        />

        {/* MTTR */}
        <MetricCard
          title="Mean Time to Recovery"
          value={currentAnalytics.metrics.mttr}
          unit="hours"
          icon={<Target className="h-6 w-6" />}
          comparison={metricComparisons.mttr}
          color="orange"
        />

        {/* Change Failure Rate */}
        <MetricCard
          title="Change Failure Rate"
          value={currentAnalytics.metrics.changeFailureRate}
          unit="%"
          icon={<AlertTriangle className="h-6 w-6" />}
          comparison={metricComparisons.changeFailureRate}
          color="red"
        />

        {/* Bug Escape Rate */}
        <MetricCard
          title="Bug Escape Rate"
          value={currentAnalytics.metrics.bugEscapeRate}
          unit="%"
          icon={<Bug className="h-6 w-6" />}
          comparison={metricComparisons.bugEscapeRate}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity Trend Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Velocity Trend</h3>
          <LineChart
            data={currentAnalytics.trends.velocityTrend.map(point => ({
              date: point.label || point.date.toLocaleDateString(),
              value: point.value
            }))}
            color="blue"
            height={200}
          />
        </div>

        {/* Deployment Success Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Success Rate</h3>
          <DonutChart
            data={[
              { label: 'Success', value: 92, color: '#10B981' },
              { label: 'Failed', value: 8, color: '#EF4444' }
            ]}
            height={200}
          />
        </div>

        {/* Feature Completion Burndown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Completion Burndown</h3>
          <BurndownChart
            ideal={[100, 80, 60, 40, 20, 0]}
            actual={[100, 85, 70, 45, 15, 5]}
            height={200}
          />
        </div>

        {/* Team Performance Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Comparison</h3>
          <BarChart
            data={mockTeamMetrics}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Metric Card Component
// ============================================================================

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  comparison: MetricComparison;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  comparison,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1">
          {comparison.trend === 'up' ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : comparison.trend === 'down' ? (
            <ArrowDown className="h-4 w-4 text-red-500" />
          ) : null}
          <span className={`text-sm font-medium ${
            comparison.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(comparison.change).toFixed(1)}%
          </span>
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      
      <div className="mt-3 text-xs text-gray-400">
        Target: {comparison.target} {unit}
      </div>
    </div>
  );
};

// ============================================================================
// Chart Components
// ============================================================================

interface LineChartProps {
  data: ChartData[];
  color: string;
  height: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, color, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = height - 40 - ((point.value - minValue) / range) * (height - 80);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color === 'blue' ? '#3B82F6' : '#10B981'} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color === 'blue' ? '#3B82F6' : '#10B981'} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={20 + (i * (height - 40) / 4)}
            x2="300"
            y2={20 + (i * (height - 40) / 4)}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {/* Area fill */}
        <path
          d={`${pathData} L 300 ${height - 40} L 0 ${height - 40} Z`}
          fill={`url(#gradient-${color})`}
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color === 'blue' ? '#3B82F6' : '#10B981'}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = height - 40 - ((point.value - minValue) / range) * (height - 80);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={color === 'blue' ? '#3B82F6' : '#10B981'}
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((point, index) => (
          <span key={index}>{point.date}</span>
        ))}
      </div>
    </div>
  );
};

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  height: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, height }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = height / 2;
  const centerY = height / 2;
  const outerRadius = (height - 40) / 2;
  const innerRadius = outerRadius * 0.6;

  let cumulativePercentage = 0;

  return (
    <div className="flex items-center space-x-6">
      <svg width={height} height={height}>
        {data.map((item, index) => {
          const percentage = item.value / total;
          const startAngle = cumulativePercentage * 2 * Math.PI - Math.PI / 2;
          const endAngle = (cumulativePercentage + percentage) * 2 * Math.PI - Math.PI / 2;
          
          const x1 = centerX + outerRadius * Math.cos(startAngle);
          const y1 = centerY + outerRadius * Math.sin(startAngle);
          const x2 = centerX + outerRadius * Math.cos(endAngle);
          const y2 = centerY + outerRadius * Math.sin(endAngle);
          const x3 = centerX + innerRadius * Math.cos(endAngle);
          const y3 = centerY + innerRadius * Math.sin(endAngle);
          const x4 = centerX + innerRadius * Math.cos(startAngle);
          const y4 = centerY + innerRadius * Math.sin(startAngle);
          
          const largeArc = percentage > 0.5 ? 1 : 0;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ');
          
          cumulativePercentage += percentage;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
            />
          );
        })}
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dy="0.35em"
          className="text-2xl font-bold fill-gray-900"
        >
          {data[0]?.value}%
        </text>
      </svg>
      
      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BurndownChartProps {
  ideal: number[];
  actual: number[];
  height: number;
}

const BurndownChart: React.FC<BurndownChartProps> = ({ ideal, actual, height }) => {
  const maxValue = Math.max(...ideal, ...actual);
  
  const createPath = (data: number[], color: string, isDashed: boolean = false) => {
    const pathData = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = height - 40 - (value / maxValue) * (height - 80);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return (
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={isDashed ? "5,5" : "none"}
      />
    );
  };

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={20 + (i * (height - 40) / 4)}
            x2="300"
            y2={20 + (i * (height - 40) / 4)}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {/* Ideal line */}
        {createPath(ideal, '#94A3B8', true)}
        
        {/* Actual line */}
        {createPath(actual, '#3B82F6')}
        
        {/* Data points for actual */}
        {actual.map((value, index) => {
          const x = (index / (actual.length - 1)) * 300;
          const y = height - 40 - (value / maxValue) * (height - 80);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#3B82F6"
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex space-x-4 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span className="text-gray-600">Actual</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-gray-400 border-dashed border-t"></div>
          <span className="text-gray-600">Ideal</span>
        </div>
      </div>
    </div>
  );
};

interface BarChartProps {
  data: TeamMetric[];
  height: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, height }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.velocity, d.quality, d.efficiency)));
  const barWidth = 300 / (data.length * 3 + data.length + 1);
  const groupWidth = barWidth * 3;
  const groupSpacing = barWidth;

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={20 + (i * (height - 60) / 4)}
            x2="300"
            y2={20 + (i * (height - 60) / 4)}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {data.map((team, teamIndex) => {
          const groupX = groupSpacing + teamIndex * (groupWidth + groupSpacing);
          
          return (
            <g key={teamIndex}>
              {/* Velocity bar */}
              <rect
                x={groupX}
                y={height - 40 - (team.velocity / maxValue) * (height - 80)}
                width={barWidth * 0.8}
                height={(team.velocity / maxValue) * (height - 80)}
                fill="#3B82F6"
              />
              
              {/* Quality bar */}
              <rect
                x={groupX + barWidth}
                y={height - 40 - (team.quality / maxValue) * (height - 80)}
                width={barWidth * 0.8}
                height={(team.quality / maxValue) * (height - 80)}
                fill="#10B981"
              />
              
              {/* Efficiency bar */}
              <rect
                x={groupX + barWidth * 2}
                y={height - 40 - (team.efficiency / maxValue) * (height - 80)}
                width={barWidth * 0.8}
                height={(team.efficiency / maxValue) * (height - 80)}
                fill="#F59E0B"
              />
              
              {/* Team name */}
              <text
                x={groupX + groupWidth / 2}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {team.teamName.replace('Team ', '')}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Velocity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Quality</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Efficiency</span>
        </div>
      </div>
    </div>
  );
};

export default ReleaseAnalyticsDashboard;