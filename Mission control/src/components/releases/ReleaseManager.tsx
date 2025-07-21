import React, { useState, useRef } from 'react';
import { 
  Plus, Minus, Lightbulb, Target, Users, FileText, Folder, Trash2, 
  Edit3, Palette, Settings, Heart, Star, Zap, Coffee, Music, 
  Camera, Book, Rocket, Globe, Shield, Diamond, Crown, Gift,
  Save, X, Check, AlertTriangle, Link, User, Calendar, Tag,
  ExternalLink, Info, Clock, Library, Search, Copy, Download,
  Upload, ArrowLeft, Grid, List, Filter, Eye, Edit, FolderOpen,
  GitBranch, Package, Code, Bug, CheckCircle, AlertCircle,
  Play, Pause, RotateCcw, TrendingUp, Layers, Terminal
} from 'lucide-react';
import type { ViewState } from '../../types';

interface ReleaseManagerProps {
  viewState: ViewState;
  onUpdateViewState: (updates: Partial<ViewState>) => void;
}

interface ReleaseNode {
  id: string;
  title: string;
  type: 'release' | 'feature' | 'task';
  color: string;
  icon: string;
  expanded?: boolean;
  properties: {
    version: string;
    assignee: string;
    targetDate: string;
    environment: string;
    description: string;
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: string;
    storyPoints: string;
    dependencies: string[];
    notes: string;
    releaseNotes: string;
  };
  children: ReleaseNode[];
}

interface Release {
  id: string | null;
  name: string;
  version: string;
  description: string;
  category: string;
  tags: string[];
  targetDate: string;
  environment: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  statusHistory?: any[];
  nodeCount?: number;
  completion?: number;
  preview?: {
    centralNode: string;
    branches: string[];
  };
  nodes: ReleaseNode[];
}

export const ReleaseManager: React.FC<ReleaseManagerProps> = ({
  viewState,
  onUpdateViewState,
}) => {
