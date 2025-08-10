/**
 * Release Management Service Layer
 * Provides mock data and API interfaces for release management system
 */

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

// ============================================================================
// Mock Data Generators
// ============================================================================

class MockDataGenerator {
  private static userPool: User[] = [
    {
      id: 'user-1',
      email: 'john.doe@company.com',
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
      roles: [{ id: 'role-1', name: 'Release Manager', permissions: [] }],
      teams: [{ id: 'team-1', name: 'Platform Team', description: 'Core platform development', members: [], lead: 'user-1' }]
    },
    {
      id: 'user-2',
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      roles: [{ id: 'role-2', name: 'Developer', permissions: [] }],
      teams: [{ id: 'team-1', name: 'Platform Team', description: 'Core platform development', members: [], lead: 'user-1' }]
    },
    {
      id: 'user-3',
      email: 'bob.johnson@company.com',
      name: 'Bob Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson',
      roles: [{ id: 'role-3', name: 'QA Engineer', permissions: [] }],
      teams: [{ id: 'team-2', name: 'QA Team', description: 'Quality assurance', members: [], lead: 'user-3' }]
    },
    {
      id: 'user-4',
      email: 'alice.brown@company.com',
      name: 'Alice Brown',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Brown',
      roles: [{ id: 'role-4', name: 'DevOps Engineer', permissions: [] }],
      teams: [{ id: 'team-3', name: 'DevOps Team', description: 'Infrastructure and deployment', members: [], lead: 'user-4' }]
    }
  ];

  private static environments: Environment[] = [
    {
      id: 'env-dev',
      name: 'Development',
      type: 'development',
      url: 'https://dev.company.com',
      description: 'Development environment for testing',
      requiresApproval: false,
      approvers: [],
      healthCheckUrl: 'https://dev.company.com/health',
      config: {
        apiUrl: 'https://api-dev.company.com',
        features: { featureA: true, featureB: false },
        secrets: ['DEV_API_KEY'],
        scaling: { min: 1, max: 3, targetCPU: 70 }
      }
    },
    {
      id: 'env-staging',
      name: 'Staging',
      type: 'staging',
      url: 'https://staging.company.com',
      description: 'Pre-production environment',
      requiresApproval: true,
      approvers: ['user-1', 'user-4'],
      healthCheckUrl: 'https://staging.company.com/health',
      config: {
        apiUrl: 'https://api-staging.company.com',
        features: { featureA: true, featureB: true },
        secrets: ['STAGING_API_KEY'],
        scaling: { min: 2, max: 5, targetCPU: 60 }
      }
    },
    {
      id: 'env-prod',
      name: 'Production',
      type: 'production',
      url: 'https://www.company.com',
      description: 'Live production environment',
      requiresApproval: true,
      approvers: ['user-1', 'user-4'],
      healthCheckUrl: 'https://www.company.com/health',
      config: {
        apiUrl: 'https://api.company.com',
        features: { featureA: true, featureB: true },
        secrets: ['PROD_API_KEY'],
        scaling: { min: 3, max: 10, targetCPU: 50 }
      },
      restrictions: [
        {
          type: 'time',
          description: 'No deployments on weekends',
          config: { blackoutDays: ['Saturday', 'Sunday'] }
        },
        {
          type: 'approval',
          description: 'Requires 2 approvals',
          config: { minApprovals: 2 }
        }
      ]
    }
  ];

