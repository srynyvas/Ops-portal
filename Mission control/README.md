# Mission Control - Enterprise Operations Portal

## 🚀 Quick Start

### Option 1: Easy Setup (Recommended)
```bash
# For Linux/Mac
chmod +x start-dev.sh
./start-dev.sh

# For Windows
start-dev.bat
```

### Option 2: Manual Setup
```bash
npm install
npm run dev
```

The application will open automatically at `http://localhost:3000`

## ✅ Recent Fixes Applied

### Issue Resolution (July 2025)
**Problem**: Users were seeing a test screen instead of the full Mission Control application.

**Root Cause**: The `index.tsx` file had a fallback mechanism using `require()` that was causing ES6 module import issues.

**Solution Applied**:
1. ✅ **Fixed index.tsx**: Replaced `require()` fallback with proper ES6 imports
2. ✅ **Removed test component**: Cleaned up unused `simple-test.tsx` file  
3. ✅ **Added startup scripts**: Created automated setup scripts for both Windows and Unix
4. ✅ **Verified all imports**: Confirmed all component dependencies exist and are properly exported

**What you should see now**: The full Mission Control dashboard with sidebar navigation, metrics, and all features working.

## Overview

Mission Control is a comprehensive enterprise operations portal that provides a unified interface for managing software releases, monitoring system health, tracking workflows, and coordinating team activities.

## Features

### 🚀 Enterprise Developer Portal
- **System Dashboard**: Real-time monitoring of services, deployments, and system health
- **Service Catalog**: Comprehensive directory of microservices, APIs, and infrastructure
- **CI/CD Pipelines**: Build and deployment status tracking
- **Team Management**: Role-based access control and team coordination
- **Incident Management**: Issue tracking and postmortem documentation
- **Documentation Hub**: Centralized developer guides and API documentation

### 🧠 Workflow Management
- **Mind Map Interface**: Visual workflow planning with drag-and-drop functionality
- **Hierarchical Organization**: Central nodes, branches, and leaf tasks
- **Rich Metadata**: Properties, tags, priorities, and dependencies
- **Workflow Catalog**: Save, version, and share workflow templates
- **Collaborative Editing**: Real-time updates and team collaboration

### 📦 Release Management
- **Release Planning**: Three-tier hierarchy (Release → Feature → Task)
- **Progress Tracking**: Story points, completion percentages, and timelines
- **Environment Management**: Development, staging, and production deployments
- **Dependency Tracking**: Cross-feature and cross-release dependencies
- **Release Notes**: Automated changelog generation
- **Version Control**: Semantic versioning and release branching

## Architecture

```
src/
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── dashboard/       # Enterprise dashboard components
│   ├── workflows/       # Mind map workflow components
│   ├── releases/        # Release management components
│   └── layout/          # Layout and navigation components
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
├── constants/           # Application constants
└── data/               # Mock data and fixtures
```

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser with ES2020 support

### Installation & Development

#### Automated Setup (Recommended)
The easiest way to get started:

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

These scripts will:
- ✅ Check system requirements (Node.js 18+)
- ✅ Install dependencies automatically
- ✅ Create `.env` file from example
- ✅ Run TypeScript type checking
- ✅ Start the development server

#### Manual Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Troubleshooting

#### If you see a test screen instead of the full app:
This issue has been **FIXED** in the latest version. If you still see it:

1. **Pull the latest changes**:
   ```bash
   git pull origin feature/restructuring
   ```

2. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Force refresh browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Check browser console** for any error messages

#### Common Issues:
- **Port 3000 in use**: The server will automatically try ports 3001, 3002, etc.
- **TypeScript errors**: Run `npm run type-check` to see all errors
- **Missing dependencies**: Run `npm install` to ensure all packages are installed
- **Browser compatibility**: Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Development

The application uses:
- **React 18** with TypeScript for component development
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for consistent iconography
- **Vite** for fast development and building
- **ESLint** for code quality and consistency

### Key Concepts

#### Dashboard Navigation
The main navigation supports multiple views:
- Dashboard (overview and metrics)
- Services (catalog and health)
- Pipelines (CI/CD status)
- Monitoring (alerts and performance)
- Documentation (guides and APIs)
- Teams (management and access control)
- Incidents (tracking and resolution)
- Releases (planning and deployment)

#### Workflow Management
Workflows use a hierarchical mind map structure:
- **Central Nodes**: Main objectives or projects
- **Branch Nodes**: Major features or milestones
- **Leaf Nodes**: Individual tasks or deliverables

#### Release Planning
Releases follow a structured hierarchy:
- **Release**: Version-controlled software release
- **Feature**: Major functionality or enhancement
- **Task**: Individual development work items

## Component Guidelines

### Naming Conventions
- Components: PascalCase (`UserCard`, `ReleaseTimeline`)
- Files: kebab-case (`user-card.tsx`, `release-timeline.tsx`)
- Hooks: camelCase with 'use' prefix (`useWorkflowData`, `useReleaseTracking`)
- Types: PascalCase with descriptive names (`WorkflowNode`, `ReleaseMetadata`)

### Component Structure
```tsx
// Component with proper TypeScript typing
interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX
  );
};
```

### Custom Hooks
Extract complex state logic into reusable hooks:
```tsx
export const useWorkflowManagement = () => {
  // State management
  // Business logic
  // Return clean interface
};
```

## Styling Guidelines

### Tailwind Classes
- Use semantic class combinations
- Prefer design tokens from theme extension
- Group related classes logically
- Use responsive prefixes consistently

### Color Palette
- **Primary**: Blue tones for main actions and navigation
- **Secondary**: Purple tones for secondary actions
- **Success**: Green tones for positive states
- **Warning**: Orange/Yellow tones for caution
- **Danger**: Red tones for errors and destructive actions

## Data Management

### State Architecture
- Local component state for UI interactions
- Custom hooks for business logic
- Context API for shared application state
- Optimistic updates for better UX

### Type Safety
All data structures are strongly typed:
```tsx
interface WorkflowNode {
  id: string;
  title: string;
  type: 'central' | 'branch' | 'leaf';
  properties: NodeProperties;
  children: WorkflowNode[];
}
```

## Testing Strategy

### Unit Tests
- Component rendering and behavior
- Hook functionality and state management
- Utility function correctness

### Integration Tests
- User workflow completion
- Component interaction patterns
- Data flow validation

### End-to-End Tests
- Critical user journeys
- Cross-component functionality
- Performance benchmarks

## Performance Considerations

### Optimization Techniques
- React.memo for expensive components
- useMemo and useCallback for expensive calculations
- Virtual scrolling for large datasets
- Lazy loading for route-based code splitting
- Debounced search and filtering

### Bundle Optimization
- Tree shaking for unused code elimination
- Dynamic imports for code splitting
- Optimized asset loading
- Compressed production builds

## Accessibility

### WCAG Compliance
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Interactive Elements
- Focus management
- Keyboard shortcuts
- Touch-friendly targets
- Clear visual feedback

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request with description
5. Code review and approval
6. Merge to main branch

### Code Quality
- Follow TypeScript best practices
- Write comprehensive tests
- Document complex logic
- Use consistent formatting
- Optimize for maintainability

## License

MIT License - see LICENSE file for details.
