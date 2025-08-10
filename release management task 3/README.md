# Claude Code CLI Instructions: Release Management Feature

## Project Overview
Develop a comprehensive Release Management Tool with complete workflow-based UI functionality. This tool will be integrated into the Releases section with full CRUD operations, visual workflow editor, and advanced project management capabilities.

## File Structure & Development Plan

Create the following files with complete functionality in this folder:

### 1. Main Component File
**File: `src/components/releases/ReleaseManagementTool.tsx`**

**Requirements:**
- Complete release management workflow UI matching the provided specification
- Dual view system: Catalogue view + Visual editor view
- Full CRUD operations for releases, features, and tasks
- Drag-and-drop functionality for node reorganization
- Real-time editing capabilities with inline title editing
- Status tracking and lifecycle management (close/reopen functionality)
- Search, filter, and categorization features
- Modal dialogs for save, close, reopen operations
- Customization panels for visual styling and properties
- Progress tracking and completion calculations
- Support for hierarchical structure: Release → Features → Tasks
- Export the exact functionality from the provided code specification

### 2. Type Definitions
**File: `src/types/release.types.ts`**

**Requirements:**
```typescript
// Define comprehensive TypeScript interfaces for:

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

export interface SaveFormData {
  name: string;
  version: string;
  description: string;
  category: CategoryType;
  tags: string[];
  targetDate: string;
  environment: EnvironmentType;
}

export interface PreviewData {
  centralNode: string;
  branches: string[];
}
```

### 3. Custom Hooks
**File: `src/hooks/useReleaseManagement.ts`**

**Requirements:**
- Custom hook for release state management
- Functions for CRUD operations (create, read, update, delete)
- Node manipulation utilities (add, remove, update, move between parents)
- Completion calculation logic based on task completion status
- Search and filter utilities with real-time filtering
- Export all the state management logic from the main component
- Handle drag-and-drop state management
- Manage modal states and form data

### 4. Utility Functions
**File: `src/utils/releaseUtils.ts`**

**Requirements:**
```typescript
// Implement utility functions:

export const findNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode | null => {
  // Recursively find node by ID in tree structure
};

export const updateNodeById = (nodes: ReleaseNode[], id: string, updates: Partial<ReleaseNode>): ReleaseNode[] => {
  // Update specific node while maintaining tree structure
};

export const removeNodeById = (nodes: ReleaseNode[], id: string): ReleaseNode[] => {
  // Remove node and all its children from tree
};

export const addNodeToParent = (nodes: ReleaseNode[], parentId: string, newNode: ReleaseNode): ReleaseNode[] => {
  // Add new node as child to specified parent
};

export const countTotalNodes = (nodes: ReleaseNode[]): number => {
  // Count all nodes in tree recursively
};

export const countTotalChildren = (node: ReleaseNode): number => {
  // Count all descendants of a specific node
};

export const calculateCompletion = (nodes: ReleaseNode[]): number => {
  // Calculate completion percentage based on task status
  // Count tasks with status 'released' or 'ready-for-release' as complete
};

export const generatePreview = (nodes: ReleaseNode[]): PreviewData => {
  // Generate preview data for catalogue cards
};

export const incrementVersion = (version: string): string => {
  // Increment patch version for duplication
};
```

### 5. Constants and Configuration
**File: `src/utils/releaseConstants.ts`**

