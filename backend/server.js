const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data store
let releases = [];
let releaseIdCounter = 1;

// Helper function to create a release
function createReleaseObject(data) {
  return {
    id: `release-${releaseIdCounter++}`,
    name: data.name || 'New Release',
    version: data.version || '1.0.0',
    description: data.description || '',
    type: data.type || 'minor',
    status: data.status || 'planning',
    priority: data.priority || 'medium',
    plannedDate: data.plannedDate || new Date().toISOString(),
    actualDate: data.actualDate,
    createdBy: data.createdBy || 'system',
    assignedTo: data.assignedTo || [],
    features: data.features || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Initialize with sample data
releases = [
  createReleaseObject({
    name: 'Q1 2024 Major Release',
    version: '2.0.0',
    description: 'Major platform upgrade with new features',
    type: 'major',
    status: 'in-development',
    priority: 'high'
  }),
  createReleaseObject({
    name: 'Security Patch',
    version: '1.9.1',
    description: 'Critical security updates',
    type: 'patch',
    status: 'testing',
    priority: 'critical'
  }),
  createReleaseObject({
    name: 'Performance Improvements',
    version: '1.10.0',
    description: 'Backend optimization and caching improvements',
    type: 'minor',
    status: 'planning',
    priority: 'medium'
  })
];

// Routes
app.get('/api/v1/releases', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedReleases = releases.slice(startIndex, endIndex);
  
  res.json({
    releases: paginatedReleases,
    total: releases.length,
    page: page,
    totalPages: Math.ceil(releases.length / limit)
  });
});

app.get('/api/v1/releases/:id', (req, res) => {
  const release = releases.find(r => r.id === req.params.id);
  if (release) {
    res.json(release);
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

app.post('/api/v1/releases', (req, res) => {
  const newRelease = createReleaseObject(req.body);
  releases.push(newRelease);
  res.status(201).json(newRelease);
});

app.put('/api/v1/releases/:id', (req, res) => {
  const index = releases.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    releases[index] = {
      ...releases[index],
      ...req.body,
      id: releases[index].id,
      createdAt: releases[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    res.json(releases[index]);
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

app.delete('/api/v1/releases/:id', (req, res) => {
  const index = releases.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    releases.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

app.post('/api/v1/releases/:id/deploy', (req, res) => {
  const release = releases.find(r => r.id === req.params.id);
  if (release) {
    release.status = 'deploying';
    release.updatedAt = new Date().toISOString();
    res.json(release);
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

app.post('/api/v1/releases/:id/rollback', (req, res) => {
  const release = releases.find(r => r.id === req.params.id);
  if (release) {
    release.status = 'rolled-back';
    release.updatedAt = new Date().toISOString();
    res.json(release);
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

app.post('/api/v1/releases/:id/approve', (req, res) => {
  const release = releases.find(r => r.id === req.params.id);
  if (release) {
    release.status = 'approved';
    release.updatedAt = new Date().toISOString();
    res.json(release);
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

app.post('/api/v1/releases/:id/reject', (req, res) => {
  const release = releases.find(r => r.id === req.params.id);
  if (release) {
    release.status = 'rejected';
    release.updatedAt = new Date().toISOString();
    res.json(release);
  } else {
    res.status(404).json({ error: 'Release not found' });
  }
});

// Environment endpoints
app.get('/api/v1/environments', (req, res) => {
  res.json([
    {
      id: 'env-dev',
      name: 'Development',
      type: 'development',
      url: 'https://dev.example.com',
      description: 'Development environment',
      requiresApproval: false,
      approvers: [],
      healthCheckUrl: 'https://dev.example.com/health'
    },
    {
      id: 'env-staging',
      name: 'Staging',
      type: 'staging',
      url: 'https://staging.example.com',
      description: 'Staging environment',
      requiresApproval: true,
      approvers: ['user-1', 'user-2'],
      healthCheckUrl: 'https://staging.example.com/health'
    },
    {
      id: 'env-prod',
      name: 'Production',
      type: 'production',
      url: 'https://www.example.com',
      description: 'Production environment',
      requiresApproval: true,
      approvers: ['user-1', 'user-2', 'user-3'],
      healthCheckUrl: 'https://www.example.com/health'
    }
  ]);
});

// Dashboard endpoints
app.get('/api/v1/dashboard/stats', (req, res) => {
  res.json({
    totalReleases: releases.length,
    activeReleases: releases.filter(r => r.status === 'in-development').length,
    deployedReleases: releases.filter(r => r.status === 'deployed').length,
    pendingApprovals: releases.filter(r => r.status === 'pending-approval').length
  });
});

app.get('/api/v1/dashboard/metrics', (req, res) => {
  res.json({
    deploymentFrequency: 3.5,
    leadTime: 14,
    mttr: 2.5,
    changeFailureRate: 5.2
  });
});

app.get('/api/v1/dashboard/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Analytics endpoint
app.get('/api/v1/releases/analytics', (req, res) => {
  res.json({
    metrics: {
      velocity: 75,
      leadTime: 12,
      cycleTime: 5,
      deploymentFrequency: 3,
      mttr: 2,
      changeFailureRate: 5,
      bugEscapeRate: 2
    },
    trends: {
      velocityTrend: [],
      deploymentTrend: [],
      qualityTrend: []
    },
    comparisons: {}
  });
});

// Teams endpoint
app.get('/api/v1/teams', (req, res) => {
  res.json([
    {
      id: 'team-1',
      name: 'Platform Team',
      members: ['John Doe', 'Jane Smith']
    },
    {
      id: 'team-2',
      name: 'Mobile Team',
      members: ['Bob Johnson', 'Alice Brown']
    }
  ]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/v1`);
  console.log('\nAvailable endpoints:');
  console.log('  GET    /api/v1/releases');
  console.log('  POST   /api/v1/releases');
  console.log('  GET    /api/v1/releases/:id');
  console.log('  PUT    /api/v1/releases/:id');
  console.log('  DELETE /api/v1/releases/:id');
  console.log('  POST   /api/v1/releases/:id/deploy');
  console.log('  POST   /api/v1/releases/:id/rollback');
  console.log('  GET    /api/v1/environments');
  console.log('  GET    /api/v1/dashboard/stats');
  console.log('  GET    /health');
});