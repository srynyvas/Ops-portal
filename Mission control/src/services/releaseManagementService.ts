import { releaseService } from './releaseService';
import {
  Release,
  Feature,
  Task,
  Environment,
  EnvironmentDeployment,
  Approval,
  RiskAssessment,
  ReleaseAnalytics,
  User,
  Team,
  ReleaseStatus,
  FeatureStatus,
  TaskStatus,
  DeploymentStatus,
  Priority,
  RiskFactor,
  HealthCheck,
  DeploymentMetrics,
  TestCase,
  PullRequest,
  Comment,
  ApprovalUser,
  Stakeholder
} from '../types/release-management';

export class ReleaseManagementService {
  private static initialized = false;
  private static fallbackMode = false;

  static initialize() {
    if (!this.initialized) {
      this.initialized = true;
      console.log('Release Management Service initialized with API integration');
    }
  }

  static async getReleases(): Promise<Release[]> {
    this.initialize();
    try {
      const response = await releaseService.getReleases();
      return response.releases;
    } catch (error) {
      console.error('API call failed, using fallback:', error);
      return this.getFallbackReleases();
    }
  }

  static async getRelease(id: string): Promise<Release | undefined> {
    this.initialize();
    try {
      return await releaseService.getRelease(id);
    } catch (error) {
      console.error('API call failed:', error);
      return undefined;
    }
  }

  static async createRelease(release: Partial<Release>): Promise<Release> {
    this.initialize();
    try {
      return await releaseService.createRelease(release);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to create release. Please check API connection.');
    }
  }

  static async updateRelease(id: string, updates: Partial<Release>): Promise<Release> {
    this.initialize();
    try {
      return await releaseService.updateRelease(id, updates);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to update release. Please check API connection.');
    }
  }

  static async deleteRelease(id: string): Promise<void> {
    this.initialize();
    try {
      return await releaseService.deleteRelease(id);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to delete release. Please check API connection.');
    }
  }

  static async getReleaseAnalytics(releaseId: string): Promise<ReleaseAnalytics> {
    this.initialize();
    try {
      return await releaseService.getReleaseAnalytics({ 
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString()
      });
    } catch (error) {
      console.error('API call failed:', error);
      return this.getFallbackAnalytics(releaseId);
    }
  }

  static async getTeamAnalytics(teamId: string): Promise<any> {
    return {
      teamId,
      velocity: 80 + Math.random() * 20,
      releaseCount: Math.floor(Math.random() * 10) + 5,
      bugRate: Math.random() * 5,
      deploymentFrequency: Math.random() * 10
    };
  }

  static async deployToEnvironment(releaseId: string, environmentId: string): Promise<EnvironmentDeployment> {
    this.initialize();
    try {
      const release = await releaseService.deployRelease(releaseId, environmentId, {
        skipTests: false,
        autoRollback: true,
        notifyTeam: true
      });
      
      const deployment: EnvironmentDeployment = {
        id: `deployment-${Date.now()}`,
        releaseId,
        environment: { id: environmentId } as Environment,
        status: 'in-progress',
        deployedVersion: release.version,
        deployedAt: new Date(),
        deployedBy: 'current-user',
        healthChecks: [],
        metrics: {} as DeploymentMetrics,
        logs: []
      };
      
      return deployment;
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to deploy release. Please check API connection.');
    }
  }

  static async rollbackDeployment(deploymentId: string): Promise<void> {
    this.initialize();
    try {
      const releaseId = deploymentId.split('-')[1];
      await releaseService.rollbackRelease(releaseId);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to rollback deployment. Please check API connection.');
    }
  }

  static async requestApproval(releaseId: string, environmentId: string): Promise<Approval> {
    const approval: Approval = {
      id: `approval-${Date.now()}`,
      releaseId,
      environmentId,
      type: 'deployment',
      status: 'pending',
      requestedBy: 'current-user',
      requestedAt: new Date(),
      approvers: [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    return approval;
  }

  static async approveRelease(approvalId: string, userId: string, comments?: string): Promise<void> {
    this.initialize();
    try {
      const releaseId = approvalId.split('-')[1];
      await releaseService.approveRelease(releaseId, comments);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to approve release. Please check API connection.');
    }
  }

  static async rejectRelease(approvalId: string, userId: string, reason: string): Promise<void> {
    this.initialize();
    try {
      const releaseId = approvalId.split('-')[1];
      await releaseService.rejectRelease(releaseId, reason);
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error('Failed to reject release. Please check API connection.');
    }
  }

  static async getUsers(): Promise<User[]> {
    return [];
  }

  static async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  static async getEnvironments(): Promise<Environment[]> {
    this.initialize();
    try {
      return await releaseService.getEnvironments();
    } catch (error) {
      console.error('API call failed:', error);
      return this.getFallbackEnvironments();
    }
  }

  static async getEnvironment(id: string): Promise<Environment | undefined> {
    this.initialize();
    try {
      return await releaseService.getEnvironmentStatus(id);
    } catch (error) {
      console.error('API call failed:', error);
      return undefined;
    }
  }

  private static getFallbackReleases(): Release[] {
    return [];
  }

  private static getFallbackAnalytics(releaseId: string): ReleaseAnalytics {
    return {
      releaseId,
      metrics: {
        velocity: 0,
        leadTime: 0,
        cycleTime: 0,
        deploymentFrequency: 0,
        mttr: 0,
        changeFailureRate: 0,
        bugEscapeRate: 0
      },
      trends: {
        velocityTrend: [],
        deploymentTrend: [],
        qualityTrend: []
      },
      comparisons: {}
    };
  }

  private static getFallbackEnvironments(): Environment[] {
    return [
      {
        id: 'env-dev',
        name: 'Development',
        type: 'development',
        url: 'https://dev.example.com',
        description: 'Development environment',
        requiresApproval: false,
        approvers: [],
        healthCheckUrl: 'https://dev.example.com/health',
        config: {
          apiUrl: 'https://api-dev.example.com',
          features: {},
          secrets: [],
          scaling: { min: 1, max: 3, targetCPU: 70 }
        }
      },
      {
        id: 'env-staging',
        name: 'Staging',
        type: 'staging',
        url: 'https://staging.example.com',
        description: 'Staging environment',
        requiresApproval: true,
        approvers: [],
        healthCheckUrl: 'https://staging.example.com/health',
        config: {
          apiUrl: 'https://api-staging.example.com',
          features: {},
          secrets: [],
          scaling: { min: 2, max: 5, targetCPU: 60 }
        }
      },
      {
        id: 'env-prod',
        name: 'Production',
        type: 'production',
        url: 'https://www.example.com',
        description: 'Production environment',
        requiresApproval: true,
        approvers: [],
        healthCheckUrl: 'https://www.example.com/health',
        config: {
          apiUrl: 'https://api.example.com',
          features: {},
          secrets: [],
          scaling: { min: 3, max: 10, targetCPU: 50 }
        }
      }
    ];
  }
}

export default ReleaseManagementService;