import React, { useState, useRef, useCallback, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { apiConfig } from '../../config/apiConfig';
import { 
  Plus, Minus, Lightbulb, Target, Users, FileText, Folder, Trash2, 
  Edit3, Palette, Settings, Heart, Star, Zap, Coffee, Music, 
  Camera, Book, Rocket, Globe, Shield, Diamond, Crown, Gift,
  Save, X, Check, AlertTriangle, Link, User, Calendar, Tag,
  ExternalLink, Info, Clock, Library, Search, Copy, Download,
  Upload, ArrowLeft, Grid, List, Filter, Eye, Edit, FolderOpen,
  GitBranch, Package, Code, Bug, CheckCircle, AlertCircle,
  Play, Pause, RotateCcw, TrendingUp, Layers, Terminal, ChevronRight, ChevronDown,
  Move, Hand, ZoomIn, ZoomOut, Maximize2, Github, RefreshCw, Send
} from 'lucide-react';

// Import types
import { 
  Release, 
  ReleaseNode, 
  NodeType, 
  PriorityLevel, 
  StatusType, 
  EnvironmentType, 
  CategoryType,
  SaveFormData,
  CloseFormData,
  ReopenFormData,
  CustomizationOptions,
  DragState,
  FilterState,
  ViewState,
  ModalState,
  ReleaseProperties,
  StatusHistoryEntry,
  PreviewData
} from '../../types/release.types';

// Import utilities
import {
  findNodeById,
  updateNodeById,
  removeNodeById,
  addNodeToParent,
  moveNode,
  countTotalNodes,
  countTotalChildren,
  calculateCompletion,
  generatePreview,
  incrementVersion,
  isValidVersion,
  generateNodeId,
  cloneNode,
  searchNodes,
  isValidDropTarget,
  getAllNodeIds
} from '../../utils/releaseUtils';

// Import constants
import {
  colorOptions,
  releaseIcons,
  categories,
  environments,
  priorityColors,
  statusColors,
  nodeSizes,
  canvasConfig,
  validationRules,
  errorMessages,
  defaultNodeProperties,
  animations
} from '../../utils/releaseConstants';

const ReleaseManagementTool: React.FC = () => {
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
    status: 'active',
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodeCount: 0,
    completion: 0,
    preview: { centralNode: '', branches: [] },
    nodes: []
  });

  // Release catalogue state
  const [savedReleases, setSavedReleases] = useState<Release[]>(() => {
    const stored = localStorage.getItem('releaseManagementReleases');
    return stored ? JSON.parse(stored) : [];
  });

  // View state
  const [viewState, setViewState] = useState<ViewState>({
    currentView: 'catalogue',
    catalogueView: 'grid',
    zoom: 1,
    panX: 0,
    panY: 0
  });

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'all',
    selectedStatus: 'all',
    selectedEnvironment: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Modal state
  const [modalState, setModalState] = useState<ModalState>({
    showSaveDialog: false,
    showCloseDialog: false,
    showReopenDialog: false,
    showDeleteConfirm: false,
    deleteTargetId: null,
    deleteTargetTitle: null,
    deleteChildrenCount: 0
  });

  // Editor state
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedNode: null,
    dropTarget: null,
    validDropTargets: []
  });

  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [customizingNode, setCustomizingNode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>({
    activeTab: 'visual',
    selectedColor: 'bg-blue-600',
    selectedIcon: 'Package',
    nodeType: 'feature'
  });

  // Form states
  const [saveFormData, setSaveFormData] = useState<SaveFormData>({
    name: '',
    version: '',
    description: '',
    category: 'minor',
    tags: [],
    targetDate: '',
    environment: 'development'
  });

  const [closeFormData, setCloseFormData] = useState<CloseFormData>({
    reason: '',
    notifyStakeholders: false
  });

  const [reopenFormData, setReopenFormData] = useState<ReopenFormData>({
    reason: '',
    resetProgress: false
  });

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);

  // Zoom and Pan state and handlers
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panMode, setPanMode] = useState(false); // Toggle for pan mode
  
  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // GitHub integration state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [githubConfig, setGithubConfig] = useState<any>(null);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setViewState(prev => ({
        ...prev,
        zoom: Math.min(Math.max(prev.zoom * delta, 0.25), 3)
      }));
    }
  }, []);

  // Handle panning mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    // Pan with middle mouse, Shift+Left click, or in pan mode with left click
    if (e.button === 1 || (e.button === 0 && e.shiftKey) || (e.button === 0 && panMode)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewState.panX, y: e.clientY - viewState.panY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setViewState(prev => ({
        ...prev,
        panX: e.clientX - panStart.x,
        panY: e.clientY - panStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Save to localStorage whenever savedReleases changes
  useEffect(() => {
    localStorage.setItem('releaseManagementReleases', JSON.stringify(savedReleases));
  }, [savedReleases]);

  // Fetch releases from backend on mount
  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const releases = await apiClient.get<Release[]>(apiConfig.endpoints.releases.list);
        setSavedReleases(releases);
      } catch (error) {
        console.error('Failed to fetch releases:', error);
        // Fall back to localStorage if API fails
        const stored = localStorage.getItem('releaseManagementReleases');
        if (stored) {
          setSavedReleases(JSON.parse(stored));
        }
      }
    };
    
    fetchReleases();
  }, []);

  // Check GitHub configuration status
  useEffect(() => {
    const checkGitHubConfig = async () => {
      try {
        const response = await apiClient.get<any>('/github/config-status');
        setGithubConfigured(response.configured);
        setGithubConfig(response);
      } catch (error) {
        console.error('Failed to check GitHub config:', error);
        setGithubConfigured(false);
        setGithubConfig(null);
      }
    };
    
    checkGitHubConfig();
  }, []);

  // Auto-save current release every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentRelease.id) {
        setSavedReleases(prev => 
          prev.map(r => r.id === currentRelease.id ? currentRelease : r)
        );
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [currentRelease]);

  // Release Management Functions
  const saveCurrentRelease = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const releaseToSave: Release = {
        ...currentRelease,
        id: currentRelease.id || generateNodeId(),
        name: saveFormData.name,
        version: saveFormData.version,
        description: saveFormData.description,
        category: saveFormData.category,
        tags: saveFormData.tags,
        targetDate: saveFormData.targetDate,
        environment: saveFormData.environment,
        updatedAt: new Date().toISOString(),
        nodeCount: countTotalNodes(currentRelease.nodes),
        completion: calculateCompletion(currentRelease.nodes),
        preview: generatePreview(currentRelease.nodes)
      };

      let savedRelease: Release;
      
      if (currentRelease.id) {
        // Update existing release
        savedRelease = await apiClient.put<Release>(
          apiConfig.endpoints.releases.update,
          releaseToSave,
          { params: { id: currentRelease.id } }
        );
        setSavedReleases(prev => 
          prev.map(r => r.id === currentRelease.id ? savedRelease : r)
        );
      } else {
        // Create new release
        savedRelease = await apiClient.post<Release>(
          apiConfig.endpoints.releases.create,
          releaseToSave
        );
        setSavedReleases(prev => [...prev, savedRelease]);
      }

      setCurrentRelease(savedRelease);
      setModalState(prev => ({ ...prev, showSaveDialog: false }));
      setSaveFormData({
        name: '',
        version: '',
        description: '',
        category: 'minor',
        tags: [],
        targetDate: '',
        environment: 'development'
      });
    } catch (error) {
      console.error('Failed to save release:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save release');
    } finally {
      setIsSaving(false);
    }
  };

  const publishToGitHub = async () => {
    if (!currentRelease.id) {
      setPublishError('Please save the release first');
      return;
    }
    
    setIsPublishing(true);
    setPublishError(null);
    
    try {
      const response = await apiClient.post<any>(
        `/releases/${currentRelease.id}/publish-to-github`,
        {}
      );
      
      if (response.success) {
        // Update current release with GitHub issue info
        const updatedRelease = await apiClient.get<Release>(
          `/releases/${currentRelease.id}`
        );
        setCurrentRelease(updatedRelease);
        
        // Show success message with details
        const message = `Successfully published to GitHub!\n\n` +
          `Created Issues: ${response.created_issues.length}\n` +
          `${response.created_issues.map((issue: any) => 
            `  • ${issue.node_title}: Issue #${issue.issue_number}`
          ).join('\n')}`;
        alert(message);
      } else {
        setPublishError(response.message || 'Failed to publish to GitHub');
      }
    } catch (error) {
      console.error('Failed to publish to GitHub:', error);
      setPublishError(error instanceof Error ? error.message : 'Failed to publish to GitHub');
    } finally {
      setIsPublishing(false);
    }
  };

  const syncNodeWithGitHub = async (nodeId: string, newStatus: string) => {
    if (!currentRelease.id) {
      return;
    }
    
    try {
      await apiClient.post<any>(
        `/releases/${currentRelease.id}/nodes/${nodeId}/sync-github`,
        { status: newStatus }
      );
    } catch (error) {
      console.error('Failed to sync with GitHub:', error);
      // Don't show error to user, sync is optional
    }
  };

  const closeAllGitHubIssues = async (release: Release) => {
    try {
      const response = await apiClient.post<any>(
        `/releases/${release.id}/close-github-issues`,
        {}
      );
      
      if (response.success) {
        console.log(`Successfully closed ${response.closed_issues.length} GitHub issues`);
      } else {
        console.warn(`Some issues failed to close:`, response.failed_issues);
      }
      
      return response;
    } catch (error) {
      console.error('Failed to close GitHub issues:', error);
      // Don't throw - closing GitHub issues is optional
      return { success: false, error };
    }
  };

  const loadRelease = async (release: Release) => {
    if (!release.id) {
      setCurrentRelease(release);
      setViewState(prev => ({ ...prev, currentView: 'editor' }));
      return;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const loadedRelease = await apiClient.get<Release>(
        apiConfig.endpoints.releases.get,
        { params: { id: release.id } }
      );
      setCurrentRelease(loadedRelease);
      setViewState(prev => ({ ...prev, currentView: 'editor' }));
    } catch (error) {
      console.error('Failed to load release:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load release');
      // Fall back to local data if API fails
      setCurrentRelease(release);
      setViewState(prev => ({ ...prev, currentView: 'editor' }));
    } finally {
      setIsLoading(false);
    }
  };

  const createNewRelease = () => {
    const newRelease: Release = {
      id: null,
      name: 'Untitled Release',
      version: '1.0.0',
      description: '',
      category: 'minor',
      tags: [],
      targetDate: '',
      environment: 'development',
      status: 'active',
      statusHistory: [{
        action: 'created',
        reason: 'New release created',
        timestamp: new Date().toISOString(),
        user: 'Current User',
        previousStatus: undefined,
        newStatus: 'active'
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: 1,
      completion: 0,
      preview: { centralNode: 'New Release', branches: [] },
      nodes: [{
        id: generateNodeId(),
        title: 'Release 1.0.0',
        type: 'release',
        color: 'bg-purple-600',
        icon: 'Rocket',
        expanded: true,
        properties: defaultNodeProperties.release,
        children: []
      }]
    };
    
    setCurrentRelease(newRelease);
    setViewState(prev => ({ ...prev, currentView: 'editor' }));
  };

  const duplicateRelease = (release: Release) => {
    const duplicated: Release = {
      ...release,
      id: null,
      name: `${release.name} (Copy)`,
      version: incrementVersion(release.version),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [{
        action: 'created',
        reason: `Duplicated from ${release.name}`,
        timestamp: new Date().toISOString(),
        user: 'Current User',
        previousStatus: undefined,
        newStatus: 'active'
      }],
      nodes: release.nodes.map(node => cloneNode(node))
    };
    
    setCurrentRelease(duplicated);
    setViewState(prev => ({ ...prev, currentView: 'editor' }));
  };

  const closeRelease = async () => {
    if (!currentRelease.id) return;
    
    const closedRelease: Release = {
      ...currentRelease,
      status: 'closed',
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...currentRelease.statusHistory,
        {
          action: 'closed',
          reason: closeFormData.reason,
          timestamp: new Date().toISOString(),
          user: 'Current User',
          previousStatus: 'active',
          newStatus: 'closed'
        }
      ]
    };
    
    try {
      // Update in MongoDB
      await apiClient.put<Release>(
        `/releases/${currentRelease.id}`,
        closedRelease
      );
      
      // Close all GitHub issues if they exist
      if (githubConfigured) {
        await closeAllGitHubIssues(closedRelease);
      }
      
      // Update local state
      setSavedReleases(prev => 
        prev.map(r => r.id === currentRelease.id ? closedRelease : r)
      );
      
      setModalState(prev => ({ ...prev, showCloseDialog: false }));
      setViewState(prev => ({ ...prev, currentView: 'catalogue' }));
      setCloseFormData({ reason: '', notifyStakeholders: false });
      
      alert('Release closed successfully!');
    } catch (error) {
      console.error('Failed to close release:', error);
      alert('Failed to close release. Please try again.');
    }
  };

  const reopenRelease = async () => {
    if (!currentRelease || !reopenFormData.reason) {
      alert('Please provide a reason for reopening the release');
      return;
    }
    
    try {
      const reopenedRelease: Release = {
        ...currentRelease,
        status: 'active',
        isReopened: true,
        updatedAt: new Date().toISOString(),
        statusHistory: [
          ...currentRelease.statusHistory,
          {
            action: 'reopened',
            reason: reopenFormData.reason,
            timestamp: new Date().toISOString(),
            user: 'Current User',
            previousStatus: 'closed',
            newStatus: 'active'
          }
        ]
      };
      
      if (reopenFormData.resetProgress) {
        // Reset all task statuses to planning
        const resetNodes = (nodes: ReleaseNode[]): ReleaseNode[] => {
          return nodes.map(node => ({
            ...node,
            properties: {
              ...node.properties,
              status: 'planning'
            },
            children: resetNodes(node.children || [])
          }));
        };
        reopenedRelease.nodes = resetNodes(reopenedRelease.nodes);
        reopenedRelease.completion = 0; // Reset completion to 0 if progress is reset
      }
      
      // Save to MongoDB
      await apiClient.put<Release>(
        `/releases/${currentRelease.id}`,
        reopenedRelease
      );
      
      // Update local state
      setSavedReleases(prev => 
        prev.map(r => r.id === currentRelease.id ? reopenedRelease : r)
      );
      setCurrentRelease(reopenedRelease);
      setModalState(prev => ({ ...prev, showReopenDialog: false }));
      setViewState(prev => ({ ...prev, currentView: 'editor' }));
      setReopenFormData({ reason: '', resetProgress: false });
      
      alert('Release reopened successfully!');
    } catch (error) {
      console.error('Failed to reopen release:', error);
      alert('Failed to reopen release. Please try again.');
    }
  };

  // Node Management Functions
  const toggleExpanded = (nodeId: string) => {
    const updatedNodes = updateNodeById(currentRelease.nodes, nodeId, {
      expanded: !findNodeById(currentRelease.nodes, nodeId)?.expanded
    });
    setCurrentRelease(prev => ({ ...prev, nodes: updatedNodes }));
  };

  const startEditing = (node: ReleaseNode) => {
    setEditingNode(node.id);
    setEditValue(node.title);
  };

  const saveEdit = () => {
    if (!editingNode || !editValue.trim()) {
      cancelEdit();
      return;
    }
    
    const updatedNodes = updateNodeById(currentRelease.nodes, editingNode, {
      title: editValue.trim()
    });
    setCurrentRelease(prev => ({ ...prev, nodes: updatedNodes }));
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingNode(null);
    setEditValue('');
  };

  const addNewNode = (parentId: string) => {
    const parent = findNodeById(currentRelease.nodes, parentId);
    if (!parent) return;
    
    let nodeType: NodeType = 'task';
    let defaultTitle = 'New Task';
    let defaultColor = 'bg-gray-600';
    let defaultIcon = 'Code';
    
    if (parent.type === 'release') {
      nodeType = 'feature';
      defaultTitle = 'New Feature';
      defaultColor = 'bg-blue-600';
      defaultIcon = 'Package';
    }
    
    const newNode: ReleaseNode = {
      id: generateNodeId(),
      title: defaultTitle,
      type: nodeType,
      color: defaultColor,
      icon: defaultIcon,
      expanded: true,
      properties: defaultNodeProperties[nodeType],
      children: []
    };
    
    const updatedNodes = addNodeToParent(currentRelease.nodes, parentId, newNode);
    setCurrentRelease(prev => ({ 
      ...prev, 
      nodes: updatedNodes,
      nodeCount: countTotalNodes(updatedNodes)
    }));
  };

  const confirmDelete = (node: ReleaseNode) => {
    const childrenCount = countTotalChildren(node);
    setModalState(prev => ({
      ...prev,
      showDeleteConfirm: true,
      deleteTargetId: node.id,
      deleteTargetTitle: node.title,
      deleteChildrenCount: childrenCount
    }));
  };

  const executeDelete = () => {
    if (!modalState.deleteTargetId) return;
    
    const updatedNodes = removeNodeById(currentRelease.nodes, modalState.deleteTargetId);
    setCurrentRelease(prev => ({ 
      ...prev, 
      nodes: updatedNodes,
      nodeCount: countTotalNodes(updatedNodes),
      completion: calculateCompletion(updatedNodes)
    }));
    
    setModalState(prev => ({
      ...prev,
      showDeleteConfirm: false,
      deleteTargetId: null,
      deleteTargetTitle: null,
      deleteChildrenCount: 0
    }));
  };

  // Drag and Drop Functions
  const handleDragStart = (e: React.DragEvent, node: ReleaseNode) => {
    e.stopPropagation();
    setDragState({
      isDragging: true,
      draggedNode: node,
      dropTarget: null,
      validDropTargets: []
    });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedNode: null,
      dropTarget: null,
      validDropTargets: []
    });
  };

  const handleDragOver = (e: React.DragEvent, node: ReleaseNode) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragState.draggedNode) return;
    
    if (isValidDropTarget(dragState.draggedNode, node)) {
      e.dataTransfer.dropEffect = 'move';
      setDragState(prev => ({ ...prev, dropTarget: node.id }));
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = () => {
    setDragState(prev => ({ ...prev, dropTarget: null }));
  };

  const handleDrop = (e: React.DragEvent, targetNode: ReleaseNode) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dragState.draggedNode || !isValidDropTarget(dragState.draggedNode, targetNode)) {
      handleDragEnd();
      return;
    }
    
    const updatedNodes = moveNode(
      currentRelease.nodes,
      dragState.draggedNode.id,
      targetNode.id
    );
    
    setCurrentRelease(prev => ({ 
      ...prev, 
      nodes: updatedNodes,
      nodeCount: countTotalNodes(updatedNodes)
    }));
    handleDragEnd();
  };

  // Customization Functions
  const updateNodeStyle = (nodeId: string, color: string, icon: string) => {
    const updatedNodes = updateNodeById(currentRelease.nodes, nodeId, {
      color,
      icon
    });
    setCurrentRelease(prev => ({ ...prev, nodes: updatedNodes }));
  };

  const updateNodeProperties = (nodeId: string, propertyUpdates: Partial<ReleaseProperties>) => {
    const node = findNodeById(currentRelease.nodes, nodeId);
    if (!node) return;
    
    const updatedNodes = updateNodeById(currentRelease.nodes, nodeId, {
      properties: { ...node.properties, ...propertyUpdates }
    });
    
    setCurrentRelease(prev => ({ 
      ...prev, 
      nodes: updatedNodes,
      completion: calculateCompletion(updatedNodes)
    }));
  };

  // Filter and Search Functions
  const filteredReleases = savedReleases.filter(release => {
    const matchesSearch = !filterState.searchQuery || [
      release.name,
      release.version,
      release.description,
      ...release.tags
    ].some(field => 
      field?.toLowerCase().includes(filterState.searchQuery.toLowerCase())
    );
    
    const matchesCategory = filterState.selectedCategory === 'all' || 
      release.category === filterState.selectedCategory;
    
    const matchesStatus = filterState.selectedStatus === 'all' || 
      release.status === filterState.selectedStatus;
    
    const matchesEnvironment = filterState.selectedEnvironment === 'all' || 
      release.environment === filterState.selectedEnvironment;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesEnvironment;
  }).sort((a, b) => {
    let compareValue = 0;
    
    switch (filterState.sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'date':
        compareValue = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        break;
      case 'completion':
        compareValue = b.completion - a.completion;
        break;
      case 'version':
        compareValue = a.version.localeCompare(b.version);
        break;
    }
    
    return filterState.sortOrder === 'asc' ? compareValue : -compareValue;
  });

  // Auto-align all nodes to prevent overlap
  const autoAlignNodes = () => {
    // Force re-render with recalculated positions
    setCurrentRelease(prev => ({
      ...prev,
      nodes: [...prev.nodes]
    }));
  };

  // Zoom controls
  const handleZoomIn = () => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3) // Max zoom 3x
    }));
  };

  const handleZoomOut = () => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom * 0.8, 0.25) // Min zoom 0.25x
    }));
  };

  const handleZoomReset = () => {
    setViewState(prev => ({
      ...prev,
      zoom: 1,
      panX: 0,
      panY: 0
    }));
  };

  const handleZoomFit = () => {
    // Calculate bounds of all nodes
    if (currentRelease.nodes.length === 0) return;
    
    // Simple fit to view - assumes a reasonable default size
    const estimatedWidth = 1200; // Estimate based on node depths
    const estimatedHeight = calculateNodeHeight(currentRelease.nodes[0]) * 2;
    
    const canvasWidth = window.innerWidth - 100;
    const canvasHeight = window.innerHeight - 200;
    
    const scaleX = canvasWidth / estimatedWidth;
    const scaleY = canvasHeight / estimatedHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    setViewState(prev => ({
      ...prev,
      zoom: scale,
      panX: 0,
      panY: 0
    }));
  };

  // Calculate total height needed for a node and its subtree
  const calculateNodeHeight = (node: ReleaseNode): number => {
    if (!node.expanded || !node.children || node.children.length === 0) {
      // Base height for a single node
      switch (node.type) {
        case 'release': return 160;
        case 'feature': return 140;
        case 'task': return 120;
        default: return 120;
      }
    }
    
    // Calculate total height needed for all children
    const childrenHeight = node.children.reduce((total, child) => {
      return total + calculateNodeHeight(child);
    }, 0);
    
    // Add spacing between children
    const spacing = 40; // Minimum spacing between nodes
    const totalChildrenHeight = childrenHeight + (node.children.length - 1) * spacing;
    
    // Return the maximum of node's own height or children's total height
    const nodeHeight = node.type === 'release' ? 160 : node.type === 'feature' ? 140 : 120;
    return Math.max(nodeHeight, totalChildrenHeight);
  };

  // Calculate Y positions for children to avoid overlap
  const calculateChildPositions = (node: ReleaseNode, parentY: number): number[] => {
    if (!node.children || node.children.length === 0) return [];
    
    const positions: number[] = [];
    const totalHeight = calculateNodeHeight(node);
    const spacing = 40;
    
    let currentY = parentY - totalHeight / 2;
    
    node.children.forEach((child) => {
      const childHeight = calculateNodeHeight(child);
      currentY += childHeight / 2;
      positions.push(currentY);
      currentY += childHeight / 2 + spacing;
    });
    
    // Center the children around the parent
    const averageY = positions.reduce((sum, y) => sum + y, 0) / positions.length;
    const offset = parentY - averageY;
    
    return positions.map(y => y + offset);
  };

  // Render Helper Functions
  const getNodeIcon = (iconName: string) => {
    const IconComponent = releaseIcons[iconName as keyof typeof releaseIcons];
    return IconComponent || Package;
  };

  const renderNode = (node: ReleaseNode, level = 0, offsetX = 0, offsetY = 0, childPositions?: number[]) => {
    const isEditing = editingNode === node.id;
    const isCustomizing = customizingNode === node.id;
    const isDropTarget = dragState.dropTarget === node.id;
    const isDragging = dragState.isDragging && dragState.draggedNode?.id === node.id;
    const canHaveChildren = node.type !== 'task';
    const hasChildren = node.children && node.children.length > 0;
    
    const Icon = getNodeIcon(node.icon);
    
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
          draggable={!isEditing && node.type !== 'release'}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, node)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node)}
        >
          <div className="p-4 h-full flex flex-col justify-between">
            {/* Header with icon and controls */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Icon size={node.type === 'release' ? 26 : 22} className="text-white/90" />
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

                {hasChildren && (
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
                
                {canHaveChildren && (
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

                {node.type !== 'release' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(node);
                    }}
                    className="w-6 h-6 bg-red-500/30 rounded-full flex items-center justify-center hover:bg-red-500/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
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
                {node.properties.targetDate && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(node.properties.targetDate).toLocaleDateString()}
                  </span>
                )}
                {node.github_issue?.issue_number && (
                  <a 
                    href={node.github_issue.issue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    title={`GitHub Issue #${node.github_issue.issue_number}`}
                  >
                    <Github size={10} />
                    #{node.github_issue.issue_number}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Child Nodes */}
        {node.expanded && hasChildren && (() => {
          const childOffsetX = offsetX + 320;
          const childYPositions = calculateChildPositions(node, offsetY);
          
          return node.children.map((child, childIndex) => {
            const childOffsetY = childYPositions[childIndex] || offsetY;
            const grandchildPositions = child.children ? calculateChildPositions(child, childOffsetY) : undefined;
            
            return renderNode(child, level + 1, childOffsetX, childOffsetY, grandchildPositions);
          });
        })()}
        
        {/* Customization Panel */}
        {isCustomizing && (
          <div className="absolute top-0 left-full ml-4 bg-white rounded-lg shadow-xl p-4 w-80 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Customize Node</h3>
              <button 
                onClick={() => setCustomizingNode(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCustomizationOptions(prev => ({ ...prev, activeTab: 'visual' }))}
                className={`px-3 py-1 rounded ${
                  customizationOptions.activeTab === 'visual' ? 
                  'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setCustomizationOptions(prev => ({ ...prev, activeTab: 'properties' }))}
                className={`px-3 py-1 rounded ${
                  customizationOptions.activeTab === 'properties' ? 
                  'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                Properties
              </button>
            </div>
            
            {customizationOptions.activeTab === 'visual' ? (
              <div className="space-y-4">
                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => updateNodeStyle(node.id, color, node.icon)}
                        className={`w-8 h-8 rounded ${color} ${
                          node.color === color ? 'ring-2 ring-offset-2 ring-blue-600' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(releaseIcons).map(([name, IconComp]) => (
                      <button
                        key={name}
                        onClick={() => updateNodeStyle(node.id, node.color, name)}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          node.icon === name ? 'bg-blue-100 text-blue-600' : ''
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Assignee</label>
                  <input
                    type="text"
                    value={node.properties.assignee}
                    onChange={(e) => updateNodeProperties(node.id, { assignee: e.target.value })}
                    className="w-full px-3 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Date</label>
                  <input
                    type="date"
                    value={node.properties.targetDate}
                    onChange={(e) => updateNodeProperties(node.id, { targetDate: e.target.value })}
                    className="w-full px-3 py-1 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={node.properties.status}
                    onChange={(e) => updateNodeProperties(node.id, { status: e.target.value as StatusType })}
                    className="w-full px-3 py-1 border rounded-lg text-sm"
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
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={node.properties.priority}
                    onChange={(e) => updateNodeProperties(node.id, { priority: e.target.value as PriorityLevel })}
                    className="w-full px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={node.properties.description}
                    onChange={(e) => updateNodeProperties(node.id, { description: e.target.value })}
                    className="w-full px-3 py-1 border rounded-lg text-sm"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderConnections = (node: ReleaseNode, level = 0, parentX = 0, parentY = 0): React.ReactNode => {
    if (!node.expanded || !node.children || node.children.length === 0) return null;

    const childYPositions = calculateChildPositions(node, parentY);
    
    return node.children.map((child, index) => {
      const childX = 320;
      const childY = childYPositions[index] - parentY;

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
          {renderConnections(child, level + 1, parentX + childX, childYPositions[index])}
        </g>
      );
    });
  };

  // Render Functions
  const renderCatalogueHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Release Management</h2>
        <button
          onClick={createNewRelease}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Release
        </button>
      </div>
      
      {/* Status Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b">
        <button
          onClick={() => setFilterState(prev => ({ ...prev, selectedStatus: 'active' }))}
          className={`px-4 py-2 font-medium transition-colors ${
            filterState.selectedStatus === 'active' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Releases
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
            {savedReleases.filter(r => r.status === 'active').length}
          </span>
        </button>
        <button
          onClick={() => setFilterState(prev => ({ ...prev, selectedStatus: 'closed' }))}
          className={`px-4 py-2 font-medium transition-colors ${
            filterState.selectedStatus === 'closed' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Closed Releases
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
            {savedReleases.filter(r => r.status === 'closed').length}
          </span>
        </button>
        <button
          onClick={() => setFilterState(prev => ({ ...prev, selectedStatus: 'all' }))}
          className={`px-4 py-2 font-medium transition-colors ${
            filterState.selectedStatus === 'all' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Releases
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
            {savedReleases.length}
          </span>
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search releases..."
            value={filterState.searchQuery}
            onChange={(e) => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        
        <select
          value={filterState.selectedCategory}
          onChange={(e) => setFilterState(prev => ({ ...prev, selectedCategory: e.target.value as CategoryType | 'all' }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
          <option value="patch">Patch</option>
          <option value="hotfix">Hotfix</option>
          <option value="beta">Beta</option>
        </select>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewState(prev => ({ ...prev, catalogueView: 'grid' }))}
            className={`p-2 rounded ${viewState.catalogueView === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewState(prev => ({ ...prev, catalogueView: 'list' }))}
            className={`p-2 rounded ${viewState.catalogueView === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderReleaseCard = (release: Release) => (
    <div key={release.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Preview Area */}
      <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 p-4 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Rocket className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">{release.preview.centralNode || release.name}</p>
            {release.preview.branches.length > 0 && (
              <div className="flex gap-2 justify-center mt-2">
                {release.preview.branches.slice(0, 3).map((branch, i) => (
                  <span key={i} className="text-xs bg-white/80 px-2 py-1 rounded">
                    {branch}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          <span className={`px-2 py-1 text-xs rounded ${
            release.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {release.status}
          </span>
          {release.isReopened && (
            <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800 font-medium">
              reopened
            </span>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{release.name}</h3>
            <p className="text-sm text-gray-500">v{release.version}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded ${
            release.category === 'major' ? 'bg-red-100 text-red-800' :
            release.category === 'minor' ? 'bg-blue-100 text-blue-800' :
            release.category === 'patch' ? 'bg-green-100 text-green-800' :
            release.category === 'hotfix' ? 'bg-orange-100 text-orange-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {release.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {release.description || 'No description provided'}
        </p>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{release.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${release.completion}%` }}
            />
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{release.nodeCount} nodes</span>
          <span>{new Date(release.updatedAt).toLocaleDateString()}</span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => loadRelease(release)}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Open
          </button>
          <button
            onClick={() => duplicateRelease(release)}
            className="flex-1 px-3 py-1.5 border border-gray-300 text-sm rounded hover:bg-gray-50"
          >
            Duplicate
          </button>
          {release.status === 'active' ? (
            <button
              onClick={() => {
                setCurrentRelease(release);
                setCloseFormData({ reason: '', notifyStakeholders: false });
                setModalState(prev => ({ ...prev, showCloseDialog: true }));
              }}
              className="px-3 py-1.5 text-red-600 text-sm hover:bg-red-50 rounded"
            >
              Close
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentRelease(release);
                setReopenFormData({ reason: '', resetProgress: false });
                setModalState(prev => ({ ...prev, showReopenDialog: true }));
              }}
              className="px-3 py-1.5 text-green-600 text-sm hover:bg-green-50 rounded"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderCustomizationPanel = () => customizingNode && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCustomizingNode(null)}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Customize Node</h3>
          <button
            onClick={() => setCustomizingNode(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCustomizationOptions(prev => ({ ...prev, activeTab: 'visual' }))}
            className={`flex-1 px-3 py-2 rounded ${
              customizationOptions.activeTab === 'visual' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setCustomizationOptions(prev => ({ ...prev, activeTab: 'properties' }))}
            className={`flex-1 px-3 py-2 rounded ${
              customizationOptions.activeTab === 'properties' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Properties
          </button>
        </div>

        {customizationOptions.activeTab === 'visual' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setCustomizationOptions(prev => ({ ...prev, selectedColor: color }));
                      updateNodeById(currentRelease.nodes, customizingNode, { color });
                      setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                    }}
                    className={`w-10 h-10 rounded ${color} ${
                      customizationOptions.selectedColor === color 
                        ? 'ring-2 ring-offset-2 ring-blue-500' 
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(releaseIcons).map(iconName => {
                  const IconComponent = {
                    Package, Rocket, Star, Target, Users, FileText,
                    Folder, GitBranch, Code, Bug, CheckCircle, Shield,
                    Zap, Crown, Diamond, Gift, Globe, Book
                  }[iconName] || Package;
                  
                  return (
                    <button
                      key={iconName}
                      onClick={() => {
                        setCustomizationOptions(prev => ({ ...prev, selectedIcon: iconName }));
                        updateNodeById(currentRelease.nodes, customizingNode, { icon: iconName });
                        setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                      }}
                      className={`w-10 h-10 rounded border flex items-center justify-center ${
                        customizationOptions.selectedIcon === iconName 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                onChange={(e) => {
                  const node = findNodeById(currentRelease.nodes, customizingNode);
                  if (node) {
                    node.properties.priority = e.target.value as PriorityLevel;
                    setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                onChange={async (e) => {
                  const node = findNodeById(currentRelease.nodes, customizingNode);
                  if (node) {
                    const oldStatus = node.properties.status;
                    node.properties.status = e.target.value;
                    setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                    
                    // Auto-sync with GitHub if issue exists
                    if (node.github_issue?.issue_number && currentRelease.id) {
                      try {
                        await apiClient.post(
                          `/releases/${currentRelease.id}/nodes/${node.id}/sync-github`,
                          { status: e.target.value }
                        );
                        console.log('GitHub issue synced automatically');
                      } catch (error) {
                        console.error('Failed to auto-sync with GitHub:', error);
                        // Revert status on error
                        node.properties.status = oldStatus;
                        setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                        alert('Failed to sync status with GitHub. Status reverted.');
                      }
                    }
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
                defaultValue={(() => {
                  const node = findNodeById(currentRelease.nodes, customizingNode);
                  return node?.properties.status || 'planning';
                })()}
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
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <input
                type="text"
                onChange={(e) => {
                  const node = findNodeById(currentRelease.nodes, customizingNode);
                  if (node) {
                    node.properties.assignee = e.target.value;
                    setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter assignee name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                onChange={(e) => {
                  const node = findNodeById(currentRelease.nodes, customizingNode);
                  if (node) {
                    node.properties.description = e.target.value;
                    setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows={3}
                placeholder="Enter description"
                defaultValue={(() => {
                  const node = findNodeById(currentRelease.nodes, customizingNode);
                  return node?.properties.description || '';
                })()}
              />
            </div>

            {/* GitHub Integration Section */}
            {(() => {
              const node = findNodeById(currentRelease.nodes, customizingNode);
              if (node?.github_issue) {
                return (
                  <div className="border-t pt-3">
                    <label className="block text-sm font-medium mb-2">GitHub Issue</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <a 
                          href={node.github_issue.issue_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Github size={16} />
                          <span>Issue #{node.github_issue.issue_number}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      {node.github_issue.last_synced && (
                        <div className="text-xs text-gray-500">
                          Last synced: {new Date(node.github_issue.last_synced).toLocaleString()}
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          if (currentRelease.id && node) {
                            try {
                              const response = await apiClient.post(
                                `/releases/${currentRelease.id}/nodes/${node.id}/sync-github`,
                                { status: node.properties.status }
                              );
                              if (response.success) {
                                // Update the last_synced timestamp
                                node.github_issue!.last_synced = new Date().toISOString();
                                setCurrentRelease(prev => ({ ...prev, nodes: [...prev.nodes] }));
                                alert('GitHub issue synced successfully!');
                              }
                            } catch (error) {
                              console.error('Failed to sync with GitHub:', error);
                              alert('Failed to sync with GitHub');
                            }
                          }
                        }}
                        className="w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
                      >
                        <RefreshCw size={14} />
                        Sync Status to GitHub
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setCustomizingNode(null)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  const renderSaveDialog = () => modalState.showSaveDialog && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Save Release</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={saveFormData.name}
              onChange={(e) => setSaveFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Release name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Version</label>
            <input
              type="text"
              value={saveFormData.version}
              onChange={(e) => setSaveFormData(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="1.0.0"
            />
            {saveFormData.version && !isValidVersion(saveFormData.version) && (
              <p className="text-red-500 text-xs mt-1">Invalid version format</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={saveFormData.description}
              onChange={(e) => setSaveFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Release description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={saveFormData.category}
              onChange={(e) => setSaveFormData(prev => ({ ...prev, category: e.target.value as CategoryType }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="patch">Patch</option>
              <option value="hotfix">Hotfix</option>
              <option value="beta">Beta</option>
            </select>
          </div>
        </div>
        
        {saveError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {saveError}
          </div>
        )}
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={saveCurrentRelease}
            disabled={!saveFormData.name || !saveFormData.version || !isValidVersion(saveFormData.version) || isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
          <button
            onClick={() => {
              setModalState(prev => ({ ...prev, showSaveDialog: false }));
              setSaveError(null);
            }}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderCloseDialog = () => modalState.showCloseDialog && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Close Release</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reason for closing</label>
            <textarea
              value={closeFormData.reason}
              onChange={(e) => setCloseFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Enter reason for closing this release"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notify"
              checked={closeFormData.notifyStakeholders}
              onChange={(e) => setCloseFormData(prev => ({ ...prev, notifyStakeholders: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="notify" className="text-sm">Notify stakeholders</label>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={closeRelease}
            disabled={!closeFormData.reason}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close Release
          </button>
          <button
            onClick={() => setModalState(prev => ({ ...prev, showCloseDialog: false }))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderReopenDialog = () => modalState.showReopenDialog && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Reopen Release</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reason for reopening <span className="text-red-500">*</span></label>
            <textarea
              value={reopenFormData.reason}
              onChange={(e) => setReopenFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Why is this release being reopened? (e.g., additional features needed, bug fixes required)"
              required
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="resetProgress"
              checked={reopenFormData.resetProgress}
              onChange={(e) => setReopenFormData(prev => ({ ...prev, resetProgress: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="resetProgress" className="text-sm">
              Reset all task progress to planning
            </label>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Reopening will change the release status back to "active" and document the reason in the status history.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={reopenRelease}
            disabled={!reopenFormData.reason}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reopen Release
          </button>
          <button
            onClick={() => {
              setModalState(prev => ({ ...prev, showReopenDialog: false }));
              setReopenFormData({ reason: '', resetProgress: false });
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirmation = () => modalState.showDeleteConfirm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold">Delete Node</h3>
        </div>
        
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete "{modalState.deleteTargetTitle}"?
        </p>
        
        {modalState.deleteChildrenCount > 0 && (
          <p className="text-sm text-red-600 mb-4">
            This will also delete {modalState.deleteChildrenCount} child node(s).
          </p>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={executeDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setModalState(prev => ({ 
              ...prev, 
              showDeleteConfirm: false,
              deleteTargetId: null,
              deleteTargetTitle: null,
              deleteChildrenCount: 0
            }))}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (viewState.currentView === 'catalogue') {
    return (
      <div className="w-full h-screen bg-gray-50">
        {renderCatalogueHeader()}
        
        <div className="px-6 py-6">
          {filteredReleases.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No releases found</h3>
              <p className="text-gray-500 mb-4">
                {filterState.searchQuery ? 
                  'Try adjusting your search or filters' : 
                  'Get started by creating your first release'}
              </p>
              {!filterState.searchQuery && (
                <button
                  onClick={createNewRelease}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create First Release
                </button>
              )}
            </div>
          ) : (
            <>
              {viewState.catalogueView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReleases.map(renderReleaseCard)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReleases.map(release => (
                    <div key={release.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Rocket className="w-8 h-8 text-purple-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{release.name}</h3>
                            <p className="text-sm text-gray-500">v{release.version} • {release.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{release.completion}% Complete</p>
                            <p className="text-xs text-gray-500">{release.nodeCount} nodes</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => loadRelease(release)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => duplicateRelease(release)}
                              className="px-3 py-1.5 border border-gray-300 text-sm rounded hover:bg-gray-50"
                            >
                              Duplicate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Render all dialogs */}
        {renderSaveDialog()}
        {renderCloseDialog()}
        {renderReopenDialog()}
        {renderDeleteConfirmation()}
      </div>
    );
  }

  // Editor view
  return (
    <div 
      className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      style={{ cursor: panMode ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Editor Header */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewState(prev => ({ ...prev, currentView: 'catalogue' }))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h2 className="font-semibold text-gray-900">
              {currentRelease.name || 'Untitled Release'}
            </h2>
            <p className="text-sm text-gray-500">
              v{currentRelease.version} • {currentRelease.nodeCount} nodes • {currentRelease.completion}% complete
            </p>
          </div>
          
          <button
            onClick={autoAlignNodes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            title="Auto-align nodes to prevent overlap"
          >
            <Layers className="w-4 h-4" />
            Auto-Align
          </button>
          
          <button
            onClick={() => {
              setSaveFormData({
                name: currentRelease.name,
                version: currentRelease.version,
                description: currentRelease.description,
                category: currentRelease.category,
                tags: currentRelease.tags,
                targetDate: currentRelease.targetDate,
                environment: currentRelease.environment
              });
              setModalState(prev => ({ ...prev, showSaveDialog: true }));
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          {/* GitHub Integration Button */}
          {currentRelease.id && (
            <>
              <button
                onClick={publishToGitHub}
                disabled={isPublishing || !githubConfigured}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  githubConfigured 
                    ? 'bg-gray-900 text-white hover:bg-gray-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isPublishing ? 'opacity-50 cursor-wait' : ''}`}
                title={
                  !githubConfigured 
                    ? `GitHub not configured. Set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO${githubConfig?.type === 'enterprise' ? ', and GITHUB_ENTERPRISE_URL' : ''} in backend .env` 
                    : `Publish all nodes as GitHub issues${githubConfig?.type === 'enterprise' ? ` (Enterprise: ${githubConfig.enterprise_url})` : ' (GitHub.com)'}`
                }
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    Publish to GitHub
                  </>
                )}
              </button>
              
              {/* GitHub Status Indicator */}
              {githubConfig && (
                <div className="flex items-center gap-2 px-3 py-1 text-xs bg-gray-100 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${githubConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
                  {githubConfig.type === 'enterprise' ? (
                    <span title={githubConfig.enterprise_url}>
                      Enterprise: {githubConfig.owner}/{githubConfig.repo}
                    </span>
                  ) : (
                    <span>
                      GitHub.com: {githubConfig.owner}/{githubConfig.repo}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* GitHub Status */}
        {publishError && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {publishError}
          </div>
        )}
      </div>

      {/* Zoom and Pan Controls */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2">
        <div className="flex items-center gap-2">
          {/* Pan Controls */}
          <button
            onClick={() => setPanMode(!panMode)}
            className={`p-2 rounded-lg transition-colors ${
              panMode ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'hover:bg-gray-100'
            }`}
            title={panMode ? "Exit Pan Mode" : "Pan Mode (or hold Shift)"}
          >
            <Hand className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setViewState(prev => ({ ...prev, panX: 0, panY: 0 }))}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Reset Pan Position"
          >
            <Move className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Zoom Out (Ctrl+Scroll)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="px-3 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {Math.round(viewState.zoom * 100)}%
          </div>
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Zoom In (Ctrl+Scroll)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button
            onClick={handleZoomReset}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleZoomFit}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Instructions */}
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex gap-4">
            <span>🖱️ Pan: {panMode ? 'Click & Drag' : 'Shift+Drag or Middle Mouse'}</span>
            <span>🔍 Zoom: Ctrl+Scroll</span>
          </div>
        </div>
      </div>

      {/* Pan Instructions */}
      {viewState.zoom !== 1 && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
          <div>Ctrl+Scroll: Zoom</div>
          <div>Shift+Drag: Pan</div>
        </div>
      )}

      {/* Release Canvas */}
      <div 
        className="relative w-full h-full overflow-hidden" 
        ref={canvasRef}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div 
          className="absolute" 
          style={{ 
            minWidth: `${canvasConfig.width}px`, 
            minHeight: `${canvasConfig.height}px`,
            transform: `scale(${viewState.zoom}) translate(${viewState.panX / viewState.zoom}px, ${viewState.panY / viewState.zoom}px)`,
            transformOrigin: 'center center'
          }}
        >
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

      {/* Empty State */}
      {currentRelease.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Rocket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Release</h3>
            <p className="text-gray-500 mb-4">Add your first release node to get started</p>
            <button
              onClick={() => {
                const newNode: ReleaseNode = {
                  id: generateNodeId(),
                  title: 'Release 1.0.0',
                  type: 'release',
                  color: 'bg-purple-600',
                  icon: 'Rocket',
                  expanded: true,
                  properties: defaultNodeProperties.release,
                  children: []
                };
                setCurrentRelease(prev => ({ 
                  ...prev, 
                  nodes: [newNode],
                  nodeCount: 1
                }));
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Release Node
            </button>
          </div>
        </div>
      )}

      {/* Render all dialogs */}
      {renderCustomizationPanel()}
      {renderSaveDialog()}
      {renderCloseDialog()}
      {renderReopenDialog()}
      {renderDeleteConfirmation()}
    </div>
  );
};

export default ReleaseManagementTool;