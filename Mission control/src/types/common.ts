export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'deploy' | 'security' | 'info';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'on-hold';
export type Environment = 'development' | 'staging' | 'production';

export interface StatusHistory {
  action: 'created' | 'updated' | 'closed' | 'reopened' | 'assigned';
  reason?: string;
  timestamp: string;
  user: string;
}

export interface SearchFilter {
  query: string;
  category?: string;
  tags?: string[];
  status?: Status[];
  priority?: Priority[];
  assignee?: string;
}

export interface PaginationParams {
  page: number;
  perPage: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationParams;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}