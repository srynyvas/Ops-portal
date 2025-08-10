from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import Document, Indexed, init_beanie, PydanticObjectId
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn
from enum import Enum
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Ops Portal Backend API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection string
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ops_portal")

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

# MongoDB Models (Documents)
class Feature(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    status: str = "backlog"
    priority: Priority = Priority.medium
    assignedTo: Optional[List[str]] = []
    storyPoints: Optional[int] = None
    completedAt: Optional[datetime] = None

class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    status: str = "todo"
    priority: Priority = Priority.medium
    assignedTo: Optional[str] = None
    estimatedHours: Optional[float] = None
    actualHours: Optional[float] = None
    dueDate: Optional[datetime] = None
    completedAt: Optional[datetime] = None

class ReleaseMetrics(BaseModel):
    deploymentDuration: Optional[float] = 0
    rollbackCount: Optional[int] = 0
    errorRate: Optional[float] = 0
    successRate: Optional[float] = 100
    affectedUsers: Optional[int] = 0
    performanceImpact: Optional[Dict[str, Any]] = {}
    resourceUsage: Optional[List[Dict[str, Any]]] = []

class DeploymentHistory(BaseModel):
    environmentId: str
    deployedAt: datetime
    deployedBy: str
    version: str
    status: str
    notes: Optional[str] = ""

class Release(Document):
    name: str = Field(..., min_length=1)
    version: str = Field(..., min_length=1)
    description: Optional[str] = ""
    type: ReleaseType = ReleaseType.minor
    status: ReleaseStatus = ReleaseStatus.planning
    priority: Priority = Priority.medium
    plannedDate: Optional[datetime] = None
    actualDate: Optional[datetime] = None
    createdBy: str = "system"
    assignedTo: List[str] = []
    features: List[Feature] = []
    tasks: List[Task] = []
    metrics: Optional[ReleaseMetrics] = None
    deploymentHistory: List[DeploymentHistory] = []
    tags: List[str] = []
    dependencies: List[str] = []  # IDs of other releases
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "releases"
        indexes = [
            [("name", 1)],
            [("version", 1)],
            [("status", 1)],
            [("createdAt", -1)],
        ]

class Environment(Document):
    name: str = Field(..., min_length=1)
    type: EnvironmentType
    url: str
    description: str
    requiresApproval: bool = False
    approvers: List[str] = []
    healthCheckUrl: Optional[str] = None
    config: Dict[str, Any] = {}
    currentRelease: Optional[str] = None  # Release ID
    status: str = "healthy"
    lastHealthCheck: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "environments"

class Team(Document):
    name: str = Field(..., min_length=1)
    description: Optional[str] = ""
    members: List[str] = []
    lead: Optional[str] = None
    projects: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "teams"

class Workflow(Document):
    name: str = Field(..., min_length=1)
    description: Optional[str] = ""
    steps: List[str] = []
    triggers: List[str] = []
    isActive: bool = True
    createdBy: str = "system"
    createdAt: datetime = Field(default_factory=datetime.now)
    updatedAt: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "workflows"

# Request/Response Models
class ReleaseCreate(BaseModel):
    name: str
    version: str
    description: Optional[str] = ""
    type: Optional[ReleaseType] = ReleaseType.minor
    status: Optional[ReleaseStatus] = ReleaseStatus.planning
    priority: Optional[Priority] = Priority.medium
    plannedDate: Optional[datetime] = None
    assignedTo: Optional[List[str]] = []
    features: Optional[List[Feature]] = []
    tasks: Optional[List[Task]] = []
    tags: Optional[List[str]] = []

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
    tasks: Optional[List[Task]] = None
    tags: Optional[List[str]] = None

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

# Database initialization
async def init_database():
    client = AsyncIOMotorClient(MONGODB_URL)
    await init_beanie(
        database=client[DATABASE_NAME],
        document_models=[Release, Environment, Team, Workflow]
    )
    
    # Initialize sample data if collections are empty
    release_count = await Release.count()
    if release_count == 0:
        await init_sample_data()

async def init_sample_data():
    # Sample environments
    environments = [
        Environment(
            name="Development",
            type=EnvironmentType.development,
            url="https://dev.example.com",
            description="Development environment",
            requiresApproval=False,
            healthCheckUrl="https://dev.example.com/health"
        ),
        Environment(
            name="Staging",
            type=EnvironmentType.staging,
            url="https://staging.example.com",
            description="Staging environment",
            requiresApproval=True,
            approvers=["user-1", "user-2"],
            healthCheckUrl="https://staging.example.com/health"
        ),
        Environment(
            name="Production",
            type=EnvironmentType.production,
            url="https://www.example.com",
            description="Production environment",
            requiresApproval=True,
            approvers=["user-1", "user-2", "user-3"],
            healthCheckUrl="https://www.example.com/health"
        )
    ]
    
    for env in environments:
        await env.insert()
    
    # Sample teams
    teams = [
        Team(
            name="Platform Team",
            description="Core platform development",
            members=["John Doe", "Jane Smith"],
            lead="John Doe"
        ),
        Team(
            name="Mobile Team",
            description="Mobile application development",
            members=["Bob Johnson", "Alice Brown"],
            lead="Bob Johnson"
        ),
        Team(
            name="DevOps Team",
            description="Infrastructure and deployment",
            members=["Charlie Wilson", "Diana Prince"],
            lead="Charlie Wilson"
        )
    ]
    
    for team in teams:
        await team.insert()
    
    # Sample releases with hierarchical structure
    releases = [
        Release(
            name="Q1 2024 Major Release",
            version="2.0.0",
            description="Major platform upgrade with new features and improved performance",
            type=ReleaseType.major,
            status=ReleaseStatus.in_development,
            priority=Priority.high,
            plannedDate=datetime.now(),
            features=[
                Feature(
                    id="f1",
                    title="New Dashboard UI",
                    description="Complete redesign of the dashboard with modern UI components",
                    status="in-progress",
                    priority=Priority.high,
                    storyPoints=13
                ),
                Feature(
                    id="f2",
                    title="API v2",
                    description="New REST API version with GraphQL support",
                    status="in-progress",
                    priority=Priority.high,
                    storyPoints=21
                ),
                Feature(
                    id="f3",
                    title="Advanced Analytics",
                    description="Real-time analytics and reporting features",
                    status="planning",
                    priority=Priority.medium,
                    storyPoints=8
                )
            ],
            tasks=[
                Task(
                    id="t1",
                    title="Database migration scripts",
                    description="Create and test migration scripts for v2.0",
                    status="in-progress",
                    priority=Priority.high,
                    estimatedHours=16
                ),
                Task(
                    id="t2",
                    title="Performance testing",
                    description="Load testing for new features",
                    status="todo",
                    priority=Priority.medium,
                    estimatedHours=8
                )
            ],
            tags=["major", "ui-update", "api-v2"],
            metrics=ReleaseMetrics(
                deploymentDuration=180,
                successRate=99.5,
                affectedUsers=10000
            )
        ),
        Release(
            name="Security Patch v1.9.1",
            version="1.9.1",
            description="Critical security updates and vulnerability fixes",
            type=ReleaseType.patch,
            status=ReleaseStatus.testing,
            priority=Priority.critical,
            plannedDate=datetime.now(),
            features=[
                Feature(
                    id="f1",
                    title="Authentication Fix",
                    description="Fix JWT token validation vulnerability",
                    status="completed",
                    priority=Priority.critical,
                    storyPoints=5
                ),
                Feature(
                    id="f2",
                    title="SQL Injection Prevention",
                    description="Update query builders to prevent SQL injection",
                    status="testing",
                    priority=Priority.critical,
                    storyPoints=8
                )
            ],
            tags=["security", "critical", "patch"]
        ),
        Release(
            name="Performance Improvements",
            version="1.10.0",
            description="Backend optimization and caching improvements",
            type=ReleaseType.minor,
            status=ReleaseStatus.planning,
            priority=Priority.medium,
            plannedDate=datetime.now(),
            features=[
                Feature(
                    id="f1",
                    title="Redis Caching",
                    description="Implement Redis for API response caching",
                    status="planning",
                    priority=Priority.medium,
                    storyPoints=13
                ),
                Feature(
                    id="f2",
                    title="Database Query Optimization",
                    description="Optimize slow queries and add indexes",
                    status="planning",
                    priority=Priority.medium,
                    storyPoints=8
                )
            ],
            tags=["performance", "optimization", "backend"]
        )
    ]
    
    for release in releases:
        await release.insert()
    
    print(f"Initialized sample data: {len(releases)} releases, {len(environments)} environments, {len(teams)} teams")

# Startup event
@app.on_event("startup")
async def startup_event():
    await init_database()

# Routes
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "timestamp": datetime.now().isoformat(),
        "service": "Ops Portal Backend API",
        "database": "MongoDB"
    }

