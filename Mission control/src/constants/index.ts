export const APP_CONFIG = {
  name: 'Mission Control',
  version: '1.0.0',
  description: 'Enterprise Operations Portal',
  author: 'Ops Portal Team',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  DASHBOARD: '/api/dashboard',
  WORKFLOWS: '/api/workflows',
  RELEASES: '/api/releases',
  TEAMS: '/api/teams',
  SERVICES: '/api/services',
  PIPELINES: '/api/pipelines',
  INCIDENTS: '/api/incidents',
  DOCS: '/api/documentation',
  NOTIFICATIONS: '/api/notifications',
  WEBSOCKET: '/ws',
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'mission-control-user-prefs',
  THEME: 'mission-control-theme',
  SIDEBAR_STATE: 'mission-control-sidebar',
  RECENT_WORKFLOWS: 'mission-control-recent-workflows',
  RECENT_RELEASES: 'mission-control-recent-releases',
  DRAFT_WORKFLOWS: 'mission-control-draft-workflows',
  DRAFT_RELEASES: 'mission-control-draft-releases',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
  KANBAN: 'kanban',
  TIMELINE: 'timeline',
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const STATUS_TYPES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  ON_HOLD: 'on-hold',
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export const NODE_TYPES = {
  CENTRAL: 'central',
  BRANCH: 'branch',
  LEAF: 'leaf',
} as const;

export const RELEASE_NODE_TYPES = {
  RELEASE: 'release',
  FEATURE: 'feature',
  TASK: 'task',
} as const;

export const RELEASE_TYPES = {
  MAJOR: 'major',
  MINOR: 'minor',
  PATCH: 'patch',
  HOTFIX: 'hotfix',
  BETA: 'beta',
  ALPHA: 'alpha',
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'cmd+k',
  NEW_WORKFLOW: 'cmd+n',
  NEW_RELEASE: 'cmd+shift+n',
  SAVE: 'cmd+s',
  UNDO: 'cmd+z',
  REDO: 'cmd+shift+z',
  DELETE: 'del',
  ESCAPE: 'esc',
  TOGGLE_SIDEBAR: 'cmd+\\',
  ZOOM_IN: 'cmd+=',
  ZOOM_OUT: 'cmd+-',
  ZOOM_RESET: 'cmd+0',
} as const;

export const DRAG_TYPES = {
  WORKFLOW_NODE: 'workflow-node',
  RELEASE_NODE: 'release-node',
  FILE: 'file',
  TEXT: 'text',
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  WORKFLOW_UPDATE: 'workflow:update',
  RELEASE_UPDATE: 'release:update',
  NOTIFICATION: 'notification',
  SYSTEM_STATUS: 'system:status',
  USER_ACTIVITY: 'user:activity',
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

export const MAX_FILE_SIZE = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  ARCHIVE: 50 * 1024 * 1024, // 50MB
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  RESIZE: 150,
  SCROLL: 100,
  AUTO_SAVE: 1000,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please correct the highlighted fields.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  UNSUPPORTED_FORMAT: 'File format is not supported.',
} as const;

export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  UPLOADED: 'File uploaded successfully',
  EXPORTED: 'Data exported successfully',
  IMPORTED: 'Data imported successfully',
} as const;

export const COLOR_PALETTE = {
  PRIMARY: [
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
    'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700',
  ],
  SECONDARY: [
    'bg-gray-500', 'bg-gray-600', 'bg-gray-700',
    'bg-slate-500', 'bg-slate-600', 'bg-slate-700',
  ],
  ACCENT: [
    'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700',
    'bg-teal-500', 'bg-teal-600', 'bg-teal-700',
    'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700',
  ],
  WARNING: [
    'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700',
    'bg-orange-500', 'bg-orange-600', 'bg-orange-700',
  ],
  DANGER: [
    'bg-red-500', 'bg-red-600', 'bg-red-700',
    'bg-rose-500', 'bg-rose-600', 'bg-rose-700',
  ],
  SUCCESS: [
    'bg-green-500', 'bg-green-600', 'bg-green-700',
    'bg-lime-500', 'bg-lime-600', 'bg-lime-700',
  ],
} as const;

export const ICON_SETS = {
  GENERAL: [
    'Target', 'Star', 'Heart', 'Zap', 'Crown', 'Diamond',
    'Gift', 'Coffee', 'Music', 'Camera', 'Book', 'Globe',
  ],
  DEVELOPMENT: [
    'Code', 'GitBranch', 'Package', 'Terminal', 'Bug',
    'Wrench', 'Settings', 'Database', 'Server', 'Cloud',
  ],
  BUSINESS: [
    'Users', 'User', 'Building', 'Briefcase', 'PieChart',
    'BarChart3', 'TrendingUp', 'Target', 'Flag', 'Award',
  ],
  WORKFLOW: [
    'Lightbulb', 'Rocket', 'CheckCircle', 'Clock', 'Calendar',
    'FileText', 'Folder', 'Link', 'Tag', 'Filter',
  ],
} as const;
