# Claude CLI Setup Instructions for Enterprise Developer Portal

This file contains the exact Claude Code CLI commands to generate the Enterprise Developer Portal locally.

## Prerequisites

- Node.js (v18+)
- Claude Code CLI installed and authenticated
- React project with Vite + TypeScript + Tailwind CSS setup

## Quick Setup Commands

Execute these commands in your project directory **one by one** in the exact order shown:

### 1. Install Dependencies

```bash
claude "Install lucide-react and any other dependencies needed for an Enterprise Developer Portal with React, TypeScript, and Tailwind CSS. Provide the exact npm install command."
```

### 2. Create Main Portal Component

```bash
claude "Create src/components/EnterpriseDevPortal.tsx with a complete Enterprise Developer Portal including Dashboard, Release Management, Service Catalog, CI/CD Pipelines, Monitoring, Documentation, Teams, and Incidents sections. Use lucide-react icons and Tailwind CSS styling. Make it fully functional with collapsible sidebar, search, notifications, and responsive design."
```

### 3. Update App Component

```bash
claude "Update src/App.tsx to render the EnterpriseDevPortal component as the main application. Remove all default Vite content and ensure proper full-screen layout."
```

### 4. Update Styles

```bash
claude "Update src/index.css with Tailwind directives and any additional styles needed for the Enterprise Developer Portal. Include proper reset styles and full-height styling."
```

### 5. Update HTML Template

```bash
claude "Update public/index.html with proper title 'Enterprise Developer Portal' and meta tags for responsive design."
```

## Detailed Setup Commands (Alternative)

If you prefer more detailed control, use these comprehensive commands:

### 1. Dependencies (Detailed)

```bash
claude "Install the required dependencies for an Enterprise Developer Portal React project. I need:
- lucide-react for icons
- Any other dependencies needed for a professional enterprise portal
Provide the exact npm install command and verify all dependencies are compatible."
```

### 2. Main Component (Comprehensive)

```bash
claude "Create a comprehensive Enterprise Developer Portal component in src/components/EnterpriseDevPortal.tsx. Requirements:

FEATURES TO INCLUDE:
- Collapsible sidebar navigation with 8 main sections: Dashboard, Release Management, Service Catalog, CI/CD Pipelines, Monitoring, Documentation, Teams, Incidents
- Dashboard with 4 metric cards, deployment activity, system health monitoring
- Release Management with active/completed/upcoming release stats and progress tracking
- Service Catalog with microservices, APIs, infrastructure categories and health status
- CI/CD Pipelines with running/succeeded/failed/queued status and recent pipeline runs
- Monitoring with system alerts, response times, error rates
- Documentation with API docs, developer guides, best practices sections
- Teams section with two sub-pages: Team Overview (team cards with leads and members) and Access Management (user roles, permissions, pending requests)
- Incidents with open/resolved stats and active incident tracking

TECHNICAL REQUIREMENTS:
- Use React with TypeScript and proper type definitions
- Use lucide-react for all icons (Home, Rocket, Database, GitBranch, Activity, Book, Users, AlertTriangle, etc.)
- Use Tailwind CSS for all styling with professional design
- Implement collapsible sidebar with menu button and smooth transitions
- Add functional search bar in top navigation
- Include notification bell with count badge
- Use useState for state management
- Make fully responsive for mobile and desktop
- Include hover effects, transitions, and loading states
- Use professional color scheme (blue primary, green success, orange warning, red error)
- Add proper accessibility attributes

SPECIFIC COMPONENTS:
- Sidebar with user profile at bottom
- Top bar with page title, search, notifications, user avatar
- Metric cards with icons and trend indicators
- Progress bars and status indicators
- Interactive buttons and navigation
- Modal-ready components for future enhancements

Please create the complete, fully functional component."
```

### 3. Additional Files

```bash
claude "Create supporting files for the Enterprise Developer Portal:
1. src/types/index.ts with TypeScript interfaces for all data structures
2. src/utils/index.ts with utility functions for formatting and calculations
3. src/data/mockData.ts with comprehensive sample data
4. Update .gitignore if needed
Ensure all imports and exports are properly configured."
```

### 4. Documentation

```bash
claude "Create comprehensive README.md for the Enterprise Developer Portal:
- Project overview and feature list
- Installation and setup instructions
- How to run development server
- Project structure explanation
- Technologies used (React, TypeScript, Tailwind, Lucide React)
- Available scripts and commands
- Contributing guidelines"
```

## Verification Steps

After running the commands above:

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Open Browser:**
   Navigate to `http://localhost:5173`

3. **Test All Features:**
   - [ ] Sidebar collapses and expands with menu button
   - [ ] All 8 navigation sections load correctly
   - [ ] Dashboard shows metrics, activity, and health monitoring
   - [ ] Release Management displays stats and current releases
   - [ ] Service Catalog shows categorized services with status
   - [ ] CI/CD Pipelines display status overview and recent runs
   - [ ] Monitoring shows alerts and performance metrics
   - [ ] Documentation displays categories and recent updates
   - [ ] Teams section has both "Team Overview" and "Access Management" tabs
   - [ ] Incidents section shows stats and active incidents
   - [ ] Search bar is present in top navigation
   - [ ] Notification bell shows count badge
   - [ ] Responsive design works on mobile and desktop
   - [ ] All icons display correctly
   - [ ] Hover effects and transitions work smoothly

## Troubleshooting Commands

If you encounter issues, use these diagnostic commands:

### Dependency Issues
```bash
claude "I'm getting dependency errors in my Enterprise Developer Portal. Here's the error: [paste error]. Please help me resolve this and provide the correct installation commands."
```

### Component Issues
```bash
claude "The EnterpriseDevPortal component has issues. Error: [paste error]. Please review and fix the component code."
```

### Styling Issues
```bash
claude "The styling in my Enterprise Developer Portal isn't working correctly. Issue: [describe issue]. Please fix the CSS/Tailwind configuration."
```

### TypeScript Issues
```bash
claude "I'm getting TypeScript errors: [paste errors]. Please provide fixes and ensure proper type definitions."
```

## Build for Production

When ready for production:

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## Additional Enhancements

After the basic portal is working, you can enhance it with:

### Authentication
```bash
claude "Add user authentication to the Enterprise Developer Portal with login/logout functionality and protected routes."
```

### API Integration
```bash
claude "Add REST API integration to fetch real data instead of mock data for the Enterprise Developer Portal."
```

### State Management
```bash
claude "Add Redux Toolkit or Zustand for global state management in the Enterprise Developer Portal."
```

### Testing
```bash
claude "Add Jest and React Testing Library tests for the Enterprise Developer Portal components."
```

## Expected Project Structure

After completion, your project should have:

```
project-root/
├── src/
│   ├── components/
│   │   ├── EnterpriseDevPortal.tsx
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── index.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Notes

- Execute commands one at a time and wait for completion
- Review the generated code before proceeding to the next step
- Save your progress frequently with git commits
- The portal should match the functionality shown in the original repository

## Success Criteria

✅ Portal loads without errors  
✅ All 8 sections are accessible and functional  
✅ Sidebar toggles properly  
✅ Teams section has both Overview and Access Management  
✅ Responsive design works on all screen sizes  
✅ All icons and styling display correctly  
✅ No console errors or warnings  

---

**Repository:** [Enterprise Developer Portal](https://github.com/srynyvas/Ops-portal/tree/main/UI)  
**Generated with:** Claude Code CLI  
**Last Updated:** August 2025