@app.get("/api/v1/releases", response_model=Dict[str, Any])
async def get_releases(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None
):
    # Build query
    query = {}
    if status:
        query["status"] = status
    if type:
        query["type"] = type
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"version": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await Release.find(query).count()
    
    # Get paginated results
    skip = (page - 1) * limit
    releases = await Release.find(query).skip(skip).limit(limit).sort("-createdAt").to_list()
    
    return {
        "releases": [r.model_dump() for r in releases],
        "total": total,
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }

@app.get("/api/v1/releases/{release_id}")
async def get_release(release_id: str):
    try:
        release = await Release.get(release_id)
        if not release:
            raise HTTPException(status_code=404, detail="Release not found")
        return release.model_dump()
    except Exception as e:
        raise HTTPException(status_code=404, detail="Release not found")

@app.post("/api/v1/releases", status_code=201)
async def create_release(release: ReleaseCreate):
    new_release = Release(**release.model_dump())
    await new_release.insert()
    return new_release.model_dump()

@app.put("/api/v1/releases/{release_id}")
async def update_release(release_id: str, update: ReleaseUpdate):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    update_data = update.model_dump(exclude_unset=True)
    update_data["updatedAt"] = datetime.now()
    
    await release.set(update_data)
    return release.model_dump()

@app.delete("/api/v1/releases/{release_id}", status_code=204)
async def delete_release(release_id: str):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    await release.delete()
    return None

