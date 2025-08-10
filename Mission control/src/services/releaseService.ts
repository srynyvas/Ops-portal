import { apiClient } from './apiClient';
import { apiConfig } from '../config/apiConfig';
import { 
  Release, 
  Environment, 
  DeploymentHistory, 
  ReleaseAnalytics,
  ReleaseMetrics,
  TeamMember
} from '../types/release.types';

export interface ReleaseFilters {
  status?: string;
  environment?: string;
  team?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReleaseResponse {
  releases: Release[];
  total: number;
  page: number;
  totalPages: number;
}

class ReleaseService {
  async getReleases(
    filters?: ReleaseFilters, 
    pagination?: PaginationParams
  ): Promise<ReleaseResponse> {
    return apiClient.get<ReleaseResponse>(
      apiConfig.endpoints.releases.list,
      {
        query: {
          ...filters,
          ...pagination,
        },
      }
    );
  }

  async getRelease(id: string): Promise<Release> {
    return apiClient.get<Release>(
      apiConfig.endpoints.releases.get,
      {
        params: { id },
      }
    );
  }

  async createRelease(release: Partial<Release>): Promise<Release> {
    return apiClient.post<Release>(
      apiConfig.endpoints.releases.create,
      release
    );
  }

  async updateRelease(id: string, updates: Partial<Release>): Promise<Release> {
    return apiClient.put<Release>(
      apiConfig.endpoints.releases.update,
      updates,
      {
        params: { id },
      }
    );
  }

  async deleteRelease(id: string): Promise<void> {
    return apiClient.delete<void>(
      apiConfig.endpoints.releases.delete,
      {
        params: { id },
      }
    );
  }

  async deployRelease(
    releaseId: string, 
    environmentId: string,
    options?: {
      skipTests?: boolean;
      autoRollback?: boolean;
      notifyTeam?: boolean;
    }
  ): Promise<Release> {
    return apiClient.post<Release>(
      apiConfig.endpoints.releases.deploy,
      {
        environmentId,
        ...options,
      },
      {
        params: { id: releaseId },
      }
    );
  }

  async rollbackRelease(
    releaseId: string,
    targetVersion?: string
  ): Promise<Release> {
    return apiClient.post<Release>(
      apiConfig.endpoints.releases.rollback,
      {
        targetVersion,
      },
      {
        params: { id: releaseId },
      }
    );
  }

  async approveRelease(
    releaseId: string,
    comments?: string
  ): Promise<Release> {
    return apiClient.post<Release>(
      apiConfig.endpoints.releases.approve,
      {
        comments,
        timestamp: new Date().toISOString(),
      },
      {
        params: { id: releaseId },
      }
    );
  }

  async rejectRelease(
    releaseId: string,
    reason: string
  ): Promise<Release> {
    return apiClient.post<Release>(
      apiConfig.endpoints.releases.reject,
      {
        reason,
        timestamp: new Date().toISOString(),
      },
      {
        params: { id: releaseId },
      }
    );
  }

  async getReleaseMetrics(releaseId: string): Promise<ReleaseMetrics> {
    return apiClient.get<ReleaseMetrics>(
      apiConfig.endpoints.releases.metrics,
      {
        params: { id: releaseId },
      }
    );
  }

  async getReleaseHistory(
    releaseId: string,
    limit?: number
  ): Promise<DeploymentHistory[]> {
    return apiClient.get<DeploymentHistory[]>(
      apiConfig.endpoints.releases.history,
      {
        params: { id: releaseId },
        query: { limit },
      }
    );
  }

  async getReleaseAnalytics(
    dateRange?: { from: string; to: string }
  ): Promise<ReleaseAnalytics> {
    return apiClient.get<ReleaseAnalytics>(
      apiConfig.endpoints.releases.analytics,
      {
        query: dateRange,
      }
    );
  }

  async getEnvironments(): Promise<Environment[]> {
    return apiClient.get<Environment[]>(apiConfig.endpoints.environments.list);
  }

  async getEnvironmentStatus(id: string): Promise<Environment> {
    return apiClient.get<Environment>(
      apiConfig.endpoints.environments.status,
      {
        params: { id },
      }
    );
  }

  async getTeams(): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(apiConfig.endpoints.teams.list);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(
      apiConfig.endpoints.teams.members,
      {
        params: { id: teamId },
      }
    );
  }

  async searchReleases(searchTerm: string): Promise<Release[]> {
    const response = await this.getReleases(
      { search: searchTerm },
      { limit: 10 }
    );
    return response.releases;
  }

  async getUpcomingReleases(days: number = 7): Promise<Release[]> {
    const response = await this.getReleases(
      {
        dateFrom: new Date().toISOString(),
        dateTo: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      },
      { sortBy: 'scheduledDate', sortOrder: 'asc' }
    );
    return response.releases;
  }

  async getPendingApprovals(): Promise<Release[]> {
    const response = await this.getReleases(
      { status: 'pending_approval' }
    );
    return response.releases;
  }

  async getActiveDeployments(): Promise<Release[]> {
    const response = await this.getReleases(
      { status: 'deploying' }
    );
    return response.releases;
  }
}

export const releaseService = new ReleaseService();