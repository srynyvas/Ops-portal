import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Target,
  Package,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  GitBranch,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Play
} from 'lucide-react';
import type { ViewState } from '../../types';

interface ReleaseManagerProps {
  viewState: ViewState;
  onUpdateViewState: (updates: Partial<ViewState>) => void;
}

interface ReleaseItem {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'staging' | 'production' | 'completed';
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  progress: number;
  startDate: string;
  targetDate: string;
  owner: string;
  team: string;
  features: number;
  tasks: number;
  completedTasks: number;
  environment: 'development' | 'staging' | 'production';
}

const MOCK_RELEASES: ReleaseItem[] = [
  {
    id: '1',
    name: 'User Dashboard Redesign',
    version: '2.1.0',
    description: 'Complete redesign of the user dashboard with new analytics and improved UX',
    status: 'development',
    type: 'minor',
    progress: 65,
    startDate: '2024-01-01',
    targetDate: '2024-02-15',
    owner: 'Alice Johnson',
    team: 'Frontend Team',
    features: 8,
    tasks: 24,
    completedTasks: 16,
    environment: 'development',
  },
  {
    id: '2',
    name: 'API Security Enhancement',
    version: '1.5.3',
    description: 'Critical security updates and authentication improvements',
    status: 'staging',
    type: 'patch',
    progress: 90,
    startDate: '2024-01-10',
    targetDate: '2024-01-25',
    owner: 'Bob Smith',
    team: 'Backend Team',
    features: 3,
    tasks: 12,
    completedTasks: 11,
    environment: 'staging',
  },
  {
    id: '3',
    name: 'Mobile App Launch',
    version: '3.0.0',
    description: 'First version of our mobile application with core features',
    status: 'planning',
    type: 'major',
    progress: 15,
    startDate: '2024-02-01',
    targetDate: '2024-06-30',
    owner: 'Carol Davis',
    team: 'Mobile Team',
    features: 15,
    tasks: 45,
    completedTasks: 7,
    environment: 'development',
  },
];

export const ReleaseManager: React.FC<ReleaseManagerProps> = ({
  viewState,
  onUpdateViewState,
}) => {
  const [searchQuery, setSearchQuery] = useState(viewState.searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'staging':
        return 'bg-orange-100 text-orange-800';
      case 'production':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-red-100 text-red-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      case 'patch':
        return 'bg-green-100 text-green-800';
      case 'hotfix':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Calendar className="h-4 w-4" />;
      case 'development':
        return <GitBranch className="h-4 w-4" />;
      case 'testing':
        return <Target className="h-4 w-4" />;
      case 'staging':
        return <Clock className="h-4 w-4" />;
      case 'production':
        return <Package className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onUpdateViewState({ searchQuery: query });
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderReleaseCard = (release: ReleaseItem) => {
    const daysRemaining = getDaysRemaining(release.targetDate);
    const StatusIcon = () => getStatusIcon(release.status);

    return (
      <div key={release.id} className="card p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{release.name}</h3>
              <span className="text-sm text-gray-500">v{release.version}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{release.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <StatusIcon />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(release.status)}`}>
              {release.status}
            </span>
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(release.type)}`}>
            {release.type}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{release.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${release.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Features:</span>
            <span className="ml-1 font-medium">{release.features}</span>
          </div>
          <div>
            <span className="text-gray-500">Tasks:</span>
            <span className="ml-1 font-medium">{release.completedTasks}/{release.tasks}</span>
          </div>
          <div>
            <span className="text-gray-500">Owner:</span>
            <span className="ml-1 font-medium">{release.owner}</span>
          </div>
          <div>
            <span className="text-gray-500">Team:</span>
            <span className="ml-1 font-medium">{release.team}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Target: {new Date(release.targetDate).toLocaleDateString()}
          </div>
          <div className={`text-sm font-medium ${
            daysRemaining < 0 ? 'text-red-600' : 
            daysRemaining < 7 ? 'text-orange-600' : 'text-green-600'
          }`}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
             daysRemaining === 0 ? 'Due today' :
             `${daysRemaining} days remaining`}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Releases</h1>
          <p className="text-gray-600">Plan and track your software releases</p>
        </div>
        
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Release
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Releases</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Development</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <GitBranch className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ready for Deploy</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg. Cycle Time</p>
              <p className="text-2xl font-bold text-gray-900">14d</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search releases..."
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
        
        <select className="input text-sm w-auto">
          <option>Sort by: Target Date</option>
          <option>Sort by: Progress</option>
          <option>Sort by: Status</option>
          <option>Sort by: Created Date</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="input text-sm">
                <option value="">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="development">Development</option>
                <option value="testing">Testing</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select className="input text-sm">
                <option value="">All Types</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
                <option value="patch">Patch</option>
                <option value="hotfix">Hotfix</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
              <select className="input text-sm">
                <option value="">All Owners</option>
                <option value="alice">Alice Johnson</option>
                <option value="bob">Bob Smith</option>
                <option value="carol">Carol Davis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
              <select className="input text-sm">
                <option value="">All Teams</option>
                <option value="frontend">Frontend Team</option>
                <option value="backend">Backend Team</option>
                <option value="mobile">Mobile Team</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Releases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_RELEASES.map(renderReleaseCard)}
      </div>

      {/* Empty State */}
      {MOCK_RELEASES.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No releases found</h3>
          <p className="text-gray-600 mb-6">Get started by planning your first release</p>
          <button className="btn btn-primary">Create Your First Release</button>
        </div>
      )}
    </div>
  );
};
