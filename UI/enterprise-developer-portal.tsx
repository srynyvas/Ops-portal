import React, { useState, useRef } from 'react';
import { 
  Plus, Minus, Lightbulb, Target, Users, FileText, Folder, Trash2, 
  Edit3, Palette, Settings, Heart, Star, Zap, Coffee, Music, 
  Camera, Book, Rocket, Globe, Shield, Diamond, Crown, Gift,
  Save, X, Check, AlertTriangle, Link, User, Calendar, Tag,
  ExternalLink, Info, Clock, Library, Search, Copy, Download,
  Upload, ArrowLeft, Grid, List, Filter, Eye, Edit, FolderOpen,
  GitBranch, Package, Code, Bug, CheckCircle, AlertCircle,
  Play, Pause, RotateCcw, TrendingUp, Layers, Terminal, Home,
  Database, Server, Activity, Bell, Menu, ChevronRight, 
  BarChart3, PieChart, GitCommit, Cloud, Lock, Wrench,
  MessageSquare, Mail, Phone, Slack, Github, Figma, 
  MonitorSpeaker, Cpu, HardDrive, Wifi, AlertOctagon
} from 'lucide-react';

const EnterpriseDevPortal = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [teamsSubPage, setTeamsSubPage] = useState('overview'); // 'overview' or 'access-management'
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'API Gateway experiencing high latency', time: '2 min ago', severity: 'high' },
    { id: 2, type: 'deploy', message: 'Release v2.1.0 deployed to staging', time: '15 min ago', severity: 'info' },
    { id: 3, type: 'security', message: 'Security scan completed - 2 vulnerabilities found', time: '1 hr ago', severity: 'medium' }
  ]);

  // Release Management Tool State (simplified version for integration)
  const [releaseManagementData] = useState({
    activeReleases: 12,
    completedReleases: 45,
    upcomingReleases: 8,
    recentActivity: [
      { action: 'Created release v2.3.0', user: 'Sarah Chen', time: '2 hours ago' },
      { action: 'Deployed hotfix v1.2.4 to production', user: 'Mike Rodriguez', time: '4 hours ago' },
      { action: 'Updated feature: User Authentication', user: 'Alex Kim', time: '6 hours ago' }
    ]
  });

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Overview and metrics' },
    { id: 'releases', label: 'Release Management', icon: Rocket, description: 'Plan and track releases' },
    { id: 'services', label: 'Service Catalog', icon: Database, description: 'Available services and APIs' },
    { id: 'pipelines', label: 'CI/CD Pipelines', icon: GitBranch, description: 'Build and deployment status' },
    { id: 'monitoring', label: 'Monitoring', icon: Activity, description: 'System health and metrics' },
    { id: 'documentation', label: 'Documentation', icon: Book, description: 'Developer guides and docs' },
    { id: 'teams', label: 'Teams', icon: Users, description: 'Team structure and contacts' },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, description: 'Issue tracking and postmortems' }
  ];

  const renderSidebar = () => (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white h-screen fixed left-0 top-0 z-30 transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-xl font-bold">DevPortal</h1>
              <p className="text-gray-400 text-sm">Enterprise Edition</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {navigationItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                if (item.id !== 'teams') {
                  setTeamsSubPage('overview'); // Reset teams sub-page when leaving teams
                }
              }}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                currentPage === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
              }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <IconComponent size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            JD
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3">
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-gray-400">Senior Developer</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTopBar = () => (
    <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} bg-white border-b border-gray-200 px-6 py-4 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{currentPage.replace('-', ' ')}</h2>
          <p className="text-gray-600 mt-1">
            {navigationItems.find(item => item.id === currentPage)?.description}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          
          {/* Profile */}
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            JD
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Services</p>
              <p className="text-3xl font-bold text-gray-800">127</p>
              <p className="text-green-600 text-sm">↑ 8% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Deployments Today</p>
              <p className="text-3xl font-bold text-gray-800">23</p>
              <p className="text-blue-600 text-sm">↑ 15% from yesterday</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Rocket size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Health</p>
              <p className="text-3xl font-bold text-green-600">99.8%</p>
              <p className="text-gray-600 text-sm">All systems operational</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open Incidents</p>
              <p className="text-3xl font-bold text-orange-600">3</p>
              <p className="text-gray-600 text-sm">2 medium, 1 low</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Deployment Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">user-service v2.1.0</p>
                  <p className="text-sm text-gray-600">Deployed to production</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">5 min ago</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">api-gateway v1.8.2</p>
                  <p className="text-sm text-gray-600">Deployed to staging</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">12 min ago</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">notification-service v1.3.1</p>
                  <p className="text-sm text-gray-600">Building</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">18 min ago</p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu size={20} className="text-blue-600" />
                <span>CPU Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive size={20} className="text-green-600" />
                <span>Memory Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <span className="text-sm font-medium">42%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wifi size={20} className="text-purple-600" />
                <span>Network I/O</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {releaseManagementData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <GitCommit size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setCurrentPage('releases')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Rocket size={20} className="text-purple-600" />
              <span>Create Release</span>
            </button>
            <button 
              onClick={() => setCurrentPage('services')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Database size={20} className="text-blue-600" />
              <span>Browse Services</span>
            </button>
            <button 
              onClick={() => setCurrentPage('documentation')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Book size={20} className="text-green-600" />
              <span>View Docs</span>
            </button>
            <button 
              onClick={() => setCurrentPage('incidents')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <AlertTriangle size={20} className="text-orange-600" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      {/* Service Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Database size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold">Microservices</h3>
          </div>
          <p className="text-gray-600 mb-4">Core business logic services</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total Services</span>
              <span className="font-medium">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Healthy</span>
              <span className="font-medium text-green-600">44</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Degraded</span>
              <span className="font-medium text-orange-600">3</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold">APIs</h3>
          </div>
          <p className="text-gray-600 mb-4">Public and internal APIs</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Total APIs</span>
              <span className="font-medium">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Public</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Internal</span>
              <span className="font-medium">15</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Cloud size={24} className="text-purple-600" />
            <h3 className="text-lg font-semibold">Infrastructure</h3>
          </div>
          <p className="text-gray-600 mb-4">Cloud resources and tools</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Clusters</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Databases</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Queues</span>
              <span className="font-medium">7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Service Directory</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { name: 'user-service', version: 'v2.1.0', status: 'healthy', type: 'microservice', env: 'production' },
              { name: 'payment-gateway', version: 'v1.8.3', status: 'healthy', type: 'microservice', env: 'production' },
              { name: 'notification-service', version: 'v1.3.1', status: 'degraded', type: 'microservice', env: 'staging' },
              { name: 'analytics-api', version: 'v3.2.0', status: 'healthy', type: 'api', env: 'production' },
              { name: 'inventory-service', version: 'v2.0.5', status: 'healthy', type: 'microservice', env: 'production' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.type} • {service.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.env === 'production' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.env}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPipelines = () => (
    <div className="space-y-6">
      {/* Pipeline Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Running</p>
              <p className="text-2xl font-bold text-blue-600">7</p>
            </div>
            <Play size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Succeeded</p>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Failed</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <AlertCircle size={24} className="text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Queued</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <Clock size={24} className="text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Pipelines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Pipeline Runs</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { pipeline: 'user-service-ci', branch: 'main', status: 'success', duration: '4m 23s', time: '5 min ago' },
              { pipeline: 'api-gateway-deploy', branch: 'release/v1.8', status: 'running', duration: '2m 15s', time: '8 min ago' },
              { pipeline: 'frontend-build', branch: 'feature/auth-ui', status: 'failed', duration: '1m 45s', time: '12 min ago' },
              { pipeline: 'notification-service-ci', branch: 'main', status: 'success', duration: '3m 56s', time: '18 min ago' },
              { pipeline: 'data-pipeline-etl', branch: 'main', status: 'success', duration: '12m 34s', time: '25 min ago' }
            ].map((pipeline, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    pipeline.status === 'success' ? 'bg-green-500' : 
                    pipeline.status === 'running' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium">{pipeline.pipeline}</h4>
                    <p className="text-sm text-gray-600">{pipeline.branch}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{pipeline.duration}</span>
                  <span>{pipeline.time}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {notifications.map(notification => (
              <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
                notification.severity === 'high' ? 'border-red-500 bg-red-50' :
                notification.severity === 'medium' ? 'border-orange-500 bg-orange-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertOctagon size={20} className={
                      notification.severity === 'high' ? 'text-red-600' :
                      notification.severity === 'medium' ? 'text-orange-600' :
                      'text-blue-600'
                    } />
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-600">{notification.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    notification.severity === 'high' ? 'bg-red-100 text-red-800' :
                    notification.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Response Times</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>API Gateway</span>
              <span className="text-green-600 font-medium">245ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>User Service</span>
              <span className="text-green-600 font-medium">156ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment Service</span>
              <span className="text-orange-600 font-medium">892ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notification Service</span>
              <span className="text-green-600 font-medium">98ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Error Rates</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>API Gateway</span>
              <span className="text-green-600 font-medium">0.12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>User Service</span>
              <span className="text-green-600 font-medium">0.08%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment Service</span>
              <span className="text-red-600 font-medium">2.34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notification Service</span>
              <span className="text-green-600 font-medium">0.05%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      {/* Documentation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <Book size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold">API Documentation</h3>
          </div>
          <p className="text-gray-600 mb-4">Comprehensive API references and guides</p>
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-sm">Browse APIs</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <Code size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold">Developer Guides</h3>
          </div>
          <p className="text-gray-600 mb-4">Step-by-step development tutorials</p>
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-sm">View Guides</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-4">
            <Wrench size={24} className="text-purple-600" />
            <h3 className="text-lg font-semibold">Best Practices</h3>
          </div>
          <p className="text-gray-600 mb-4">Coding standards and architecture guidelines</p>
          <div className="flex items-center gap-2 text-purple-600">
            <span className="text-sm">Read More</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Recent Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recently Updated</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { title: 'Authentication API v2.0', type: 'API Reference', updated: '2 hours ago', author: 'Security Team' },
              { title: 'Microservices Deployment Guide', type: 'Developer Guide', updated: '1 day ago', author: 'DevOps Team' },
              { title: 'Code Review Standards', type: 'Best Practice', updated: '3 days ago', author: 'Engineering Team' },
              { title: 'GraphQL API Documentation', type: 'API Reference', updated: '5 days ago', author: 'Backend Team' },
              { title: 'Frontend Component Library', type: 'Developer Guide', updated: '1 week ago', author: 'Frontend Team' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Book size={20} className="text-blue-600" />
                  <div>
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-sm text-gray-600">{doc.type} • by {doc.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{doc.updated}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      {/* Sub-navigation for Teams */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTeamsSubPage('overview')}
            className={`px-6 py-4 font-medium transition-colors ${
              teamsSubPage === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={20} />
              Team Overview
            </div>
          </button>
          <button
            onClick={() => setTeamsSubPage('access-management')}
            className={`px-6 py-4 font-medium transition-colors ${
              teamsSubPage === 'access-management'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={20} />
              Access Management
            </div>
          </button>
        </div>
      </div>

      {/* Content based on selected sub-page */}
      {teamsSubPage === 'overview' ? renderTeamOverview() : renderAccessManagement()}
    </div>
  );

  const renderTeamOverview = () => (
    <div className="space-y-6">
      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">8</p>
            <p className="text-gray-600 text-sm">Teams</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">47</p>
            <p className="text-gray-600 text-sm">Developers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-gray-600 text-sm">DevOps Engineers</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">6</p>
            <p className="text-gray-600 text-sm">Product Managers</p>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Frontend Team', lead: 'Sarah Chen', members: 8, focus: 'React, TypeScript, UI/UX' },
          { name: 'Backend Team', lead: 'Mike Rodriguez', members: 12, focus: 'Node.js, Python, APIs' },
          { name: 'DevOps Team', lead: 'Alex Kim', members: 6, focus: 'Kubernetes, CI/CD, Infrastructure' },
          { name: 'Mobile Team', lead: 'Jessica Park', members: 5, focus: 'React Native, iOS, Android' },
          { name: 'Data Team', lead: 'David Wilson', members: 7, focus: 'Analytics, ML, Data Pipeline' },
          { name: 'Security Team', lead: 'Lisa Thompson', members: 4, focus: 'Security, Compliance, Auditing' }
        ].map((team, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {team.members} members
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="text-sm">Lead: {team.lead}</span>
              </div>
              <div className="flex items-start gap-2">
                <Target size={16} className="text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-600">{team.focus}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                <MessageSquare size={14} />
                Slack
              </button>
              <button className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                <Mail size={14} />
                Email
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccessManagement = () => (
    <div className="space-y-6">
      {/* Access Management Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">73</p>
            </div>
            <User size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Roles</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <Shield size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-orange-600">5</p>
            </div>
            <Clock size={24} className="text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Security Alerts</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus size={20} className="text-blue-600" />
            <div className="text-left">
              <p className="font-medium">Add User</p>
              <p className="text-sm text-gray-600">Create new account</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Shield size={20} className="text-green-600" />
            <div className="text-left">
              <p className="font-medium">Manage Roles</p>
              <p className="text-sm text-gray-600">Configure permissions</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Clock size={20} className="text-orange-600" />
            <div className="text-left">
              <p className="font-medium">Review Requests</p>
              <p className="text-sm text-gray-600">Approve access requests</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity size={20} className="text-purple-600" />
            <div className="text-left">
              <p className="font-medium">Audit Log</p>
              <p className="text-sm text-gray-600">View access history</p>
            </div>
          </button>
        </div>
      </div>

      {/* Role-based Access Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles & Permissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Roles & Permissions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { 
                  role: 'Admin', 
                  users: 3, 
                  permissions: ['Full Access', 'User Management', 'System Config'], 
                  color: 'red' 
                },
                { 
                  role: 'Team Lead', 
                  users: 8, 
                  permissions: ['Team Management', 'Release Planning', 'Code Review'], 
                  color: 'purple' 
                },
                { 
                  role: 'Senior Developer', 
                  users: 15, 
                  permissions: ['Code Deploy', 'Service Access', 'Monitoring'], 
                  color: 'blue' 
                },
                { 
                  role: 'Developer', 
                  users: 32, 
                  permissions: ['Code Commit', 'Dev Environment', 'Documentation'], 
                  color: 'green' 
                },
                { 
                  role: 'Intern', 
                  users: 15, 
                  permissions: ['Read Only', 'Dev Environment', 'Learning Resources'], 
                  color: 'gray' 
                }
              ].map((roleData, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${roleData.color}-500`}></div>
                      <h4 className="font-medium">{roleData.role}</h4>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                      {roleData.users} users
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {roleData.permissions.map((permission, pIndex) => (
                      <span key={pIndex} className={`px-2 py-1 text-xs rounded-full bg-${roleData.color}-100 text-${roleData.color}-800`}>
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Access */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">System Access Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { system: 'Production Environment', access: 23, total: 73, level: 'Restricted' },
                { system: 'Staging Environment', access: 45, total: 73, level: 'Controlled' },
                { system: 'Development Environment', access: 68, total: 73, level: 'Open' },
                { system: 'CI/CD Pipelines', access: 35, total: 73, level: 'Controlled' },
                { system: 'Monitoring Systems', access: 28, total: 73, level: 'Restricted' },
                { system: 'Database Access', access: 18, total: 73, level: 'Restricted' }
              ].map((system, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{system.system}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        system.level === 'Restricted' ? 'bg-red-100 text-red-800' :
                        system.level === 'Controlled' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {system.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(system.access / system.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{system.access}/{system.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Access Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Access Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { 
                action: 'Access Granted', 
                user: 'Sarah Chen', 
                resource: 'Production Database', 
                time: '5 min ago',
                type: 'grant',
                approver: 'Admin'
              },
              { 
                action: 'Role Updated', 
                user: 'Mike Rodriguez', 
                resource: 'Senior Developer → Team Lead', 
                time: '2 hours ago',
                type: 'update',
                approver: 'HR System'
              },
              { 
                action: 'Access Revoked', 
                user: 'Alex Kim', 
                resource: 'Staging Environment', 
                time: '1 day ago',
                type: 'revoke',
                approver: 'Security Team'
              },
              { 
                action: 'New User Added', 
                user: 'Jessica Park', 
                resource: 'Developer Role', 
                time: '2 days ago',
                type: 'grant',
                approver: 'Team Lead'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'grant' ? 'bg-green-500' :
                    activity.type === 'revoke' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">
                      {activity.user} • {activity.resource}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{activity.time}</p>
                  <p>by {activity.approver}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Access Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pending Access Requests</h3>
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
            5 pending
          </span>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { 
                user: 'David Wilson', 
                resource: 'Production Environment', 
                reason: 'Debugging critical issue', 
                requested: '2 hours ago',
                urgency: 'high'
              },
              { 
                user: 'Lisa Thompson', 
                resource: 'Database Admin Access', 
                reason: 'Performance optimization', 
                requested: '1 day ago',
                urgency: 'medium'
              },
              { 
                user: 'John Smith', 
                resource: 'CI/CD Pipeline Access', 
                reason: 'New team member onboarding', 
                requested: '2 days ago',
                urgency: 'low'
              }
            ].map((request, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{request.user}</h4>
                    <p className="text-sm text-gray-600">Requesting: {request.resource}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                    request.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.urgency} priority
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Reason: {request.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Requested {request.requested}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      Deny
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      {/* Incident Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open Incidents</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Resolved This Week</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-blue-600">4.2h</p>
            </div>
            <Clock size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Critical Incidents</p>
              <p className="text-2xl font-bold text-orange-600">1</p>
            </div>
            <AlertOctagon size={24} className="text-orange-600" />
          </div>
        </div>
      </div>

      {/* Active Incidents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Incidents</h3>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Report Incident
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { 
                id: 'INC-2024-001', 
                title: 'API Gateway High Latency', 
                severity: 'high', 
                status: 'investigating', 
                assignee: 'DevOps Team',
                created: '2 hours ago'
              },
              { 
                id: 'INC-2024-002', 
                title: 'Payment Service Intermittent Failures', 
                severity: 'medium', 
                status: 'in-progress', 
                assignee: 'Backend Team',
                created: '4 hours ago'
              },
              { 
                id: 'INC-2024-003', 
                title: 'Mobile App Crash on iOS 17', 
                severity: 'low', 
                status: 'monitoring', 
                assignee: 'Mobile Team',
                created: '6 hours ago'
              }
            ].map((incident, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      incident.severity === 'high' ? 'bg-red-500' :
                      incident.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}></span>
                    <h4 className="font-medium">{incident.title}</h4>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {incident.id}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    incident.status === 'investigating' ? 'bg-red-100 text-red-800' :
                    incident.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Assigned to {incident.assignee}</span>
                  <span>{incident.created}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReleaseManagement = () => (
    <div className="space-y-6">
      {/* Release Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Releases</p>
              <p className="text-2xl font-bold text-purple-600">{releaseManagementData.activeReleases}</p>
            </div>
            <Rocket size={24} className="text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{releaseManagementData.completedReleases}</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{releaseManagementData.upcomingReleases}</p>
            </div>
            <Calendar size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold text-orange-600">8</p>
            </div>
            <TrendingUp size={24} className="text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus size={20} className="text-purple-600" />
            <div className="text-left">
              <p className="font-medium">Create New Release</p>
              <p className="text-sm text-gray-600">Start planning a new release</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <GitBranch size={20} className="text-blue-600" />
            <div className="text-left">
              <p className="font-medium">View Release Pipeline</p>
              <p className="text-sm text-gray-600">Check deployment status</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 size={20} className="text-green-600" />
            <div className="text-left">
              <p className="font-medium">Release Analytics</p>
              <p className="text-sm text-gray-600">View release metrics</p>
            </div>
          </button>
        </div>
      </div>

      {/* Current Releases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Current Releases</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { name: 'Mobile App v2.1.0', progress: 75, status: 'in-development', target: '2025-08-30', features: 8 },
              { name: 'API Gateway v3.0.0', progress: 45, status: 'planning', target: '2025-09-15', features: 12 },
              { name: 'User Dashboard v1.8.0', progress: 90, status: 'testing', target: '2025-08-20', features: 5 },
              { name: 'Payment System v2.2.0', progress: 25, status: 'planning', target: '2025-10-01', features: 15 }
            ].map((release, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{release.name}</h4>
                    <p className="text-sm text-gray-600">{release.features} features • Target: {release.target}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    release.status === 'testing' ? 'bg-purple-100 text-purple-800' :
                    release.status === 'in-development' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${release.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{release.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Note about full release management tool */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Info size={20} className="text-blue-600" />
          <h4 className="font-medium text-blue-800">Full Release Management Tool</h4>
        </div>
        <p className="text-blue-700 text-sm">
          The complete Release Management tool with hierarchical planning, drag & drop functionality, 
          and detailed project tracking is available as a dedicated component. Click "Open Full Tool" 
          to access the comprehensive release planning interface.
        </p>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Open Full Release Management Tool
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return renderDashboard();
      case 'releases': return renderReleaseManagement();
      case 'services': return renderServices();
      case 'pipelines': return renderPipelines();
      case 'monitoring': return renderMonitoring();
      case 'documentation': return renderDocumentation();
      case 'teams': return renderTeams();
      case 'incidents': return renderIncidents();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {renderTopBar()}
        
        <main className={`${sidebarCollapsed ? 'ml-0' : 'ml-0'} p-6 transition-all duration-300`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EnterpriseDevPortal;
