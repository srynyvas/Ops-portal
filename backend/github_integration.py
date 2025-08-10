"""
GitHub Integration Module for Release Management
Handles creation and synchronization of GitHub Issues
"""

import os
import aiohttp
import json
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class GitHubIssueState(str, Enum):
    OPEN = "open"
    CLOSED = "closed"

class GitHubLabel(str, Enum):
    FEATURE = "feature"
    TASK = "task"
    BUG = "bug"
    RELEASE = "release"
    CRITICAL = "priority:critical"
    HIGH = "priority:high"
    MEDIUM = "priority:medium"
    LOW = "priority:low"
    IN_PROGRESS = "status:in-progress"
    TESTING = "status:testing"
    BLOCKED = "status:blocked"
    READY = "status:ready"

# Status mapping between our system and GitHub
STATUS_TO_GITHUB_STATE = {
    "planning": GitHubIssueState.OPEN,
    "in-development": GitHubIssueState.OPEN,
    "testing": GitHubIssueState.OPEN,
    "ready-for-release": GitHubIssueState.OPEN,
    "released": GitHubIssueState.CLOSED,
    "blocked": GitHubIssueState.OPEN,
    "on-hold": GitHubIssueState.OPEN,
    "completed": GitHubIssueState.CLOSED,
    "cancelled": GitHubIssueState.CLOSED
}

STATUS_TO_GITHUB_LABEL = {
    "planning": "status:planning",
    "in-development": "status:in-progress",
    "testing": "status:testing",
    "ready-for-release": "status:ready",
    "released": "status:released",
    "blocked": "status:blocked",
    "on-hold": "status:on-hold"
}

PRIORITY_TO_GITHUB_LABEL = {
    "critical": GitHubLabel.CRITICAL,
    "high": GitHubLabel.HIGH,
    "medium": GitHubLabel.MEDIUM,
    "low": GitHubLabel.LOW
}

