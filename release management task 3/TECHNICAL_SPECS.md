# Technical Specification: Release Management Tool

## Component Architecture

```
src/
├── components/
│   └── releases/
│       ├── ReleaseManagementTool.tsx        // Main component with state management
│       ├── CatalogueView.tsx                // Grid/List view for release browsing
│       ├── EditorView.tsx                   // Visual workflow editor canvas
│       ├── NodeComponent.tsx                // Individual draggable nodes
│       ├── CustomizationPanel.tsx           // Properties and visual customization
│       └── Dialogs.tsx                      // Modal dialogs (save/close/delete)
├── types/
│   └── release.types.ts                     // TypeScript interfaces
├── hooks/
│   └── useReleaseManagement.ts             // Custom hook for state management
├── utils/
│   ├── releaseUtils.ts                     // Tree manipulation utilities
│   └── releaseConstants.ts                // Constants and configuration
└── data/
    └── sampleReleases.ts                   // Sample data for testing
```

## Core Features Specification

### 1. Dual View System

#### Catalogue View
- **Header**: Search input, category filter, grid/list toggle, "New Release" button
- **Grid View**: Cards (3 columns) with preview, progress, metadata
- **List View**: Table-like rows with condensed information
- **Actions**: Open, Duplicate, Close release buttons per item
- **Empty State**: When no releases match filters

#### Editor View
- **Canvas**: 3000x2000px scrollable area with zoom capability
- **Nodes**: Hierarchical display (Release → Features → Tasks)
- **Connections**: SVG lines connecting parent-child relationships
- **Controls**: Back button, Save button, release info header
- **Empty State**: When no nodes exist in release

### 2. Node System

#### Node Types & Hierarchy
```
Release (Purple, Large: 64x40)
├── Feature (Blue, Medium: 52x32)
│   ├── Task (Gray, Small: 44x28)
│   └── Task (Gray, Small: 44x28)
└── Feature (Blue, Medium: 52x32)
    └── Task (Gray, Small: 44x28)
```

#### Node Properties
```typescript
interface NodeProperties {
  // Core Information
  version: string;           // Release version (releases only)
  assignee: string;          // Person or team assigned
  targetDate: string;        // Target completion date
  environment: string;       // development/staging/production
  description: string;       // Detailed description
  
  // Classification
  tags: string[];           // Custom tags for organization
  priority: string;         // low/medium/high/critical
  status: string;           // planning/in-development/testing/etc
  
  // Project Management
  storyPoints: string;      // Effort estimation
  dependencies: string[];   // Blocking dependencies
  notes: string;           // Additional notes
  releaseNotes: string;    // What's new (releases only)
}
```

### 3. Interaction Patterns

#### Drag-and-Drop Rules
- **Valid Drops**: Feature → Release, Task → Feature
- **Invalid Drops**: Task → Task, Any → Task
- **Visual Feedback**: Yellow ring around valid drop targets
- **Constraints**: Cannot create circular dependencies

#### Inline Editing
- **Trigger**: Click on node title
- **Controls**: Enter (save), Escape (cancel), Blur (save)
- **Validation**: No empty titles, max 50 characters
- **Visual**: Input field replaces title with save/cancel buttons

#### Status Management
- **Release Status**: Active (editable) ↔ Closed (read-only)
- **Node Status**: Planning → In Development → Testing → Ready → Released
- **History Tracking**: All status changes with timestamp and reason

### 4. Data Models

#### Core Release Model
```typescript
interface Release {
  // Identity
  id: string | null;
  name: string;
  version: string;
  
  // Metadata
  description: string;
  category: 'major' | 'minor' | 'patch' | 'hotfix' | 'beta';
  tags: string[];
  targetDate: string;
  environment: 'development' | 'staging' | 'production';
  
  // Status
  status: 'active' | 'closed';
  statusHistory: StatusHistoryEntry[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Calculated
  nodeCount: number;
  completion: number;       // 0-100 percentage
  preview: PreviewData;
  
  // Structure
  nodes: ReleaseNode[];
}
```

#### State Management Structure
```typescript
// Main component state
const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
const [currentRelease, setCurrentRelease] = useState<Release>();
const [savedReleases, setSavedReleases] = useState<Release[]>([]);

// UI state
const [catalogueView, setCatalogueView] = useState<'grid' | 'list'>('grid');
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');

// Editor state
const [draggedNode, setDraggedNode] = useState<ReleaseNode | null>(null);
const [editingNode, setEditingNode] = useState<string | null>(null);
const [customizingNode, setCustomizingNode] = useState<string | null>(null);

// Modal state
const [showSaveDialog, setShowSaveDialog] = useState(false);
const [showCloseDialog, setShowCloseDialog] = useState(false);
const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
```

### 5. Visual Design Specifications

