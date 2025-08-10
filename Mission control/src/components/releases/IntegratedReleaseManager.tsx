import React, { useState } from 'react';
import {
  Plus, Minus, Target, Users, FileText, Folder, Trash2,
  Edit3, Palette, Settings, Star, Zap, 
  Save, X, Check, AlertTriangle, User, Calendar, Tag,
  Info, Clock, Search, Copy, Download,
  ArrowLeft, Grid, List, Filter, Eye, Edit, FolderOpen,
  GitBranch, Package, Code, Bug, CheckCircle, AlertCircle,
  Play, Pause, RotateCcw, TrendingUp, Layers, Terminal,
  Rocket, Shield, ChevronRight, MoreVertical
} from 'lucide-react';

interface ReleaseNode {
  id: string;
  title: string;
  type: 'release' | 'feature' | 'task';
  color: string;
  icon: string;
  expanded?: boolean;
  properties: {
    version?: string;
    assignee?: string;
    targetDate?: string;
    environment?: string;
    description?: string;
    tags?: string[];
    priority?: string;
    status?: string;
    storyPoints?: string;
    dependencies?: string[];
    notes?: string;
    releaseNotes?: string;
  };
  children?: ReleaseNode[];
}

interface SavedRelease {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  tags: string[];
  targetDate: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'closed';
  statusHistory: any[];
  nodeCount: number;
  completion: number;
  preview: {
    centralNode: string;
    branches: string[];
  };
  nodes: ReleaseNode[];
}

