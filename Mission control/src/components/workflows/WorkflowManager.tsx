import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  Clock,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import type { ViewState } from '../../types';

interface WorkflowManagerProps {
  viewState: ViewState;
  onUpdateViewState: (updates: Partial<ViewState>) => void;
}

interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  type: 'central' | 'branch' | 'leaf';
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  author: string;
  collaborators: string[];
  tags: string[];
  nodeCount: number;
  favorite: boolean;
}

const MOCK_WORKFLOWS: WorkflowItem[] = [
  {
    id: '1',
    title: 'User Onboarding Process',
    description: 'Complete workflow for new user registration and setup',
    type: 'central',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    author: 'Alice Johnson',
    collaborators: ['Bob Smith', 'Carol Davis'],
    tags: ['onboarding', 'users', 'automation'],
    nodeCount: 24,
    favorite: true,
  },
  {
    id: '2',
    title: 'Product Release Pipeline',
    description: 'End-to-end release process from development to production',
    type: 'central',
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    author: 'Bob Smith',
    collaborators: ['Alice Johnson', 'David Wilson'],
    tags: ['release', 'pipeline', 'deployment'],
    nodeCount: 18,
    favorite: false,
  },
  {
    id: '3',
    title: 'Customer Support Workflow',
    description: 'Standard operating procedures for customer support team',
    type: 'branch',
    status: 'draft',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    author: 'Carol Davis',
    collaborators: ['Eve Brown'],
    tags: ['support', 'customer', 'sop'],
    nodeCount: 12,
    favorite: false,
  },
];

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  viewState,
  onUpdateViewState,
}) => {
  const [searchQuery, setSearchQuery] = useState(viewState.searchQuery);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onUpdateViewState({ searchQuery: query });
  };

  const toggleWorkflowSelection = (workflowId: string) => {
    setSelectedWorkflows(prev =>
      prev.includes(workflowId)
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  const renderWorkflowCard = (workflow: WorkflowItem) => (
    <div key={workflow.id} className="card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{workflow.title}</h3>
            {workflow.favorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {workflow.nodeCount} nodes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Updated {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
              {workflow.status}
            </span>
            {workflow.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              by {workflow.author}
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded" title="View">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="Copy">
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded" title="More options">
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowList = (workflow: WorkflowItem) => (
    <div key={workflow.id} className="card p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={selectedWorkflows.includes(workflow.id)}
          onChange={() => toggleWorkflowSelection(workflow.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        
        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{workflow.title}</h3>
              {workflow.favorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            </div>
            <p className="text-sm text-gray-500 truncate">{workflow.description}</p>
          </div>
          
          <div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
              {workflow.status}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            {workflow.nodeCount} nodes
          </div>
          
          <div className="text-sm text-gray-600">
            {workflow.author}
          </div>
          
          <div className="text-sm text-gray-500">
            {new Date(workflow.updatedAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded" title="View">
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" title="More options">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600">Create and manage mind map workflows</p>
        </div>
        
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Workflow
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 input"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
        
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => onUpdateViewState({ viewMode: 'grid' })}
            className={`p-2 ${viewState.viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onUpdateViewState({ viewMode: 'list' })}
            className={`p-2 ${viewState.viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="input text-sm">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <select className="input text-sm">
                <option value="">All Authors</option>
                <option value="alice">Alice Johnson</option>
                <option value="bob">Bob Smith</option>
                <option value="carol">Carol Davis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select className="input text-sm">
                <option value="">All Types</option>
                <option value="central">Central</option>
                <option value="branch">Branch</option>
                <option value="leaf">Leaf</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input type="text" placeholder="Filter by tags..." className="input text-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {selectedWorkflows.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedWorkflows.length} workflow{selectedWorkflows.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800">Export</button>
              <button className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        )}

        {viewState.viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_WORKFLOWS.map(renderWorkflowCard)}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="card p-3 bg-gray-50">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                <div>Name</div>
                <div>Status</div>
                <div>Nodes</div>
                <div>Author</div>
                <div>Updated</div>
              </div>
            </div>
            {MOCK_WORKFLOWS.map(renderWorkflowList)}
          </div>
        )}
      </div>

      {/* Empty State */}
      {MOCK_WORKFLOWS.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗂️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first workflow</p>
          <button className="btn btn-primary">Create Your First Workflow</button>
        </div>
      )}
    </div>
  );
};
