import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Save, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Rocket, 
  Package, 
  CheckSquare, 
  Calendar, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Eye, 
  Settings, 
  AlertTriangle,
  Lock,
  Unlock,
  Target,
  Users,
  GitBranch,
  Clock
} from 'lucide-react';

// Types and Interfaces
interface ReleaseNode {
  id: string;
  title: string;
  type: 'release' | 'feature' | 'task';
  color: string;
  icon: string;
  expanded: boolean;
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
  children: ReleaseNode[];
}

interface Release {
  id: string;
  name: string;
  version?: string;
  description: string;
  category: string;
  tags: string[];
  targetDate?: string;
  environment?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closeReason?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    reason?: string;
  }>;
  nodes: ReleaseNode[];
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket size={16} />,
  Package: <Package size={16} />,
  CheckSquare: <CheckSquare size={16} />,
  Target: <Target size={16} />,
  Users: <Users size={16} />,
  GitBranch: <GitBranch size={16} />,
  Clock: <Clock size={16} />
};

// Sample data
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'web', name: 'Web Application' },
  { id: 'mobile', name: 'Mobile App' },
  { id: 'api', name: 'API/Backend' },
  { id: 'infrastructure', name: 'Infrastructure' },
  { id: 'security', name: 'Security' },
  { id: 'feature', name: 'Feature Release' },
  { id: 'hotfix', name: 'Hotfix' },
  { id: 'maintenance', name: 'Maintenance' }
];

const environments = [
  { id: 'development', name: 'Development' },
  { id: 'staging', name: 'Staging' },
  { id: 'production', name: 'Production' },
  { id: 'testing', name: 'Testing' }
];