**Requirements:**
```typescript
// Define all constants:

export const colorOptions = [
  'bg-red-600', 'bg-pink-600', 'bg-purple-600', 'bg-indigo-600',
  'bg-blue-600', 'bg-cyan-600', 'bg-teal-600', 'bg-green-600',
  'bg-lime-600', 'bg-yellow-600', 'bg-orange-600', 'bg-gray-600',
  'bg-red-400', 'bg-pink-400', 'bg-purple-400', 'bg-indigo-400',
  'bg-blue-400', 'bg-cyan-400', 'bg-teal-400', 'bg-green-400'
];

export const releaseIcons = {
  'Rocket': 'Rocket', 'Package': 'Package', 'GitBranch': 'GitBranch', 'Code': 'Code',
  'Bug': 'Bug', 'Shield': 'Shield', 'Target': 'Target', 'CheckCircle': 'CheckCircle',
  'AlertCircle': 'AlertCircle', 'Play': 'Play', 'Pause': 'Pause', 'RotateCcw': 'RotateCcw',
  'TrendingUp': 'TrendingUp', 'Layers': 'Layers', 'Terminal': 'Terminal', 'Users': 'Users',
  'Zap': 'Zap', 'Star': 'Star'
};

export const categories = [
  { id: 'all', name: 'All Releases', icon: 'FolderOpen' },
  { id: 'major', name: 'Major Release', icon: 'Rocket' },
  { id: 'minor', name: 'Minor Release', icon: 'Package' },
  { id: 'patch', name: 'Patch Release', icon: 'Code' },
  { id: 'hotfix', name: 'Hotfix', icon: 'Bug' },
  { id: 'beta', name: 'Beta Release', icon: 'GitBranch' }
];

export const environments = [
  { id: 'development', name: 'Development', color: 'bg-blue-100 text-blue-800' },
  { id: 'staging', name: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'production', name: 'Production', color: 'bg-green-100 text-green-800' }
];

export const priorityColors = {
  'low': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800'
};

export const statusColors = {
  'planning': 'bg-gray-100 text-gray-800',
  'in-development': 'bg-blue-100 text-blue-800',
  'testing': 'bg-purple-100 text-purple-800',
  'ready-for-release': 'bg-green-100 text-green-800',
  'released': 'bg-emerald-100 text-emerald-800',
  'blocked': 'bg-red-100 text-red-800',
  'on-hold': 'bg-gray-100 text-gray-800'
};
```

### 6. Sub-components

**File: `src/components/releases/CatalogueView.tsx`**
- Header with search and filters (grid/list toggle, category filter, search input)
- Grid and list view rendering with responsive design
- Release cards with progress indicators, status badges, and metadata
- Action buttons (open, duplicate, close) with proper state management
- Empty state handling when no releases found
- Pagination support for large datasets

**File: `src/components/releases/EditorView.tsx`**
- Visual workflow canvas with scrollable area (3000x2000px minimum)
- SVG connection lines between parent and child nodes
- Node rendering with drag-and-drop functionality
- Editor controls and navigation (back to catalogue, save button)
- Header with release information and status indicators
- Empty state for when no nodes exist

**File: `src/components/releases/NodeComponent.tsx`**
- Individual node rendering with appropriate sizing (release: 64x40, feature: 52x32, task: 44x28)
- Inline editing functionality with click-to-edit titles
- Property indicators (priority, status, assignee, dates, tags, dependencies)
- Control buttons (customize, expand/collapse, add child, delete)
- Drag-and-drop handlers with visual feedback
- Conditional rendering based on node type and properties

**File: `src/components/releases/CustomizationPanel.tsx`**
- Visual customization tab (colors in 8-column grid, icons in 6-column grid, node types)
- Properties tab with comprehensive form fields:
  * Version (for releases only)
  * Assignee (text input)
  * Description (textarea)
  * Priority (dropdown: low, medium, high, critical)
  * Status (dropdown: planning, in-development, testing, ready-for-release, released, blocked, on-hold)
  * Story Points (number input)
  * Target Date (date input)
  * Environment (dropdown: development, staging, production)
  * Tags (add/remove with Enter key support)
  * Dependencies (add/remove with Enter key support)
  * Release Notes (for releases only, textarea)
  * Notes (textarea)
- Tab navigation between Visual and Properties
- Real-time updates to node appearance and data

**File: `src/components/releases/Dialogs.tsx`**
- Save dialog with form fields (name, version, description, category, environment, target date)
- Close dialog with required reason input and confirmation
- Reopen dialog with required reason input for closed releases
- Delete confirmation with warning about child items
- All modals with proper overlay, escape key handling, and validation

### 7. Sample Data
**File: `src/data/sampleReleases.ts`**

**Requirements:**
```typescript
// Include comprehensive sample data:
- At least 2 sample releases with different statuses (active, closed)
- Complete node hierarchies with releases, features, and tasks
- Realistic metadata (dates, assignees, tags, descriptions)
- Progress calculations and status history
- Variety of node types and properties
```

