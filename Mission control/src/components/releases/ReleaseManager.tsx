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