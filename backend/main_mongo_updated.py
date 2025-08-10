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
from github_integration_simple import GitHubIntegrationSimple as GitHubIntegration, get_github_config, validate_github_config

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
class NodeType(str, Enum):
    release = "release"
    feature = "feature"
    task = "task"

class PriorityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class StatusType(str, Enum):
    planning = "planning"
    in_development = "in-development"
    testing = "testing"
    ready_for_release = "ready-for-release"
    released = "released"
    blocked = "blocked"
    on_hold = "on-hold"

class EnvironmentType(str, Enum):
    development = "development"
    staging = "staging"
    production = "production"

class CategoryType(str, Enum):
    major = "major"
    minor = "minor"
    patch = "patch"
    hotfix = "hotfix"
    beta = "beta"

# Nested Models
class ReleaseProperties(BaseModel):
    version: str = "1.0.0"
    assignee: str = ""
    targetDate: str = ""
    environment: EnvironmentType = EnvironmentType.development
    description: str = ""
    tags: List[str] = []
    priority: PriorityLevel = PriorityLevel.medium
    status: StatusType = StatusType.planning
    storyPoints: str = ""
    dependencies: List[str] = []
    notes: str = ""
    releaseNotes: str = ""

class GitHubIssueInfo(BaseModel):
    issue_number: Optional[int] = None
    issue_url: Optional[str] = None
    issue_id: Optional[int] = None
    created_at: Optional[str] = None
    last_synced: Optional[str] = None

class ReleaseNode(BaseModel):
    id: str
    title: str
    type: NodeType
    color: str = "bg-blue-600"
    icon: str = "Package"
    expanded: Optional[bool] = True
    properties: ReleaseProperties
    children: List['ReleaseNode'] = []
    x: Optional[float] = None
    y: Optional[float] = None
    github_issue: Optional[GitHubIssueInfo] = None

# Update forward references
ReleaseNode.model_rebuild()

class PreviewData(BaseModel):
    centralNode: str
    branches: List[str] = []

class StatusHistoryEntry(BaseModel):
    status: Optional[str] = None  # Made optional for compatibility
    timestamp: Optional[str] = None  # Made optional for compatibility
    reason: Optional[str] = None
    changedBy: Optional[str] = None
    # Additional fields from frontend
    action: Optional[str] = None
    user: Optional[str] = None
    previousStatus: Optional[str] = None
    newStatus: Optional[str] = None

# MongoDB Document Model
class Release(Document):
    custom_id: Optional[str] = Field(None, description="Custom ID for frontend compatibility")
    name: str = Field(..., min_length=1)
    version: str = Field(..., min_length=1)
    description: str = ""
    category: CategoryType = CategoryType.minor
    tags: List[str] = []
    targetDate: str = ""
    environment: EnvironmentType = EnvironmentType.development
    status: str = "active"  # 'active' or 'closed'
    isReopened: bool = False
    statusHistory: List[StatusHistoryEntry] = []
    createdAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    nodeCount: int = 0
    completion: int = 0
    preview: PreviewData = PreviewData(centralNode="", branches=[])
    nodes: List[ReleaseNode] = []

    class Settings:
        name = "releases"
        indexes = [
            [("name", 1)],
            [("version", 1)],
            [("status", 1)],
            [("createdAt", -1)],
        ]

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

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

# Initialize database
async def init_db():
    client = AsyncIOMotorClient(MONGODB_URL)
    await init_beanie(
        database=client[DATABASE_NAME],
        document_models=[Release, Environment, Team, Workflow]
    )

@app.on_event("startup")
async def startup_event():
    await init_db()
    print(f"Connected to MongoDB at {MONGODB_URL}")
    print(f"Using database: {DATABASE_NAME}")
    
    # Create sample data if collections are empty
    release_count = await Release.count()
    if release_count == 0:
        print("Creating sample releases...")
        await create_sample_data()

