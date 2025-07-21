import React, { useState } from 'react';
import { 
  Plus, Search, Eye, Copy, X, Rocket, Package, Code, Shield, 
  Grid, List, AlertTriangle, Settings, Edit3, Save, ArrowLeft,
  Check, Minus, Target, User, Calendar, Tag, Trash2
} from 'lucide-react';
import type { ViewState } from '../../types';

interface ReleaseManagerProps {
  viewState: ViewState;
  onUpdateViewState: (updates: Partial<ViewState>) => void;
}

interface ReleaseNode {
  id: string;
  title: string;
  type: 'release' | 'feature' | 'task';
  color: string;
  icon: string;
  expanded?: boolean;
  properties: {
    version: string;
    assignee: string;
    targetDate: string;
    environment: string;
    description: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: string;
    storyPoints: string;
    dependencies: string[];
    notes: string;
    releaseNotes: string;
  };
  children: ReleaseNode[];
}

interface Release {
  id: string | null;
  name: string;
  version: string;
  description: string;
  category: string;
  tags: string[];
  targetDate: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  nodeCount?: number;
  completion?: number;
  preview?: {
    centralNode: string;
    branches: string[];
  };
  nodes: ReleaseNode[];
}

export const ReleaseManager: React.FC<ReleaseManagerProps> = ({
  viewState,
  onUpdateViewState,
}) => {
  // Sample data
  const [savedReleases] = useState<Release[]>([
    {
      id: 'release-1',
      name: 'Mobile App v2.1.0',
      version: '2.1.0',
      description: 'Major mobile app update with new UI components and performance improvements.',
      category: 'minor',
      tags: ['mobile', 'ui', 'performance'],
      targetDate: '2025-08-30',
      environment: 'staging',
      createdAt: '2025-07-15T10:00:00.000Z',
      updatedAt: '2025-07-18T14:30:00.000Z',
      status: 'active',
      nodeCount: 15,
      completion: 75,
      preview: {
        centralNode: 'Mobile App v2.1.0',
        branches: ['New UI Components', 'Performance Optimization', 'Bug Fixes']
      },
      nodes: []
    },
    {
      id: 'release-2',
      name: 'API Security Hotfix v1.2.1',
      version: '1.2.1',
      description: 'Critical security patch for API vulnerabilities.',
      category: 'hotfix',
      tags: ['security', 'api', 'critical'],
      targetDate: '2025-07-25',
      environment: 'production',
      createdAt: '2025-07-20T09:00:00.000Z',
      updatedAt: '2025-07-24T16:45:00.000Z',
      status: 'closed',
      nodeCount: 6,
      completion: 100,
      preview: {
        centralNode: 'API Security Hotfix v1.2.1',
        branches: ['SQL Injection Fix', 'Rate Limiting', 'Auth Token Validation']
      },
      nodes: []
    }
  ]);

  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [currentRelease, setCurrentRelease] = useState<Release | null>(null);

  // Configuration
  const environments = [
    { id: 'development', name: 'Development', color: 'bg-blue-100 text-blue-800' },
    { id: 'staging', name: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'production', name: 'Production', color: 'bg-green-100 text-green-800' }
  ];

  const categories = [
    { id: 'all', name: 'All Releases' },
    { id: 'major', name: 'Major Release' },
    { id: 'minor', name: 'Minor Release' },
    { id: 'patch', name: 'Patch Release' },
    { id: 'hotfix', name: 'Hotfix' },
    { id: 'beta', name: 'Beta Release' }
  ];

  // Handlers
  const handleSearch = (query: string) => {
    onUpdateViewState({ searchQuery: query });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    onUpdateViewState({ viewMode: mode });
  };

  const loadRelease = (release: Release) => {
    setCurrentRelease(release);
    setCurrentView('editor');
  };

  const createNewRelease = () => {
    const newRelease: Release = {
      id: null,
      name: 'New Release',
      version: '1.0.0',
      description: '',
      category: 'minor',
      tags: [],
      targetDate: '',
      environment: 'development',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      nodeCount: 1,
      completion: 0,
      preview: {
        centralNode: 'New Release',
        branches: []
      },
      nodes: [{
        id: Date.now().toString(),
        title: 'Release v1.0.0',
        type: 'release',
        color: 'bg-purple-600',
        icon: 'Rocket',
        expanded: true,
        properties: {
          version: '1.0.0',
          assignee: '',
          targetDate: '',
          environment: 'development',
          description: '',
          tags: [],
          priority: 'medium',
          status: 'planning',
          storyPoints: '',
          dependencies: [],
          notes: '',
          releaseNotes: ''
        },
        children: []
      }]
    };
    setCurrentRelease(newRelease);
    setCurrentView('editor');
  };

  // Filter releases
  const filteredReleases = savedReleases.filter(release => {
    const searchQuery = viewState.searchQuery.toLowerCase();
    const selectedCategory = viewState.activeFilters?.category || 'all';
    
    const matchesSearch = !searchQuery || (
      release.name.toLowerCase().includes(searchQuery) ||
      release.version.toLowerCase().includes(searchQuery) ||
      release.description.toLowerCase().includes(searchQuery) ||
      release.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
    
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Render release card
  const renderReleaseCard = (release: Release) => (
    <div key={release.id} className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg ${
      release.status === 'closed' ? 'opacity-60 bg-gray-50' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-semibold ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-800'}`}>
                {release.name}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                release.status === 'closed' ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-700'
              }`}>
                v{release.version}
              </span>
              {release.status === 'closed' && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  Closed
                </span>
              )}
            </div>
            <p className={`text-sm ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
              {release.description}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => loadRelease(release)}
              className={`p-2 rounded-lg transition-colors ${
                release.status === 'closed' 
                  ? 'text-orange-600 hover:bg-orange-50' 
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
              title={release.status === 'closed' ? 'Reopen release' : 'Open release'}
            >
              <Eye size={16} />
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Duplicate release"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{release.completion || 0}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${release.status === 'closed' ? 'bg-gray-400' : 'bg-purple-600'}`}
              style={{ width: `${release.completion || 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-600'
            }`}>
              {environments.find(e => e.id === release.environment)?.name || release.environment}
            </span>
            {release.targetDate && (
              <span className="text-xs text-gray-500">
                Target: {new Date(release.targetDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className={`rounded-lg p-3 mb-3 ${release.status === 'closed' ? 'bg-gray-100' : 'bg-gray-50'}`}>
          <div className="text-xs text-gray-600 mb-2">Features</div>
          <div className="text-sm">
            <div className={`font-medium mb-1 ${release.status === 'closed' ? 'text-gray-500' : 'text-purple-600'}`}>
              {release.preview?.centralNode || 'No content'}
            </div>
            {release.preview?.branches && release.preview.branches.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {release.preview.branches.map((branch, index) => (
                  <span key={index} className={`px-2 py-1 rounded text-xs ${
                    release.status === 'closed' 
                      ? 'bg-gray-200 text-gray-500' 
                      : 'bg-white text-gray-600'
                  }`}>
                    {branch}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags and metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-wrap gap-1">
            {release.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`px-2 py-1 rounded ${
                release.status === 'closed' 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {tag}
              </span>
            ))}
            {release.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                +{release.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span>{release.nodeCount || 0} items</span>
            <span>{new Date(release.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render - Catalogue view
  if (currentView === 'catalogue') {
    return (
      <div className="h-full bg-gray-50">
        {/* Header */}
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
                onClick={() => handleViewModeChange(viewState.viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title={`Switch to ${viewState.viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewState.viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
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
                value={viewState.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search releases..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={viewState.activeFilters?.category || 'all'}
              onChange={(e) => onUpdateViewState({ 
                activeFilters: { ...viewState.activeFilters, category: e.target.value }
              })}
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
        
        {/* Content */}
        <div className="p-6">
          {filteredReleases.length === 0 ? (
            <div className="text-center py-12">
              <Rocket size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {viewState.searchQuery ? 'No releases found' : 'No releases yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {viewState.searchQuery 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first release to get started'}
              </p>
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
                <p className="text-gray-600">
                  {filteredReleases.length} release{filteredReleases.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReleases.map(renderReleaseCard)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main render - Editor view (Mind Map)
  if (currentView === 'editor' && currentRelease) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Editor Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => setCurrentView('catalogue')}
              className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Back to Catalogue</span>
            </button>
            
            <button
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save size={16} />
              <span className="text-sm font-medium">Save Release</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {currentRelease.name}
            {currentRelease.version && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                v{currentRelease.version}
              </span>
            )}
          </h1>
          {currentRelease.description && (
            <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
              {currentRelease.description}
            </p>
          )}
        </div>

        {/* Mind Map Canvas - Fixed Layout */}
        <div className="w-full h-full overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Central Node */}
              {currentRelease.nodes.length > 0 && (
                <div className="relative">
                  <div className="w-64 h-40 bg-purple-600 text-white rounded-xl shadow-lg flex flex-col justify-center items-center p-4 relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                        <Settings size={12} />
                      </button>
                      <button className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    <Rocket size={26} className="mb-2" />
                    <h3 className="text-lg font-bold text-center leading-tight">
                      {currentRelease.nodes[0].title}
                    </h3>
                    
                    {currentRelease.nodes[0].properties.version && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-2">
                        v{currentRelease.nodes[0].properties.version}
                      </span>
                    )}
                  </div>

                  {/* Feature Nodes */}
                  {currentRelease.nodes[0].children && currentRelease.nodes[0].children.map((child, index) => {
                    const angle = (index * 90) - 45; // Spread around the center
                    const radius = 300;
                    const x = Math.cos(angle * Math.PI / 180) * radius;
                    const y = Math.sin(angle * Math.PI / 180) * radius;
                    
                    return (
                      <div key={child.id} className="absolute" style={{ 
                        left: `calc(50% + ${x}px - 104px)`, 
                        top: `calc(50% + ${y}px - 64px)` 
                      }}>
                        {/* Connection Line */}
                        <svg className="absolute inset-0 pointer-events-none" style={{
                          left: x > 0 ? -x : 0,
                          top: y > 0 ? -y : 0,
                          width: Math.abs(x) + 208,
                          height: Math.abs(y) + 128
                        }}>
                          <line
                            x1={x > 0 ? 0 : Math.abs(x)}
                            y1={y > 0 ? 0 : Math.abs(y)}
                            x2={x > 0 ? Math.abs(x) : 0}
                            y2={y > 0 ? Math.abs(y) : 0}
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                        </svg>
                        
                        <div className="w-52 h-32 bg-blue-600 text-white rounded-xl shadow-lg flex flex-col justify-center items-center p-4 relative hover:scale-105 transition-transform cursor-pointer">
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                              <Settings size={10} />
                            </button>
                            <button className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                              <Plus size={10} />
                            </button>
                          </div>
                          
                          <Package size={22} className="mb-2" />
                          <h4 className="text-md font-semibold text-center leading-tight">
                            {child.title}
                          </h4>
                          
                          {child.properties.assignee && (
                            <span className="text-xs bg-white/20 px-2 py-1 rounded mt-1">
                              {child.properties.assignee}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {currentRelease.nodes.length === 0 && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket size={32} className="text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-600 mb-2">No items yet!</h2>
                  <p className="text-gray-500 mb-4">Add a release to get started</p>
                  <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium">
                    Create Release Node
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Rocket size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">Release Manager</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export default ReleaseManager;