## Implementation Instructions

### Phase 1: Core Setup (Priority 1)
1. Set up the basic component structure with TypeScript
2. Implement all type definitions comprehensively
3. Create utility functions with proper error handling
4. Set up state management hooks with all CRUD operations

### Phase 2: Catalogue View (Priority 1)
1. Implement release listing with both grid and list views
2. Add search functionality with real-time filtering
3. Add category filtering with visual indicators
4. Create release cards with complete metadata display
5. Implement CRUD operations (create, duplicate, close, reopen)
6. Add progress bars and completion indicators

### Phase 3: Visual Editor (Priority 1)
1. Build the canvas component with SVG connection lines
2. Implement node rendering with proper sizing and styling
3. Add drag-and-drop functionality with validation (no task-to-task drops)
4. Implement inline editing with escape/enter key handling
5. Create node hierarchy management (add child, delete with confirmation)
6. Add visual feedback for drag operations

### Phase 4: Customization & Properties (Priority 2)
1. Build the customization panel with tabbed interface
2. Implement visual styling options (colors, icons, node types)
3. Add comprehensive property management with all form fields
4. Create tag and dependency systems with add/remove functionality
5. Add real-time preview of changes
6. Implement validation for required fields

### Phase 5: Advanced Features (Priority 2)
1. Implement progress tracking and completion calculations
2. Add status history and lifecycle management
3. Create modal dialogs with proper validation and error handling
4. Add real-time updates and state persistence in localStorage
5. Implement empty states and loading indicators
6. Add keyboard shortcuts and accessibility features

### Phase 6: Polish & Integration (Priority 3)
1. Add animations and transitions for better UX
2. Implement responsive design for mobile devices
3. Add export/import functionality for releases
4. Create comprehensive error handling and user feedback
5. Add tooltips and help text for complex features
6. Optimize performance for large datasets

## Dependencies Required

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.0"
  }
}
```

## Integration Points

### Main App Integration
**File: `src/App.tsx`**
```typescript
// Add route for releases section
import ReleaseManagementTool from './components/releases/ReleaseManagementTool';

// Add to your routing configuration:
<Route path="/releases" component={ReleaseManagementTool} />
```

### Navigation Integration
Add "Releases" section to your main navigation menu with link to `/releases`

## Specific Implementation Requirements

### Drag-and-Drop Implementation
- Use native HTML5 drag-and-drop API with proper event handling
- Implement visual feedback for valid drop targets (yellow ring)
- Prevent invalid drops (tasks cannot accept children)
- Update parent-child relationships correctly in state
- Provide visual drag indicator with dragged item name

### Node Editing System
- Click-to-edit node titles with input field replacement
- Handle escape key (cancel) and enter key (save) properly
- Auto-save on blur/focus loss with validation
- Visual feedback during editing state (different background)
- Prevent empty titles with validation

### Progress Calculation Algorithm
- Count completed tasks vs total tasks across entire tree
- Support multiple completion criteria (released, ready-for-release statuses)
- Real-time updates when status changes anywhere in hierarchy
- Visual progress bars in catalogue with percentage display
- Accurate calculation even with deeply nested structures

### Search and Filter Logic
- Search across: name, version, description, tags, assignee names
- Filter by: category, status, environment with multi-select capability
- Real-time filtering with debouncing (300ms delay)
- Clear visual indicators for active filters
- Preserve scroll position when filters change

### State Management Pattern
- Use useReducer for complex state operations
- Implement optimistic updates for better UX
- Handle undo/redo functionality for major operations
- Persist state to localStorage with proper serialization
- Handle state migration for schema changes

## Data Persistence Requirements

1. **Local State Management**: Implement useState/useReducer for all real-time updates
2. **LocalStorage Persistence**: Auto-save releases to localStorage every 30 seconds
3. **Sample Data**: Include realistic sample releases for immediate testing
4. **Future API Integration**: Structure code to easily connect to REST/GraphQL APIs
5. **Export/Import**: Prepare JSON export/import functionality for data portability

## Testing Requirements

### Unit Testing
1. **Utility Functions**: Test all tree manipulation functions thoroughly
2. **State Management**: Verify CRUD operations maintain data integrity
3. **Calculations**: Test progress calculation with various scenarios
4. **Search/Filter**: Test filtering logic with edge cases

### Integration Testing
1. **Drag-and-Drop**: Test node movement and hierarchy validation
2. **Modal Workflows**: Test complete save/close/reopen flows
3. **Data Persistence**: Test localStorage integration
4. **UI Interactions**: Test responsive design and modal interactions

### User Acceptance Testing
1. **Workflow Completion**: User can create, edit, and manage releases end-to-end
2. **Data Integrity**: No data loss during operations
3. **Performance**: Smooth operation with 100+ nodes
4. **Accessibility**: Keyboard navigation and screen reader support

## Error Handling Strategy

### User Input Validation
- Required field validation with clear error messages
- Date validation (target dates cannot be in the past)
- Version format validation (semantic versioning)
- Title length limits and special character handling

### Operation Error Handling
- Graceful handling of failed drag-and-drop operations
- Recovery from localStorage corruption
- Network error handling for future API integration
- Fallback UI states for loading and error conditions

### Data Integrity Protection
- Prevent deletion of nodes with children without confirmation
- Validate parent-child relationships during moves
- Protect against circular references in dependencies
- Automatic backup before destructive operations

## Performance Optimization

### Rendering Optimization
- Implement React.memo for expensive components
- Use useCallback and useMemo for complex calculations
- Virtualize large lists in catalogue view
- Optimize SVG rendering for connection lines

### State Management Optimization
- Debounce search input to prevent excessive filtering
- Lazy load node properties to reduce initial render time
- Implement efficient tree traversal algorithms
- Cache calculation results where appropriate

## Accessibility Requirements

### Keyboard Navigation
- Full keyboard navigation support for all interactive elements
- Tab order follows logical flow through interface
- Escape key closes modals and cancels operations
- Enter key confirms actions and saves edits

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Semantic HTML structure with proper headings
- Alt text for all icons and visual indicators
- Screen reader announcements for state changes

### Visual Accessibility
- High contrast mode support
- Scalable text and interface elements
- Color-blind friendly color schemes
- Focus indicators for all interactive elements

## Success Criteria

The completed feature must:

### Functional Requirements
1. **Replicate 100% of the provided functionality** without any missing features
2. **Handle all user interactions** smoothly with proper feedback
3. **Maintain data integrity** across all operations
4. **Support complex hierarchies** with unlimited nesting depth
5. **Provide real-time updates** for all changes

### Technical Requirements
1. **Follow React best practices** and TypeScript standards
2. **Be fully type-safe** with comprehensive TypeScript coverage
3. **Handle edge cases** gracefully with proper error handling
4. **Be performance optimized** for large datasets
5. **Support future enhancements** with extensible architecture

### User Experience Requirements
1. **Be intuitive and easy to use** for non-technical users
2. **Provide clear visual feedback** for all operations
3. **Support efficient workflows** with keyboard shortcuts
4. **Be responsive** across all device sizes
5. **Be accessible** to users with disabilities

### Integration Requirements
1. **Be ready for production deployment** with proper testing
2. **Support API integration** with minimal refactoring
3. **Follow existing codebase patterns** and conventions
4. **Be maintainable** with clear documentation and comments
5. **Be extensible** for future feature additions

## Deployment Checklist

- [ ] All TypeScript interfaces defined and exported
- [ ] Complete ReleaseManagementTool component implemented
- [ ] All sub-components created and integrated
- [ ] Utility functions implemented and tested
- [ ] Sample data included for testing
- [ ] Error handling implemented throughout
- [ ] Responsive design verified across devices
- [ ] Accessibility features implemented
- [ ] Performance optimizations applied
- [ ] Integration points documented
- [ ] Code documented with comprehensive comments
- [ ] All success criteria verified
- [ ] Ready for code review and testing

Execute this plan methodically, ensuring each phase is complete and tested before moving to the next. Maintain clean, well-documented code throughout the development process, and test thoroughly at each stage to ensure the final product meets all requirements and success criteria.
