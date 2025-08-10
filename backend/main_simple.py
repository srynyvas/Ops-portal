from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uvicorn

app = FastAPI(title="Ops Portal Backend API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database
releases_db: Dict[str, dict] = {}
release_counter = 1

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ops-portal-backend"}

# Release endpoints
@app.get("/api/v1/releases")
def get_releases():
    """Get all releases"""
    return list(releases_db.values())

@app.get("/api/v1/releases/{release_id}")
def get_release(release_id: str):
    """Get a specific release by ID"""
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    return releases_db[release_id]

@app.post("/api/v1/releases", status_code=201)
def create_release(release_data: dict):
    """Create a new release"""
    global release_counter
    
    # Generate ID if not provided
    if not release_data.get("id"):
        release_data["id"] = f"release-{release_counter}"
        release_counter += 1
    
    release_id = release_data["id"]
    
    # Add timestamps
    if "createdAt" not in release_data:
        release_data["createdAt"] = datetime.now().isoformat()
    release_data["updatedAt"] = datetime.now().isoformat()
    
    # Store in database
    releases_db[release_id] = release_data
    
    return release_data

@app.put("/api/v1/releases/{release_id}")
def update_release(release_id: str, release_data: dict):
    """Update an existing release"""
    if release_id not in releases_db:
        # Create new release if not exists
        release_data["id"] = release_id
        return create_release(release_data)
    
    # Update existing release
    release_data["id"] = release_id
    release_data["updatedAt"] = datetime.now().isoformat()
    
    # Preserve createdAt
    if "createdAt" not in release_data and "createdAt" in releases_db[release_id]:
        release_data["createdAt"] = releases_db[release_id]["createdAt"]
    
    releases_db[release_id] = release_data
    
    return release_data

@app.delete("/api/v1/releases/{release_id}", status_code=204)
def delete_release(release_id: str):
    """Delete a release"""
    if release_id not in releases_db:
        raise HTTPException(status_code=404, detail="Release not found")
    del releases_db[release_id]
    return None

# Environment endpoints
@app.get("/api/v1/environments")
def get_environments():
    """Get all environments"""
    return [
        {
            "id": "env-1",
            "name": "Development",
            "type": "development",
            "url": "https://dev.example.com",
            "description": "Development environment for testing"
        },
        {
            "id": "env-2",
            "name": "Staging",
            "type": "staging",
            "url": "https://staging.example.com",
            "description": "Staging environment for pre-production testing"
        },
        {
            "id": "env-3",
            "name": "Production",
            "type": "production",
            "url": "https://example.com",
            "description": "Production environment"
        }
    ]

# Team endpoints
@app.get("/api/v1/teams")
def get_teams():
    """Get all teams"""
    return [
        {
            "id": "team-1",
            "name": "Platform Team",
            "description": "Core platform development",
            "members": ["john.doe", "jane.smith", "bob.johnson"],
            "lead": "john.doe"
        },
        {
            "id": "team-2",
            "name": "DevOps Team",
            "description": "Infrastructure and deployment",
            "members": ["alice.williams", "charlie.brown"],
            "lead": "alice.williams"
        }
    ]

# Workflow endpoints
@app.get("/api/v1/workflows")
def get_workflows():
    """Get all workflows"""
    return [
        {
            "id": "workflow-1",
            "name": "Standard Release",
            "description": "Standard release workflow",
            "steps": ["Development", "Testing", "Staging", "Production"],
            "isActive": True
        }
    ]

# Dashboard endpoints
@app.get("/api/v1/dashboard/stats")
def get_dashboard_stats():
    """Get dashboard statistics"""
    total_releases = len(releases_db)
    active_releases = sum(1 for r in releases_db.values() if r.get("status") == "active")
    
    # Calculate average completion
    completions = [r.get("completion", 0) for r in releases_db.values()]
    avg_completion = sum(completions) / len(completions) if completions else 0
    
    return {
        "totalReleases": total_releases,
        "activeReleases": active_releases,
        "averageCompletion": round(avg_completion, 2),
        "totalEnvironments": 3,
        "totalTeams": 2,
        "totalWorkflows": 1
    }

@app.get("/api/v1/dashboard/metrics")
def get_dashboard_metrics():
    """Get dashboard metrics"""
    metrics = {
        "releasesByCategory": {},
        "releasesByStatus": {},
        "releasesByEnvironment": {},
        "completionRates": []
    }
    
    for release in releases_db.values():
        # Count by category
        cat = release.get("category", "minor")
        metrics["releasesByCategory"][cat] = metrics["releasesByCategory"].get(cat, 0) + 1
        
        # Count by status
        status = release.get("status", "active")
        metrics["releasesByStatus"][status] = metrics["releasesByStatus"].get(status, 0) + 1
        
        # Count by environment
        env = release.get("environment", "development")
        metrics["releasesByEnvironment"][env] = metrics["releasesByEnvironment"].get(env, 0) + 1
        
        # Collect completion rates
        metrics["completionRates"].append({
            "name": release.get("name", "Unnamed"),
            "completion": release.get("completion", 0)
        })
    
    return metrics

@app.get("/api/v1/dashboard/health")
def get_system_health():
    """Get system health status"""
    return {
        "status": "healthy",
        "database": "in-memory",
        "uptime": "100%",
        "lastCheck": datetime.now().isoformat()
    }

# Initialize with sample data
def init_sample_data():
    global releases_db, release_counter
    
    sample_release = {
        "id": "release-sample-1",
        "name": "Q1 2024 Major Release",
        "version": "2.0.0",
        "description": "Major platform upgrade with new features",
        "category": "major",
        "tags": ["platform", "upgrade"],
        "targetDate": "2024-03-31",
        "environment": "production",
        "status": "active",
        "statusHistory": [],
        "createdAt": datetime.now().isoformat(),
        "updatedAt": datetime.now().isoformat(),
        "nodeCount": 4,
        "completion": 25,
        "preview": {
            "centralNode": "Q1 2024 Release",
            "branches": ["Feature 1", "Feature 2"]
        },
        "nodes": [
            {
                "id": "node-1",
                "title": "Q1 2024 Release",
                "type": "release",
                "color": "bg-purple-600",
                "icon": "Rocket",
                "expanded": True,
                "properties": {
                    "version": "2.0.0",
                    "assignee": "",
                    "targetDate": "2024-03-31",
                    "environment": "production",
                    "description": "Major platform release with new dashboard and API integrations",
                    "tags": ["major", "platform"],
                    "priority": "high",
                    "status": "in-development",
                    "storyPoints": "",
                    "dependencies": [],
                    "notes": "",
                    "releaseNotes": ""
                },
                "children": [
                    {
                        "id": "node-2",
                        "title": "User Dashboard",
                        "type": "feature",
                        "color": "bg-blue-600",
                        "icon": "Layout",
                        "expanded": True,
                        "properties": {
                            "version": "1.0.0",
                            "assignee": "John Doe",
                            "targetDate": "",
                            "environment": "development",
                            "description": "New user dashboard with real-time analytics and customizable widgets",
                            "tags": ["frontend", "ux"],
                            "priority": "high",
                            "status": "testing",
                            "storyPoints": "8",
                            "dependencies": [],
                            "notes": "",
                            "releaseNotes": ""
                        },
                        "children": []
                    },
                    {
                        "id": "node-3",
                        "title": "API Integration",
                        "type": "feature",
                        "color": "bg-green-600",
                        "icon": "Link",
                        "expanded": True,
                        "properties": {
                            "version": "1.0.0",
                            "assignee": "Jane Smith",
                            "targetDate": "",
                            "environment": "development",
                            "description": "Third-party API integrations for payment processing and notifications",
                            "tags": ["backend", "integration"],
                            "priority": "medium",
                            "status": "planning",
                            "storyPoints": "13",
                            "dependencies": [],
                            "notes": "",
                            "releaseNotes": ""
                        },
                        "children": []
                    }
                ]
            }
        ]
    }
    
    releases_db["release-sample-1"] = sample_release
    release_counter = 2

# Initialize on startup
init_sample_data()

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8080,
        reload=True
    )