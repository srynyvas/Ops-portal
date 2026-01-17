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

// Import the Release Management Tool Component
const ReleaseManagementTool = () => {
  // Current release state
  const [currentRelease, setCurrentRelease] = useState({
    id: null,
    name: 'Untitled Release',
    version: '1.0.0',
    description: '',
    category: 'minor',
    tags: [],
    targetDate: '',
    environment: 'development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: '1',
        title: 'Release v1.0.0',
        type: 'release',
        color: 'bg-purple-600',
        icon: 'Rocket',
        expanded: true,
        properties: {
          version: '1.0.0',
          assignee: '',
          targetDate: '2025-09-01',
          environment: 'development',
          description: 'Major release with new features',
          tags: ['release', 'major'],
          priority: 'high',
          status: 'planning',
          storyPoints: '',
          dependencies: [],
          notes: '',
          releaseNotes: ''
        },
        children: [
          {
            id: '2',
            title: 'User Authentication System',
            type: 'feature',
            color: 'bg-blue-600',
            icon: 'Shield',
            expanded: true,
            properties: {
              version: '',
              assignee: 'Frontend Team',
              targetDate: '2025-08-15',
              environment: 'development',
              description: 'Implement OAuth and JWT authentication',
              tags: ['auth', 'security', 'frontend'],
              priority: 'high',
              status: 'in-development',
              storyPoints: '13',
              dependencies: ['Database Setup'],
              notes: 'Requires security review',
              releaseNotes: ''
            },
            children: [
              { 
                id: '3', 
                title: 'Login Component', 
                type: 'task', 
                color: 'bg-blue-400', 
                icon: 'Code',
                properties: {
                  version: '',
                  assignee: 'John Doe',
                  targetDate: '2025-08-05',
                  environment: 'development',
                  description: 'Create React login component with validation',
                  tags: ['react', 'validation', 'ui'],
                  priority: 'high',
                  status: 'completed',
                  storyPoints: '5',
                  dependencies: [],
                  notes: 'Includes form validation and error handling',
                  releaseNotes: ''
                },
                children: [] 
              }
            ]
          }
        ]
      }
    ]
  });

  // Release catalogue state
  const [savedReleases, setSavedReleases] = useState([
    {
      id: 'release-1',
      name: 'Mobile App v2.1.0',
      version: '2.1.0',
      description: 'Major mobile app update with new UI components, performance improvements, and bug fixes.',
      category: 'minor',
      tags: ['mobile', 'ui', 'performance'],
      targetDate: '2025-08-30',
      environment: 'staging',
      createdAt: '2025-07-15T10:00:00.000Z',
      updatedAt: '2025-07-18T14:30:00.000Z',
      status: 'active',
      statusHistory: [],
      nodeCount: 15,
      completion: 75,
      preview: {
        centralNode: 'Mobile App v2.1.0',
        branches: ['New UI Components', 'Performance Optimization', 'Bug Fixes', 'Testing Suite']
      },
      nodes: [
        {
          id: '1',
          title: 'Mobile App v2.1.0',
          type: 'release',
          color: 'bg-purple-600',
          icon: 'Rocket',
          expanded: true,
          properties: { 
            version: '2.1.0', assignee: 'Release Manager', targetDate: '2025-08-30', environment: 'staging',
            description: 'Mobile app update', tags: ['mobile'], priority: 'high', status: 'in-development', 
            storyPoints: '89', dependencies: [], notes: '', releaseNotes: 'Major UI overhaul' 
          },
          children: [
            { id: '2', title: 'New UI Components', type: 'feature', color: 'bg-blue-600', icon: 'Layers', expanded: true, 
              properties: { version: '', assignee: 'UI Team', targetDate: '2025-08-20', environment: 'development', description: '', tags: [], priority: 'high', status: 'in-development', storyPoints: '34', dependencies: [], notes: '', releaseNotes: '' }, children: [] },
            { id: '3', title: 'Performance Optimization', type: 'feature', color: 'bg-green-600', icon: 'TrendingUp', expanded: true, 
              properties: { version: '', assignee: 'Backend Team', targetDate: '2025-08-25', environment: 'development', description: '', tags: [], priority: 'medium', status: 'testing', storyPoints: '21', dependencies: [], notes: '', releaseNotes: '' }, children: [] }
          ]
        }
      ]
    }
  ]);

  // UI state
  const [currentView, setCurrentView] = useState('catalogue'); // 'catalogue' or 'editor'
  const [catalogueView, setCatalogueView] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormData, setSaveFormData] = useState({ name: '', version: '', description: '', category: 'minor', tags: [], targetDate: '', environment: 'development' });

  const categories = [
    { id: 'all', name: 'All Releases', icon: FolderOpen },
    { id: 'major', name: 'Major Release', icon: Rocket },
    { id: 'minor', name: 'Minor Release', icon: Package },
    { id: 'patch', name: 'Patch Release', icon: Code },
    { id: 'hotfix', name: 'Hotfix', icon: Bug },
    { id: 'beta', name: 'Beta Release', icon: GitBranch }
  ];

  const environments = [
    { id: 'development', name: 'Development', color: 'bg-blue-100 text-blue-800' },
    { id: 'staging', name: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'production', name: 'Production', color: 'bg-green-100 text-green-800' }
  ];

  const createNewRelease = () => {
    setCurrentRelease({
      id: null,
      name: 'New Release',
      version: '1.0.0',
      description: '',
      category: 'minor',
      tags: [],
      targetDate: '',
      environment: 'development',
      status: 'active',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [{
        id: Date.now().toString(),
        title: 'Release v1.0.0',
        type: 'release',
        color: 'bg-purple-600',
        icon: 'Rocket',
        expanded: true,
        properties: {
          version: '1.0.0', assignee: '', targetDate: '', environment: 'development',
          description: '', tags: [], priority: 'medium', status: 'planning',
          storyPoints: '', dependencies: [], notes: '', releaseNotes: ''
        },
        children: []
      }]
    });
    setCurrentView('editor');
  };

  const loadRelease = (release) => {
    setCurrentRelease({
      ...release,
      updatedAt: new Date().toISOString()
    });
    setCurrentView('editor');
  };

  const renderCatalogueHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Rocket size={28} className="text-purple-600" />
            Release Management
          </h1>
          <p className="text-gray-600 mt-1">Manage software releases, features, and tasks</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCatalogueView(catalogueView === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title={`Switch to ${catalogueView === 'grid' ? 'list' : 'grid'} view`}
          >
            {catalogueView === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
          
          <button
            onClick={createNewRelease}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            New Release
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mt-4">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search releases..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderReleaseCard = (release) => (
    <div key={release.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-800">{release.name}</h3>
              <span className="px-2 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-700">
                v{release.version}
              </span>
            </div>
            <p className="text-sm line-clamp-2 text-gray-600">{release.description}</p>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => loadRelease(release)}
              className="p-2 rounded-lg transition-colors text-purple-600 hover:bg-purple-50"
              title="Open release"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{release.completion || 0}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-purple-600"
              style={{ width: `${release.completion || 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-wrap gap-1">
            {release.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                {tag}
              </span>
            ))}
          </div>
          <span>{release.nodeCount} items</span>
        </div>
      </div>
    </div>
  );

  if (currentView === 'catalogue') {
    return (
      <div className="w-full h-screen bg-gray-50">
        {renderCatalogueHeader()}
        
        <div className="px-6 py-6">
          {savedReleases.length === 0 ? (
            <div className="text-center py-12">
              <Rocket size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No releases yet</h3>
              <p className="text-gray-500 mb-6">Create your first release to get started</p>
              <button
                onClick={createNewRelease}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Create New Release
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">{savedReleases.length} releases found</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedReleases.map(renderReleaseCard)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Editor view - simplified for integration
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setCurrentView('catalogue')}
          className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Catalogue</span>
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          {currentRelease.name} v{currentRelease.version}
        </h1>
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket size={32} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Release Editor</h2>
          <p className="text-gray-500 mb-4">Full hierarchical release planning interface</p>
          <p className="text-sm text-gray-400">This is the integrated release management editor</p>
        </div>
      </div>
    </div>
  );
};

const EnterpriseDevPortal = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [teamsSubPage, setTeamsSubPage] = useState('overview');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'API Gateway experiencing high latency', time: '2 min ago', severity: 'high' },
    { id: 2, type: 'deploy', message: 'Release v2.1.0 deployed to staging', time: '15 min ago', severity: 'info' },
    { id: 3, type: 'security', message: 'Security scan completed - 2 vulnerabilities found', time: '1 hr ago', severity: 'medium' }
  ]);

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
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white h-screen fixed left-0 top-0 z-30 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold truncate">DevPortal</h1>
              <p className="text-gray-400 text-sm truncate">Enterprise Edition</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        {navigationItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                if (item.id !== 'teams') {
                  setTeamsSubPage('overview');
                }
              }}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                currentPage === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
              }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <IconComponent size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="ml-3 min-w-0 flex-1">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className="text-xs text-gray-400 truncate">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
            JD
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3 min-w-0 flex-1">
              <div className="font-medium truncate">John Doe</div>
              <div className="text-xs text-gray-400 truncate">Senior Developer</div>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setCurrentPage('releases')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Rocket size={20} className="text-purple-600" />
            <div className="text-left">
              <p className="font-medium">Create Release</p>
              <p className="text-sm text-gray-600">Plan new release</p>
            </div>
          </button>
          <button 
            onClick={() => setCurrentPage('services')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Database size={20} className="text-blue-600" />
            <div className="text-left">
              <p className="font-medium">Browse Services</p>
              <p className="text-sm text-gray-600">Service catalog</p>
            </div>
          </button>
          <button 
            onClick={() => setCurrentPage('documentation')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Book size={20} className="text-green-600" />
            <div className="text-left">
              <p className="font-medium">View Docs</p>
              <p className="text-sm text-gray-600">API documentation</p>
            </div>
          </button>
          <button 
            onClick={() => setCurrentPage('incidents')}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertTriangle size={20} className="text-orange-600" />
            <div className="text-left">
              <p className="font-medium">Report Issue</p>
              <p className="text-sm text-gray-600">Create incident</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderBasicPage = (title, description) => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Database size={32} className="text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': 
        return renderDashboard();
      case 'releases': 
        return <ReleaseManagementTool />;
      case 'services': 
        return renderBasicPage('Service Catalog', 'Browse available services and APIs');
      case 'pipelines': 
        return renderBasicPage('CI/CD Pipelines', 'Monitor build and deployment status');
      case 'monitoring': 
        return renderBasicPage('System Monitoring', 'View system health and metrics');
      case 'documentation': 
        return renderBasicPage('Documentation', 'Access developer guides and API docs');
      case 'teams': 
        return renderBasicPage('Teams', 'Team structure and contact information');
      case 'incidents': 
        return renderBasicPage('Incident Management', 'Track and manage system incidents');
      default: 
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {renderTopBar()}
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EnterpriseDevPortal;