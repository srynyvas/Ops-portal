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

export const ReleaseManager: React.FC<ReleaseManagerProps> = ({
  viewState,
  onUpdateViewState,
}) => {
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
    },
    {
      id: 'release-2',
      name: 'API Security Hotfix v1.2.1',
      version: '1.2.1',
      description: 'Critical security patch for API vulnerabilities discovered in production. Immediate deployment required.',
      category: 'hotfix',
      tags: ['security', 'api', 'critical'],
      targetDate: '2025-07-25',
      environment: 'production',
      createdAt: '2025-07-20T09:00:00.000Z',
      updatedAt: '2025-07-24T16:45:00.000Z',
      status: 'closed',
      statusHistory: [
        {
          action: 'closed',
          reason: 'Successfully deployed to production, security vulnerabilities patched',
          timestamp: '2025-07-24T16:45:00.000Z',
          user: 'Security Team'
        }
      ],
      nodeCount: 6,
      completion: 100,
      preview: {
        centralNode: 'API Security Hotfix v1.2.1',
        branches: ['SQL Injection Fix', 'Rate Limiting', 'Auth Token Validation']
      },
      nodes: [
        {
          id: '1',
          title: 'API Security Hotfix v1.2.1',
          type: 'release',
          color: 'bg-red-600',
          icon: 'Shield',
          expanded: true,
          properties: { 
            version: '1.2.1', assignee: 'Security Team', targetDate: '2025-07-25', environment: 'production',
            description: 'Critical security fixes', tags: ['security'], priority: 'critical', status: 'released', 
            storyPoints: '13', dependencies: [], notes: 'Emergency deployment', releaseNotes: 'Security patches applied' 
          },
          children: [
            { id: '2', title: 'SQL Injection Fix', type: 'feature', color: 'bg-red-500', icon: 'Bug', expanded: true, 
              properties: { version: '', assignee: 'Backend Dev', targetDate: '2025-07-23', environment: 'production', description: '', tags: [], priority: 'critical', status: 'released', storyPoints: '8', dependencies: [], notes: '', releaseNotes: '' }, children: [] }
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
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState(null);
  const [closeReason, setCloseReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');

  // Editor state
  const [draggedNode, setDraggedNode] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [customizingNode, setCustomizingNode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('visual');
  const [newTag, setNewTag] = useState('');
  const [newDependency, setNewDependency] = useState('');

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

  // Release management functions
  const saveCurrentRelease = () => {
    const releaseToSave = {
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
      // Update existing
      setSavedReleases(prev => 
        prev.map(r => r.id === currentRelease.id ? releaseToSave : r)
      );
    } else {
      // Create new
      releaseToSave.createdAt = new Date().toISOString();
      setSavedReleases(prev => [...prev, releaseToSave]);
    }

    setCurrentRelease(releaseToSave);
    setShowSaveDialog(false);
    setSaveFormData({ name: '', version: '', description: '', category: 'minor', tags: [], targetDate: '', environment: 'development' });
  };

  const loadRelease = (release) => {
    // Only allow loading if release is active
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

  const closeRelease = () => {
    if (!selectedReleaseId || !closeReason.trim()) return;
    
    setSavedReleases(prev => 
      prev.map(r => r.id === selectedReleaseId ? {
        ...r,
        status: 'closed',
        statusHistory: [
          ...r.statusHistory,
          {
            action: 'closed',
            reason: closeReason.trim(),
            timestamp: new Date().toISOString(),
            user: 'User'
          }
        ],
        updatedAt: new Date().toISOString()
      } : r)
    );
    
    setShowCloseDialog(false);
    setSelectedReleaseId(null);
    setCloseReason('');
  };

  const reopenRelease = () => {
    if (!selectedReleaseId || !reopenReason.trim()) return;
    
    const release = savedReleases.find(r => r.id === selectedReleaseId);
    if (!release) return;
    
    const updatedRelease = {
      ...release,
      status: 'active',
      statusHistory: [
        ...release.statusHistory,
        {
          action: 'reopened',
          reason: reopenReason.trim(),
          timestamp: new Date().toISOString(),
          user: 'User'
        }
      ],
      updatedAt: new Date().toISOString()
    };
    
    setSavedReleases(prev => 
      prev.map(r => r.id === selectedReleaseId ? updatedRelease : r)
    );
    
    setCurrentRelease(updatedRelease);
    setCurrentView('editor');
    
    setShowReopenDialog(false);
    setSelectedReleaseId(null);
    setReopenReason('');
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

  const duplicateRelease = (release) => {
    const duplicate = {
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

  const incrementVersion = (version) => {
    const parts = version.split('.');
    if (parts.length >= 3) {
      parts[2] = (parseInt(parts[2]) + 1).toString();
      return parts.join('.');
    }
    return version;
  };

  const countTotalNodes = (nodes) => {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? countTotalNodes(node.children) : 0);
    }, 0);
  };

  const calculateCompletion = (nodes) => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    const countTasks = (nodeList) => {
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

  const generatePreview = (nodes) => {
    const centralNode = nodes.find(n => n.type === 'release');
    if (!centralNode) return { centralNode: 'Empty', branches: [] };
    
    return {
      centralNode: centralNode.title,
      branches: centralNode.children ? centralNode.children.map(c => c.title).slice(0, 4) : []
    };
  };

  // Filter releases
  const filteredReleases = savedReleases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Node management functions
  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeById = (nodes, id, updates) => {
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

  const removeNodeById = (nodes, id) => {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) {
        node.children = removeNodeById(node.children, id);
      }
      return true;
    });
  };

  const addNodeToParent = (nodes, parentId, newNode) => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
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

  const countTotalChildren = (node) => {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((count, child) => count + 1 + countTotalChildren(child), 0);
  };

  // Editor functions
  const handleDragStart = (e, node) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
    setDropTarget(null);
  };

  const handleDragOver = (e, node) => {
    e.preventDefault();
    if (draggedNode && draggedNode.id !== node.id && node.type !== 'task') {
      setDropTarget(node.id);
    }
  };

  const handleDrop = (e, targetNode) => {
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

  const toggleExpanded = (nodeId) => {
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, { 
        expanded: !findNodeById(prev.nodes, nodeId).expanded 
      }),
      updatedAt: new Date().toISOString()
    }));
  };

  const startEditing = (node) => {
    setEditingNode(node.id);
    setEditValue(node.title);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      setCurrentRelease(prev => ({
        ...prev,
        nodes: updateNodeById(prev.nodes, editingNode, { title: editValue.trim() }),
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

  const addNewNode = (parentId) => {
    const parent = findNodeById(currentRelease.nodes, parentId);
    let newNodeType, newColor, newIcon;
    
    if (parent?.type === 'release') {
      newNodeType = 'feature';
      newColor = 'bg-blue-600';
      newIcon = 'Package';
    } else if (parent?.type === 'feature') {
      newNodeType = 'task';
      newColor = 'bg-gray-500';
      newIcon = 'Code';
    } else {
      return; // Can't add children to tasks
    }
    
    const newNode = {
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

  const confirmDelete = (nodeId) => {
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

  const updateNodeStyle = (nodeId, updates) => {
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, updates),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateNodeProperties = (nodeId, propertyUpdates) => {
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

  const addTag = (nodeId, tagText) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node && tagText.trim() && !node.properties.tags.includes(tagText.trim())) {
      updateNodeProperties(nodeId, { 
        tags: [...node.properties.tags, tagText.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (nodeId, tagToRemove) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node) {
      updateNodeProperties(nodeId, { 
        tags: node.properties.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const addDependency = (nodeId, depText) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node && depText.trim() && !node.properties.dependencies.includes(depText.trim())) {
      updateNodeProperties(nodeId, { 
        dependencies: [...node.properties.dependencies, depText.trim()] 
      });
      setNewDependency('');
    }
  };

  const removeDependency = (nodeId, depToRemove) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (node) {
      updateNodeProperties(nodeId, { 
        dependencies: node.properties.dependencies.filter(dep => dep !== depToRemove)
      });
    }
  };

  // Render functions for catalogue
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
            <p className={`text-sm line-clamp-2 ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
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
              onClick={() => duplicateRelease(release)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Duplicate release"
            >
              <Copy size={16} />
            </button>
            {release.status !== 'closed' && (
              <button
                onClick={() => {
                  setSelectedReleaseId(release.id);
                  setShowCloseDialog(true);
                }}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Close release"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Progress and Environment */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{release.completion || 0}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${release.status === 'closed' ? 'bg-gray-400' : 'bg-purple-600'}`}
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
              {release.preview.centralNode}
            </div>
            {release.preview.branches.length > 0 && (
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

        {/* Status History */}
        {release.statusHistory.length > 0 && (
          <div className="mb-3 text-xs">
            <div className="text-gray-600 mb-1">Last Status Change:</div>
            <div className={`${release.status === 'closed' ? 'text-gray-500' : 'text-gray-700'}`}>
              {release.statusHistory[release.statusHistory.length - 1].action === 'closed' ? '🔒' : '🔓'} 
              {release.statusHistory[release.statusHistory.length - 1].reason}
            </div>
          </div>
        )}

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
            <span>{release.nodeCount} items</span>
            <span>{new Date(release.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReleaseList = (release) => (
    <div key={release.id} className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all ${
      release.status === 'closed' ? 'opacity-60 bg-gray-50' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
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
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {release.nodeCount} items
            </span>
            <span className={`px-2 py-1 text-xs rounded ${
              environments.find(e => e.id === release.environment)?.color || 'bg-gray-100 text-gray-600'
            }`}>
              {environments.find(e => e.id === release.environment)?.name || release.environment}
            </span>
            <span className="text-xs text-gray-500">
              {release.completion || 0}% complete
            </span>
            <span className="text-xs text-gray-500">
              {new Date(release.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <p className={`text-sm mt-1 ${release.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
            {release.description}
          </p>
          <div className="flex gap-1 mt-2">
            {release.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className={`px-2 py-1 text-xs rounded ${
                release.status === 'closed' 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {tag}
              </span>
            ))}
          </div>
          {release.statusHistory.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              Last: {release.statusHistory[release.statusHistory.length - 1].action === 'closed' ? '🔒' : '🔓'} 
              {release.statusHistory[release.statusHistory.length - 1].reason}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadRelease(release)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              release.status === 'closed' 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {release.status === 'closed' ? 'Re-Open' : 'Open'}
          </button>
          <button
            onClick={() => duplicateRelease(release)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          {release.status !== 'closed' && (
            <button
              onClick={() => {
                setSelectedReleaseId(release.id);
                setShowCloseDialog(true);
              }}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Close release"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSaveDialog = () => {
    if (!showSaveDialog) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Save Release</h3>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Name</label>
              <input
                type="text"
                value={saveFormData.name}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter release name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input
                type="text"
                value={saveFormData.version}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="e.g., 1.0.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={saveFormData.description}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this release"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={saveFormData.category}
                  onChange={(e) => setSaveFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.filter(c => c.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                <select
                  value={saveFormData.environment}
                  onChange={(e) => setSaveFormData(prev => ({ ...prev, environment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {environments.map(env => (
                    <option key={env.id} value={env.id}>
                      {env.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
              <input
                type="date"
                value={saveFormData.targetDate}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={saveCurrentRelease}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Save Release
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCloseDialog = () => {
    if (!showCloseDialog) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Close Release</h3>
            <button
              onClick={() => {
                setShowCloseDialog(false);
                setSelectedReleaseId(null);
                setCloseReason('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              This release will be closed and no longer editable. You can reopen it later if needed.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for closing <span className="text-red-500">*</span>
              </label>
              <textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="e.g., Release deployed to production, Project cancelled, Moving to next version..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeRelease}
              disabled={!closeReason.trim()}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Close Release
            </button>
            <button
              onClick={() => {
                setShowCloseDialog(false);
                setSelectedReleaseId(null);
                setCloseReason('');
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReopenDialog = () => {
    if (!showReopenDialog) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Reopen Release</h3>
            <button
              onClick={() => {
                setShowReopenDialog(false);
                setSelectedReleaseId(null);
                setReopenReason('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              This release is currently closed. To reopen and enable editing, please provide a reason.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for reopening <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g., Need to add hotfix, Found additional requirements, Continuing development..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reopenRelease}
              disabled={!reopenReason.trim()}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Reopen Release
            </button>
            <button
              onClick={() => {
                setShowReopenDialog(false);
                setSelectedReleaseId(null);
                setReopenReason('');
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmation = () => {
    if (!deleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete "<strong>{deleteConfirm.node.title}</strong>"?
            </p>
            {deleteConfirm.childCount > 0 && (
              <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                ⚠️ This will also delete {deleteConfirm.childCount} child {deleteConfirm.childCount === 1 ? 'item' : 'items'}.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={executeDelete}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Delete
            </button>
            <button
              onClick={cancelDelete}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomizationPanel = () => {
    if (!customizingNode) return null;
    const node = findNodeById(currentRelease.nodes, customizingNode);
    if (!node) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Customize {node.type === 'release' ? 'Release' : node.type === 'feature' ? 'Feature' : 'Task'}: {node.title}</h3>
            <button
              onClick={() => {
                setCustomizingNode(null); 
                setActiveTab('visual');
                setNewTag('');
                setNewDependency('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {setActiveTab('visual'); setNewTag(''); setNewDependency('');}}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'visual' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Palette size={16} className="inline mr-2" />
              Visual
            </button>
            <button
              onClick={() => {setActiveTab('properties'); setNewTag(''); setNewDependency('');}}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'properties' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Info size={16} className="inline mr-2" />
              Properties
            </button>
          </div>

          {/* Visual Tab */}
          {activeTab === 'visual' && (
            <div>
              {/* Color Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-8 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} hover:scale-110 transition-transform ${
                        node.color === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                      }`}
                      onClick={() => updateNodeStyle(node.id, { color })}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                  {Object.entries(releaseIcons).map(([name, IconComponent]) => (
                    <button
                      key={name}
                      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        node.icon === name ? 'bg-purple-100 ring-2 ring-purple-300' : ''
                      }`}
                      onClick={() => updateNodeStyle(node.id, { icon: name })}
                    >
                      <IconComponent size={20} className="text-gray-600" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Node Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="flex gap-2">
                  {['release', 'feature', 'task'].map(type => (
                    <button
                      key={type}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        node.type === type 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => updateNodeStyle(node.id, { type })}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {/* Version (for releases) */}
              {node.type === 'release' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Package size={16} className="mr-2" />
                    Version
                  </label>
                  <input
                    type="text"
                    value={node.properties.version}
                    onChange={(e) => updateNodeProperties(node.id, { version: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 1.0.0"
                  />
                </div>
              )}

              {/* Assignee */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2" />
                  Assignee
                </label>
                <input
                  type="text"
                  value={node.properties.assignee}
                  onChange={(e) => updateNodeProperties(node.id, { assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter assignee name or team"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="mr-2" />
                  Description
                </label>
                <textarea
                  value={node.properties.description}
                  onChange={(e) => updateNodeProperties(node.id, { description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              {/* Priority, Status, Story Points */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={node.properties.priority}
                    onChange={(e) => updateNodeProperties(node.id, { priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={node.properties.status}
                    onChange={(e) => updateNodeProperties(node.id, { status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-development">In Development</option>
                    <option value="testing">Testing</option>
                    <option value="ready-for-release">Ready for Release</option>
                    <option value="released">Released</option>
                    <option value="blocked">Blocked</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Points</label>
                  <input
                    type="number"
                    value={node.properties.storyPoints}
                    onChange={(e) => updateNodeProperties(node.id, { storyPoints: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              {/* Target Date and Environment */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="mr-2" />
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={node.properties.targetDate}
                    onChange={(e) => updateNodeProperties(node.id, { targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <select
                    value={node.properties.environment}
                    onChange={(e) => updateNodeProperties(node.id, { environment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {environments.map(env => (
                      <option key={env.id} value={env.id}>
                        {env.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} className="mr-2" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {node.properties.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(node.id, tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        addTag(node.id, newTag);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add tag and press Enter"
                  />
                </div>
              </div>

              {/* Dependencies */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <GitBranch size={16} className="mr-2" />
                  Dependencies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {node.properties.dependencies.map((dep, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                    >
                      {dep}
                      <button
                        onClick={() => removeDependency(node.id, dep)}
                        className="ml-1 text-orange-600 hover:text-orange-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDependency}
                    onChange={(e) => setNewDependency(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newDependency.trim()) {
                        addDependency(node.id, newDependency);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add dependency and press Enter"
                  />
                </div>
              </div>

              {/* Release Notes */}
              {node.type === 'release' && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="mr-2" />
                    Release Notes
                  </label>
                  <textarea
                    value={node.properties.releaseNotes}
                    onChange={(e) => updateNodeProperties(node.id, { releaseNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="4"
                    placeholder="What's new in this release?"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="mr-2" />
                  Notes
                </label>
                <textarea
                  value={node.properties.notes}
                  onChange={(e) => updateNodeProperties(node.id, { notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Additional notes and comments"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConnections = (node, level = 0, parentX = 0, parentY = 0) => {
    if (!node.expanded || !node.children || node.children.length === 0) return null;

    return node.children.map((child, index) => {
      const childX = 320;
      const childY = (index - (node.children.length - 1) / 2) * 160;

      return (
        <g key={`connection-${child.id}`}>
          <line
            x1={parentX}
            y1={parentY}
            x2={parentX + childX}
            y2={parentY + childY}
            stroke="#e5e7eb"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          {renderConnections(child, level + 1, parentX + childX, parentY + childY)}
        </g>
      );
    });
  };

  const renderNode = (node, level = 0, offsetX = 0, offsetY = 0) => {
    const IconComponent = releaseIcons[node.icon] || Rocket;
    const isDropTarget = dropTarget === node.id;
    const isDragging = draggedNode?.id === node.id;
    const isEditing = editingNode === node.id;
    const hasProperties = node.properties.assignee || node.properties.targetDate || node.properties.description || node.properties.tags.length > 0;
    
    const getNodeSize = () => {
      switch (node.type) {
        case 'release': return 'w-64 h-40';
        case 'feature': return 'w-52 h-32';
        case 'task': return 'w-44 h-28';
        default: return 'w-44 h-28';
      }
    };

    const getTextSize = () => {
      switch (node.type) {
        case 'release': return 'text-lg font-bold';
        case 'feature': return 'text-md font-semibold';
        case 'task': return 'text-sm font-medium';
        default: return 'text-sm';
      }
    };

    return (
      <div key={node.id} className="relative">
        <div
          className={`
            absolute transform -translate-x-1/2 -translate-y-1/2 ${getNodeSize()}
            ${node.color} text-white rounded-xl shadow-lg cursor-pointer
            transition-all duration-300 hover:scale-105 hover:shadow-xl
            ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
            ${isDropTarget ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
          `}
          style={{ left: offsetX, top: offsetY }}
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, node)}
          onDrop={(e) => handleDrop(e, node)}
        >
          <div className="p-4 h-full flex flex-col justify-between">
            {/* Header with icon and controls */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <IconComponent size={node.type === 'release' ? 26 : 22} className="text-white/90" />
                {hasProperties && (
                  <div className="w-2 h-2 bg-yellow-300 rounded-full" title="Has additional properties" />
                )}
                {node.type === 'release' && node.properties.version && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    v{node.properties.version}
                  </span>
                )}
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomizingNode(node.id);
                  }}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  title="Customize"
                >
                  <Settings size={12} />
                </button>

                {node.children && node.children.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(node.id);
                    }}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title="Expand/Collapse"
                  >
                    {node.expanded ? <Minus size={12} /> : <Plus size={12} />}
                  </button>
                )}
                
                {node.type !== 'task' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addNewNode(node.id);
                    }}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    title={`Add ${node.type === 'release' ? 'Feature' : 'Task'}`}
                  >
                    <Plus size={12} />
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(node.id);
                  }}
                  className="w-6 h-6 bg-red-500/30 rounded-full flex items-center justify-center hover:bg-red-500/50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Node Title - Editable */}
            <div className="flex-1 flex flex-col justify-center">
              {isEditing ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Enter title"
                    autoFocus
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <div className="flex justify-center gap-1 mt-1">
                    <button
                      onClick={saveEdit}
                      className="w-5 h-5 bg-green-500/30 rounded flex items-center justify-center hover:bg-green-500/50"
                    >
                      <Check size={10} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-5 h-5 bg-red-500/30 rounded flex items-center justify-center hover:bg-red-500/50"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="group cursor-pointer w-full"
                  onClick={() => startEditing(node)}
                >
                  <h3 className={`${getTextSize()} text-center text-white/95 leading-tight group-hover:text-white transition-colors mb-1`}>
                    {node.title}
                  </h3>
                  <Edit3 size={10} className="mx-auto text-white/0 group-hover:text-white/70 transition-colors" />
                </div>
              )}
            </div>

            {/* Property Indicators */}
            <div className="space-y-1">
              {/* Priority & Status */}
              <div className="flex gap-1 justify-center">
                {node.properties.priority && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[node.properties.priority]}`}>
                    {node.properties.priority}
                  </span>
                )}
                {node.properties.status && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[node.properties.status]}`}>
                    {node.properties.status}
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/70">
                {node.properties.assignee && (
                  <span className="flex items-center gap-1">
                    <User size={10} />
                    {node.properties.assignee.split(' ')[0]}
                  </span>
                )}
                {node.properties.storyPoints && (
                  <span className="flex items-center gap-1">
                    <Target size={10} />
                    {node.properties.storyPoints}
                  </span>
                )}
                {node.properties.targetDate && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(node.properties.targetDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Environment & Dependencies */}
              <div className="flex items-center justify-center gap-1 text-xs">
                {node.properties.environment && node.properties.environment !== 'development' && (
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    environments.find(e => e.id === node.properties.environment)?.color || 'bg-white/20 text-white'
                  }`}>
                    {environments.find(e => e.id === node.properties.environment)?.name.slice(0, 4) || node.properties.environment}
                  </span>
                )}
                {node.properties.dependencies.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded text-xs">
                    {node.properties.dependencies.length} dep{node.properties.dependencies.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Tags */}
              {node.properties.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {node.properties.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {node.properties.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      +{node.properties.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Children count */}
              {node.children && node.children.length > 0 && (
                <div className="text-center">
                  <span className="text-xs text-white/70">
                    {node.children.length} {node.type === 'release' ? 'feature' : 'task'}{node.children.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Child Nodes */}
        {node.expanded && node.children && node.children.map((child, index) => {
          const childOffsetX = offsetX + 320;
          const childOffsetY = offsetY + (index - (node.children.length - 1) / 2) * 160;
          
          return renderNode(child, level + 1, childOffsetX, childOffsetY);
        })}
      </div>
    );
  };

  // Main render
  if (currentView === 'catalogue') {
    return (
      <div className="w-full h-screen bg-gray-50">
        {renderCatalogueHeader()}
        
        <div className="px-6 py-6">
          {filteredReleases.length === 0 ? (
            <div className="text-center py-12">
              <Rocket size={48} className="mx-auto text-gray-400 mb-4" />
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

              {catalogueView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReleases.map(renderReleaseCard)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReleases.map(renderReleaseList)}
                </div>
              )}
            </>
          )}
        </div>

        {renderSaveDialog()}
        {renderCloseDialog()}
        {renderReopenDialog()}
      </div>
    );
  }

  // Editor view
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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
          
          {currentRelease.status !== 'closed' && (
            <button
              onClick={() => {
                setSaveFormData({
                  name: currentRelease.name,
                  version: currentRelease.version || '1.0.0',
                  description: currentRelease.description,
                  category: currentRelease.category,
                  tags: currentRelease.tags,
                  targetDate: currentRelease.targetDate || '',
                  environment: currentRelease.environment || 'development'
                });
                setShowSaveDialog(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save size={16} />
              <span className="text-sm font-medium">Save Release</span>
            </button>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {currentRelease.name}
          {currentRelease.version && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
              v{currentRelease.version}
            </span>
          )}
          {currentRelease.status === 'closed' && (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
              🔒 Read Only
            </span>
          )}
        </h1>
        {currentRelease.description && (
          <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
            {currentRelease.description}
          </p>
        )}
        
        {currentRelease.status === 'closed' && (
          <p className="text-sm text-red-600 bg-red-50 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
            <strong>⚠️ This release is closed:</strong> All editing functions are disabled. Return to the catalogue to reopen if needed.
          </p>
        )}
      </div>

      {/* Release Canvas */}
      <div className="relative w-full h-full overflow-auto">
        <div className="absolute inset-0" style={{ minWidth: '3000px', minHeight: '2000px' }}>
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {currentRelease.nodes.map(node => renderConnections(node, 0, 300, 600))}
          </svg>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {currentRelease.nodes.map(node => renderNode(node, 0, 300, 600))}
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {renderCustomizationPanel()}

      {/* Delete Confirmation */}
      {renderDeleteConfirmation()}

      {/* Save Dialog */}
      {renderSaveDialog()}

      {/* Close Dialog */}
      {renderCloseDialog()}

      {/* Reopen Dialog */}
      {renderReopenDialog()}

      {/* Drag Indicator */}
      {draggedNode && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
          <p className="text-sm font-medium">
            Dragging: <span className="font-bold">{draggedNode.title}</span>
          </p>
          <p className="text-xs opacity-75">Drop on a release or feature</p>
        </div>
      )}

      {/* Empty State */}
      {currentRelease.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No items left!</h2>
            <p className="text-gray-500 mb-4">Add a release to get started</p>
            <button
              onClick={() => setCurrentRelease(prev => ({
                ...prev,
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
                }],
                updatedAt: new Date().toISOString()
              }))}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Create New Release
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