const IntegratedReleaseManager: React.FC = () => {
  // State management
  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [catalogueView, setCatalogueView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [customizingNode, setCustomizingNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('visual');

  // Current release being edited
  const [currentRelease, setCurrentRelease] = useState<SavedRelease>({
    id: '',
    name: 'Untitled Release',
    version: '1.0.0',
    description: '',
    category: 'minor',
    tags: [],
    targetDate: '',
    environment: 'development',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    statusHistory: [],
    nodeCount: 1,
    completion: 0,
    preview: {
      centralNode: 'Release v1.0.0',
      branches: []
    },
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
        children: []
      }
    ]
  });

  // Saved releases catalogue
  const [savedReleases, setSavedReleases] = useState<SavedRelease[]>([
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
      statusHistory: [],
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
      statusHistory: [],
      nodeCount: 6,
      completion: 100,
      preview: {
        centralNode: 'API Security Hotfix',
        branches: ['SQL Injection Fix', 'Rate Limiting']
      },
      nodes: []
    }
  ]);

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

  const priorityColors: { [key: string]: string } = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  const statusColors: { [key: string]: string } = {
    'planning': 'bg-gray-100 text-gray-800',
    'in-development': 'bg-blue-100 text-blue-800',
    'testing': 'bg-purple-100 text-purple-800',
    'ready-for-release': 'bg-green-100 text-green-800',
    'released': 'bg-emerald-100 text-emerald-800',
    'blocked': 'bg-red-100 text-red-800',
    'on-hold': 'bg-gray-100 text-gray-800'
  };

  // Helper functions
  const findNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeById = (nodes: ReleaseNode[], id: string, updates: Partial<ReleaseNode>): ReleaseNode[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return { ...node, children: updateNodeById(node.children, id, updates) };
      }
      return node;
    });
  };

  const addNodeToParent = (nodes: ReleaseNode[], parentId: string, newNode: ReleaseNode): ReleaseNode[] => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
          expanded: true
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addNodeToParent(node.children, parentId, newNode)
        };
      }
      return node;
    });
  };

  const toggleExpanded = (nodeId: string) => {
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, {
        expanded: !findNodeById(prev.nodes, nodeId)?.expanded
      })
    }));
  };

  const startEditing = (node: ReleaseNode) => {
    setEditingNode(node.id);
    setEditValue(node.title);
  };

  const saveEdit = () => {
    if (editValue.trim() && editingNode) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: updateNodeById(prev.nodes, editingNode, { title: editValue.trim() })
      }));
    }
    setEditingNode(null);
    setEditValue('');
  };

  const addNewNode = (parentId: string) => {
    const parent = findNodeById(currentRelease.nodes, parentId);
    if (!parent) return;

    let newNodeType: 'feature' | 'task';
    let newColor: string;
    let newIcon: string;

    if (parent.type === 'release') {
      newNodeType = 'feature';
      newColor = 'bg-blue-600';
      newIcon = 'Package';
    } else if (parent.type === 'feature') {
      newNodeType = 'task';
      newColor = 'bg-gray-500';
      newIcon = 'Code';
    } else {
      return;
    }

    const newNode: ReleaseNode = {
      id: Date.now().toString(),
      title: newNodeType === 'feature' ? 'New Feature' : 'New Task',
      type: newNodeType,
      color: newColor,
      icon: newIcon,
      properties: {
        assignee: '',
        targetDate: '',
        environment: 'development',
        description: '',
        tags: [],
        priority: 'medium',
        status: 'planning',
        storyPoints: '',
        dependencies: [],
        notes: ''
      },
      children: []
    };

    setCurrentRelease(prev => ({
      ...prev,
      nodes: addNodeToParent(prev.nodes, parentId, newNode)
    }));
  };

  const createNewRelease = () => {
    setCurrentRelease({
      id: '',
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
      nodeCount: 1,
      completion: 0,
      preview: {
        centralNode: 'Release v1.0.0',
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
    });
    setCurrentView('editor');
  };

  const loadRelease = (release: SavedRelease) => {
    setCurrentRelease(release);
    setCurrentView('editor');
  };

  const duplicateRelease = (release: SavedRelease) => {
    const duplicate = {
      ...release,
      id: `release-${Date.now()}`,
      name: `${release.name} (Copy)`,
      version: release.version,
      status: 'active' as const,
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedReleases(prev => [...prev, duplicate]);
  };

  // Filter releases
  const filteredReleases = savedReleases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render node in tree view
  const renderNode = (node: ReleaseNode, level: number = 0) => {
    const isEditing = editingNode === node.id;

    return (
      <div key={node.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
          node.type === 'release' ? 'bg-purple-50' : node.type === 'feature' ? 'bg-blue-50' : 'bg-gray-50'
        }`}>
          {node.children && node.children.length > 0 && (
            <button
              onClick={() => toggleExpanded(node.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {node.expanded ? <ChevronRight className="h-4 w-4 rotate-90" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          
          <div className={`w-2 h-2 rounded-full ${node.color}`}></div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') {
                    setEditingNode(null);
                    setEditValue('');
                  }
                }}
                className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <button onClick={saveEdit} className="text-green-600 hover:text-green-700">
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <span 
                className="flex-1 font-medium cursor-pointer hover:text-purple-600"
                onClick={() => startEditing(node)}
              >
                {node.title}
              </span>
              
              {node.properties.version && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  v{node.properties.version}
                </span>
              )}
              
              {node.properties.priority && (
                <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[node.properties.priority]}`}>
                  {node.properties.priority}
                </span>
              )}
              
              {node.properties.status && (
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[node.properties.status]}`}>
                  {node.properties.status}
                </span>
              )}
              
              <div className="flex items-center gap-1">
                {node.type !== 'task' && (
                  <button
                    onClick={() => addNewNode(node.id)}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                    title={`Add ${node.type === 'release' ? 'Feature' : 'Task'}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  onClick={() => setCustomizingNode(node.id)}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
        
        {node.expanded && node.children && node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  // Render release card for catalogue
  const renderReleaseCard = (release: SavedRelease) => (
    <div key={release.id} className={`bg-white rounded-lg border hover:shadow-md transition-shadow ${
      release.status === 'closed' ? 'border-gray-300 opacity-75' : 'border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{release.name}</h3>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                v{release.version}
              </span>
              {release.status === 'closed' && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  Closed
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{release.description}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => loadRelease(release)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Open release"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => duplicateRelease(release)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{release.completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${release.completion}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs rounded-full ${
              environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-600'
            }`}>
              {environments.find(e => e.id === release.environment)?.name}
            </span>
            {release.targetDate && (
              <span className="text-xs text-gray-500">
                Target: {new Date(release.targetDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {release.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                {tag}
              </span>
            ))}
            {release.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{release.tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>{release.nodeCount} items</span>
            <span>Updated {new Date(release.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Catalogue view
  if (currentView === 'catalogue') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Release Management</h2>
            <p className="text-gray-600 mt-1">Plan and track software releases</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCatalogueView(catalogueView === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {catalogueView === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </button>
            
            <button
              onClick={createNewRelease}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Release
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Releases</span>
              <Rocket className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{savedReleases.length}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active</span>
              <Play className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {savedReleases.filter(r => r.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completed</span>
              <CheckCircle className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {savedReleases.filter(r => r.completion === 100).length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Progress</span>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(savedReleases.reduce((acc, r) => acc + r.completion, 0) / savedReleases.length)}%
            </p>
          </div>
        </div>

        {/* Releases grid/list */}
        {filteredReleases.length === 0 ? (
          <div className="text-center py-12">
            <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery || selectedCategory !== 'all' ? 'No releases found' : 'No releases yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first release to get started'}
            </p>
            <button
              onClick={createNewRelease}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create New Release
            </button>
          </div>
        ) : catalogueView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReleases.map(renderReleaseCard)}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReleases.map(release => (
              <div key={release.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{release.name}</h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        v{release.version}
                      </span>
                      {release.status === 'closed' && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          Closed
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{release.completion}% complete</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{release.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadRelease(release)}
                      className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => duplicateRelease(release)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Editor view
  return (
    <div className="space-y-6">
      {/* Editor header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('catalogue')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">{currentRelease.name}</h2>
              {currentRelease.version && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  v{currentRelease.version}
                </span>
              )}
            </div>
            {currentRelease.description && (
              <p className="text-gray-600 mt-1">{currentRelease.description}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowSaveDialog(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          Save Release
        </button>
      </div>

      {/* Release tree view */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Release Structure</h3>
          <p className="text-sm text-gray-600 mt-1">Organize features and tasks for this release</p>
        </div>
        
        <div className="space-y-2">
          {currentRelease.nodes.map(node => renderNode(node, 0))}
        </div>
        
        {currentRelease.nodes.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No release structure defined</p>
            <button
              onClick={() => {
                setCurrentRelease(prev => ({
                  ...prev,
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
                }));
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Release Structure
            </button>
          </div>
        )}
      </div>

      {/* Node customization panel */}
      {customizingNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Node Settings</h3>
              <button
                onClick={() => setCustomizingNode(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="planning">Planning</option>
                  <option value="in-development">In Development</option>
                  <option value="testing">Testing</option>
                  <option value="ready-for-release">Ready for Release</option>
                  <option value="released">Released</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <input
                  type="text"
                  placeholder="Enter assignee name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setCustomizingNode(null)}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setCustomizingNode(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedReleaseManager;