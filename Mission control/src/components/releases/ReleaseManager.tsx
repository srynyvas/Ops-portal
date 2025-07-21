import React, { useState } from 'react';
import { 
  Plus, Minus, Target, Users, FileText, Trash2, 
  Edit3, Palette, Settings, Rocket, Globe, Shield, 
  Save, X, Check, AlertTriangle, User, Calendar, Tag,
  Info, Clock, Search, Copy, ArrowLeft, Grid, List, Eye, FolderOpen,
  GitBranch, Package, Code, Bug, CheckCircle, AlertCircle,
  Play, Pause, RotateCcw, TrendingUp, Layers, Terminal, Zap, Star
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
  const [saveFormData, setSaveFormData] = useState({ 
    name: '', 
    version: '', 
    description: '', 
    category: 'minor', 
    tags: [], 
    targetDate: '', 
    environment: 'development' 
  });
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState(null);
  const [closeReason, setCloseReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [formErrors, setFormErrors] = useState({});

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
    'on-hold': 'bg-gray-100 text-gray-800',
    'completed': 'bg-emerald-100 text-emerald-800'
  };

  // Validation functions
  const validateReleaseForm = (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim().length < 3) {
      errors.name = 'Release name must be at least 3 characters';
    }
    
    if (!data.version || !/^\d+\.\d+\.\d+/.test(data.version)) {
      errors.version = 'Version must follow semantic versioning (e.g., 1.0.0)';
    }
    
    if (data.targetDate && new Date(data.targetDate) < new Date()) {
      errors.targetDate = 'Target date cannot be in the past';
    }
    
    return errors;
  };

  // Node styling update functions
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