async def create_sample_data():
    """Create sample releases with node structure"""
    sample_release = Release(
        name="Q1 2024 Major Release",
        version="2.0.0",
        description="Major platform upgrade with new features",
        category=CategoryType.major,
        tags=["platform", "upgrade"],
        targetDate="2024-03-31",
        environment=EnvironmentType.production,
        status="active",
        nodeCount=4,
        completion=25,
        preview=PreviewData(centralNode="Q1 2024 Release", branches=["Feature 1", "Feature 2"]),
        nodes=[
            ReleaseNode(
                id="node-1",
                title="Q1 2024 Release",
                type=NodeType.release,
                color="bg-purple-600",
                icon="Rocket",
                properties=ReleaseProperties(
                    version="2.0.0",
                    description="Major platform release",
                    priority=PriorityLevel.high,
                    status=StatusType.in_development
                ),
                children=[
                    ReleaseNode(
                        id="node-2",
                        title="User Dashboard",
                        type=NodeType.feature,
                        color="bg-blue-600",
                        icon="Layout",
                        properties=ReleaseProperties(
                            description="New user dashboard with analytics",
                            assignee="John Doe",
                            status=StatusType.testing
                        ),
                        children=[]
                    ),
                    ReleaseNode(
                        id="node-3",
                        title="API Integration",
                        type=NodeType.feature,
                        color="bg-green-600",
                        icon="Link",
                        properties=ReleaseProperties(
                            description="Third-party API integrations",
                            assignee="Jane Smith",
                            status=StatusType.planning
                        ),
                        children=[]
                    )
                ]
            )
        ]
    )
    
    await sample_release.save()
    print("Sample release created")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ops-portal-backend"}

# Release endpoints
@app.get("/api/v1/releases")
async def get_releases(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    category: Optional[CategoryType] = None
):
    """Get all releases with optional filtering"""
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    releases = await Release.find(query).skip(skip).limit(limit).to_list()
    
    # Convert to dicts and add id field for frontend compatibility
    release_list = []
    for release in releases:
        release_dict = release.model_dump()
        release_dict["id"] = release.custom_id or str(release.id)
        release_list.append(release_dict)
    
    return release_list

@app.get("/api/v1/releases/{release_id}")
async def get_release(release_id: str):
    """Get a specific release by ID"""
    # Try to find by custom id field first
    release = await Release.find_one({"custom_id": release_id})
    if not release:
        # Try MongoDB ObjectId
        try:
            from bson import ObjectId
            if ObjectId.is_valid(release_id):
                release = await Release.get(release_id)
        except:
            pass
    
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    # Convert to dict and add id field for frontend compatibility
    release_dict = release.model_dump()
    release_dict["id"] = release.custom_id or str(release.id)
    return release_dict

@app.post("/api/v1/releases")
async def create_release(release_data: dict):
    """Create a new release"""
    # Extract id if provided and use as custom_id
    if "id" in release_data:
        release_data["custom_id"] = release_data.pop("id")
    
    # Convert dict to Release model
    release = Release(**release_data)
    release.updatedAt = datetime.now().isoformat()
    
    # Save to MongoDB
    await release.save()
    
    # Convert to dict and add id field for frontend compatibility
    release_dict = release.model_dump()
    release_dict["id"] = release.custom_id or str(release.id)
    return release_dict

