# 🚀 Mission Control - Local Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (version 18.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - Optional yarn: `npm install -g yarn`
- **Git** (for cloning the repository)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 1GB free space
- **Internet Connection**: Required for downloading dependencies

## Step-by-Step Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/srynyvas/Ops-portal.git

# Navigate to the project root
cd Ops-portal

# Switch to the feature branch
git checkout feature/restructuring

# Navigate to the Mission Control directory
cd "Mission control"
```

### Step 2: Verify Project Structure

Ensure you see the following structure:
```
Mission control/
├── src/
├── public/
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

### Step 3: Install Dependencies

```bash
# Install all project dependencies
npm install

# This will install:
# - React 18.2.0
# - TypeScript 5.0.2
# - Vite 4.4.5
# - Tailwind CSS 3.3.0
# - Lucide React icons
# - And all other dependencies
```

**Expected Output:**
```
npm WARN deprecated ...
added 1247 packages, and audited 1248 packages in 45s
found 0 vulnerabilities
```

### Step 4: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file (optional for local development)
# You can use any text editor:
nano .env
# or
code .env
# or
vim .env
```

**Default .env contents work for local development**, but you can customize:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_APP_NAME=Mission Control
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### Step 5: Start the Development Server

```bash
# Start the Vite development server
npm run dev
```

**Expected Output:**
```
  VITE v4.4.5  ready in 832 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
  ➜  press h to show help
```

### Step 6: Open the Application

1. **Automatic Browser Opening**: The browser should automatically open to `http://localhost:3000`
2. **Manual Opening**: If not, open your browser and navigate to `http://localhost:3000`
3. **Network Access**: Use the Network URL to access from other devices on your network

### Step 7: Verify Everything Works

You should see:
1. **Loading Screen**: Brief loading animation with "Loading Mission Control..."
2. **Main Application**: Dashboard with:
   - Collapsible sidebar with navigation
   - Header with search bar and user menu
   - Dashboard metrics and activity feed
   - Responsive design that adapts to window size

## Development Workflow

### Available Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check code quality
npm run type-check   # Run TypeScript compiler to check types

# Package Management
npm install          # Install/update dependencies
npm audit            # Check for security vulnerabilities
npm update           # Update packages to latest versions
```

### Hot Reload Development

The development server supports hot module replacement (HMR):
- **File Changes**: Automatically reload when you save files
- **Component Updates**: React components update without losing state
- **Style Changes**: CSS/Tailwind changes apply instantly
- **Type Checking**: TypeScript errors appear in terminal and browser

### Project Navigation

#### Key Directories to Know:
```
src/
├── components/
│   ├── dashboard/     # Dashboard-related components
│   ├── workflows/     # Workflow management components
│   ├── releases/      # Release management components
│   ├── layout/        # Layout components (Header, Sidebar)
│   └── common/        # Reusable UI components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── constants/         # Application constants
└── data/              # Mock data for development
```

#### Key Files to Know:
- `src/App.tsx` - Main application component
- `src/index.tsx` - Application entry point
- `src/index.css` - Global styles and Tailwind imports
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Testing the Application

### Manual Testing Checklist

1. **Navigation**:
   - [ ] Click through all sidebar navigation items
   - [ ] Toggle sidebar collapse/expand
   - [ ] Test responsive behavior by resizing window

2. **Dashboard**:
   - [ ] Verify metrics cards display correctly
   - [ ] Check recent activity feed
   - [ ] Test quick action buttons

3. **Workflows**:
   - [ ] Switch between grid and list views
   - [ ] Test search functionality
   - [ ] Try filtering options

4. **Releases**:
   - [ ] View release cards with progress bars
   - [ ] Test sorting and filtering
   - [ ] Verify responsive layout

5. **Keyboard Shortcuts**:
   - [ ] Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) for search
   - [ ] Press `⌘N` for new workflow
   - [ ] Press `⌘\` to toggle sidebar

## Troubleshooting

### Common Issues and Solutions

#### Issue: `npm install` fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 3000 already in use
```bash
# The server will automatically try ports 3001, 3002, etc.
# Or manually specify a port:
npm run dev -- --port 3001
```

#### Issue: TypeScript errors
```bash
# Run type checking to see all errors
npm run type-check

# Most common fixes:
# 1. Restart your IDE/editor
# 2. Restart the dev server
# 3. Clear TypeScript cache: rm -rf node_modules/.cache
```

#### Issue: Tailwind styles not working
```bash
# Verify Tailwind is properly configured
# Check that these files exist:
# - tailwind.config.js
# - postcss.config.js
# - src/index.css (with @tailwind directives)

# Restart the dev server
npm run dev
```

#### Issue: Browser shows blank page
1. Check browser console for JavaScript errors
2. Verify the development server is running
3. Try hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
4. Check terminal for compilation errors

### Performance Tips

1. **Development Speed**:
   - Use `npm run dev` for fastest hot reload
   - Keep dev tools open for debugging
   - Use TypeScript strict mode for better IntelliSense

2. **Browser Performance**:
   - Use Chrome DevTools for debugging
   - Install React Developer Tools extension
   - Use Redux DevTools if you add state management

3. **VS Code Setup** (Recommended):
   ```json
   // .vscode/settings.json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

## Next Steps

Once you have the application running locally:

1. **Explore the Codebase**:
   - Read through component files to understand the architecture
   - Check type definitions in `src/types/`
   - Review utility functions in `src/utils/`

2. **Customize the Application**:
   - Modify colors in `tailwind.config.js`
   - Update mock data in `src/data/`
   - Add new components following the established patterns

3. **Extend Functionality**:
   - Add new navigation items in `App.tsx`
   - Create additional components for new features
   - Implement API integration for real data

4. **Deploy**:
   - Run `npm run build` to create production build
   - Deploy to platforms like Vercel, Netlify, or your preferred hosting

## Support

If you encounter any issues:

1. **Check the logs**: Look at the terminal output for error messages
2. **Browser console**: Check for JavaScript errors in browser dev tools
3. **Documentation**: Refer to the comprehensive README.md
4. **Dependencies**: Ensure all prerequisites are correctly installed

Your Mission Control application should now be running locally and ready for development! 🚀