class GitHubIntegration:
    def __init__(self, token: str, owner: str, repo: str):
        """
        Initialize GitHub integration
        
        Args:
            token: GitHub personal access token
            owner: Repository owner (username or organization)
            repo: Repository name
        """
        self.token = token
        self.owner = owner
        self.repo = repo
        self.base_url = f"https://api.github.com/repos/{owner}/{repo}"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        }
    
    async def create_issue(self, node_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a GitHub issue from a release node
        
        Args:
            node_data: Node data including title, description, properties
            
        Returns:
            Created GitHub issue data
        """
        # Build issue title
        title = f"[{node_data.get('type', 'task').upper()}] {node_data.get('title', 'Untitled')}"
        
        # Build issue body with metadata
        properties = node_data.get('properties', {})
        description = properties.get('description', 'No description provided')
        
        body = f"""## Description
{description}

## Metadata
- **Type**: {node_data.get('type', 'task')}
- **Priority**: {properties.get('priority', 'medium')}
- **Status**: {properties.get('status', 'planning')}
- **Version**: {properties.get('version', 'N/A')}
- **Environment**: {properties.get('environment', 'development')}
- **Story Points**: {properties.get('storyPoints', 'N/A')}

## Assignee
{properties.get('assignee', 'Unassigned')}

## Release Notes
{properties.get('releaseNotes', 'N/A')}

## Additional Notes
{properties.get('notes', 'N/A')}

---
*This issue was automatically created from Release Management Tool*
*Node ID: {node_data.get('id', 'unknown')}*
"""
        
        # Determine labels - using simple strings to avoid GitHub label validation issues
        labels = []
        
        # For now, skip labels to avoid 422 errors
        # GitHub requires labels to exist before they can be used
        # TODO: Create labels first or use only existing labels
        
        # We can add basic labels that commonly exist
        # labels = ["enhancement"]  # This label usually exists by default
        
        # Prepare issue data
        issue_data = {
            "title": title,
            "body": body,
            "labels": labels
        }
        
        print(f"DEBUG: Creating issue with labels: {labels}")
        
        # Add assignee if specified and valid
        # NOTE: Commenting out assignee to avoid 422 errors if username doesn't exist
        # assignee = properties.get('assignee', '')
        # if assignee and assignee != 'Unassigned':
        #     # Note: assignee should be a valid GitHub username
        #     issue_data["assignees"] = [assignee]
        
        # Create issue via GitHub API
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/issues",
                headers=self.headers,
                json=issue_data
            ) as response:
                if response.status == 201:
                    issue = await response.json()
                    return {
                        "success": True,
                        "issue_number": issue["number"],
                        "issue_url": issue["html_url"],
                        "issue_id": issue["id"],
                        "created_at": issue["created_at"]
                    }
                else:
                    error_data = await response.text()
                    print(f"DEBUG: GitHub API error {response.status}: {error_data}")
                    return {
                        "success": False,
                        "error": f"Failed to create issue: {response.status}",
                        "details": error_data
                    }
    
    async def update_issue_status(self, issue_number: int, status: str) -> Dict[str, Any]:
        """
        Update GitHub issue status based on node status change
        
        Args:
            issue_number: GitHub issue number
            status: New status from our system
            
        Returns:
            Update result
        """
        # Determine if issue should be open or closed
        state = STATUS_TO_GITHUB_STATE.get(status, GitHubIssueState.OPEN)
        
        # Get new status label
        new_label = STATUS_TO_GITHUB_LABEL.get(status)
        
        update_data = {
            "state": state
        }
        
        # Update issue state
        async with aiohttp.ClientSession() as session:
            # First, update the issue state
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
            
            # Then update labels to reflect new status
            if new_label:
                # Get current labels
                async with session.get(
                    f"{self.base_url}/issues/{issue_number}",
                    headers=self.headers
                ) as response:
                    if response.status == 200:
                        issue = await response.json()
                        current_labels = [label["name"] for label in issue["labels"]]
                        
                        # Remove old status labels
                        new_labels = [
                            label for label in current_labels 
                            if not label.startswith("status:")
                        ]
                        
                        # Add new status label
                        new_labels.append(new_label)
                        
                        # Update labels
                        async with session.put(
                            f"{self.base_url}/issues/{issue_number}/labels",
                            headers=self.headers,
                            json={"labels": new_labels}
                        ) as label_response:
                            if label_response.status != 200:
                                return {
                                    "success": True,
                                    "warning": "Issue state updated but labels failed to update"
                                }
            
            # Add a comment about the status change
            comment = f"🔄 Status changed to: **{status}**\n\n*Updated from Release Management Tool*"
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
                "github_state": state
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
        
        # Process all nodes recursively
        async def process_node(node: Dict[str, Any], parent_issue: Optional[int] = None):
            results["total_processed"] += 1
            
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
                    await process_node(child, issue_result["issue_number"])
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
        
        return results
    
    async def add_issue_link(self, parent_issue: int, child_issue: int, child_title: str):
        """
        Add a comment to parent issue linking to child issue
        """
        comment = f"📌 Sub-task created: #{child_issue} - {child_title}"
        
        async with aiohttp.ClientSession() as session:
            await session.post(
                f"{self.base_url}/issues/{parent_issue}/comments",
                headers=self.headers,
                json={"body": comment}
            )
    
    async def get_issue(self, issue_number: int) -> Optional[Dict[str, Any]]:
        """
        Get GitHub issue details
        """
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/issues/{issue_number}",
                headers=self.headers
            ) as response:
                if response.status == 200:
                    return await response.json()
                return None
    
    async def close_issue(self, issue_number: int, reason: str = "Completed"):
        """
        Close a GitHub issue
        """
        update_data = {
            "state": "closed"
        }
        
        async with aiohttp.ClientSession() as session:
            # Close the issue
            async with session.patch(
                f"{self.base_url}/issues/{issue_number}",
                headers=self.headers,
                json=update_data
            ) as response:
                if response.status == 200:
                    # Add closing comment
                    comment = f"✅ Issue closed: {reason}\n\n*Closed from Release Management Tool*"
                    await session.post(
                        f"{self.base_url}/issues/{issue_number}/comments",
                        headers=self.headers,
                        json={"body": comment}
                    )
                    return {"success": True}
                else:
                    return {"success": False, "error": f"Failed to close issue: {response.status}"}

# Configuration helper
def get_github_config():
    """
    Get GitHub configuration from environment variables
    """
    return {
        "token": os.getenv("GITHUB_TOKEN", ""),
        "owner": os.getenv("GITHUB_OWNER", ""),
        "repo": os.getenv("GITHUB_REPO", "")
    }

def validate_github_config(config: Dict[str, str]) -> bool:
    """
    Validate GitHub configuration
    """
    return all([
        config.get("token"),
        config.get("owner"),
        config.get("repo")
    ])