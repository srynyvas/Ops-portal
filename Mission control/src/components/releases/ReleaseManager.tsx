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
  position?: { x: number; y: number }; // Add position tracking
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

// Viewport and Canvas Management
interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  lastMousePos: { x: number; y: number };
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

// Configuration constants
const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 40;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

// Sample data constants
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
  
  // Viewport state for mind map
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
        const childrenStartY = y;
        let currentY = childrenStartY;
        
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
    
    let currentY = 100; // Start with some padding from top
    
    nodes.forEach(rootNode => {
      const positioned = positionNode(rootNode, 100, currentY, 0); // Start with some padding from left
      positionedNodes.push(positioned);
      currentY += calculateSubtreeHeight(positioned) + VERTICAL_SPACING * 2; // Extra spacing between root nodes
    });
    
    return positionedNodes;
  }, []);

  // Viewport Management Functions
  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    setViewport(prev => {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom + delta));
      
      if (clientX !== undefined && clientY !== undefined && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;
        
        // Zoom towards mouse position
        const newPanX = offsetX - (offsetX - prev.panX) * (newZoom / prev.zoom);
        const newPanY = offsetY - (offsetY - prev.panY) * (newZoom / prev.zoom);
        
        return { ...prev, zoom: newZoom, panX: newPanX, panY: newPanY };
      }
      
      return { ...prev, zoom: newZoom };
    });
  }, []);

  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setViewport(prev => ({
      ...prev,
      panX: prev.panX + deltaX,
      panY: prev.panY + deltaY
    }));
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
    if (e.button === 0) { // Left mouse button
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