@app.put("/api/v1/releases/{release_id}")
async def update_release(release_id: str, release_data: dict):
    """Update an existing release"""
    try:
        # Extract id if provided and use as custom_id
        if "id" in release_data:
            release_data["custom_id"] = release_data.pop("id")
        
        # Find the release
        release = await Release.find_one({"custom_id": release_id})
        if not release:
            try:
                from bson import ObjectId
                if ObjectId.is_valid(release_id):
                    release = await Release.get(release_id)
            except:
                pass
        
        if not release:
            raise HTTPException(status_code=404, detail="Release not found")
        
        # Update fields - handle nested properties carefully
        for key, value in release_data.items():
            if key == "statusHistory" and isinstance(value, list):
                # Convert status history entries to proper format
                status_history = []
                for entry in value:
                    if isinstance(entry, dict):
                        status_history.append(StatusHistoryEntry(**entry))
                    else:
                        status_history.append(entry)
                setattr(release, key, status_history)
            elif key == "preview" and isinstance(value, dict):
                # Convert preview data to proper format
                setattr(release, key, PreviewData(**value))
            elif key == "nodes" and isinstance(value, list):
                # Convert nodes to proper format
                nodes = []
                for node in value:
                    if isinstance(node, dict):
                        # Recursively handle nested nodes
                        nodes.append(ReleaseNode(**node))
                    else:
                        nodes.append(node)
                setattr(release, key, nodes)
            elif hasattr(release, key):
                setattr(release, key, value)
        
        release.updatedAt = datetime.now().isoformat()
        
        # Save changes
        await release.save()
        
        # Convert to dict and add id field for frontend compatibility
        release_dict = release.model_dump()
        release_dict["id"] = release.custom_id or str(release.id)
        return release_dict
    except Exception as e:
        print(f"Error updating release: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to update release: {str(e)}")

@app.delete("/api/v1/releases/{release_id}")
async def delete_release(release_id: str):
    """Delete a release"""
    release = await Release.find_one({"id": release_id})
    if not release:
        try:
            release = await Release.get(release_id)
        except:
            raise HTTPException(status_code=404, detail="Release not found")
    
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    await release.delete()
    
    return {"message": "Release deleted successfully"}

# Environment endpoints
@app.get("/api/v1/environments")
async def get_environments():
    """Get all environments"""
    environments = await Environment.find_all().to_list()
    return environments

# Team endpoints
@app.get("/api/v1/teams")
async def get_teams():
    """Get all teams"""
    teams = await Team.find_all().to_list()
    return teams

# Workflow endpoints
@app.get("/api/v1/workflows")
async def get_workflows():
    """Get all workflows"""
    workflows = await Workflow.find_all().to_list()
    return workflows