@app.post("/api/v1/releases/{release_id}/deploy")
async def deploy_release(release_id: str, request: DeployRequest):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    # Update release status and add deployment history
    deployment = DeploymentHistory(
        environmentId=request.environmentId,
        deployedAt=datetime.now(),
        deployedBy="current-user",
        version=release.version,
        status="deploying",
        notes=f"Deployment initiated with skipTests={request.skipTests}, autoRollback={request.autoRollback}"
    )
    
    release.deploymentHistory.append(deployment)
    release.status = ReleaseStatus.deploying
    release.updatedAt = datetime.now()
    await release.save()
    
    return release.model_dump()

@app.post("/api/v1/releases/{release_id}/rollback")
async def rollback_release(release_id: str, request: RollbackRequest):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release.status = ReleaseStatus.rolled_back
    release.updatedAt = datetime.now()
    
    if release.metrics:
        release.metrics.rollbackCount += 1
    
    await release.save()
    return release.model_dump()

@app.post("/api/v1/releases/{release_id}/approve")
async def approve_release(release_id: str, request: ApprovalRequest):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release.status = ReleaseStatus.approved
    release.updatedAt = datetime.now()
    await release.save()
    return release.model_dump()

@app.post("/api/v1/releases/{release_id}/reject")
async def reject_release(release_id: str, request: RejectionRequest):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    release.status = ReleaseStatus.rejected
    release.updatedAt = datetime.now()
    await release.save()
    return release.model_dump()

@app.get("/api/v1/releases/{release_id}/metrics")
async def get_release_metrics(release_id: str):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    if not release.metrics:
        release.metrics = ReleaseMetrics()
    
    return release.metrics.model_dump()

