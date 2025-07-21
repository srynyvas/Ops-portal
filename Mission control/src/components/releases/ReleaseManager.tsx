import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Save, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Rocket, 
  Package, 
  CheckSquare, 
  Calendar, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Eye, 
  Settings, 
  AlertTriangle,
  Lock,
  Unlock,
  Target,
  Users,
  GitBranch,
  Clock,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';

// Types and Interfaces
interface ReleaseNode {
  id: string;
  title: string;
  type: 'release' | 'feature' | 'task';
  color: string;
  icon: string;
  expanded: boolean;
  position?: { x: number; y: number }; // Add position tracking
  properties: {
    version?: string;
    assignee?: string;
    targetDate?: string;
    environment?: string;
    description?: string;
    tags?: string[];
    priority?: string;
    status?: string;
    storyPoints?: string;
    dependencies?: string[];
    notes?: string;
    releaseNotes?: string;
  };
  children: ReleaseNode[];
}

interface Release {
  id: string;
  name: string;
  version?: string;
  description: string;
  category: string;
  tags: string[];
  targetDate?: string;
  environment?: string;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closeReason?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    reason?: string;
  }>;
  nodes: ReleaseNode[];
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// Viewport and Canvas Management
interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  lastMousePos: { x: number; y: number };
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket size={16} />,
  Package: <Package size={16} />,
  CheckSquare: <CheckSquare size={16} />,
  Target: <Target size={16} />,
  Users: <Users size={16} />,
  GitBranch: <GitBranch size={16} />,
  Clock: <Clock size={16} />
};

// Configuration constants
const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 40;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

// Sample data constants
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'web', name: 'Web Application' },
  { id: 'mobile', name: 'Mobile App' },
  { id: 'api', name: 'API/Backend' },
  { id: 'infrastructure', name: 'Infrastructure' },
  { id: 'security', name: 'Security' },
  { id: 'feature', name: 'Feature Release' },
  { id: 'hotfix', name: 'Hotfix' },
  { id: 'maintenance', name: 'Maintenance' }
];

const environments = [
  { id: 'development', name: 'Development' },
  { id: 'staging', name: 'Staging' },
  { id: 'production', name: 'Production' },
  { id: 'testing', name: 'Testing' }
];

const priorities = [
  { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
  { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800' }
];

const statuses = [
  { id: 'planning', name: 'Planning', color: 'bg-blue-100 text-blue-800' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { id: 'review', name: 'Review', color: 'bg-orange-100 text-orange-800' },
  { id: 'testing', name: 'Testing', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'completed', name: 'Completed', color: 'bg-green-100 text-green-800' },
  { id: 'blocked', name: 'Blocked', color: 'bg-red-100 text-red-800' }
];

const defaultColors = [
  'bg-purple-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 
  'bg-red-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600'
];

const defaultIcons = ['Rocket', 'Package', 'CheckSquare', 'Target', 'Users', 'GitBranch', 'Clock'];

const ReleaseManager: React.FC = () => {
  // State management
  const [currentView, setCurrentView] = useState<'catalogue' | 'editor'>('catalogue');
  const [catalogueViewMode, setCatalogueViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [releases, setReleases] = useState<Release[]>([]);
  
  // Viewport state for mind map
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    lastMousePos: { x: 0, y: 0 }
  });