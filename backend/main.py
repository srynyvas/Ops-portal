from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn
from enum import Enum

app = FastAPI(title="Ops Portal Backend API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class ReleaseType(str, Enum):
    major = "major"
    minor = "minor"
    patch = "patch"
    hotfix = "hotfix"
    beta = "beta"

class ReleaseStatus(str, Enum):
    planning = "planning"
    in_development = "in-development"
    testing = "testing"
    staging = "staging"
    deployed = "deployed"
    deploying = "deploying"
    approved = "approved"
    rejected = "rejected"
    rolled_back = "rolled-back"

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class EnvironmentType(str, Enum):
    development = "development"
    staging = "staging"
    production = "production"

# Models
class Feature(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    status: str = "backlog"
    priority: Priority = Priority.medium

class ReleaseBase(BaseModel):
    name: str
    version: str
    description: Optional[str] = ""
    type: Optional[ReleaseType] = ReleaseType.minor
    status: Optional[ReleaseStatus] = ReleaseStatus.planning
    priority: Optional[Priority] = Priority.medium
    plannedDate: Optional[datetime] = None
    actualDate: Optional[datetime] = None
    createdBy: Optional[str] = "system"
    assignedTo: Optional[List[str]] = []
    features: Optional[List[Feature]] = []

class Release(ReleaseBase):
    id: str
    createdAt: datetime
    updatedAt: datetime

class ReleaseCreate(ReleaseBase):
    pass

class ReleaseUpdate(BaseModel):
    name: Optional[str] = None
    version: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ReleaseType] = None
    status: Optional[ReleaseStatus] = None
    priority: Optional[Priority] = None
    plannedDate: Optional[datetime] = None
    actualDate: Optional[datetime] = None
    assignedTo: Optional[List[str]] = None
    features: Optional[List[Feature]] = None

class Environment(BaseModel):
    id: str
    name: str
    type: EnvironmentType
    url: str
    description: str
    requiresApproval: bool
    approvers: List[str]
    healthCheckUrl: str
    config: Optional[Dict[str, Any]] = {}

class DeployRequest(BaseModel):
    environmentId: str
    skipTests: Optional[bool] = False
    autoRollback: Optional[bool] = True
    notifyTeam: Optional[bool] = True

class ApprovalRequest(BaseModel):
    comments: Optional[str] = ""
    timestamp: Optional[datetime] = None

class RejectionRequest(BaseModel):
    reason: str
    timestamp: Optional[datetime] = None

class RollbackRequest(BaseModel):
    targetVersion: Optional[str] = None

# In-memory database
releases_db: Dict[str, Release] = {}
release_counter = 1

# Initialize with sample data
def init_sample_data():
    global release_counter
    sample_releases = [
        ReleaseCreate(
            name="Q1 2024 Major Release",
            version="2.0.0",
            description="Major platform upgrade with new features",
            type=ReleaseType.major,
            status=ReleaseStatus.in_development,
            priority=Priority.high,
            plannedDate=datetime.now(),
            features=[
                Feature(id="f1", title="New Dashboard", description="Redesigned dashboard"),
                Feature(id="f2", title="API v2", description="New API version")
            ]
        ),
        ReleaseCreate(
            name="Security Patch",
            version="1.9.1",
            description="Critical security updates",
            type=ReleaseType.patch,
            status=ReleaseStatus.testing,
            priority=Priority.critical,
            plannedDate=datetime.now()
        ),
        ReleaseCreate(
            name="Performance Improvements",
            version="1.10.0",
            description="Backend optimization and caching improvements",
            type=ReleaseType.minor,
            status=ReleaseStatus.planning,
            priority=Priority.medium,
            plannedDate=datetime.now()
        )
    ]
    
    for release_data in sample_releases:
        release_id = f"release-{release_counter}"
        release = Release(
            id=release_id,
            **release_data.model_dump(),
            createdAt=datetime.now(),
            updatedAt=datetime.now()
        )
        releases_db[release_id] = release
        release_counter += 1

# Initialize sample data on startup
init_sample_data()

# Routes
@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "timestamp": datetime.now().isoformat(),
        "service": "Ops Portal Backend API"
    }