# Dashboard endpoints
@app.get("/api/v1/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    total_releases = await Release.count()
    active_releases = await Release.find({"status": "active"}).count()
    
    # Calculate average completion
    releases = await Release.find_all().to_list()
    avg_completion = sum(r.completion for r in releases) / len(releases) if releases else 0
    
    return {
        "totalReleases": total_releases,
        "activeReleases": active_releases,
        "averageCompletion": round(avg_completion, 2),
        "totalEnvironments": await Environment.count(),
        "totalTeams": await Team.count(),
        "totalWorkflows": await Workflow.count()
    }

@app.get("/api/v1/dashboard/metrics")
async def get_dashboard_metrics():
    """Get dashboard metrics"""
    releases = await Release.find_all().to_list()
    
    metrics = {
        "releasesByCategory": {},
        "releasesByStatus": {},
        "releasesByEnvironment": {},
        "completionRates": []
    }
    
    for release in releases:
        # Count by category
        cat = release.category
        metrics["releasesByCategory"][cat] = metrics["releasesByCategory"].get(cat, 0) + 1
        
        # Count by status
        status = release.status
        metrics["releasesByStatus"][status] = metrics["releasesByStatus"].get(status, 0) + 1
        
        # Count by environment
        env = release.environment
        metrics["releasesByEnvironment"][env] = metrics["releasesByEnvironment"].get(env, 0) + 1
        
        # Collect completion rates
        metrics["completionRates"].append({
            "name": release.name,
            "completion": release.completion
        })
    
    return metrics

@app.get("/api/v1/dashboard/health")
async def get_system_health():
    """Get system health status"""
    return {
        "status": "healthy",
        "database": "connected",
        "uptime": "100%",
        "lastCheck": datetime.now().isoformat()
    }

# GitHub Integration Endpoints
@app.post("/api/v1/releases/{release_id}/publish-to-github")
async def publish_release_to_github(release_id: str):
    """Publish a release and its nodes to GitHub as issues"""
    # Get GitHub configuration
    github_config = get_github_config()
    if not validate_github_config(github_config):
        raise HTTPException(
            status_code=400,
            detail="GitHub integration not configured. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables."
        )
    
    # Find the release
    release = await Release.find_one({"custom_id": release_id})
    if not release:
        try:
            from bson import ObjectId
            if ObjectId.is_valid(release_id):
                release = await Release.get(release_id)
        except:
            pass
    
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    # Initialize GitHub integration
    github = GitHubIntegration(
        token=github_config["token"],
        owner=github_config["owner"],
        repo=github_config["repo"],
        enterprise_url=github_config.get("enterprise_url")
    )
    
    # Create issues for all nodes
    release_dict = release.model_dump()
    print(f"DEBUG: Publishing release with {len(release_dict.get('nodes', []))} nodes")
    results = await github.create_issues_for_release(release_dict)
    print(f"DEBUG: GitHub results: {results}")
    
    # Update release with GitHub issue information
    if results["success"] or len(results["created_issues"]) > 0:
        # Update nodes with GitHub issue info
        for created_issue in results["created_issues"]:
            await update_node_github_info(
                release,
                created_issue["node_id"],
                {
                    "issue_number": created_issue["issue_number"],
                    "issue_url": created_issue["issue_url"],
                    "created_at": datetime.now().isoformat()
                }
            )
        
        # Save updated release
        await release.save()
    
    return {
        "success": results["success"],
        "created_issues": results["created_issues"],
        "failed_issues": results["failed_issues"],
        "total_processed": results["total_processed"],
        "message": f"Published {len(results['created_issues'])} issues to GitHub"
    }

@app.post("/api/v1/releases/{release_id}/nodes/{node_id}/sync-github")
async def sync_node_with_github(release_id: str, node_id: str, status_update: Dict[str, Any]):
    """Sync a node's status with its GitHub issue"""
    # Get GitHub configuration
    github_config = get_github_config()
    if not validate_github_config(github_config):
        raise HTTPException(
            status_code=400,
            detail="GitHub integration not configured"
        )
    
    # Find the release
    release = await Release.find_one({"custom_id": release_id})
    if not release:
        try:
            from bson import ObjectId
            if ObjectId.is_valid(release_id):
                release = await Release.get(release_id)
        except:
            pass
    
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    # Find the node and its GitHub issue info
    # Convert nodes to dicts for searching
    nodes_dict = [node.model_dump() if hasattr(node, 'model_dump') else node for node in release.nodes]
    node = find_node_by_id(nodes_dict, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    
    if not node.get("github_issue") or not node.get("github_issue", {}).get("issue_number"):
        raise HTTPException(status_code=400, detail="Node is not published to GitHub")
    
    # Initialize GitHub integration
    github = GitHubIntegration(
        token=github_config["token"],
        owner=github_config["owner"],
        repo=github_config["repo"],
        enterprise_url=github_config.get("enterprise_url")
    )
    
    # Update GitHub issue status
    new_status = status_update.get("status")
    if new_status:
        result = await github.update_issue_status(
            node["github_issue"]["issue_number"],
            new_status
        )
        
        if result["success"]:
            # Update node's GitHub sync timestamp
            node["github_issue"]["last_synced"] = datetime.now().isoformat()
            node["properties"]["status"] = new_status
            await release.save()
            
            return {
                "success": True,
                "message": f"GitHub issue #{node['github_issue']['issue_number']} updated",
                "github_state": result.get("github_state")
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to update GitHub issue"))
    
    return {"success": False, "message": "No status update provided"}

@app.post("/api/v1/releases/{release_id}/close-github-issues")
async def close_all_github_issues(release_id: str):
    """Close all GitHub issues for a release when the release is closed"""
    # Get GitHub configuration
    github_config = get_github_config()
    if not validate_github_config(github_config):
        return {"success": False, "message": "GitHub not configured"}
    
    # Find the release
    release = await Release.find_one({"custom_id": release_id})
    if not release:
        try:
            from bson import ObjectId
            if ObjectId.is_valid(release_id):
                release = await Release.get(release_id)
        except:
            pass
    
    if not release:
        raise HTTPException(status_code=404, detail="Release not found")
    
    # Initialize GitHub integration
    github = GitHubIntegration(
        token=github_config["token"],
        owner=github_config["owner"],
        repo=github_config["repo"],
        enterprise_url=github_config.get("enterprise_url")
    )
    
    closed_issues = []
    failed_issues = []
    
    # Helper function to close issues recursively
    async def close_node_issues(nodes):
        for node in nodes:
            node_dict = node.model_dump() if hasattr(node, 'model_dump') else node
            if node_dict.get("github_issue") and node_dict["github_issue"].get("issue_number"):
                try:
                    result = await github.update_issue_status(
                        node_dict["github_issue"]["issue_number"],
                        "released"  # This will close the issue
                    )
                    if result["success"]:
                        closed_issues.append({
                            "node_id": node_dict["id"],
                            "issue_number": node_dict["github_issue"]["issue_number"]
                        })
                    else:
                        failed_issues.append({
                            "node_id": node_dict["id"],
                            "error": result.get("error")
                        })
                except Exception as e:
                    failed_issues.append({
                        "node_id": node_dict["id"],
                        "error": str(e)
                    })
            
            # Process children
            children = node_dict.get("children", [])
            if children:
                await close_node_issues(children)
    
    # Close all issues
    await close_node_issues(release.nodes)
    
    return {
        "success": len(failed_issues) == 0,
        "closed_issues": closed_issues,
        "failed_issues": failed_issues,
        "message": f"Closed {len(closed_issues)} GitHub issues"
    }

@app.get("/api/v1/github/config-status")
async def get_github_config_status():
    """Check if GitHub integration is configured"""
    github_config = get_github_config()
    is_configured = validate_github_config(github_config)
    
    response = {
        "configured": is_configured,
        "owner": github_config.get("owner", ""),
        "repo": github_config.get("repo", ""),
        "has_token": bool(github_config.get("token")),
        "type": github_config.get("type", "cloud")
    }
    
    # Add enterprise URL if configured
    if github_config.get("type") == "enterprise":
        response["enterprise_url"] = github_config.get("enterprise_url", "")
    
    return response

# Helper functions for GitHub integration
def find_node_by_id(nodes: List, node_id: str) -> Optional[Dict]:
    """Find a node by ID in the node tree"""
    for node in nodes:
        # Handle both dict and Pydantic model
        node_dict = node.model_dump() if hasattr(node, 'model_dump') else node
        if node_dict.get("id") == node_id:
            return node_dict
        children = node_dict.get("children", [])
        found = find_node_by_id(children, node_id)
        if found:
            return found
    return None

async def update_node_github_info(release: Release, node_id: str, github_info: Dict):
    """Update a node's GitHub issue information"""
    def update_in_tree(nodes: List):
        for i, node in enumerate(nodes):
            # Handle both dict and Pydantic model
            node_dict = node if isinstance(node, dict) else node.model_dump()
            if node_dict.get("id") == node_id:
                # Initialize github_issue if it doesn't exist
                if "github_issue" not in node_dict or node_dict["github_issue"] is None:
                    node_dict["github_issue"] = {}
                # Update the github_issue info
                node_dict["github_issue"].update(github_info)
                nodes[i] = node_dict
                return True
            children = node_dict.get("children", [])
            if children and update_in_tree(children):
                node_dict["children"] = children
                nodes[i] = node_dict
                return True
        return False
    
    # Convert to dict, update, and save
    release_dict = release.model_dump()
    update_in_tree(release_dict.get("nodes", []))
    
    # Update the release document
    for key, value in release_dict.items():
        if hasattr(release, key):
            setattr(release, key, value)

if __name__ == "__main__":
    uvicorn.run(
        "main_mongo_updated:app",
        host="0.0.0.0",
        port=8080,
        reload=True
    )