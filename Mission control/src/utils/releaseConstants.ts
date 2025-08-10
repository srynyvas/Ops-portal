/**
 * Release Management Constants and Configuration
 * Provides all constant values for the Release Management Tool
 */

import {
  Rocket, Package, GitBranch, Code, Bug, Shield, Target, CheckCircle,
  AlertCircle, Play, Pause, RotateCcw, TrendingUp, Layers, Terminal,
  Users, Zap, Star, FolderOpen
} from 'lucide-react';

// Color options for node customization
export const colorOptions = [
  'bg-red-600', 'bg-pink-600', 'bg-purple-600', 'bg-indigo-600',
  'bg-blue-600', 'bg-cyan-600', 'bg-teal-600', 'bg-green-600',
  'bg-lime-600', 'bg-yellow-600', 'bg-orange-600', 'bg-gray-600',
  'bg-red-400', 'bg-pink-400', 'bg-purple-400', 'bg-indigo-400',
  'bg-blue-400', 'bg-cyan-400', 'bg-teal-400', 'bg-green-400'
];

// Icon mapping for node customization
export const releaseIcons = {
  'Rocket': Rocket,
  'Package': Package,
  'GitBranch': GitBranch,
  'Code': Code,
  'Bug': Bug,
  'Shield': Shield,
  'Target': Target,
  'CheckCircle': CheckCircle,
  'AlertCircle': AlertCircle,
  'Play': Play,
  'Pause': Pause,
  'RotateCcw': RotateCcw,
  'TrendingUp': TrendingUp,
  'Layers': Layers,
  'Terminal': Terminal,
  'Users': Users,
  'Zap': Zap,
  'Star': Star
};

// Release categories
export const categories = [
  { id: 'all', name: 'All Releases', icon: FolderOpen },
  { id: 'major', name: 'Major Release', icon: Rocket },
  { id: 'minor', name: 'Minor Release', icon: Package },
  { id: 'patch', name: 'Patch Release', icon: Code },
  { id: 'hotfix', name: 'Hotfix', icon: Bug },
  { id: 'beta', name: 'Beta Release', icon: GitBranch }
];

// Environment configurations
export const environments = [
  { id: 'development', name: 'Development', color: 'bg-blue-100 text-blue-800' },
  { id: 'staging', name: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'production', name: 'Production', color: 'bg-green-100 text-green-800' }
];

// Priority color mapping
export const priorityColors: Record<string, string> = {
  'low': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800'
};

// Status color mapping
export const statusColors: Record<string, string> = {
  'planning': 'bg-gray-100 text-gray-800',
  'in-development': 'bg-blue-100 text-blue-800',
  'testing': 'bg-purple-100 text-purple-800',
  'ready-for-release': 'bg-green-100 text-green-800',
  'released': 'bg-emerald-100 text-emerald-800',
  'blocked': 'bg-red-100 text-red-800',
  'on-hold': 'bg-gray-100 text-gray-800'
};

// Node size configurations
export const nodeSizes = {
  release: { width: 256, height: 160 }, // 64x40 * 4 for better visibility
  feature: { width: 208, height: 128 }, // 52x32 * 4
  task: { width: 176, height: 112 }     // 44x28 * 4
};

// Canvas configuration
export const canvasConfig = {
  width: 3000,
  height: 2000,
  gridSize: 20,
  connectionStrokeWidth: 2,
  connectionColor: '#9CA3AF',
  selectedConnectionColor: '#6366F1'
};

// Validation rules
export const validationRules = {
  maxTitleLength: 50,
  maxDescriptionLength: 500,
  maxTagsPerNode: 10,
  maxDependenciesPerNode: 5,
  maxNestingLevel: 5,
  versionRegex: /^\d+\.\d+\.\d+$/
};

// Error messages
export const errorMessages = {
  'SAVE_FAILED': 'Failed to save release. Please try again.',
  'INVALID_VERSION': 'Version must follow semantic versioning (e.g., 1.0.0)',
  'EMPTY_TITLE': 'Node title cannot be empty',
  'CIRCULAR_DEPENDENCY': 'Cannot create circular dependencies',
  'MAX_NESTING': 'Maximum nesting level reached (5 levels)',
  'NETWORK_ERROR': 'Network error. Changes saved locally.',
  'INVALID_DROP': 'Cannot drop this item here',
  'DELETE_WITH_CHILDREN': 'This node has children. Delete them first or confirm deletion of all.'
};

// Default node properties
export const defaultNodeProperties = {
  release: {
    version: '1.0.0',
    assignee: '',
    targetDate: '',
    environment: 'development' as const,
    description: '',
    tags: [] as string[],
    priority: 'medium' as const,
    status: 'planning' as const,
    storyPoints: '',
    dependencies: [] as string[],
    notes: '',
    releaseNotes: ''
  },
  feature: {
    version: '',
    assignee: '',
    targetDate: '',
    environment: 'development' as const,
    description: '',
    tags: [] as string[],
    priority: 'medium' as const,
    status: 'planning' as const,
    storyPoints: '5',
    dependencies: [] as string[],
    notes: '',
    releaseNotes: ''
  },
  task: {
    version: '',
    assignee: '',
    targetDate: '',
    environment: 'development' as const,
    description: '',
    tags: [] as string[],
    priority: 'medium' as const,
    status: 'planning' as const,
    storyPoints: '1',
    dependencies: [] as string[],
    notes: '',
    releaseNotes: ''
  }
};

// Animation durations (in ms)
export const animations = {
  nodeTransition: 200,
  connectionFade: 150,
  modalFade: 300,
  dragFeedback: 100
};

// Keyboard shortcuts
export const shortcuts = {
  save: 'Ctrl+S',
  new: 'Ctrl+N',
  delete: 'Delete',
  escape: 'Escape',
  enter: 'Enter',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y'
};