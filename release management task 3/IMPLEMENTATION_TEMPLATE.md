# Implementation Template: ReleaseManagementTool.tsx

This template provides the exact structure and starting code for Claude Code CLI to implement the Release Management Tool.

## Main Component Template

```typescript
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

// Import types (to be created)
import { 
  Release, 
  ReleaseNode, 
  NodeType, 
  PriorityLevel, 
  StatusType, 
  EnvironmentType, 
  CategoryType 
} from '../types/release.types';

// Import utilities (to be created)
import {
  findNodeById,
  updateNodeById,
  removeNodeById,
  addNodeToParent,
  countTotalNodes,
  calculateCompletion,
  generatePreview
} from '../utils/releaseUtils';

// Import constants (to be created)
import {
  colorOptions,
  releaseIcons,
  categories,
  environments,
  priorityColors,
  statusColors
} from '../utils/releaseConstants';

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
  const [savedReleases, setSavedReleases] = useState<Release[]>([]);

  // UI state
  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [catalogueView, setCatalogueView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showReopenDialog, setShowReopenDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  // Editor state
  const [draggedNode, setDraggedNode] = useState<ReleaseNode | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [customizingNode, setCustomizingNode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Form states
  const [saveFormData, setSaveFormData] = useState<any>({});
  const [closeReason, setCloseReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');

  // IMPLEMENTATION FUNCTIONS TO BE COMPLETED:

  // Release Management Functions
  const saveCurrentRelease = () => {
    // TODO: Implement save functionality
  };

  const loadRelease = (release: Release) => {
    // TODO: Implement load functionality
  };

  const createNewRelease = () => {
    // TODO: Implement new release creation
  };

  const duplicateRelease = (release: Release) => {
    // TODO: Implement duplication functionality
  };

  const closeRelease = () => {
    // TODO: Implement close functionality
  };

  const reopenRelease = () => {
    // TODO: Implement reopen functionality
  };

  // Node Management Functions
  const toggleExpanded = (nodeId: string) => {
    // TODO: Implement expand/collapse functionality
  };

  const startEditing = (node: ReleaseNode) => {
    // TODO: Implement inline editing start
  };

  const saveEdit = () => {
    // TODO: Implement inline editing save
  };

  const cancelEdit = () => {
    // TODO: Implement inline editing cancel
  };

  const addNewNode = (parentId: string) => {
    // TODO: Implement new node creation
  };

  const confirmDelete = (nodeId: string) => {
    // TODO: Implement delete confirmation
  };

  const executeDelete = () => {
    // TODO: Implement actual deletion
  };

  // Drag and Drop Functions
  const handleDragStart = (e: React.DragEvent, node: ReleaseNode) => {
    // TODO: Implement drag start
  };

  const handleDragEnd = () => {
    // TODO: Implement drag end
  };

  const handleDragOver = (e: React.DragEvent, node: ReleaseNode) => {
    // TODO: Implement drag over
  };

  const handleDrop = (e: React.DragEvent, targetNode: ReleaseNode) => {
    // TODO: Implement drop functionality
  };

  // Customization Functions
  const updateNodeStyle = (nodeId: string, updates: any) => {
    // TODO: Implement style updates
  };

  const updateNodeProperties = (nodeId: string, propertyUpdates: any) => {
    // TODO: Implement property updates
  };

  // Filter and Search Functions
  const filteredReleases = savedReleases.filter(release => {
    // TODO: Implement filtering logic
    return true;
  });

  // Render Functions
  const renderCatalogueHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      {/* TODO: Implement catalogue header */}
    </div>
  );

  const renderReleaseCard = (release: Release) => (
    <div key={release.id} className="bg-white rounded-xl border border-gray-200">
      {/* TODO: Implement release card */}
    </div>
  );

  const renderReleaseList = (release: Release) => (
    <div key={release.id} className="bg-white border border-gray-200 rounded-lg p-4">
      {/* TODO: Implement release list item */}
    </div>
  );

  const renderNode = (node: ReleaseNode, level = 0, offsetX = 0, offsetY = 0) => {
    // TODO: Implement node rendering with all interactions
    return <div key={node.id}>Node: {node.title}</div>;
  };

  const renderConnections = (node: ReleaseNode, level = 0, parentX = 0, parentY = 0) => {
    // TODO: Implement SVG connection lines
    return null;
  };

  const renderCustomizationPanel = () => {
    // TODO: Implement customization panel with tabs
    return null;
  };

  const renderSaveDialog = () => {
    // TODO: Implement save dialog
    return null;
  };

  const renderCloseDialog = () => {
    // TODO: Implement close dialog
    return null;
  };

  const renderReopenDialog = () => {
    // TODO: Implement reopen dialog
    return null;
  };

  const renderDeleteConfirmation = () => {
    // TODO: Implement delete confirmation dialog
    return null;
  };

  // Main render logic
  if (currentView === 'catalogue') {
    return (
      <div className="w-full h-screen bg-gray-50">
        {renderCatalogueHeader()}
        
        <div className="px-6 py-6">
          {filteredReleases.length === 0 ? (
            <div className="text-center py-12">
              {/* TODO: Implement empty state */}
            </div>
          ) : (
            <>
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

        {/* Render all dialogs */}
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
        {/* TODO: Implement editor header */}
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

      {/* Render all panels and dialogs */}
      {renderCustomizationPanel()}
      {renderDeleteConfirmation()}
      {renderSaveDialog()}
      {renderCloseDialog()}
      {renderReopenDialog()}

      {/* Empty State */}
      {currentRelease.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* TODO: Implement empty state */}
        </div>
      )}
    </div>
  );
};

export default ReleaseManagementTool;
```