@app.get("/api/v1/releases", response_model=Dict[str, Any])
def get_releases(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None
):
    # Filter releases
    filtered_releases = list(releases_db.values())
    
    if status:
        filtered_releases = [r for r in filtered_releases if r.status == status]
    
    if search:
        search_lower = search.lower()
        filtered_releases = [
            r for r in filtered_releases
            if search_lower in r.name.lower() or 
               search_lower in r.version.lower() or
               (r.description and search_lower in r.description.lower())
        ]
    
    # Pagination
    total = len(filtered_releases)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_releases = filtered_releases[start_idx:end_idx]
    
    return {
        "releases": paginated_releases,
        "total": total,
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }

@app.get("/api/v1/releases/{release_id}", response_model=Release)
def get_release(release_id: str):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    return releases_db[release_id]

@app.post("/api/v1/releases", response_model=Release, status_code=201)
def create_release(release: ReleaseCreate):
    global release_counter
    release_id = f"release-{release_counter}"
    release_counter += 1
    
    new_release = Release(
        id=release_id,
        **release.model_dump(),
        createdAt=datetime.now(),
        updatedAt=datetime.now()
    )
    releases_db[release_id] = new_release
    return new_release

@app.put("/api/v1/releases/{release_id}", response_model=Release)
def update_release(release_id: str, update: ReleaseUpdate):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release = releases_db[release_id]
    update_data = update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(release, field, value)
    
    release.updatedAt = datetime.now()
    return release

@app.delete("/api/v1/releases/{release_id}", status_code=204)
def delete_release(release_id: str):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    del releases_db[release_id]
    return None

@app.post("/api/v1/releases/{release_id}/deploy", response_model=Release)
def deploy_release(release_id: str, request: DeployRequest):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release = releases_db[release_id]
    release.status = ReleaseStatus.deploying
    release.updatedAt = datetime.now()
    return release

@app.post("/api/v1/releases/{release_id}/rollback", response_model=Release)
def rollback_release(release_id: str, request: RollbackRequest):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release = releases_db[release_id]
    release.status = ReleaseStatus.rolled_back
    release.updatedAt = datetime.now()
    return release

@app.post("/api/v1/releases/{release_id}/approve", response_model=Release)
def approve_release(release_id: str, request: ApprovalRequest):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release = releases_db[release_id]
    release.status = ReleaseStatus.approved
    release.updatedAt = datetime.now()
    return release

@app.post("/api/v1/releases/{release_id}/reject", response_model=Release)
def reject_release(release_id: str, request: RejectionRequest):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release = releases_db[release_id]
    release.status = ReleaseStatus.rejected
    release.updatedAt = datetime.now()
    return release

@app.get("/api/v1/releases/{release_id}/metrics")
def get_release_metrics(release_id: str):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    return {
        "deploymentDuration": 180,
        "rollbackCount": 0,
        "errorRate": 2.5,
        "successRate": 97.5,
        "affectedUsers": 5000,
        "performanceImpact": {
            "responseTime": {"baseline": 100, "current": 95, "unit": "ms"},
            "throughput": {"baseline": 1000, "current": 1100, "unit": "req/s"}
        }
    }

@app.get("/api/v1/releases/{release_id}/history")
def get_release_history(release_id: str, limit: int = Query(10, ge=1, le=100)):
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    
    return [
        {
            "id": f"history-{i}",
            "action": "deployment",
            "timestamp": datetime.now().isoformat(),
            "user": "system",
            "details": f"Deployment action {i}"
        }
        for i in range(min(limit, 5))
    ]

@app.get("/api/v1/releases/analytics")
def get_release_analytics():
    return {
        "metrics": {
            "velocity": 75,
            "leadTime": 12,
            "cycleTime": 5,
            "deploymentFrequency": 3,
            "mttr": 2,
            "changeFailureRate": 5,
            "bugEscapeRate": 2
        },
        "trends": {
            "velocityTrend": [],
            "deploymentTrend": [],
            "qualityTrend": []
        },
        "comparisons": {}
    }

