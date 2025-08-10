import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Copy, X, Rocket, Package, Code, Shield, 
  Grid, List, AlertTriangle, Settings, Edit3, Save, ArrowLeft,
  Check, Minus, Target, User, Calendar, Tag, Trash2, RefreshCw,
  Loader2, AlertCircle
} from 'lucide-react';
import type { ViewState } from '../../types';
import { useApiCall } from '../../hooks/useApiCall';
import { releaseService } from '../../services/releaseService';
import ReleaseManagementService from '../../services/releaseManagementService';

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
  nodes?: ReleaseNode[];
}

export default function ReleaseManager({ viewState, onUpdateViewState }: ReleaseManagerProps) {
  const [savedReleases, setSavedReleases] = useState<Release[]>([]);
  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [currentRelease, setCurrentRelease] = useState<Release | null>(null);

  // API integration hooks
  const {
    data: releasesData,
    loading: loadingReleases,
    error: releasesError,
    execute: fetchReleases
  } = useApiCall(ReleaseManagementService.getReleases);

  const {
    loading: savingRelease,
    error: saveError,
    execute: saveRelease
  } = useApiCall(ReleaseManagementService.createRelease);

  const {
    loading: deletingRelease,
    error: deleteError,
    execute: deleteRelease
  } = useApiCall(ReleaseManagementService.deleteRelease);

  // Load releases on mount
  useEffect(() => {
    fetchReleases();
  }, []);

  // Update saved releases when data changes
  useEffect(() => {
    if (releasesData) {
      const formattedReleases = releasesData.map(r => ({
        id: r.id,
        name: r.name,
        version: r.version,
        description: r.description || '',
        category: r.type || 'minor',
        tags: [],
        targetDate: r.plannedDate ? new Date(r.plannedDate).toISOString() : '',
        environment: 'production',
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
        status: r.status,
        nodeCount: r.features?.length || 0,
        completion: 0,
        preview: {
          centralNode: r.name,
          branches: r.features?.map(f => f.title) || []
        },
        nodes: []
      }));
      setSavedReleases(formattedReleases);
    }
  }, [releasesData]);

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

  const handleSaveRelease = async () => {
    if (!currentRelease) return;

    try {
      const releaseData = {
        name: currentRelease.name,
        version: currentRelease.version,
        description: currentRelease.description,
        type: currentRelease.category as any,
        plannedDate: currentRelease.targetDate ? new Date(currentRelease.targetDate) : undefined,
        status: 'planning' as any
      };

      if (currentRelease.id) {
        await ReleaseManagementService.updateRelease(currentRelease.id, releaseData);
      } else {
        await saveRelease(releaseData);
      }

      await fetchReleases();
      setCurrentView('catalogue');
    } catch (error) {
      console.error('Failed to save release:', error);
    }
  };

  const handleDeleteRelease = async (releaseId: string) => {
    if (!confirm('Are you sure you want to delete this release?')) return;

    try {
      await deleteRelease(releaseId);
      await fetchReleases();
    } catch (error) {
      console.error('Failed to delete release:', error);
    }
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

  // Render loading state
  if (loadingReleases && savedReleases.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading releases...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (releasesError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Releases</h3>
          <p className="text-gray-600 mb-4">
            {releasesError.message || 'Unable to connect to the backend API. Please check your configuration.'}
          </p>
          <button
            onClick={() => fetchReleases()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {currentView === 'catalogue' ? (
        <>
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">Release Catalogue</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 rounded-lg ${
                      viewState.viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 rounded-lg ${
                      viewState.viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fetchReleases()}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                  disabled={loadingReleases}
                >
                  <RefreshCw className={`w-4 h-4 ${loadingReleases ? 'animate-spin' : ''}`} />
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search releases..."
                    value={viewState.searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <button
                  onClick={createNewRelease}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Release
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center space-x-1 mt-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => onUpdateViewState({ 
                    activeFilters: { ...viewState.activeFilters, category: category.id }
                  })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    (viewState.activeFilters?.category || 'all') === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {(saveError || deleteError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {saveError?.message || deleteError?.message}
              </div>
            </div>
          )}

          {/* Release Grid/List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredReleases.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No releases found</h3>
                <p className="text-gray-600 mb-4">
                  {viewState.searchQuery 
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first release'}
                </p>
                {!viewState.searchQuery && (
                  <button
                    onClick={createNewRelease}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Release
                  </button>
                )}
              </div>
            ) : viewState.viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredReleases.map(release => (
                  <div
                    key={release.id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="p-4" onClick={() => loadRelease(release)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Rocket className="w-5 h-5 text-purple-600 mr-2" />
                          <h3 className="font-semibold text-gray-900">{release.name}</h3>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {release.environment}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{release.description || 'No description'}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">v{release.version}</span>
                        <span className="text-gray-500">
                          {release.nodeCount || 0} items
                        </span>
                      </div>
                      {release.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {release.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t flex justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadRelease(release);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (release.id) handleDeleteRelease(release.id);
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                        disabled={deletingRelease}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                {filteredReleases.map((release, index) => (
                  <div
                    key={release.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      index !== filteredReleases.length - 1 ? 'border-b' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4" onClick={() => loadRelease(release)}>
                        <Rocket className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{release.name}</h3>
                          <p className="text-sm text-gray-600">v{release.version} • {release.nodeCount || 0} items</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {release.environment}
                        </span>
                        <button
                          onClick={() => loadRelease(release)}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (release.id) handleDeleteRelease(release.id);
                          }}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                          disabled={deletingRelease}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        // Editor View
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('catalogue')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={currentRelease?.name || ''}
                  onChange={(e) => setCurrentRelease(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveRelease}
                  disabled={savingRelease}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingRelease ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Release
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Release Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                    <input
                      type="text"
                      value={currentRelease?.version || ''}
                      onChange={(e) => setCurrentRelease(prev => prev ? {...prev, version: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={currentRelease?.description || ''}
                      onChange={(e) => setCurrentRelease(prev => prev ? {...prev, description: e.target.value} : null)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={currentRelease?.category || 'minor'}
                      onChange={(e) => setCurrentRelease(prev => prev ? {...prev, category: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={currentRelease?.targetDate ? currentRelease.targetDate.split('T')[0] : ''}
                      onChange={(e) => setCurrentRelease(prev => prev ? {...prev, targetDate: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                    <select
                      value={currentRelease?.environment || 'development'}
                      onChange={(e) => setCurrentRelease(prev => prev ? {...prev, environment: e.target.value} : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {environments.map(env => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}