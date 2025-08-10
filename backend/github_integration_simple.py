"""
Simplified GitHub Integration Module for Release Management
Creates issues without labels or assignees to avoid validation errors
"""

import os
import aiohttp
import json
from typing import Optional, Dict, List, Any
from datetime import datetime

class GitHubIntegrationSimple:
    def __init__(self, token: str, owner: str, repo: str, enterprise_url: Optional[str] = None):
        """
        Initialize GitHub integration
        
        Args:
            token: GitHub personal access token
            owner: Repository owner (username or organization)
            repo: Repository name
            enterprise_url: GitHub Enterprise base URL (e.g., 'https://github.company.com')
        """
        self.token = token
        self.owner = owner
        self.repo = repo
        self.enterprise_url = enterprise_url
        
        # Determine API base URL based on whether it's enterprise or cloud
        if enterprise_url:
            # GitHub Enterprise format: https://github.company.com/api/v3/repos/{owner}/{repo}
            # Remove trailing slash if present
            base = enterprise_url.rstrip('/')
            self.api_base = f"{base}/api/v3"
            self.base_url = f"{self.api_base}/repos/{owner}/{repo}"
        else:
            # GitHub.com format: https://api.github.com/repos/{owner}/{repo}
            self.api_base = "https://api.github.com"
            self.base_url = f"{self.api_base}/repos/{owner}/{repo}"
        
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }
    
    async def create_issue(self, node_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a GitHub issue from a release node (simplified version)
        
        Args:
            node_data: Node data including title, description, properties
            
        Returns:
            Created GitHub issue data
        """
        # Build issue title
        node_type = node_data.get('type', 'task').upper()
        title = f"[{node_type}] {node_data.get('title', 'Untitled')}"
        
        # Build issue body with metadata
        properties = node_data.get('properties', {})
        description = properties.get('description', 'No description provided')
        
        body = f"""## Description
{description}

## Details
- **Type**: {node_data.get('type', 'task')}
- **Priority**: {properties.get('priority', 'medium')}
- **Status**: {properties.get('status', 'planning')}
- **Version**: {properties.get('version', 'N/A')}
- **Assignee**: {properties.get('assignee', 'Unassigned')}

---
*Created from Release Management Tool*
*Node ID: {node_data.get('id', 'unknown')}*
"""
        
        # Simple issue data without labels or assignees
        issue_data = {
            "title": title,
            "body": body
        }
        
        print(f"Creating GitHub issue: {title}")
        
        # Create issue via GitHub API
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/issues",
                headers=self.headers,
                json=issue_data
            ) as response:
                if response.status == 201:
                    issue = await response.json()
                    print(f"  [OK] Created issue #{issue['number']}")
                    return {
                        "success": True,
                        "issue_number": issue["number"],
                        "issue_url": issue["html_url"],
                        "issue_id": issue["id"],
                        "created_at": issue["created_at"]
                    }
                else:
                    error_data = await response.text()
                    print(f"  [ERROR] Failed to create issue: {response.status}")
                    print(f"    Error: {error_data[:200]}")
                    return {
                        "success": False,
                        "error": f"Failed to create issue: {response.status}",
                        "details": error_data
                    }
    
    async def update_issue_status(self, issue_number: int, status: str) -> Dict[str, Any]:
        """
        Update GitHub issue based on status change
        
        Args:
            issue_number: GitHub issue number
            status: New status from our system
            
        Returns:
            Update result
        """
        # Map status to GitHub state
        github_state = "closed" if status in ["released", "completed", "cancelled"] else "open"
        
        update_data = {
            "state": github_state
        }
        
        # Update issue state
        async with aiohttp.ClientSession() as session:
            async with session.patch(
                f"{self.base_url}/issues/{issue_number}",
                headers=self.headers,
                json=update_data
            ) as response:
                if response.status != 200:
                    error_data = await response.text()
                    return {
                        "success": False,
                        "error": f"Failed to update issue state: {response.status}",
                        "details": error_data
                    }
            
            # Add a comment about the status change
            comment = f"Status updated to: **{status}**\n\n*Updated from Release Management Tool*"
            async with session.post(
                f"{self.base_url}/issues/{issue_number}/comments",
                headers=self.headers,
                json={"body": comment}
            ) as comment_response:
                pass  # Comment is optional, don't fail if it doesn't work
            
            return {
                "success": True,
                "issue_number": issue_number,
                "new_status": status,
                "github_state": github_state
            }
    
    async def create_issues_for_release(self, release_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create GitHub issues for all nodes in a release
        
        Args:
            release_data: Complete release data with nodes
            
        Returns:
            Results of issue creation
        """
        results = {
            "success": True,
            "created_issues": [],
            "failed_issues": [],
            "total_processed": 0
        }
        
        print(f"\nProcessing release: {release_data.get('name', 'Unnamed')}")
        print(f"Nodes to process: {len(release_data.get('nodes', []))}")
        
        # Process all nodes recursively
        async def process_node(node: Dict[str, Any], parent_issue: Optional[int] = None, level: int = 0):
            results["total_processed"] += 1
            indent = "  " * level
            print(f"{indent}Processing: {node.get('title', 'Untitled')}")
            
            # Create issue for this node
            issue_result = await self.create_issue(node)
            
            if issue_result["success"]:
                issue_info = {
                    "node_id": node.get("id"),
                    "node_title": node.get("title"),
                    "issue_number": issue_result["issue_number"],
                    "issue_url": issue_result["issue_url"]
                }
                
                # If there's a parent issue, add a comment linking them
                if parent_issue:
                    await self.add_issue_link(
                        parent_issue,
                        issue_result["issue_number"],
                        node.get("title")
                    )
                
                results["created_issues"].append(issue_info)
                
                # Process children
                children = node.get("children", [])
                for child in children:
                    await process_node(child, issue_result["issue_number"], level + 1)
            else:
                results["failed_issues"].append({
                    "node_id": node.get("id"),
                    "node_title": node.get("title"),
                    "error": issue_result.get("error")
                })
                results["success"] = False
        
        # Process all root nodes
        nodes = release_data.get("nodes", [])
        for node in nodes:
            await process_node(node)
        
        print(f"\nResults: {len(results['created_issues'])} created, {len(results['failed_issues'])} failed")
        
        return results
    
    async def add_issue_link(self, parent_issue: int, child_issue: int, child_title: str):
        """
        Add a comment to parent issue linking to child issue
        """
        comment = f"Sub-task: #{child_issue} - {child_title}"
        
        async with aiohttp.ClientSession() as session:
            await session.post(
                f"{self.base_url}/issues/{parent_issue}/comments",
                headers=self.headers,
                json={"body": comment}
            )

# Configuration helper
def get_github_config():
    """
    Get GitHub configuration from environment variables
    
    Uses GITHUB_ENTERPRISE flag to switch between cloud and enterprise:
    - GITHUB_ENTERPRISE=false: Use GitHub.com with GITHUB_CLOUD_* variables
    - GITHUB_ENTERPRISE=true: Use Enterprise with GITHUB_ENTERPRISE_* variables
    """
    # Check if enterprise mode is enabled
    is_enterprise = os.getenv("GITHUB_ENTERPRISE", "false").lower() == "true"
    
    if is_enterprise:
        # Use enterprise configuration
        config = {
            "token": os.getenv("GITHUB_ENTERPRISE_TOKEN", ""),
            "owner": os.getenv("GITHUB_ENTERPRISE_OWNER", ""),
            "repo": os.getenv("GITHUB_ENTERPRISE_REPO", ""),
            "type": "enterprise",
            "enterprise_url": os.getenv("GITHUB_ENTERPRISE_URL", "")
        }
    else:
        # Use cloud configuration
        config = {
            "token": os.getenv("GITHUB_CLOUD_TOKEN", ""),
            "owner": os.getenv("GITHUB_CLOUD_OWNER", ""),
            "repo": os.getenv("GITHUB_CLOUD_REPO", ""),
            "type": "cloud",
            "enterprise_url": None
        }
    
    return config

def validate_github_config(config: Dict[str, str]) -> bool:
    """
    Validate GitHub configuration
    
    For cloud: requires token, owner, repo
    For enterprise: also requires enterprise_url
    """
    # Basic requirements
    basic_valid = all([
        config.get("token"),
        config.get("owner"),
        config.get("repo")
    ])
    
    if not basic_valid:
        return False
    
    # If enterprise, also need enterprise URL
    if config.get("type") == "enterprise":
        return bool(config.get("enterprise_url"))
    
    return True