  static generateRelease(index: number): Release {
    const statuses: ReleaseStatus[] = ['planning', 'in-development', 'testing', 'staging', 'deployed'];
    const types = ['major', 'minor', 'patch', 'hotfix'] as const;
    const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
    
    const releaseId = `release-${index}`;
    const plannedDate = new Date();
    plannedDate.setDate(plannedDate.getDate() + (index * 7));
    
    return {
      id: releaseId,
      name: `Release ${index}.0.0`,
      version: `${index}.0.0`,
      description: `This is release ${index} with new features and improvements`,
      type: types[index % 4],
      status: statuses[index % 5],
      priority: priorities[index % 4],
      plannedDate,
      actualDate: index < 3 ? plannedDate : undefined,
      createdBy: this.userPool[0].id,
      assignedTo: [this.userPool[1].id, this.userPool[2].id],
      environments: this.generateEnvironmentDeployments(releaseId, index),
      features: this.generateFeatures(releaseId, index),
      riskAssessment: this.generateRiskAssessment(releaseId),
      approvals: this.generateApprovals(releaseId),
      metadata: {
        tags: ['release', `v${index}`, 'production'],
        links: [
          {
            id: `link-${index}-1`,
            title: 'Release Notes',
            url: `https://docs.company.com/releases/${index}`,
            type: 'documentation'
          },
          {
            id: `link-${index}-2`,
            title: 'JIRA Epic',
            url: `https://jira.company.com/epic/REL-${index}`,
            type: 'issue'
          }
        ],
        stakeholders: [
          {
            id: `stakeholder-${index}-1`,
            name: 'Product Owner',
            email: 'po@company.com',
            role: 'owner'
          },
          {
            id: `stakeholder-${index}-2`,
            name: 'Tech Lead',
            email: 'tech.lead@company.com',
            role: 'approver'
          }
        ]
      },
      createdAt: new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
  }

  static generateFeatures(releaseId: string, releaseIndex: number): Feature[] {
    const features: Feature[] = [];
    const featureCount = 3 + (releaseIndex % 3);
    
    for (let i = 0; i < featureCount; i++) {
      const featureId = `feature-${releaseId}-${i}`;
      features.push({
        id: featureId,
        releaseId,
        title: `Feature ${i + 1}: ${this.getFeatureName(i)}`,
        description: `Implementation of ${this.getFeatureName(i)} functionality`,
        type: ['feature', 'enhancement', 'bugfix', 'security'][i % 4] as any,
        status: ['backlog', 'in-progress', 'testing', 'done'][i % 4] as FeatureStatus,
        priority: ['low', 'medium', 'high', 'critical'][i % 4] as Priority,
        storyPoints: 3 + (i % 5) * 2,
        assignedTo: this.userPool[i % 4].id,
        tasks: this.generateTasks(featureId, i),
        dependencies: i > 0 ? [`feature-${releaseId}-${i - 1}`] : [],
        testCases: this.generateTestCases(featureId),
        pullRequests: this.generatePullRequests(featureId),
        createdAt: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    }
    
    return features;
  }

  static generateTasks(featureId: string, featureIndex: number): Task[] {
    const tasks: Task[] = [];
    const taskCount = 2 + (featureIndex % 3);
    
    for (let i = 0; i < taskCount; i++) {
      tasks.push({
        id: `task-${featureId}-${i}`,
        featureId,
        title: `Task ${i + 1}: ${this.getTaskName(i)}`,
        description: `Complete ${this.getTaskName(i)}`,
        status: ['todo', 'in-progress', 'review', 'done'][i % 4] as TaskStatus,
        priority: ['low', 'medium', 'high'][i % 3] as Priority,
        estimatedHours: 4 + (i % 4) * 2,
        actualHours: i < 2 ? 4 + (i % 4) * 2 : undefined,
        assignedTo: this.userPool[i % 4].id,
        dueDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        completedAt: i === 0 ? new Date() : undefined,
        comments: [],
        createdAt: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    }
    
    return tasks;
  }

  static generateEnvironmentDeployments(releaseId: string, releaseIndex: number): EnvironmentDeployment[] {
    const deployments: EnvironmentDeployment[] = [];
    
    // Only deployed releases have environment deployments
    if (releaseIndex < 3) {
      this.environments.forEach((env, index) => {
        if (index <= releaseIndex) {
          deployments.push({
            id: `deployment-${releaseId}-${env.id}`,
            releaseId,
            environment: env,
            status: index === releaseIndex ? 'in-progress' : 'success',
            deployedVersion: `${releaseIndex}.0.0`,
            deployedAt: new Date(Date.now() - (3 - index) * 24 * 60 * 60 * 1000),
            deployedBy: this.userPool[3].id,
            healthChecks: this.generateHealthChecks(env.id),
            metrics: this.generateDeploymentMetrics(),
            logs: []
          });
        }
      });
    }
    
    return deployments;
  }

  static generateRiskAssessment(releaseId: string): RiskAssessment {
    const factors: RiskFactor[] = [
      {
        id: `risk-${releaseId}-1`,
        category: 'technical',
        description: 'Database migration required',
        severity: 'medium',
        likelihood: 'possible',
        impact: 'Service downtime during migration',
        score: 6
      },
      {
        id: `risk-${releaseId}-2`,
        category: 'security',
        description: 'New authentication flow',
        severity: 'high',
        likelihood: 'unlikely',
        impact: 'Potential security vulnerability',
        score: 7
      },
      {
        id: `risk-${releaseId}-3`,
        category: 'business',
        description: 'Major UI changes',
        severity: 'low',
        likelihood: 'likely',
        impact: 'User adoption challenges',
        score: 4
      }
    ];
    
    return {
      id: `assessment-${releaseId}`,
      releaseId,
      overallRisk: 'medium',
      factors,
      mitigations: [
        {
          id: `mitigation-${releaseId}-1`,
          riskFactorId: factors[0].id,
          strategy: 'Perform migration during maintenance window',
          owner: this.userPool[3].id,
          status: 'planned',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          effectiveness: 'high'
        },
        {
          id: `mitigation-${releaseId}-2`,
          riskFactorId: factors[1].id,
          strategy: 'Security audit and penetration testing',
          owner: this.userPool[2].id,
          status: 'in-progress',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          effectiveness: 'high'
        }
      ],
      assessedBy: this.userPool[0].id,
      assessedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      approvedBy: this.userPool[0].id,
      approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    };
  }

  static generateApprovals(releaseId: string): Approval[] {
    return [
      {
        id: `approval-${releaseId}-1`,
        releaseId,
        environmentId: 'env-staging',
        type: 'deployment',
        status: 'approved',
        requestedBy: this.userPool[1].id,
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        approvers: [
          {
            userId: this.userPool[0].id,
            name: this.userPool[0].name,
            email: this.userPool[0].email,
            role: 'Release Manager',
            status: 'approved',
            respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            comments: 'Approved for staging deployment'
          }
        ],
        comments: 'Ready for staging',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  static generateHealthChecks(envId: string): HealthCheck[] {
    return [
      {
        id: `health-${envId}-1`,
        name: 'API Health',
        endpoint: '/health/api',
        status: 'healthy',
        responseTime: 45,
        lastChecked: new Date(),
        details: { version: '1.0.0', uptime: '99.9%' }
      },
      {
        id: `health-${envId}-2`,
        name: 'Database Connection',
        endpoint: '/health/db',
        status: 'healthy',
        responseTime: 12,
        lastChecked: new Date(),
        details: { connections: 10, latency: '5ms' }
      },
      {
        id: `health-${envId}-3`,
        name: 'Cache Service',
        endpoint: '/health/cache',
        status: envId === 'env-dev' ? 'degraded' : 'healthy',
        responseTime: 8,
        lastChecked: new Date(),
        details: { hitRate: '85%', memory: '2GB' }
      }
    ];
  }

  static generateDeploymentMetrics(): DeploymentMetrics {
    return {
      deploymentDuration: 180 + Math.random() * 120,
      rollbackCount: Math.floor(Math.random() * 2),
      errorRate: Math.random() * 5,
      successRate: 95 + Math.random() * 5,
      affectedUsers: Math.floor(Math.random() * 10000),
      performanceImpact: [
        {
          name: 'Response Time',
          baseline: 100,
          current: 95 + Math.random() * 10,
          unit: 'ms',
          status: 'improved'
        },
        {
          name: 'Throughput',
          baseline: 1000,
          current: 1050 + Math.random() * 50,
          unit: 'req/s',
          status: 'improved'
        }
      ],
      resourceUsage: [
        {
          resource: 'cpu',
          usage: 45 + Math.random() * 20,
          limit: 80,
          unit: '%'
        },
        {
          resource: 'memory',
          usage: 60 + Math.random() * 15,
          limit: 90,
          unit: '%'
        }
      ]
    };
  }

  static generateTestCases(featureId: string): TestCase[] {
    return [
      {
        id: `test-${featureId}-1`,
        featureId,
        title: 'Unit test for core functionality',
        description: 'Test the main feature logic',
        type: 'unit',
        status: 'passed',
        automationStatus: 'automated',
        executedBy: this.userPool[2].id,
        executedAt: new Date(),
        duration: 45,
        results: []
      },
      {
        id: `test-${featureId}-2`,
        featureId,
        title: 'Integration test with API',
        description: 'Test API integration points',
        type: 'integration',
        status: 'passed',
        automationStatus: 'automated',
        executedBy: this.userPool[2].id,
        executedAt: new Date(),
        duration: 120,
        results: []
      }
    ];
  }

  static generatePullRequests(featureId: string): PullRequest[] {
    return [
      {
        id: `pr-${featureId}-1`,
        featureId,
        title: `feat: Implement ${featureId}`,
        description: 'Implementation of feature functionality',
        status: 'merged',
        sourceRef: `feature/${featureId}`,
        targetRef: 'develop',
        author: this.userPool[1].id,
        reviewers: [this.userPool[0].id, this.userPool[2].id],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        mergedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        url: `https://github.com/company/repo/pull/${Math.floor(Math.random() * 1000)}`
      }
    ];
  }

  static generateAnalytics(releaseId: string): ReleaseAnalytics {
    const generateTrendData = (baseValue: number, days: number) => {
      const trend = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i));
        trend.push({
          date,
          value: baseValue + Math.random() * 20 - 10,
          label: date.toISOString().split('T')[0]
        });
      }
      return trend;
    };
    
    return {
      releaseId,
      metrics: {
        velocity: 75 + Math.random() * 20,
        leadTime: 10 + Math.random() * 5,
        cycleTime: 5 + Math.random() * 3,
        deploymentFrequency: 3 + Math.random() * 2,
        mttr: 1 + Math.random() * 2,
        changeFailureRate: Math.random() * 10,
        bugEscapeRate: Math.random() * 5
      },
      trends: {
        velocityTrend: generateTrendData(75, 30),
        deploymentTrend: generateTrendData(3, 30),
        qualityTrend: generateTrendData(95, 30)
      },
      comparisons: {
        previousRelease: {
          metric: 'velocity',
          current: 85,
          comparison: 75,
          difference: 10,
          percentageChange: 13.3
        },
        teamAverage: {
          metric: 'velocity',
          current: 85,
          comparison: 80,
          difference: 5,
          percentageChange: 6.25
        }
      }
    };
  }

  private static getFeatureName(index: number): string {
    const names = [
      'User Authentication',
      'Payment Integration',
      'Dashboard Analytics',
      'API Gateway',
      'Notification System',
      'Search Functionality'
    ];
    return names[index % names.length];
  }

  private static getTaskName(index: number): string {
    const names = [
      'Backend implementation',
      'Frontend components',
      'Database schema',
      'API endpoints',
      'Unit tests',
      'Documentation'
    ];
    return names[index % names.length];
  }
}

// ============================================================================
// Service Class
// ============================================================================

export class ReleaseManagementService {
  private static releases: Release[] = [];
  private static initialized = false;

  // Initialize with empty data
  static initialize() {
    if (!this.initialized) {
      // Start with empty releases array - no mock data
      this.releases = [];
      this.initialized = true;
    }
  }

  // Release operations
  static async getReleases(): Promise<Release[]> {
    this.initialize();
    return Promise.resolve([...this.releases]);
  }

  static async getRelease(id: string): Promise<Release | undefined> {
    this.initialize();
    return Promise.resolve(this.releases.find(r => r.id === id));
  }

  static async createRelease(release: Partial<Release>): Promise<Release> {
    this.initialize();
    const newRelease = {
      ...MockDataGenerator.generateRelease(this.releases.length + 1),
      ...release,
      id: `release-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.releases.push(newRelease);
    return Promise.resolve(newRelease);
  }

  static async updateRelease(id: string, updates: Partial<Release>): Promise<Release> {
    this.initialize();
    const index = this.releases.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Release not found');
    
    this.releases[index] = {
      ...this.releases[index],
      ...updates,
      updatedAt: new Date()
    };
    return Promise.resolve(this.releases[index]);
  }

  static async deleteRelease(id: string): Promise<void> {
    this.initialize();
    const index = this.releases.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Release not found');
    
    this.releases.splice(index, 1);
    return Promise.resolve();
  }

  // Analytics operations
  static async getReleaseAnalytics(releaseId: string): Promise<ReleaseAnalytics> {
    this.initialize();
    return Promise.resolve(MockDataGenerator.generateAnalytics(releaseId));
  }

  static async getTeamAnalytics(teamId: string): Promise<any> {
    return Promise.resolve({
      teamId,
      velocity: 80 + Math.random() * 20,
      releaseCount: Math.floor(Math.random() * 10) + 5,
      bugRate: Math.random() * 5,
      deploymentFrequency: Math.random() * 10
    });
  }

  // Deployment operations
  static async deployToEnvironment(releaseId: string, environmentId: string): Promise<EnvironmentDeployment> {
    const deployment: EnvironmentDeployment = {
      id: `deployment-${Date.now()}`,
      releaseId,
      environment: MockDataGenerator['environments'].find(e => e.id === environmentId)!,
      status: 'in-progress',
      deployedVersion: '1.0.0',
      deployedAt: new Date(),
      deployedBy: 'current-user',
      healthChecks: [],
      metrics: MockDataGenerator.generateDeploymentMetrics(),
      logs: []
    };
    
    // Simulate deployment progress
    setTimeout(() => {
      deployment.status = 'success';
    }, 5000);
    
    return Promise.resolve(deployment);
  }

  static async rollbackDeployment(deploymentId: string): Promise<void> {
    // Simulate rollback
    return new Promise(resolve => {
      setTimeout(resolve, 3000);
    });
  }

  // Approval operations
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
    
    return Promise.resolve(approval);
  }

  static async approveRelease(approvalId: string, userId: string, comments?: string): Promise<void> {
    // Simulate approval
    return Promise.resolve();
  }

  static async rejectRelease(approvalId: string, userId: string, reason: string): Promise<void> {
    // Simulate rejection
    return Promise.resolve();
  }

  // User operations
  static async getUsers(): Promise<User[]> {
    return Promise.resolve(MockDataGenerator['userPool']);
  }

  static async getUser(id: string): Promise<User | undefined> {
    return Promise.resolve(MockDataGenerator['userPool'].find(u => u.id === id));
  }

  // Environment operations
  static async getEnvironments(): Promise<Environment[]> {
    return Promise.resolve(MockDataGenerator['environments']);
  }

  static async getEnvironment(id: string): Promise<Environment | undefined> {
    return Promise.resolve(MockDataGenerator['environments'].find(e => e.id === id));
  }
}

// Export singleton instance
export default ReleaseManagementService;