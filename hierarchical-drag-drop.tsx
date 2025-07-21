import React, { useState, useRef } from 'react';
import { 
  Plus, Minus, Lightbulb, Target, Users, FileText, Folder, Trash2, 
  Edit3, Palette, Settings, Heart, Star, Zap, Coffee, Music, 
  Camera, Book, Rocket, Globe, Shield, Diamond, Crown, Gift,
  Save, X, Check, AlertTriangle, Link, User, Calendar, Tag,
  ExternalLink, Info, Clock, Library, Search, Copy, Download,
  Upload, ArrowLeft, Grid, List, Filter, Eye, Edit, FolderOpen
} from 'lucide-react';

const MindMapWorkflowCatalogue = () => {
  // Current workflow state
  const [currentWorkflow, setCurrentWorkflow] = useState({
    id: null,
    name: 'Untitled Workflow',
    description: '',
    category: 'general',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: '1',
        title: 'Research Project',
        type: 'central',
        color: 'bg-purple-500',
        icon: 'Target',
        expanded: true,
        properties: {
          author: '',
          link: '',
          description: '',
          tags: [],
          priority: 'medium',
          status: 'in-progress',
          dueDate: '',
          notes: ''
        },
        children: [
          {
            id: '2',
            title: 'Literature Review',
            type: 'branch',
            color: 'bg-blue-500',
            icon: 'Book',
            expanded: true,
            properties: {
              author: 'Research Team',
              link: 'https://scholar.google.com',
              description: 'Comprehensive review of existing research',
              tags: ['research', 'academic'],
              priority: 'high',
              status: 'in-progress',
              dueDate: '2025-08-15',
              notes: 'Focus on papers from last 5 years'
            },
            children: [
              { 
                id: '3', 
                title: 'Key Papers', 
                type: 'leaf', 
                color: 'bg-blue-300', 
                icon: 'FileText',
                properties: {
                  author: 'Dr. Smith',
                  link: 'https://doi.org/10.1000/example',
                  description: 'Collection of most relevant research papers',
                  tags: ['papers', 'citations'],
                  priority: 'high',
                  status: 'completed',
                  dueDate: '2025-07-30',
                  notes: 'Found 15 highly relevant papers'
                },
                children: [] 
              }
            ]
          }
        ]
      }
    ]
  });

  // Catalogue state
  const [savedWorkflows, setSavedWorkflows] = useState([
    {
      id: 'workflow-1',
      name: 'Research Project Template',
      description: 'A comprehensive template for academic research projects with literature review, data analysis, and documentation phases.',
      category: 'research',
      tags: ['research', 'academic', 'template'],
      createdAt: '2025-07-15T10:00:00.000Z',
      updatedAt: '2025-07-18T14:30:00.000Z',
      status: 'active',
      statusHistory: [],
      nodeCount: 12,
      preview: {
        centralNode: 'Research Project',
        branches: ['Literature Review', 'Data Collection', 'Analysis', 'Documentation']
      },
      nodes: [
        {
          id: '1',
          title: 'Research Project',
          type: 'central',
          color: 'bg-purple-500',
          icon: 'Target',
          expanded: true,
          properties: { author: '', link: '', description: 'Academic research workflow', tags: ['research'], priority: 'high', status: 'in-progress', dueDate: '', notes: '' },
          children: [
            { id: '2', title: 'Literature Review', type: 'branch', color: 'bg-blue-500', icon: 'Book', expanded: true, properties: { author: '', link: '', description: '', tags: [], priority: 'high', status: 'pending', dueDate: '', notes: '' }, children: [] },
            { id: '3', title: 'Data Collection', type: 'branch', color: 'bg-green-500', icon: 'Target', expanded: true, properties: { author: '', link: '', description: '', tags: [], priority: 'medium', status: 'pending', dueDate: '', notes: '' }, children: [] }
          ]
        }
      ]
    },
    {
      id: 'workflow-2',
      name: 'Product Development',
      description: 'End-to-end product development workflow from ideation to launch, including user research, design, and testing.',
      category: 'business',
      tags: ['product', 'development', 'business'],
      createdAt: '2025-07-10T09:00:00.000Z',
      updatedAt: '2025-07-17T16:45:00.000Z',
      status: 'closed',
      statusHistory: [
        {
          action: 'closed',
          reason: 'Project completed successfully',
          timestamp: '2025-07-17T16:45:00.000Z',
          user: 'System'
        }
      ],
      nodeCount: 8,
      preview: {
        centralNode: 'Product Development',
        branches: ['Research', 'Design', 'Development', 'Launch']
      },
      nodes: [
        {
          id: '1',
          title: 'Product Development',
          type: 'central',
          color: 'bg-orange-500',
          icon: 'Rocket',
          expanded: true,
          properties: { author: '', link: '', description: 'Product development lifecycle', tags: ['product'], priority: 'high', status: 'in-progress', dueDate: '', notes: '' },
          children: [
            { id: '2', title: 'User Research', type: 'branch', color: 'bg-blue-500', icon: 'Users', expanded: true, properties: { author: '', link: '', description: '', tags: [], priority: 'high', status: 'completed', dueDate: '', notes: '' }, children: [] },
            { id: '3', title: 'Design Phase', type: 'branch', color: 'bg-pink-500', icon: 'Heart', expanded: true, properties: { author: '', link: '', description: '', tags: [], priority: 'medium', status: 'in-progress', dueDate: '', notes: '' }, children: [] }
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
  const [saveFormData, setSaveFormData] = useState({ name: '', description: '', category: 'general', tags: [] });
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [closeReason, setCloseReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');

  // Editor state (same as before)
  const [draggedNode, setDraggedNode] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [customizingNode, setCustomizingNode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('visual');
  const [newTag, setNewTag] = useState('');

  const colorOptions = [
    'bg-red-500', 'bg-pink-500', 'bg-purple-500', 'bg-indigo-500',
    'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500',
    'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-gray-500',
    'bg-red-300', 'bg-pink-300', 'bg-purple-300', 'bg-indigo-300',
    'bg-blue-300', 'bg-cyan-300', 'bg-teal-300', 'bg-green-300'
  ];

  const iconOptions = {
    'Lightbulb': Lightbulb, 'Target': Target, 'Users': Users, 'FileText': FileText,
    'Folder': Folder, 'Heart': Heart, 'Star': Star, 'Zap': Zap,
    'Coffee': Coffee, 'Music': Music, 'Camera': Camera, 'Book': Book,
    'Rocket': Rocket, 'Globe': Globe, 'Shield': Shield, 'Diamond': Diamond,
    'Crown': Crown, 'Gift': Gift
  };

  const categories = [
    { id: 'all', name: 'All Categories', icon: FolderOpen },
    { id: 'research', name: 'Research', icon: Book },
    { id: 'business', name: 'Business', icon: Target },
    { id: 'education', name: 'Education', icon: Users },
    { id: 'personal', name: 'Personal', icon: Heart },
    { id: 'general', name: 'General', icon: Folder }
  ];

  const priorityColors = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800', 
    'high': 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'blocked': 'bg-red-100 text-red-800'
  };

  // Workflow management functions
  const saveCurrentWorkflow = () => {
    const workflowToSave = {
      ...currentWorkflow,
      ...saveFormData,
      id: currentWorkflow.id || `workflow-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      nodeCount: countTotalNodes(currentWorkflow.nodes),
      preview: generatePreview(currentWorkflow.nodes),
      status: currentWorkflow.status || 'active',
      statusHistory: currentWorkflow.statusHistory || []
    };

    if (currentWorkflow.id) {
      // Update existing
      setSavedWorkflows(prev => 
        prev.map(w => w.id === currentWorkflow.id ? workflowToSave : w)
      );
    } else {
      // Create new
      workflowToSave.createdAt = new Date().toISOString();
      setSavedWorkflows(prev => [...prev, workflowToSave]);
    }

    setCurrentWorkflow(workflowToSave);
    setShowSaveDialog(false);
    setSaveFormData({ name: '', description: '', category: 'general', tags: [] });
  };

  const loadWorkflow = (workflow) => {
    // Only allow loading if workflow is active
    if (workflow.status === 'closed') {
      setSelectedWorkflowId(workflow.id);
      setShowReopenDialog(true);
      return;
    }
    
    setCurrentWorkflow({
      ...workflow,
      updatedAt: new Date().toISOString()
    });
    setCurrentView('editor');
  };

  const closeWorkflow = () => {
    if (!selectedWorkflowId || !closeReason.trim()) return;
    
    setSavedWorkflows(prev => 
      prev.map(w => w.id === selectedWorkflowId ? {
        ...w,
        status: 'closed',
        statusHistory: [
          ...w.statusHistory,
          {
            action: 'closed',
            reason: closeReason.trim(),
            timestamp: new Date().toISOString(),
            user: 'User'
          }
        ],
        updatedAt: new Date().toISOString()
      } : w)
    );
    
    setShowCloseDialog(false);
    setSelectedWorkflowId(null);
    setCloseReason('');
  };

  const reopenWorkflow = () => {
    if (!selectedWorkflowId || !reopenReason.trim()) return;
    
    const workflow = savedWorkflows.find(w => w.id === selectedWorkflowId);
    if (!workflow) return;
    
    const updatedWorkflow = {
      ...workflow,
      status: 'active',
      statusHistory: [
        ...workflow.statusHistory,
        {
          action: 'reopened',
          reason: reopenReason.trim(),
          timestamp: new Date().toISOString(),
          user: 'User'
        }
      ],
      updatedAt: new Date().toISOString()
    };
    
    setSavedWorkflows(prev => 
      prev.map(w => w.id === selectedWorkflowId ? updatedWorkflow : w)
    );
    
    setCurrentWorkflow(updatedWorkflow);
    setCurrentView('editor');
    
    setShowReopenDialog(false);
    setSelectedWorkflowId(null);
    setReopenReason('');
  };

  const createNewWorkflow = () => {
    setCurrentWorkflow({
      id: null,
      name: 'Untitled Workflow',
      description: '',
      category: 'general',
      tags: [],
      status: 'active',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [{
        id: Date.now().toString(),
        title: 'New Mind Map',
        type: 'central',
        color: 'bg-purple-500',
        icon: 'Target',
        expanded: true,
        properties: {
          author: '', link: '', description: '', tags: [], priority: 'medium',
          status: 'in-progress', dueDate: '', notes: ''
        },
        children: []
      }]
    });
    setCurrentView('editor');
  };

  const duplicateWorkflow = (workflow) => {
    const duplicate = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      status: 'active',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSavedWorkflows(prev => [...prev, duplicate]);
  };

  const countTotalNodes = (nodes) => {
    return nodes.reduce((count, node) => {
      return count + 1 + (node.children ? countTotalNodes(node.children) : 0);
    }, 0);
  };

  const generatePreview = (nodes) => {
    const centralNode = nodes.find(n => n.type === 'central');
    if (!centralNode) return { centralNode: 'Empty', branches: [] };
    
    return {
      centralNode: centralNode.title,
      branches: centralNode.children ? centralNode.children.map(c => c.title).slice(0, 4) : []
    };
  };

  // Filter workflows
  const filteredWorkflows = savedWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // [All the node management functions remain the same - findNodeById, updateNodeById, etc.]
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

  // Editor functions (same as before)
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
    if (draggedNode && draggedNode.id !== node.id && node.type !== 'leaf') {
      setDropTarget(node.id);
    }
  };

  const handleDrop = (e, targetNode) => {
    e.preventDefault();
    if (!draggedNode || draggedNode.id === targetNode.id || targetNode.type === 'leaf') return;

    let newNodes = removeNodeById(currentWorkflow.nodes, draggedNode.id);
    newNodes = addNodeToParent(newNodes, targetNode.id, draggedNode);
    
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: newNodes,
      updatedAt: new Date().toISOString()
    }));
    
    setDraggedNode(null);
    setDropTarget(null);
  };

  const toggleExpanded = (nodeId) => {
    setCurrentWorkflow(prev => ({
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
      setCurrentWorkflow(prev => ({
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
    const parent = findNodeById(currentWorkflow.nodes, parentId);
    const newNodeType = parent?.type === 'central' ? 'branch' : 'leaf';
    
    const newNode = {
      id: Date.now().toString(),
      title: 'New Card',
      type: newNodeType,
      color: newNodeType === 'branch' ? 'bg-blue-500' : 'bg-gray-400',
      icon: 'Lightbulb',
      properties: {
        author: '', link: '', description: '', tags: [], priority: 'medium',
        status: 'pending', dueDate: '', notes: ''
      },
      children: []
    };
    
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: addNodeToParent(prev.nodes, parentId, newNode),
      updatedAt: new Date().toISOString()
    }));
  };

  const confirmDelete = (nodeId) => {
    const node = findNodeById(currentWorkflow.nodes, nodeId);
    if (!node) return;

    const childCount = countTotalChildren(node);
    setDeleteConfirm({ nodeId, node, childCount });
  };

  const executeDelete = () => {
    if (deleteConfirm) {
      setCurrentWorkflow(prev => ({
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
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes: updateNodeById(prev.nodes, nodeId, updates),
      updatedAt: new Date().toISOString()
    }));
  };

  const updateNodeProperties = (nodeId, propertyUpdates) => {
    const node = findNodeById(currentWorkflow.nodes, nodeId);
    if (node) {
      setCurrentWorkflow(prev => ({
        ...prev,
        nodes: updateNodeById(prev.nodes, nodeId, { 
          properties: { ...node.properties, ...propertyUpdates }
        }),
        updatedAt: new Date().toISOString()
      }));
    }
  };

  const addTag = (nodeId, tagText) => {
    const node = findNodeById(currentWorkflow.nodes, nodeId);
    if (node && tagText.trim() && !node.properties.tags.includes(tagText.trim())) {
      updateNodeProperties(nodeId, { 
        tags: [...node.properties.tags, tagText.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (nodeId, tagToRemove) => {
    const node = findNodeById(currentWorkflow.nodes, nodeId);
    if (node) {
      updateNodeProperties(nodeId, { 
        tags: node.properties.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  // Render functions for catalogue
  const renderCatalogueHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Library size={28} className="text-blue-600" />
            Workflow Catalogue
          </h1>
          <p className="text-gray-600 mt-1">Manage and organize your mind map workflows</p>
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
            onClick={createNewWorkflow}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            New Workflow
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
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  const renderWorkflowCard = (workflow) => (
    <div key={workflow.id} className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg ${
      workflow.status === 'closed' ? 'opacity-60 bg-gray-50' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-semibold ${workflow.status === 'closed' ? 'text-gray-500' : 'text-gray-800'}`}>
                {workflow.name}
              </h3>
              {workflow.status === 'closed' && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  Closed
                </span>
              )}
            </div>
            <p className={`text-sm line-clamp-2 ${workflow.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
              {workflow.description}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => loadWorkflow(workflow)}
              className={`p-2 rounded-lg transition-colors ${
                workflow.status === 'closed' 
                  ? 'text-orange-600 hover:bg-orange-50' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              title={workflow.status === 'closed' ? 'Reopen workflow' : 'Open workflow'}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => duplicateWorkflow(workflow)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Duplicate workflow"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => {
                setSelectedWorkflowId(workflow.id);
                setShowCloseDialog(true);
              }}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Close workflow"
              disabled={workflow.status === 'closed'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className={`rounded-lg p-3 mb-3 ${workflow.status === 'closed' ? 'bg-gray-100' : 'bg-gray-50'}`}>
          <div className="text-xs text-gray-600 mb-2">Preview</div>
          <div className="text-sm">
            <div className={`font-medium mb-1 ${workflow.status === 'closed' ? 'text-gray-500' : 'text-blue-600'}`}>
              {workflow.preview.centralNode}
            </div>
            {workflow.preview.branches.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {workflow.preview.branches.map((branch, index) => (
                  <span key={index} className={`px-2 py-1 rounded text-xs ${
                    workflow.status === 'closed' 
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
        {workflow.statusHistory.length > 0 && (
          <div className="mb-3 text-xs">
            <div className="text-gray-600 mb-1">Last Status Change:</div>
            <div className={`${workflow.status === 'closed' ? 'text-gray-500' : 'text-gray-700'}`}>
              {workflow.statusHistory[workflow.statusHistory.length - 1].action === 'closed' ? '🔒' : '🔓'} 
              {workflow.statusHistory[workflow.statusHistory.length - 1].reason}
            </div>
          </div>
        )}

        {/* Tags and metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-wrap gap-1">
            {workflow.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={`px-2 py-1 rounded ${
                workflow.status === 'closed' 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {tag}
              </span>
            ))}
            {workflow.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">
                +{workflow.tags.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span>{workflow.nodeCount} nodes</span>
            <span>{new Date(workflow.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowList = (workflow) => (
    <div key={workflow.id} className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all ${
      workflow.status === 'closed' ? 'opacity-60 bg-gray-50' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className={`text-lg font-semibold ${workflow.status === 'closed' ? 'text-gray-500' : 'text-gray-800'}`}>
              {workflow.name}
            </h3>
            {workflow.status === 'closed' && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                Closed
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {workflow.nodeCount} nodes
            </span>
            <span className="text-xs text-gray-500">
              {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <p className={`text-sm mt-1 ${workflow.status === 'closed' ? 'text-gray-500' : 'text-gray-600'}`}>
            {workflow.description}
          </p>
          <div className="flex gap-1 mt-2">
            {workflow.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className={`px-2 py-1 text-xs rounded ${
                workflow.status === 'closed' 
                  ? 'bg-gray-200 text-gray-600' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {tag}
              </span>
            ))}
          </div>
          {workflow.statusHistory.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              Last: {workflow.statusHistory[workflow.statusHistory.length - 1].action === 'closed' ? '🔒' : '🔓'} 
              {workflow.statusHistory[workflow.statusHistory.length - 1].reason}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadWorkflow(workflow)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              workflow.status === 'closed' 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {workflow.status === 'closed' ? 'Re-Open' : 'Open'}
          </button>
          <button
            onClick={() => duplicateWorkflow(workflow)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedWorkflowId(workflow.id);
              setShowCloseDialog(true);
            }}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Close workflow"
            disabled={workflow.status === 'closed'}
          >
            <X size={16} />
          </button>
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
            <h3 className="text-lg font-bold text-gray-800">Save Workflow</h3>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={saveFormData.name}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter workflow name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={saveFormData.description}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this workflow"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={saveFormData.category}
                onChange={(e) => setSaveFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.filter(c => c.id !== 'all').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={saveCurrentWorkflow}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Workflow
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
            <h3 className="text-lg font-bold text-gray-800">Close Workflow</h3>
            <button
              onClick={() => {
                setShowCloseDialog(false);
                setSelectedWorkflowId(null);
                setCloseReason('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              This workflow will be closed and no longer editable. You can reopen it later if needed.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for closing <span className="text-red-500">*</span>
              </label>
              <textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="e.g., Project completed, No longer needed, Moving to different approach..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeWorkflow}
              disabled={!closeReason.trim()}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Close Workflow
            </button>
            <button
              onClick={() => {
                setShowCloseDialog(false);
                setSelectedWorkflowId(null);
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
            <h3 className="text-lg font-bold text-gray-800">Reopen Workflow</h3>
            <button
              onClick={() => {
                setShowReopenDialog(false);
                setSelectedWorkflowId(null);
                setReopenReason('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              This workflow is currently closed. To reopen and enable editing, please provide a reason.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for reopening <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g., Need to make updates, Continuing the project, Found additional requirements..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={reopenWorkflow}
              disabled={!reopenReason.trim()}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Reopen Workflow
            </button>
            <button
              onClick={() => {
                setShowReopenDialog(false);
                setSelectedWorkflowId(null);
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

  // [Include all the render functions from before - renderDeleteConfirmation, renderCustomizationPanel, renderConnections, renderNode]
  
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
                ⚠️ This will also delete {deleteConfirm.childCount} child {deleteConfirm.childCount === 1 ? 'card' : 'cards'}.
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
    const node = findNodeById(currentWorkflow.nodes, customizingNode);
    if (!node) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Customize Card: {node.title}</h3>
            <button
              onClick={() => {
                setCustomizingNode(null); 
                setActiveTab('visual');
                setNewTag('');
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {setActiveTab('visual'); setNewTag('');}}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'visual' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Palette size={16} className="inline mr-2" />
              Visual
            </button>
            <button
              onClick={() => {setActiveTab('properties'); setNewTag('');}}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'properties' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
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
                  {Object.entries(iconOptions).map(([name, IconComponent]) => (
                    <button
                      key={name}
                      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        node.icon === name ? 'bg-blue-100 ring-2 ring-blue-300' : ''
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
                  {['central', 'branch', 'leaf'].map(type => (
                    <button
                      key={type}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        node.type === type 
                          ? 'bg-blue-500 text-white' 
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
              {/* Author */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="mr-2" />
                  Author
                </label>
                <input
                  type="text"
                  value={node.properties.author}
                  onChange={(e) => updateNodeProperties(node.id, { author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>

              {/* Link */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Link size={16} className="mr-2" />
                  Link
                </label>
                <input
                  type="url"
                  value={node.properties.link}
                  onChange={(e) => updateNodeProperties(node.id, { link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={node.properties.priority}
                    onChange={(e) => updateNodeProperties(node.id, { priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={node.properties.status}
                    onChange={(e) => updateNodeProperties(node.id, { status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="mr-2" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={node.properties.dueDate}
                  onChange={(e) => updateNodeProperties(node.id, { dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add tag and press Enter"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="mr-2" />
                  Notes
                </label>
                <textarea
                  value={node.properties.notes}
                  onChange={(e) => updateNodeProperties(node.id, { notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      const childX = 300;
      const childY = (index - (node.children.length - 1) / 2) * 140;

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
    const IconComponent = iconOptions[node.icon] || Lightbulb;
    const isDropTarget = dropTarget === node.id;
    const isDragging = draggedNode?.id === node.id;
    const isEditing = editingNode === node.id;
    const hasProperties = node.properties.author || node.properties.link || node.properties.description || node.properties.tags.length > 0;
    
    const getNodeSize = () => {
      switch (node.type) {
        case 'central': return 'w-56 h-36';
        case 'branch': return 'w-48 h-28';
        case 'leaf': return 'w-40 h-24';
        default: return 'w-40 h-24';
      }
    };

    const getTextSize = () => {
      switch (node.type) {
        case 'central': return 'text-lg font-bold';
        case 'branch': return 'text-md font-semibold';
        case 'leaf': return 'text-sm font-medium';
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
                <IconComponent size={node.type === 'central' ? 24 : 20} className="text-white/90" />
                {hasProperties && (
                  <div className="w-2 h-2 bg-yellow-300 rounded-full" title="Has additional properties" />
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
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addNewNode(node.id);
                  }}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  title="Add Child"
                >
                  <Plus size={12} />
                </button>

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
                {node.properties.author && (
                  <span className="flex items-center gap-1">
                    <User size={10} />
                    {node.properties.author.split(' ')[0]}
                  </span>
                )}
                {node.properties.link && (
                  <a
                    href={node.properties.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={10} />
                  </a>
                )}
                {node.properties.dueDate && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(node.properties.dueDate).toLocaleDateString()}
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
                    {node.children.length} {node.children.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Child Nodes */}
        {node.expanded && node.children && node.children.map((child, index) => {
          const childOffsetX = offsetX + 300;
          const childOffsetY = offsetY + (index - (node.children.length - 1) / 2) * 140;
          
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
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <Library size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery || selectedCategory !== 'all' ? 'No workflows found' : 'No workflows yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first workflow to get started'}
              </p>
              <button
                onClick={createNewWorkflow}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create New Workflow
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {catalogueView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorkflows.map(renderWorkflowCard)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkflows.map(renderWorkflowList)}
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
          
          {currentWorkflow.status !== 'closed' && (
            <button
              onClick={() => {
                setSaveFormData({
                  name: currentWorkflow.name,
                  description: currentWorkflow.description,
                  category: currentWorkflow.category,
                  tags: currentWorkflow.tags
                });
                setShowSaveDialog(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              <span className="text-sm font-medium">Save Workflow</span>
            </button>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          {currentWorkflow.name}
          {currentWorkflow.status === 'closed' && (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
              🔒 Read Only
            </span>
          )}
        </h1>
        {currentWorkflow.description && (
          <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
            {currentWorkflow.description}
          </p>
        )}
        
        {currentWorkflow.status === 'closed' && (
          <p className="text-sm text-red-600 bg-red-50 backdrop-blur-sm rounded-lg p-3 max-w-md mt-2">
            <strong>⚠️ This workflow is closed:</strong> All editing functions are disabled. Return to the catalogue to reopen if needed.
          </p>
        )}
      </div>

      {/* Mind Map Canvas */}
      <div className="relative w-full h-full overflow-auto">
        <div className="absolute inset-0" style={{ minWidth: '3000px', minHeight: '2000px' }}>
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {currentWorkflow.nodes.map(node => renderConnections(node, 0, 300, 600))}
          </svg>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {currentWorkflow.nodes.map(node => renderNode(node, 0, 300, 600))}
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
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
          <p className="text-sm font-medium">
            Dragging: <span className="font-bold">{draggedNode.title}</span>
          </p>
          <p className="text-xs opacity-75">Drop on a branch or central node</p>
        </div>
      )}

      {/* Empty State */}
      {currentWorkflow.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No cards left!</h2>
            <p className="text-gray-500 mb-4">Add a new card to get started</p>
            <button
              onClick={() => setCurrentWorkflow(prev => ({
                ...prev,
                nodes: [{
                  id: Date.now().toString(),
                  title: 'New Mind Map',
                  type: 'central',
                  color: 'bg-purple-500',
                  icon: 'Target',
                  expanded: true,
                  properties: {
                    author: '', link: '', description: '', tags: [], priority: 'medium',
                    status: 'in-progress', dueDate: '', notes: ''
                  },
                  children: []
                }],
                updatedAt: new Date().toISOString()
              }))}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Create New Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMapWorkflowCatalogue;