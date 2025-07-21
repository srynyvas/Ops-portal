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