@app.get("/api/v1/releases/{release_id}/history")
async def get_release_history(release_id: str, limit: int = Query(10, ge=1, le=100)):
    release = await Release.get(release_id)
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    history = release.deploymentHistory[-limit:] if release.deploymentHistory else []
    return [h.model_dump() for h in history]

@app.get("/api/v1/releases/analytics")
async def get_release_analytics():
    # Aggregate analytics from all releases
    releases = await Release.find_all().to_list()
    
    total_releases = len(releases)
    deployed = sum(1 for r in releases if r.status == ReleaseStatus.deployed)
    in_progress = sum(1 for r in releases if r.status in [ReleaseStatus.in_development, ReleaseStatus.testing])
    
    # Calculate average metrics
    avg_features = sum(len(r.features) for r in releases) / total_releases if total_releases > 0 else 0
    avg_tasks = sum(len(r.tasks) for r in releases) / total_releases if total_releases > 0 else 0
    
    return {
        "totalReleases": total_releases,
        "deployedReleases": deployed,
        "inProgressReleases": in_progress,
        "averageFeaturesPerRelease": avg_features,
        "averageTasksPerRelease": avg_tasks,
        "metrics": {
            "velocity": 75,
            "leadTime": 12,
            "cycleTime": 5,
            "deploymentFrequency": 3,
            "mttr": 2,
            "changeFailureRate": 5,
            "bugEscapeRate": 2
        }
    }

@app.get("/api/v1/environments")
async def get_environments():
    environments = await Environment.find_all().to_list()
    return [env.model_dump() for env in environments]

@app.get("/api/v1/environments/{env_id}/status")
async def get_environment_status(env_id: str):
    env = await Environment.get(env_id)
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    
    return {
        "id": str(env.id),
        "name": env.name,
        "status": env.status,
        "currentRelease": env.currentRelease,
        "lastHealthCheck": env.lastHealthCheck.isoformat() if env.lastHealthCheck else None,
        "url": env.url
    }

@app.get("/api/v1/dashboard/stats")
async def get_dashboard_stats():
    releases = await Release.find_all().to_list()
    environments = await Environment.find_all().to_list()
    teams = await Team.find_all().to_list()
    
    total = len(releases)
    active = sum(1 for r in releases if r.status == ReleaseStatus.in_development)
    deployed = sum(1 for r in releases if r.status == ReleaseStatus.deployed)
    pending = sum(1 for r in releases if r.status == ReleaseStatus.planning)
    
    return {
        "totalReleases": total,
        "activeReleases": active,
        "deployedReleases": deployed,
        "pendingApprovals": pending,
        "totalEnvironments": len(environments),
        "totalTeams": len(teams)
    }

@app.get("/api/v1/dashboard/metrics")
async def get_dashboard_metrics():
    return {
        "deploymentFrequency": 3.5,
        "leadTime": 14,
        "mttr": 2.5,
        "changeFailureRate": 5.2
    }

@app.get("/api/v1/dashboard/health")
async def get_dashboard_health():
    return {
        "status": "healthy",
        "uptime": 99.99,
        "timestamp": datetime.now().isoformat(),
        "database": "connected"
    }

@app.get("/api/v1/teams")
async def get_teams():
    teams = await Team.find_all().to_list()
    return [team.model_dump() for team in teams]

@app.get("/api/v1/teams/{team_id}/members")
async def get_team_members(team_id: str):
    team = await Team.get(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team.members

@app.get("/api/v1/workflows")
async def get_workflows():
    workflows = await Workflow.find_all().to_list()
    return [workflow.model_dump() for workflow in workflows]

if __name__ == "__main__":
    print("Starting Ops Portal Backend API with MongoDB...")
    print(f"MongoDB URL: {MONGODB_URL}")
    print(f"Database: {DATABASE_NAME}")
    print("API Documentation available at: http://localhost:8080/docs")
    print("Alternative docs at: http://localhost:8080/redoc")
    uvicorn.run("main_mongo:app", host="0.0.0.0", port=8080, reload=True)