import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Clock,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';

// Types and Interfaces
interface ReleaseNode {
  id: string;
  title: string;
  type: 'release' | 'feature' | 'task';
  color: string;
  icon: string;
  expanded: boolean;
  position?: { x: number; y: number };
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

interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  lastMousePos: { x: number; y: number };
}

// Constants
const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket size={16} />,
  Package: <Package size={16} />,
  CheckSquare: <CheckSquare size={16} />,
  Target: <Target size={16} />,
  Users: <Users size={16} />,
  GitBranch: <GitBranch size={16} />,
  Clock: <Clock size={16} />
};

const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 40;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

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
  
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    lastMousePos: { x: 0, y: 0 }
  });

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  // Improved Node Positioning Algorithm
  const calculateNodePositions = useCallback((nodes: ReleaseNode[]): ReleaseNode[] => {
    const positionedNodes: ReleaseNode[] = [];
    
    const calculateSubtreeHeight = (node: ReleaseNode): number => {
      if (!node.expanded || node.children.length === 0) {
        return NODE_HEIGHT;
      }
      
      let totalHeight = 0;
      node.children.forEach(child => {
        totalHeight += calculateSubtreeHeight(child) + VERTICAL_SPACING;
      });
      
      return Math.max(NODE_HEIGHT, totalHeight - VERTICAL_SPACING);
    };
    
    const positionNode = (node: ReleaseNode, x: number, y: number, depth: number): ReleaseNode => {
      const positionedNode = { ...node, position: { x, y } };
      
      if (node.expanded && node.children.length > 0) {
        let currentY = y;
        
        positionedNode.children = node.children.map(child => {
          const childHeight = calculateSubtreeHeight(child);
          const childX = x + NODE_WIDTH + HORIZONTAL_SPACING;
          const childY = currentY;
          
          const positionedChild = positionNode(child, childX, childY, depth + 1);
          currentY += childHeight + VERTICAL_SPACING;
          
          return positionedChild;
        });
        
        // Center parent vertically among children
        if (positionedNode.children.length > 0) {
          const firstChildY = positionedNode.children[0].position!.y;
          const lastChildY = positionedNode.children[positionedNode.children.length - 1].position!.y;
          const childrenCenterY = (firstChildY + lastChildY) / 2;
          positionedNode.position.y = childrenCenterY;
        }
      } else {
        positionedNode.children = node.children;
      }
      
      return positionedNode;
    };
    
    let currentY = 100;
    
    nodes.forEach(rootNode => {
      const positioned = positionNode(rootNode, 100, currentY, 0);
      positionedNodes.push(positioned);
      currentY += calculateSubtreeHeight(positioned) + VERTICAL_SPACING * 2;
    });
    
    return positionedNodes;
  }, []);

  // Viewport Management
  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setViewport(prev => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom + delta));
      
      if (clientX !== undefined && clientY !== undefined && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;
        
        const newPanX = offsetX - (offsetX - prev.panX) * (newZoom / prev.zoom);
        const newPanY = offsetY - (offsetY - prev.panY) * (newZoom / prev.zoom);
        
        return { ...prev, zoom: newZoom, panX: newPanX, panY: newPanY };
      }
      
      return { ...prev, zoom: newZoom };
    });
  }, []);

  const resetViewport = useCallback(() => {
    setViewport({
      zoom: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      lastMousePos: { x: 0, y: 0 }
    });
  }, []);

  // Canvas Event Handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setViewport(prev => ({
        ...prev,
        isDragging: true,
        lastMousePos: { x: e.clientX, y: e.clientY }
      }));
    }
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    setViewport(prev => {
      if (prev.isDragging) {
        const deltaX = e.clientX - prev.lastMousePos.x;
        const deltaY = e.clientY - prev.lastMousePos.y;
        
        return {
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY,
          lastMousePos: { x: e.clientX, y: e.clientY }
        };
      }
      return prev;
    });
  }, []);

  const handleCanvasMouseUp = useCallback(() => {
    setViewport(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleCanvasWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    handleZoom(delta, e.clientX, e.clientY);
  }, [handleZoom]);

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

  const countChildNodes = (node: ReleaseNode): number => {
    let count = node.children.length;
    node.children.forEach(child => {
      count += countChildNodes(child);
    });
    return count;
  };

  // Event handlers
  const handleNodeUpdate = (id: string, updates: Partial<ReleaseNode>) => {
    const updatedNodes = updateNode(currentRelease.nodes, id, updates);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
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
    
    const updatedNodes = addChildNode(currentRelease.nodes, parentId, newNode);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleDeleteNode = (node: ReleaseNode) => {
    const childCount = countChildNodes(node);
    setDeleteConfirm({ node, childCount });
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;
    
    const updatedNodes = deleteNode(currentRelease.nodes, deleteConfirm.node.id);
    const positionedNodes = calculateNodePositions(updatedNodes);
    
    setCurrentRelease(prev => ({
      ...prev,
      nodes: positionedNodes,
      updatedAt: new Date().toISOString()
    }));
    
    setDeleteConfirm(null);
    setSelectedNode(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
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
      setReleases(prev => prev.map(r => r.id === currentRelease.id ? releaseData : r));
    } else {
      releaseData.id = Date.now().toString();
      releaseData.createdAt = new Date().toISOString();
      setReleases(prev => [...prev, releaseData]);
    }
    
    setCurrentRelease(releaseData);
    setShowSaveDialog(false);
    setFormErrors({});
  };

  const openRelease = (release: Release) => {
    // Calculate positions for existing nodes
    const positionedNodes = calculateNodePositions(release.nodes);
    setCurrentRelease({ ...release, nodes: positionedNodes });
    setCurrentView('editor');
    resetViewport();
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
        position: { x: 100, y: 100 },
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
    resetViewport();
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
    
    const positionedNodes = calculateNodePositions(duplicated.nodes);
    setCurrentRelease({ ...duplicated, nodes: positionedNodes });
    setCurrentView('editor');
    resetViewport();
  };

  // Apply position calculations when nodes change
  useEffect(() => {
    if (currentRelease.nodes.length > 0 && currentView === 'editor') {
      const positionedNodes = calculateNodePositions(currentRelease.nodes);
      setCurrentRelease(prev => ({ ...prev, nodes: positionedNodes }));
    }
  }, [currentRelease.nodes.map(n => n.expanded).join(','), calculateNodePositions, currentView]);

  // Filter functions
  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || release.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render functions for mind map
  const renderNode = (node: ReleaseNode): React.ReactNode => {
    if (!node.position) return null;
    
    const isSelected = selectedNode === node.id;
    const isDragTarget = dragTarget === node.id && node.type !== 'task';
    const isReadOnly = currentRelease.status === 'closed';

    return (
      <div 
        key={node.id} 
        style={{ 
          position: 'absolute', 
          left: node.position.x, 
          top: node.position.y,
          width: NODE_WIDTH,
          zIndex: isSelected ? 10 : 1
        }}
      >
        <div
          className={`relative group cursor-pointer transition-all duration-200 ${
            isSelected ? 'ring-2 ring-purple-400 ring-offset-2' : ''
          } ${isDragTarget ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
          draggable={!isReadOnly}
          onDragStart={() => !isReadOnly && setDraggedNode(node)}
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
        >
          <div className={`${node.color} text-white rounded-xl p-4 shadow-lg min-h-[120px]`}>
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
        {node.expanded && node.children.map(child => renderNode(child))}
      </div>
    );
  };

  const renderConnections = (nodes: ReleaseNode[]): React.ReactNode => {
    const connections: React.ReactNode[] = [];
    
    const addConnections = (node: ReleaseNode) => {
      if (!node.expanded || !node.position) return;
      
      node.children.forEach(child => {
        if (!child.position) return;
        
        const startX = node.position!.x + NODE_WIDTH;
        const startY = node.position!.y + NODE_HEIGHT / 2;
        const endX = child.position.x;
        const endY = child.position.y + NODE_HEIGHT / 2;
        const midX = startX + 60;
        
        connections.push(
          <path
            key={`line-${node.id}-${child.id}`}
            d={`M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${endY} T ${endX} ${endY}`}
            stroke="rgba(156, 163, 175, 0.4)"
            strokeWidth="2"
            fill="none"
          />
        );
        
        addConnections(child);
      });
    };
    
    nodes.forEach(addConnections);
    
    return connections;
  };

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
      }
    ];
    
    setReleases(sampleReleases);
  }, []);

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
              </div>
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
      </div>
    );
  }

  // Editor view
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Editor Header */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => setCurrentView('catalogue')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
        
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {currentRelease.name}
          {currentRelease.version && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
              v{currentRelease.version}
            </span>
          )}
          {currentRelease.status === 'closed' && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
              🔒 Read Only
            </span>
          )}
        </h1>
        {currentRelease.description && (
          <p className="text-sm text-gray-600 max-w-md mt-1">
            {currentRelease.description}
          </p>
        )}
      </div>

      {/* Viewport Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <button
          onClick={() => handleZoom(-ZOOM_STEP)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-sm font-medium px-2">
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          onClick={() => handleZoom(ZOOM_STEP)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={resetViewport}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset View"
        >
          <Move size={16} />
        </button>
      </div>

      {/* Mind Map Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-full overflow-hidden cursor-move"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleCanvasWheel}
        style={{ 
          cursor: viewport.isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div 
          className="absolute origin-top-left"
          style={{
            transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
            width: '4000px',
            height: '3000px'
          }}
        >
          {/* Connection Lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            {renderConnections(currentRelease.nodes)}
          </svg>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {currentRelease.nodes.map(node => renderNode(node))}
          </div>
        </div>
      </div>

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

      {/* Dragging Indicator */}
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
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No items yet!</h2>
            <p className="text-gray-500 mb-4">Add a release to get started</p>
            <button
              onClick={() => {
                const newNode = {
                  id: Date.now().toString(),
                  title: 'Release v1.0.0',
                  type: 'release' as const,
                  color: 'bg-purple-600',
                  icon: 'Rocket',
                  expanded: true,
                  position: { x: 100, y: 100 },
                  properties: {
                    version: '1.0.0', assignee: '', targetDate: '', environment: 'development',
                    description: '', tags: [], priority: 'medium', status: 'planning',
                    storyPoints: '', dependencies: [], notes: '', releaseNotes: ''
                  },
                  children: []
                };
                
                const positionedNodes = calculateNodePositions([newNode]);
                setCurrentRelease(prev => ({
                  ...prev,
                  nodes: positionedNodes,
                  updatedAt: new Date().toISOString()
                }));
              }}
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