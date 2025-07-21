import { BaseEntity, Priority, Status, StatusHistory, Tag } from './common';

export type NodeType = 'central' | 'branch' | 'leaf';

export interface WorkflowNode {
  id: string;
  title: string;
  type: NodeType;
  color: string;
  icon: string;
  expanded: boolean;
  properties: NodeProperties;
  children: WorkflowNode[];
}

export interface NodeProperties {
  author: string;
  link: string;
  description: string;
  tags: string[];
  priority: Priority;
  status: Status;
  dueDate: string;
  notes: string;
  assignee?: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
  attachments: Attachment[];
  comments: Comment[];
}

export interface Workflow extends BaseEntity {
  name: string;
  description: string;
  category: string;
  tags: string[];
  status: 'active' | 'closed' | 'archived';
  statusHistory: StatusHistory[];
  nodeCount: number;
  owner: string;
  collaborators: string[];
  isPublic: boolean;
  version: string;
  parentWorkflowId?: string;
  preview: WorkflowPreview;
  nodes: WorkflowNode[];
  permissions: WorkflowPermission[];
}

export interface WorkflowPreview {
  centralNode: string;
  branches: string[];
  totalNodes: number;
  completionRate: number;
}

export interface WorkflowPermission {
  userId: string;
  role: 'viewer' | 'editor' | 'admin';
  grantedAt: string;
  grantedBy: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nodeStructure: WorkflowNode[];
  usageCount: number;
  rating: number;
  author: string;
  isOfficial: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  editedAt?: string;
  parentId?: string;
  reactions: Reaction[];
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface WorkflowAnalytics {
  workflowId: string;
  views: number;
  edits: number;
  collaborators: number;
  avgCompletionTime: number;
  popularNodes: string[];
  activityHistory: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  action: 'created' | 'edited' | 'deleted' | 'moved' | 'commented' | 'completed';
  nodeId?: string;
  userId: string;
  timestamp: string;
  details?: object;
}

export interface DragOperation {
  draggedNode: WorkflowNode;
  dropTarget: string;
  isValidDrop: boolean;
  operation: 'move' | 'copy' | 'link';
}

export interface NodeCustomization {
  nodeId: string;
  color: string;
  icon: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'rectangle' | 'rounded' | 'circle' | 'diamond';
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: 'normal' | 'bold';
}

export interface ViewportSettings {
  zoom: number;
  panX: number;
  panY: number;
  centerOnNode?: string;
  showConnections: boolean;
  showMinimap: boolean;
  gridEnabled: boolean;
  snapToGrid: boolean;
}