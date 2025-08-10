/**
 * Release Management Type Definitions
 * Comprehensive TypeScript interfaces for the Release Management Tool
 */

// Core node structure
export interface ReleaseNode {
  id: string;
  title: string;
  type: NodeType;
  color: string;
  icon: string;
  expanded?: boolean;
  properties: ReleaseProperties;
  children: ReleaseNode[];
  // Visual positioning
  x?: number;
  y?: number;
}

// Main release structure
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

// Node properties
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

// Type definitions
export type NodeType = 'release' | 'feature' | 'task';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type StatusType = 
  | 'planning' 
  | 'in-development' 
  | 'testing' 
  | 'ready-for-release' 
  | 'released' 
  | 'blocked' 
  | 'on-hold';
export type EnvironmentType = 'development' | 'staging' | 'production';
export type CategoryType = 'major' | 'minor' | 'patch' | 'hotfix' | 'beta';

// Status history tracking
export interface StatusHistoryEntry {
  action: 'closed' | 'reopened' | 'created' | 'updated';
  reason: string;
  timestamp: string;
  user: string;
  previousStatus?: string;
  newStatus?: string;
}

// Preview data for catalogue cards
export interface PreviewData {
  centralNode: string;
  branches: string[];
}

// Form data structures
export interface SaveFormData {
  name: string;
  version: string;
  description: string;
  category: CategoryType;
  tags: string[];
  targetDate: string;
  environment: EnvironmentType;
}

export interface CloseFormData {
  reason: string;
  notifyStakeholders: boolean;
}

export interface ReopenFormData {
  reason: string;
  resetProgress: boolean;
}

// Customization options
export interface CustomizationOptions {
  activeTab: 'visual' | 'properties';
  selectedColor: string;
  selectedIcon: string;
  nodeType: NodeType;
}

// Drag and drop state
export interface DragState {
  isDragging: boolean;
  draggedNode: ReleaseNode | null;
  dropTarget: string | null;
  validDropTargets: string[];
}

// Filter and search state
export interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryType | 'all';
  selectedStatus: 'active' | 'closed' | 'all';
  selectedEnvironment: EnvironmentType | 'all';
  sortBy: 'name' | 'date' | 'completion' | 'version';
  sortOrder: 'asc' | 'desc';
}

// View state
export interface ViewState {
  currentView: 'catalogue' | 'editor';
  catalogueView: 'grid' | 'list';
  zoom: number;
  panX: number;
  panY: number;
}

// Modal state
export interface ModalState {
  showSaveDialog: boolean;
  showCloseDialog: boolean;
  showReopenDialog: boolean;
  showDeleteConfirm: boolean;
  deleteTargetId: string | null;
  deleteTargetTitle: string | null;
  deleteChildrenCount: number;
}

// Canvas configuration
export interface CanvasConfig {
  width: number;
  height: number;
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
}

// Connection line between nodes
export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// Analytics data
export interface ReleaseMetrics {
  totalNodes: number;
  totalFeatures: number;
  totalTasks: number;
  completedTasks: number;
  blockedTasks: number;
  avgCompletionTime?: number;
  velocity?: number;
}

// Export/Import format
export interface ExportData {
  version: string;
  exportDate: string;
  releases: Release[];
  metadata: {
    totalReleases: number;
    activeReleases: number;
    closedReleases: number;
  };
}

// Notification
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  autoSaveInterval: number;
  showTips: boolean;
  defaultView: 'catalogue' | 'editor';
  defaultCategory: CategoryType;
  defaultEnvironment: EnvironmentType;
}

// Collaboration features (future)
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  activeNodeId?: string;
  cursorPosition?: { x: number; y: number };
  lastActive: string;
}

// Activity log
export interface ActivityLog {
  id: string;
  releaseId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  nodeId?: string;
  nodeName?: string;
}