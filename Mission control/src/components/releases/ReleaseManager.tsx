import React, { useState, useRef } from 'react';
import { 
  Plus, Minus, Lightbulb, Target, Users, FileText, Folder, Trash2, 
  Edit3, Palette, Settings, Heart, Star, Zap, Coffee, Music, 
  Camera, Book, Rocket, Globe, Shield, Diamond, Crown, Gift,
  Save, X, Check, AlertTriangle, Link, User, Calendar, Tag,
  ExternalLink, Info, Clock, Library, Search, Copy, Download,
  Upload, ArrowLeft, Grid, List, Filter, Eye, Edit, FolderOpen,
  GitBranch, Package, Code, Bug, CheckCircle, AlertCircle,
  Play, Pause, RotateCcw, TrendingUp, Layers, Terminal
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
  statusHistory?: any[];
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
  // Current release state
  const [currentRelease, setCurrentRelease] = useState<Release>({
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
  const [savedReleases, setSavedReleases] = useState<Release[]>([
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
      nodes: []
    },
    {
      id: 'release-2',
      name: 'API Security Hotfix v1.2.1',
      version: '1.2.1',
      description: 'Critical security patch for API vulnerabilities discovered in production.',
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
        centralNode: 'API Security Hotfix v1.2.1',
        branches: ['SQL Injection Fix', 'Rate Limiting', 'Auth Token Validation']
      },
      nodes: []
    }
  ]);

  // Editor state
  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [draggedNode, setDraggedNode] = useState<ReleaseNode | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [customizingNode, setCustomizingNode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('visual');
  const [newTag, setNewTag] = useState('');
  const [newDependency, setNewDependency] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [saveFormData, setSaveFormData] = useState({
    name: '', version: '', description: '', category: 'minor', tags: [], targetDate: '', environment: 'development'
  });

  // Configuration constants
  const colorOptions = [
    'bg-red-600', 'bg-pink-600', 'bg-purple-600', 'bg-indigo-600',
    'bg-blue-600', 'bg-cyan-600', 'bg-teal-600', 'bg-green-600',
    'bg-lime-600', 'bg-yellow-600', 'bg-orange-600', 'bg-gray-600',
    'bg-red-400', 'bg-pink-400', 'bg-purple-400', 'bg-indigo-400',
    'bg-blue-400', 'bg-cyan-400', 'bg-teal-400', 'bg-green-400'
  ];

  const releaseIcons = {
    'Rocket': Rocket, 'Package': Package, 'GitBranch': GitBranch, 'Code': Code,
    'Bug': Bug, 'Shield': Shield, 'Target': Target, 'CheckCircle': CheckCircle,
    'AlertCircle': AlertCircle, 'Play': Play, 'Pause': Pause, 'RotateCcw': RotateCcw,
    'TrendingUp': TrendingUp, 'Layers': Layers, 'Terminal': Terminal, 'Users': Users,
    'Zap': Zap, 'Star': Star
  };

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

  const priorityColors = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800', 
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'planning': 'bg-gray-100 text-gray-800',
    'in-development': 'bg-blue-100 text-blue-800',
    'testing': 'bg-purple-100 text-purple-800',
    'ready-for-release': 'bg-green-100 text-green-800',
    'released': 'bg-emerald-100 text-emerald-800',
    'blocked': 'bg-red-100 text-red-800',
    'on-hold': 'bg-gray-100 text-gray-800'
  };

  // Utility functions
  const handleSearch = (query: string) => {
    onUpdateViewState({ searchQuery: query });
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    onUpdateViewState({ viewMode: mode });
  };

  const countTotalNodes = (nodes: ReleaseNode[]): number => {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? countTotalNodes(node.children) : 0);
    }, 0);
  };

  const calculateCompletion = (nodes: ReleaseNode[]): number => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    const countTasks = (nodeList: ReleaseNode[]) => {
      nodeList.forEach(node => {
        if (node.type === 'task') {
          totalTasks++;
          if (node.properties.status === 'released' || node.properties.status === 'ready-for-release') {
            completedTasks++;
          }
        }
        if (node.children) {
          countTasks(node.children);
        }
      });
    };
    
    countTasks(nodes);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const generatePreview = (nodes: ReleaseNode[]) => {
    const centralNode = nodes.find(n => n.type === 'release');
    if (!centralNode) return { centralNode: 'Empty', branches: [] };
    
    return {
      centralNode: centralNode.title,
      branches: centralNode.children ? centralNode.children.map(c => c.title).slice(0, 4) : []
    };
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    if (parts.length >= 3) {
      parts[2] = (parseInt(parts[2]) + 1).toString();
      return parts.join('.');
    }
    return version;
  };

  // Filter releases
  const filteredReleases = savedReleases.filter(release => {
    const searchQuery = viewState.searchQuery.toLowerCase();
    const selectedCategory = viewState.activeFilters.category || 'all';
    
    const matchesSearch = !searchQuery || (
      release.name.toLowerCase().includes(searchQuery) ||
      release.version.toLowerCase().includes(searchQuery) ||
      release.description.toLowerCase().includes(searchQuery) ||
      release.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
    
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Node management functions
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

  const removeNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode[] => {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) {
        node.children = removeNodeById(node.children, id);
      }
      return true;
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

  const countTotalChildren = (node: ReleaseNode): number => {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((count, child) => count + 1 + countTotalChildren(child), 0);
  };

  // Release management functions
  const saveCurrentRelease = () => {
    const releaseToSave: Release = {
      ...currentRelease,
      ...saveFormData,
      id: currentRelease.id || `release-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      nodeCount: countTotalNodes(currentRelease.nodes),
      completion: calculateCompletion(currentRelease.nodes),
      preview: generatePreview(currentRelease.nodes),
      status: currentRelease.status || 'active',
      statusHistory: currentRelease.statusHistory || []
    };

    if (currentRelease.id) {
      setSavedReleases(prev => 
        prev.map(r => r.id === currentRelease.id ? releaseToSave : r)
      );
    } else {
      releaseToSave.createdAt = new Date().toISOString();
      setSavedReleases(prev => [...prev, releaseToSave]);
    }

    setCurrentRelease(releaseToSave);
    setShowSaveDialog(false);
    setSaveFormData({ name: '', version: '', description: '', category: 'minor', tags: [], targetDate: '', environment: 'development' });
  };

  const loadRelease = (release: Release) => {
    if (release.status === 'closed') {
      setSelectedReleaseId(release.id);
      setShowReopenDialog(true);
      return;
    }
    
    setCurrentRelease({
      ...release,
      updatedAt: new Date().toISOString()
    });
    setCurrentView('editor');
  };

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

  const duplicateRelease = (release: Release) => {
    const duplicate: Release = {
      ...release,
      id: `release-${Date.now()}`,
      name: `${release.name} (Copy)`,
      version: incrementVersion(release.version),
      status: 'active',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedReleases(prev => [...prev, duplicate]);
  };

  // Editor functions - Drag and Drop
  const handleDragStart = (e: React.DragEvent, node: ReleaseNode) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, node: ReleaseNode) => {
    e.preventDefault();
    if (draggedNode && draggedNode.id !== node.id && node.type !== 'task') {
      setDropTarget(node.id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetNode: ReleaseNode) => {
    e.preventDefault();
    if (!draggedNode || draggedNode.id === targetNode.id || targetNode.type === 'task') return;

    let newNodes = removeNodeById(currentRelease.nodes, draggedNode.id);
    newNodes = addNodeToParent(newNodes, targetNode.id, draggedNode);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: newNodes,
      updatedAt: new Date().toISOString()
    }));
    
    setDraggedNode(null);
    setDropTarget(null);
  };

  // Editor functions - Node manipulation
  const toggleExpanded = (nodeId: string) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (!node) return;
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, { 
        expanded: !node.expanded 
      }),
      updatedAt: new Date().toISOString()
    }));
  };

  const startEditing = (node: ReleaseNode) => {
    setEditingNode(node.id);
    setEditValue(node.title);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: updateNodeById(prev.nodes, editingNode!, { title: editValue.trim() }),
        updatedAt: new Date().toISOString()
      }));
    }
    setEditingNode(null);
    setEditValue('');
  };

  const cancelEdit = () => {
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
      return; // Can't add children to tasks
    }
    
    const newNode: ReleaseNode = {
      id: Date.now().toString(),
      title: newNodeType === 'feature' ? 'New Feature' : 'New Task',
      type: newNodeType,
      color: newColor,
      icon: newIcon,
      properties: {
        version: '', assignee: '', targetDate: '', environment: 'development',
        description: '', tags: [], priority: 'medium', status: 'planning',
        storyPoints: '', dependencies: [], notes: '', releaseNotes: ''
      },
      children: []
    };
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: addNodeToParent(prev.nodes, parentId, newNode),
      updatedAt: new Date().toISOString()
    }));
  };

  const confirmDelete = (nodeId: string) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (!node) return;

    const childCount = countTotalChildren(node);
    setDeleteConfirm({ nodeId, node, childCount });
  };

  const executeDelete = () => {
    if (deleteConfirm) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: removeNodeById(prev.nodes, deleteConfirm.nodeId),
        updatedAt: new Date().toISOString()
      }));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Node property management functions
  const updateNodeStyle = (nodeId: string, updates: Partial<ReleaseNode>) => {
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, updates),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateNodeProperties = (nodeId: string, propertyUpdates: Partial<ReleaseNode['properties']>) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: updateNodeById(prev.nodes, nodeId, { 
          properties: { ...node.properties, ...propertyUpdates }
        }),
        updatedAt: new Date().toISOString()
      }));
    }
  };

  const addTag = (nodeId: string, tagText: string) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node && tagText.trim() && !node.properties.tags.includes(tagText.trim())) {
      updateNodeProperties(nodeId, { 
        tags: [...node.properties.tags, tagText.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (nodeId: string, tagToRemove: string) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node) {
      updateNodeProperties(nodeId, { 
        tags: node.properties.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const addDependency = (nodeId: string, depText: string) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node && depText.trim() && !node.properties.dependencies.includes(depText.trim())) {
      updateNodeProperties(nodeId, { 
        dependencies: [...node.properties.dependencies, depText.trim()] 
      });
      setNewDependency('');
    }
  };

  const removeDependency = (nodeId: string, depToRemove: string) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node) {
      updateNodeProperties(nodeId, { 
        dependencies: node.properties.dependencies.filter(dep => dep !== depToRemove)
      });
    }
  };

  // Render functions - Catalogue header
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
          value={viewState.activeFilters.category || 'all'}
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
  );