@app.get("/api/v1/environments", response_model=List[Environment])
def get_environments():
    return [
        Environment(
            id="env-dev",
            name="Development",
            type=EnvironmentType.development,
            url="https://dev.example.com",
            description="Development environment",
            requiresApproval=False,
            approvers=[],
            healthCheckUrl="https://dev.example.com/health",
            config={"apiUrl": "https://api-dev.example.com"}
        ),
        Environment(
            id="env-staging",
            name="Staging",
            type=EnvironmentType.staging,
            url="https://staging.example.com",
            description="Staging environment",
            requiresApproval=True,
            approvers=["user-1", "user-2"],
            healthCheckUrl="https://staging.example.com/health",
            config={"apiUrl": "https://api-staging.example.com"}
        ),
        Environment(
            id="env-prod",
            name="Production",
            type=EnvironmentType.production,
            url="https://www.example.com",
            description="Production environment",
            requiresApproval=True,
            approvers=["user-1", "user-2", "user-3"],
            healthCheckUrl="https://www.example.com/health",
            config={"apiUrl": "https://api.example.com"}
        )
    ]

@app.get("/api/v1/environments/{env_id}/status")
def get_environment_status(env_id: str):
    environments = {
        "env-dev": "healthy",
        "env-staging": "healthy",
        "env-prod": "healthy"
    }
    
    if env_id not in environments:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    return {
        "id": env_id,
        "status": environments[env_id],
        "lastChecked": datetime.now().isoformat(),
        "uptime": "99.9%",
        "responseTime": 45
    }

@app.get("/api/v1/dashboard/stats")
def get_dashboard_stats():
    total = len(releases_db)
    active = sum(1 for r in releases_db.values() if r.status == ReleaseStatus.in_development)
    deployed = sum(1 for r in releases_db.values() if r.status == ReleaseStatus.deployed)
    pending = sum(1 for r in releases_db.values() if r.status == ReleaseStatus.planning)
    
    return {
        "totalReleases": total,
        "activeReleases": active,
        "deployedReleases": deployed,
        "pendingApprovals": pending
    }

@app.get("/api/v1/dashboard/metrics")
def get_dashboard_metrics():
    return {
        "deploymentFrequency": 3.5,
        "leadTime": 14,
        "mttr": 2.5,
        "changeFailureRate": 5.2
    }

@app.get("/api/v1/dashboard/health")
def get_dashboard_health():
    return {
        "status": "healthy",
        "uptime": 99.99,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/teams")
def get_teams():
    return [
        {
            "id": "team-1",
            "name": "Platform Team",
            "members": ["John Doe", "Jane Smith"],
            "lead": "John Doe"
        },
        {
            "id": "team-2",
            "name": "Mobile Team",
            "members": ["Bob Johnson", "Alice Brown"],
            "lead": "Bob Johnson"
        },
        {
            "id": "team-3",
            "name": "DevOps Team",
            "members": ["Charlie Wilson", "Diana Prince"],
            "lead": "Charlie Wilson"
        }
    ]

@app.get("/api/v1/teams/{team_id}/members")
def get_team_members(team_id: str):
    teams = {
        "team-1": ["John Doe", "Jane Smith"],
        "team-2": ["Bob Johnson", "Alice Brown"],
        "team-3": ["Charlie Wilson", "Diana Prince"]
    }
    
    if team_id not in teams:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return teams[team_id]

# Workflow endpoints
@app.get("/api/v1/workflows")
def get_workflows():
    return [
        {
            "id": "workflow-1",
            "name": "Standard Deployment",
            "description": "Standard deployment workflow",
            "steps": ["Build", "Test", "Deploy", "Verify"]
        },
        {
            "id": "workflow-2",
            "name": "Hotfix Deployment",
            "description": "Emergency hotfix workflow",
            "steps": ["Build", "Quick Test", "Deploy", "Monitor"]
        }
    ]

if __name__ == "__main__":
    print("Starting Ops Portal Backend API...")
    print("API Documentation available at: http://localhost:8080/docs")
    print("Alternative docs at: http://localhost:8080/redoc")
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)