#### Color Palette
```typescript
const nodeColors = [
  'bg-red-600', 'bg-pink-600', 'bg-purple-600', 'bg-indigo-600',
  'bg-blue-600', 'bg-cyan-600', 'bg-teal-600', 'bg-green-600',
  'bg-lime-600', 'bg-yellow-600', 'bg-orange-600', 'bg-gray-600'
];

const statusColors = {
  'planning': 'bg-gray-100 text-gray-800',
  'in-development': 'bg-blue-100 text-blue-800',
  'testing': 'bg-purple-100 text-purple-800',
  'ready-for-release': 'bg-green-100 text-green-800',
  'released': 'bg-emerald-100 text-emerald-800',
  'blocked': 'bg-red-100 text-red-800'
};
```

#### Icon System
```typescript
import { 
  Rocket,      // Release
  Package,     // Feature  
  Code,        // Task
  Shield,      // Security
  Bug,         // Bug fix
  Target,      // Story points
  Users,       // Team assignment
  Calendar,    // Dates
  Tag          // Tags
} from 'lucide-react';
```

### 6. Business Logic

#### Progress Calculation
```typescript
const calculateCompletion = (nodes: ReleaseNode[]): number => {
  let totalTasks = 0;
  let completedTasks = 0;
  
  const countTasks = (nodeList: ReleaseNode[]) => {
    nodeList.forEach(node => {
      if (node.type === 'task') {
        totalTasks++;
        if (['released', 'ready-for-release'].includes(node.properties.status)) {
          completedTasks++;
        }
      }
      if (node.children) {
        countTasks(node.children);
      }
    });
  };
  
  countTasks(nodes);
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
};
```

#### Search Algorithm
```typescript
const filterReleases = (releases: Release[], query: string, category: string) => {
  return releases.filter(release => {
    const matchesSearch = [
      release.name,
      release.version,
      release.description,
      ...release.tags
    ].some(field => 
      field.toLowerCase().includes(query.toLowerCase())
    );
    
    const matchesCategory = category === 'all' || release.category === category;
    
    return matchesSearch && matchesCategory;
  });
};
```

### 7. Performance Requirements

#### Rendering Optimization
- **Large Lists**: Virtualize catalogue when >100 releases
- **Canvas**: Efficient SVG rendering for connection lines
- **Drag Operations**: Debounce at 16ms for smooth interactions
- **Search**: Debounce at 300ms to prevent excessive filtering

#### Memory Management
- **Deep Trees**: Limit nesting to 5 levels for performance
- **Node Count**: Optimize for up to 1000 nodes per release
- **State Updates**: Batch related updates to prevent render thrashing

### 8. Validation Rules

#### Data Validation
```typescript
// Version format validation
const versionRegex = /^\d+\.\d+\.\d+$/;

// Required fields
const requiredFields = {
  release: ['name', 'version'],
  node: ['title'],
  save: ['name', 'version', 'description']
};

// Business rules
const businessRules = {
  maxTitleLength: 50,
  maxDescriptionLength: 500,
  maxTagsPerNode: 10,
  maxDependenciesPerNode: 5
};
```

#### User Input Sanitization
- **XSS Prevention**: Sanitize all text inputs
- **SQL Injection**: Escape special characters
- **File Uploads**: Validate file types and sizes
- **URL Validation**: Check external link formats

### 9. Error Handling Strategy

#### User-Facing Errors
```typescript
const errorMessages = {
  'SAVE_FAILED': 'Failed to save release. Please try again.',
  'INVALID_VERSION': 'Version must follow semantic versioning (e.g., 1.0.0)',
  'EMPTY_TITLE': 'Node title cannot be empty',
  'CIRCULAR_DEPENDENCY': 'Cannot create circular dependencies',
  'MAX_NESTING': 'Maximum nesting level reached (5 levels)',
  'NETWORK_ERROR': 'Network error. Changes saved locally.'
};
```

#### Recovery Mechanisms
- **Auto-save**: Save to localStorage every 30 seconds
- **Conflict Resolution**: Merge conflicting changes intelligently
- **Rollback**: Undo/redo for destructive operations
- **Backup**: Export before major operations

### 10. Integration Specifications

#### API Contract (Future)
```typescript
interface ReleaseAPI {
  // CRUD operations
  getReleases(): Promise<Release[]>;
  getRelease(id: string): Promise<Release>;
  createRelease(release: Omit<Release, 'id'>): Promise<Release>;
  updateRelease(id: string, release: Partial<Release>): Promise<Release>;
  deleteRelease(id: string): Promise<void>;
  
  // Collaboration
  subscribeToUpdates(releaseId: string, callback: (release: Release) => void): void;
  unsubscribeFromUpdates(releaseId: string): void;
}
```

#### State Synchronization
- **Real-time Updates**: WebSocket integration for live collaboration
- **Conflict Resolution**: Last-write-wins with merge notifications
- **Offline Support**: Queue operations when network unavailable
- **Data Consistency**: Optimistic updates with rollback on failure

This technical specification provides the detailed blueprint for implementing the Release Management Tool with Claude Code CLI. Each section includes specific implementation requirements, code examples, and architectural decisions needed to build a production-ready feature.