## Required Type Definitions (release.types.ts)

```typescript
export interface ReleaseNode {
  id: string;
  title: string;
  type: NodeType;
  color: string;
  icon: string;
  expanded?: boolean;
  properties: ReleaseProperties;
  children: ReleaseNode[];
}

export interface Release {
  id: string | null;
  name: string;
  version: string;
  description: string;
  category: CategoryType;
  tags: string[];
  targetDate: string;
  environment: EnvironmentType;
  status: 'active' | 'closed';
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  completion: number;
  preview: PreviewData;
  nodes: ReleaseNode[];
}

export interface ReleaseProperties {
  version: string;
  assignee: string;
  targetDate: string;
  environment: EnvironmentType;
  description: string;
  tags: string[];
  priority: PriorityLevel;
  status: StatusType;
  storyPoints: string;
  dependencies: string[];
  notes: string;
  releaseNotes: string;
}

export type NodeType = 'release' | 'feature' | 'task';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type StatusType = 'planning' | 'in-development' | 'testing' | 'ready-for-release' | 'released' | 'blocked' | 'on-hold';
export type EnvironmentType = 'development' | 'staging' | 'production';
export type CategoryType = 'major' | 'minor' | 'patch' | 'hotfix' | 'beta';

export interface StatusHistoryEntry {
  action: 'closed' | 'reopened';
  reason: string;
  timestamp: string;
  user: string;
}

export interface PreviewData {
  centralNode: string;
  branches: string[];
}
```

## Key Implementation Points

### 1. State Management Pattern
- Use useState for all state management
- Implement proper state updates with spread operators
- Handle nested state updates correctly for tree structures
- Use useCallback and useMemo for performance optimization

### 2. Drag and Drop Implementation
- Use native HTML5 drag and drop API
- Implement proper event handling (dragStart, dragEnd, dragOver, drop)
- Validate drop targets (no task-to-task drops)
- Provide visual feedback with CSS classes

### 3. Tree Manipulation
- Implement recursive functions for finding/updating nodes
- Handle parent-child relationships correctly
- Maintain tree integrity during operations
- Calculate progress and node counts efficiently

### 4. Modal Management
- Use conditional rendering with proper z-index
- Handle escape key and overlay clicks
- Implement form validation and error handling
- Manage form state separately from main state

### 5. Visual Design
- Use Tailwind CSS for all styling
- Implement responsive design patterns
- Use proper color coding and visual hierarchy
- Add hover states and transitions

### 6. Performance Considerations
- Debounce search input (300ms)
- Memoize expensive calculations
- Limit re-renders with React.memo where appropriate
- Use efficient tree traversal algorithms

This template provides the exact starting structure that Claude Code CLI should use to implement the Release Management Tool. Each TODO comment indicates where specific functionality needs to be implemented according to the detailed specifications.