const priorities = [
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
  { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800' }
];

const statuses = [
  { id: 'planning', name: 'Planning', color: 'bg-blue-100 text-blue-800' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { id: 'review', name: 'Review', color: 'bg-orange-100 text-orange-800' },
  { id: 'testing', name: 'Testing', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800' },
  { id: 'blocked', name: 'Blocked', color: 'bg-red-100 text-red-800' }
];

const defaultColors = [
  'bg-purple-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 
  'bg-red-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600'
];

const defaultIcons = ['Rocket', 'Package', 'CheckSquare', 'Target', 'Users', 'GitBranch', 'Clock'];

const ReleaseManager: React.FC = () => {
  // State management
  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [catalogueViewMode, setCatalogueViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [releases, setReleases] = useState<Release[]>([]);
  const [currentRelease, setCurrentRelease] = useState<Release>({
    id: '',
    name: '',
    description: '',
    category: 'web',
    tags: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: []
  });
  
  // Dialog states
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  
  // Form states
  const [saveFormData, setSaveFormData] = useState({
    name: '',
    version: '',
    description: '',
    category: 'web',
    tags: [] as string[],
    targetDate: '',
    environment: 'development'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Editor states
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<ReleaseNode | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ node: ReleaseNode; childCount: number } | null>(null);
  
  // Refs
  const dragCounter = useRef(0);

  // Initialize with sample data
  useEffect(() => {
    const sampleReleases: Release[] = [
      {
        id: '1',
        name: 'User Authentication System',
        version: '2.1.0',
        description: 'Complete overhaul of the authentication system with OAuth2 integration',
        category: 'security',
        tags: ['oauth', 'security', 'backend'],
        targetDate: '2024-02-15',
        environment: 'production',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        progress: { completed: 7, total: 12, percentage: 58 },
        nodes: [
          {
            id: '1-1',
            title: 'Authentication Core v2.1.0',
            type: 'release',
            color: 'bg-purple-600',
            icon: 'Rocket',
            expanded: true,
            properties: {
              version: '2.1.0',
              assignee: 'Sarah Johnson',
              targetDate: '2024-02-15',
              environment: 'production',
              description: 'Core authentication system release',
              tags: ['oauth', 'security'],
              priority: 'high',
              status: 'in-progress',
              storyPoints: '89',
              dependencies: [],
              releaseNotes: 'Major authentication improvements with OAuth2 support'
            },
            children: [
              {
                id: '1-1-1',
                title: 'OAuth2 Integration',
                type: 'feature',
                color: 'bg-blue-600',
                icon: 'Package',
                expanded: true,
                properties: {
                  assignee: 'Mike Chen',
                  targetDate: '2024-02-01',
                  description: 'Implement OAuth2 authentication flow',
                  tags: ['oauth', 'integration'],
                  priority: 'high',
                  status: 'completed',
                  storyPoints: '21',
                  dependencies: [],
                  notes: 'Completed ahead of schedule'
                },
                children: [
                  {
                    id: '1-1-1-1',
                    title: 'OAuth2 Provider Setup',
                    type: 'task',
                    color: 'bg-green-600',
                    icon: 'CheckSquare',
                    expanded: false,
                    properties: {
                      assignee: 'Mike Chen',
                      targetDate: '2024-01-25',
                      description: 'Configure OAuth2 providers (Google, GitHub)',
                      tags: ['oauth', 'setup'],
                      priority: 'medium',
                      status: 'completed',
                      storyPoints: '8',
                      dependencies: [],
                      notes: 'Google and GitHub providers configured'
                    },
                    children: []
                  },
                  {
                    id: '1-1-1-2',
                    title: 'Token Management',
                    type: 'task',
                    color: 'bg-yellow-600',
                    icon: 'CheckSquare',
                    expanded: false,
                    properties: {
                      assignee: 'Alex Rivera',
                      targetDate: '2024-01-30',
                      description: 'Implement JWT token generation and validation',
                      tags: ['jwt', 'tokens'],
                      priority: 'high',
                      status: 'completed',
                      storyPoints: '13',
                      dependencies: ['1-1-1-1'],
                      notes: 'Includes refresh token mechanism'
                    },
                    children: []
                  }
                ]
              },
              {
                id: '1-1-2',
                title: 'Security Enhancements',
                type: 'feature',
                color: 'bg-red-600',
                icon: 'Package',
                expanded: false,
                properties: {
                  assignee: 'David Park',
                  targetDate: '2024-02-10',
                  description: 'Additional security measures and rate limiting',
                  tags: ['security', 'rate-limiting'],
                  priority: 'high',
                  status: 'in-progress',
                  storyPoints: '34',
                  dependencies: ['1-1-1'],
                  notes: 'Rate limiting implementation in progress'
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Mobile App v3.0',
        version: '3.0.0',
        description: 'Major mobile application redesign with new features',
        category: 'mobile',
        tags: ['mobile', 'ui', 'redesign'],
        targetDate: '2024-03-01',
        environment: 'staging',
        status: 'active',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-18T14:20:00Z',
        progress: { completed: 3, total: 8, percentage: 38 },
        nodes: []
      },
      {
        id: '3',
        name: 'Legacy System Migration',
        version: '1.5.0',
        description: 'Migration of legacy systems to new infrastructure',
        category: 'infrastructure',
        tags: ['migration', 'legacy', 'infrastructure'],
        status: 'closed',
        createdAt: '2023-12-01T08:00:00Z',
        updatedAt: '2024-01-05T16:00:00Z',
        closedAt: '2024-01-05T16:00:00Z',
        closeReason: 'Successfully deployed to production',
        progress: { completed: 15, total: 15, percentage: 100 },
        statusHistory: [
          { status: 'active', timestamp: '2023-12-01T08:00:00Z' },
          { status: 'closed', timestamp: '2024-01-05T16:00:00Z', reason: 'Successfully deployed to production' }
        ],
        nodes: []
      }
    ];
    
    setReleases(sampleReleases);
  }, []);

  // Utility functions
  const calculateProgress = (nodes: ReleaseNode[]): { completed: number; total: number; percentage: number } => {
    let completed = 0;
    let total = 0;
    
    const countNodes = (nodeList: ReleaseNode[]) => {
      nodeList.forEach(node => {
        if (node.type === 'task') {
          total++;
          if (node.properties.status === 'completed') {
            completed++;
          }
        }
        if (node.children.length > 0) {
          countNodes(node.children);
        }
      });
    };
    
    countNodes(nodes);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Validation functions
  const validateSaveForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!saveFormData.name.trim()) {
      errors.name = 'Release name is required';
    }
    
    if (!saveFormData.version.trim()) {
      errors.version = 'Version is required';
    } else if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(saveFormData.version)) {
      errors.version = 'Version must follow semantic versioning (e.g., 1.0.0)';
    }
    
    if (saveFormData.targetDate && new Date(saveFormData.targetDate) < new Date()) {
      errors.targetDate = 'Target date cannot be in the past';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD operations
  const saveCurrentRelease = () => {
    if (!validateSaveForm()) return;
    
    const progress = calculateProgress(currentRelease.nodes);
    const releaseData: Release = {
      ...currentRelease,
      ...saveFormData,
      progress,
      updatedAt: new Date().toISOString()
    };
    
    if (currentRelease.id) {
      // Update existing
      setReleases(prev => prev.map(r => r.id === currentRelease.id ? releaseData : r));
    } else {
      // Create new
      releaseData.id = Date.now().toString();
      releaseData.createdAt = new Date().toISOString();
      setReleases(prev => [...prev, releaseData]);
    }
    
    setCurrentRelease(releaseData);
    setShowSaveDialog(false);
    setFormErrors({});
  };

  const openRelease = (release: Release) => {
    setCurrentRelease(release);
    setCurrentView('editor');
  };

  const createNewRelease = () => {
    const newRelease: Release = {
      id: '',
      name: 'New Release',
      description: '',
      category: 'web',
      tags: [],
      status: 'active',
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
    
    setSaveFormData({
      name: newRelease.name,
      version: '1.0.0',
      description: newRelease.description,
      category: newRelease.category,
      tags: newRelease.tags,
      targetDate: '',
      environment: 'development'
    });
    
    setCurrentRelease(newRelease);
    setCurrentView('editor');
  };

  const duplicateRelease = (release: Release) => {
    const duplicated: Release = {
      ...release,
      id: '',
      name: `${release.name} (Copy)`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: undefined,
      closeReason: undefined,
      nodes: release.nodes.map(node => ({ ...node, id: `${Date.now()}-${node.id}` }))
    };
    
    setSaveFormData({
      name: duplicated.name,
      version: duplicated.version || '1.0.0',
      description: duplicated.description,
      category: duplicated.category,
      tags: duplicated.tags,
      targetDate: duplicated.targetDate || '',
      environment: duplicated.environment || 'development'
    });
    
    setCurrentRelease(duplicated);
    setCurrentView('editor');
  };

  const closeRelease = () => {
    if (!selectedReleaseId || !closeReason.trim()) return;
    
    setReleases(prev => prev.map(release => 
      release.id === selectedReleaseId 
        ? {
            ...release,
            status: 'closed' as const,
            closedAt: new Date().toISOString(),
            closeReason: closeReason.trim(),
            updatedAt: new Date().toISOString(),
            statusHistory: [
              ...(release.statusHistory || []),
              {
                status: 'closed',
                timestamp: new Date().toISOString(),
                reason: closeReason.trim()
              }
            ]
          }
        : release
    ));
    
    setShowCloseDialog(false);
    setSelectedReleaseId(null);
    setCloseReason('');
  };

  const reopenRelease = () => {
    if (!selectedReleaseId || !reopenReason.trim()) return;
    
    setReleases(prev => prev.map(release => 
      release.id === selectedReleaseId 
        ? {
            ...release,
            status: 'active' as const,
            closedAt: undefined,
            closeReason: undefined,
            updatedAt: new Date().toISOString(),
            statusHistory: [
              ...(release.statusHistory || []),
              {
                status: 'active',
                timestamp: new Date().toISOString(),
                reason: reopenReason.trim()
              }
            ]
          }
        : release
    ));
    
    if (currentRelease.id === selectedReleaseId) {
      setCurrentRelease(prev => ({ ...prev, status: 'active' }));
    }
    
    setShowReopenDialog(false);
    setSelectedReleaseId(null);
    setReopenReason('');
  };

  // Node management functions
  const findNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
    return null;
  };

  const updateNode = (nodes: ReleaseNode[], id: string, updates: Partial<ReleaseNode>): ReleaseNode[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, ...updates };
      }
      if (node.children.length > 0) {
        return { ...node, children: updateNode(node.children, id, updates) };
      }
      return node;
    });
  };

  const deleteNode = (nodes: ReleaseNode[], id: string): ReleaseNode[] => {
    return nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children.length > 0) {
        node.children = deleteNode(node.children, id);
      }
      return true;
    });
  };

  const addChildNode = (nodes: ReleaseNode[], parentId: string, newNode: ReleaseNode): ReleaseNode[] => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode] };
      }
      if (node.children.length > 0) {
        return { ...node, children: addChildNode(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  const moveNode = (nodes: ReleaseNode[], nodeId: string, targetId: string): ReleaseNode[] => {
    const nodeToMove = findNodeById(nodes, nodeId);
    if (!nodeToMove) return nodes;
    
    let updatedNodes = deleteNode(nodes, nodeId);
    updatedNodes = addChildNode(updatedNodes, targetId, nodeToMove);
    
    return updatedNodes;
  };

  const countChildNodes = (node: ReleaseNode): number => {
    let count = node.children.length;
    node.children.forEach(child => {
      count += countChildNodes(child);
    });
    return count;
  };

  // Event handlers
  const handleNodeUpdate = (id: string, updates: Partial<ReleaseNode>) => {
    setCurrentRelease(prev => ({
      ...prev,
      nodes: updateNode(prev.nodes, id, updates),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleAddChild = (parentId: string, type: 'feature' | 'task') => {
    const newNode: ReleaseNode = {
      id: Date.now().toString(),
      title: type === 'feature' ? 'New Feature' : 'New Task',
      type,
      color: defaultColors[Math.floor(Math.random() * defaultColors.length)],
      icon: defaultIcons[Math.floor(Math.random() * defaultIcons.length)],
      expanded: true,
      properties: {
        assignee: '',
        targetDate: '',
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
      nodes: addChildNode(prev.nodes, parentId, newNode),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDeleteNode = (node: ReleaseNode) => {
    const childCount = countChildNodes(node);
    setDeleteConfirm({ node, childCount });
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: deleteNode(prev.nodes, deleteConfirm.node.id),
      updatedAt: new Date().toISOString()
    }));
    
    setDeleteConfirm(null);
    setSelectedNode(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Drag and drop handlers
  const handleDragStart = (node: ReleaseNode) => {
    if (currentRelease.status === 'closed') return;
    setDraggedNode(node);
    dragCounter.current = 0;
  };

  const handleDragEnter = (targetId: string) => {
    dragCounter.current++;
    setDragTarget(targetId);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragTarget(null);
    }
  };

  const handleDrop = (targetId: string) => {
    if (!draggedNode || draggedNode.id === targetId) return;
    
    const targetNode = findNodeById(currentRelease.nodes, targetId);
    if (!targetNode || targetNode.type === 'task') return;
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: moveNode(prev.nodes, draggedNode.id, targetId),
      updatedAt: new Date().toISOString()
    }));
    
    setDraggedNode(null);
    setDragTarget(null);
    dragCounter.current = 0;
  };

  // Filter functions
  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render functions
  const renderNode = (node: ReleaseNode, depth: number, x: number, y: number): React.ReactNode => {
    const isSelected = selectedNode === node.id;
    const isDragTarget = dragTarget === node.id && node.type !== 'task';
    const canAcceptDrop = draggedNode && draggedNode.id !== node.id && node.type !== 'task';
    const isReadOnly = currentRelease.status === 'closed';

    return (
      <div key={node.id} style={{ position: 'absolute', left: x, top: y }}>
        <div
          className={`relative group cursor-pointer transition-all duration-200 ${
            isSelected ? 'ring-2 ring-purple-400 ring-offset-2' : ''
          } ${isDragTarget ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
          draggable={!isReadOnly}
          onDragStart={() => handleDragStart(node)}
          onDragEnter={(e) => {
            e.preventDefault();
            if (canAcceptDrop) handleDragEnter(node.id);
          }}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(node.id);
          }}
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
        >
          <div className={`${node.color} text-white rounded-xl p-4 shadow-lg min-w-[200px] max-w-[280px]`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {iconMap[node.icon]}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                </span>
              </div>
              {node.children.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeUpdate(node.id, { expanded: !node.expanded });
                  }}
                  className="p-1 hover:bg-white/20 rounded"
                  disabled={isReadOnly}
                >
                  {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
            </div>
            
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{node.title}</h3>
            
            {node.properties.status && (
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statuses.find(s => s.id === node.properties.status)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {statuses.find(s => s.id === node.properties.status)?.name || node.properties.status}
                </span>
              </div>
            )}
            
            <div className="text-xs opacity-90 space-y-1">
              {node.properties.assignee && (
                <div>👤 {node.properties.assignee}</div>
              )}
              {node.properties.targetDate && (
                <div>📅 {new Date(node.properties.targetDate).toLocaleDateString()}</div>
              )}
              {node.properties.storyPoints && (
                <div>🎯 {node.properties.storyPoints} pts</div>
              )}
            </div>
            
            {!isReadOnly && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  {node.type !== 'task' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddChild(node.id, 'feature');
                        }}
                        className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 text-xs"
                        title="Add Feature"
                      >
                        F+
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddChild(node.id, 'task');
                        }}
                        className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 text-xs"
                        title="Add Task"
                      >
                        T+
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNode(node);
                    }}
                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Render children */}
        {node.expanded && node.children.map((child, index) => 
          renderNode(child, depth + 1, x + 320, y + (index * 140))
        )}
      </div>
    );
  };

  const renderConnections = (node: ReleaseNode, depth: number, x: number, y: number): React.ReactNode => {
    if (!node.expanded || node.children.length === 0) return null;
    
    const startX = x + 200;
    const startY = y + 60;
    
    return (
      <g key={`connections-${node.id}`}>
        {node.children.map((child, index) => {
          const endX = x + 320;
          const endY = y + (index * 140) + 60;
          const midX = startX + 60;
          
          return (
            <path
              key={`line-${child.id}`}
              d={`M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${endY} T ${endX} ${endY}`}
              stroke="rgba(156, 163, 175, 0.3)"
              strokeWidth="2"
              fill="none"
            />
          );
        })}
        {node.children.map((child, index) => 
          renderConnections(child, depth + 1, x + 320, y + (index * 140))
        )}
      </g>
    );
  };

  const renderCustomizationPanel = () => {
    if (!selectedNode) return null;
    
    const node = findNodeById(currentRelease.nodes, selectedNode);
    if (!node) return null;
    
    const isReadOnly = currentRelease.status === 'closed';

    return (
      <div className="fixed right-4 top-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Node Properties</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Visual Tab */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Visual</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={node.title}
                  onChange={(e) => handleNodeUpdate(node.id, { title: e.target.value })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {defaultColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleNodeUpdate(node.id, { color })}
                      disabled={isReadOnly}
                      className={`w-8 h-8 rounded ${color} border-2 ${
                        node.color === color ? 'border-gray-800' : 'border-gray-300'
                      } disabled:cursor-not-allowed`}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {defaultIcons.map(icon => (
                    <button
                      key={icon}
                      onClick={() => handleNodeUpdate(node.id, { icon })}
                      disabled={isReadOnly}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                        node.icon === icon ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                      } hover:bg-gray-50 disabled:cursor-not-allowed`}
                    >
                      {iconMap[icon]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Properties Tab */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Properties</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={node.properties.description || ''}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, description: e.target.value }
                  })}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <input
                  type="text"
                  value={node.properties.assignee || ''}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, assignee: e.target.value }
                  })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={node.properties.targetDate || ''}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, targetDate: e.target.value }
                  })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={node.properties.priority || 'medium'}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, priority: e.target.value }
                  })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={node.properties.status || 'planning'}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, status: e.target.value }
                  })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                <input
                  type="number"
                  value={node.properties.storyPoints || ''}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, storyPoints: e.target.value }
                  })}
                  disabled={isReadOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={(node.properties.tags || []).join(', ')}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { 
                      ...node.properties, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }
                  })}
                  disabled={isReadOnly}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dependencies</label>
                <input
                  type="text"
                  value={(node.properties.dependencies || []).join(', ')}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { 
                      ...node.properties, 
                      dependencies: e.target.value.split(',').map(dep => dep.trim()).filter(dep => dep)
                    }
                  })}
                  disabled={isReadOnly}
                  placeholder="dep1, dep2, dep3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={node.properties.notes || ''}
                  onChange={(e) => handleNodeUpdate(node.id, { 
                    properties: { ...node.properties, notes: e.target.value }
                  })}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
              
              {node.type === 'release' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Release Notes</label>
                  <textarea
                    value={node.properties.releaseNotes || ''}
                    onChange={(e) => handleNodeUpdate(node.id, { 
                      properties: { ...node.properties, releaseNotes: e.target.value }
                    })}
                    disabled={isReadOnly}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  if (currentView === 'catalogue') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Rocket className="text-purple-600" />
              Release Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and track your software releases</p>
          </div>
          
          <button
            onClick={createNewRelease}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            New Release
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search releases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300">
            <button
              onClick={() => setCatalogueViewMode('grid')}
              className={`p-2 rounded-l-lg ${catalogueViewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setCatalogueViewMode('list')}
              className={`p-2 rounded-r-lg ${catalogueViewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Release Grid/List */}
        <div className={catalogueViewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {filteredReleases.map(release => (
            <div
              key={release.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              {/* Release Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{release.name}</h3>
                  {release.version && (
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium mt-1">
                      v{release.version}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {release.status === 'closed' ? (
                    <Lock size={16} className="text-red-500" />
                  ) : (
                    <Unlock size={16} className="text-green-500" />
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{release.description}</p>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Category</span>
                  <span className="capitalize">{categories.find(c => c.id === release.category)?.name}</span>
                </div>
                
                {release.targetDate && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target Date</span>
                    <span>{new Date(release.targetDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {release.environment && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Environment</span>
                    <span className="capitalize">{environments.find(e => e.id === release.environment)?.name}</span>
                  </div>
                )}
              </div>

              {/* Progress */}
              {release.progress && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{release.progress.completed}/{release.progress.total} tasks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${release.progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {release.progress.percentage}% complete
                  </div>
                </div>
              )}

              {/* Tags */}
              {release.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {release.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {release.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{release.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  release.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {release.status === 'active' ? '🟢 Active' : '🔴 Closed'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openRelease(release)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Eye size={16} />
                  {release.status === 'closed' ? 'View' : 'Edit'}
                </button>
                
                <button
                  onClick={() => duplicateRelease(release)}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  <Settings size={16} />
                </button>
                
                {release.status === 'active' ? (
                  <button
                    onClick={() => {
                      setSelectedReleaseId(release.id);
                      setShowCloseDialog(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  >
                    <Lock size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedReleaseId(release.id);
                      setShowReopenDialog(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  >
                    <Unlock size={16} />
                  </button>
                )}
              </div>

              {/* Closed info */}
              {release.status === 'closed' && release.closedAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Closed: {new Date(release.closedAt).toLocaleDateString()}
                  </p>
                  {release.closeReason && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      "{release.closeReason}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReleases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Rocket size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No releases found</h2>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first release to get started'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={createNewRelease}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                Create First Release
              </button>
            )}
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Save Release</h3>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setFormErrors({});
                  }}
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
                    onChange={(e) => {
                      setSaveFormData(prev => ({ ...prev, name: e.target.value }));
                      if (formErrors.name) {
                        setFormErrors(prev => ({ ...prev, name: '' }));
                      }
                    }}
                    placeholder="Enter release name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={saveFormData.version}
                    onChange={(e) => {
                      setSaveFormData(prev => ({ ...prev, version: e.target.value }));
                      if (formErrors.version) {
                        setFormErrors(prev => ({ ...prev, version: '' }));
                      }
                    }}
                    placeholder="e.g., 1.0.0"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.version ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.version && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.version}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={saveFormData.description}
                    onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this release"
                    rows={3}
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
                    onChange={(e) => {
                      setSaveFormData(prev => ({ ...prev, targetDate: e.target.value }));
                      if (formErrors.targetDate) {
                        setFormErrors(prev => ({ ...prev, targetDate: '' }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      formErrors.targetDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.targetDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.targetDate}</p>
                  )}
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
                  onClick={() => {
                    setShowSaveDialog(false);
                    setFormErrors({});
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Close Dialog */}
        {showCloseDialog && (
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
                    rows={3}
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
        )}

        {/* Reopen Dialog */}
        {showReopenDialog && (
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
                    rows={3}
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
        )}
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
      {deleteConfirm && (
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
      )}

      {/* Save Dialog in Editor */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Save Release</h3>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setFormErrors({});
                }}
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
                  onChange={(e) => {
                    setSaveFormData(prev => ({ ...prev, name: e.target.value }));
                    if (formErrors.name) {
                      setFormErrors(prev => ({ ...prev, name: '' }));
                    }
                  }}
                  placeholder="Enter release name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input
                  type="text"
                  value={saveFormData.version}
                  onChange={(e) => {
                    setSaveFormData(prev => ({ ...prev, version: e.target.value }));
                    if (formErrors.version) {
                      setFormErrors(prev => ({ ...prev, version: '' }));
                    }
                  }}
                  placeholder="e.g., 1.0.0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.version ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.version && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.version}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={saveFormData.description}
                  onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this release"
                  rows={3}
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
                  onChange={(e) => {
                    setSaveFormData(prev => ({ ...prev, targetDate: e.target.value }));
                    if (formErrors.targetDate) {
                      setFormErrors(prev => ({ ...prev, targetDate: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.targetDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.targetDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.targetDate}</p>
                )}
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
                onClick={() => {
                  setShowSaveDialog(false);
                  setFormErrors({});
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ReleaseManager;