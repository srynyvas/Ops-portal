"""
Test script for GitHub integration with Release Management Tool
Prerequisites:
1. Set up GitHub credentials in .env file
2. MongoDB running on localhost:27017
3. Backend API running on localhost:8080
"""

import asyncio
import aiohttp
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_BASE_URL = "http://localhost:8080/api/v1"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "")
GITHUB_REPO = os.getenv("GITHUB_REPO", "")

# Test release data
test_release = {
    "name": "GitHub Integration Test Release",
    "version": "1.0.0",
    "description": "Testing GitHub integration with hierarchical nodes",
    "category": "major",
    "targetDate": "2024-12-31",
    "environment": "development",
    "nodes": [
        {
            "id": "test-root",
            "title": "Test Release Root",
            "type": "release",
            "color": "bg-purple-600",
            "icon": "Rocket",
            "properties": {
                "description": "Root node for GitHub integration testing",
                "version": "1.0.0",
                "assignee": "Test User",
                "priority": "high",
                "status": "in-development"
            },
            "children": [
                {
                    "id": "test-feature-1",
                    "title": "Authentication Feature",
                    "type": "feature",
                    "color": "bg-blue-600",
                    "icon": "Shield",
                    "properties": {
                        "description": "Implement OAuth2 authentication for testing",
                        "assignee": "Dev Team",
                        "priority": "critical",
                        "status": "testing"
                    },
                    "children": [
                        {
                            "id": "test-task-1",
                            "title": "Setup OAuth Provider",
                            "type": "task",
                            "color": "bg-green-600",
                            "icon": "Code",
                            "properties": {
                                "description": "Configure OAuth2 provider settings",
                                "assignee": "Alice Developer",
                                "priority": "high",
                                "status": "planning"
                            },
                            "children": []
                        }
                    ]
                },
                {
                    "id": "test-feature-2",
                    "title": "Dashboard UI",
                    "type": "feature",
                    "color": "bg-green-600",
                    "icon": "Layout",
                    "properties": {
                        "description": "Create dashboard interface",
                        "assignee": "UI Team",
                        "priority": "medium",
                        "status": "planning"
                    },
                    "children": []
                }
            ]
        }
    ]
}

async def test_github_integration():
    """Run comprehensive GitHub integration tests"""
    
    print("\n" + "="*60)
    print("GitHub Integration Test Suite")
    print("="*60 + "\n")
    
    async with aiohttp.ClientSession() as session:
        
        # Test 1: Check GitHub configuration
        print("1. Checking GitHub configuration...")
        async with session.get(f"{API_BASE_URL}/github/config-status") as response:
            if response.status == 200:
                config = await response.json()
                if config["configured"]:
                    print(f"   [OK] GitHub configured: {config['owner']}/{config['repo']}")
                else:
                    print("   [ERROR] GitHub not configured. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in .env")
                    return
            else:
                print(f"   [ERROR] Failed to check config: {response.status}")
                return
        
        # Test 2: Create a test release
        print("\n2. Creating test release...")
        async with session.post(
            f"{API_BASE_URL}/releases",
            json=test_release,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                created_release = await response.json()
                release_id = created_release["id"]
                print(f"   [OK] Release created: {created_release['name']} (ID: {release_id})")
            else:
                print(f"   [ERROR] Failed to create release: {response.status}")
                error = await response.text()
                print(f"     Error: {error}")
                return
        
        # Test 3: Publish release to GitHub
        print("\n3. Publishing release to GitHub...")
        async with session.post(
            f"{API_BASE_URL}/releases/{release_id}/publish-to-github",
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                result = await response.json()
                if result["success"]:
                    print(f"   [OK] Published successfully!")
                    print(f"     - Created issues: {len(result['created_issues'])}")
                    for issue in result["created_issues"]:
                        print(f"       * {issue['node_title']}: Issue #{issue['issue_number']}")
                    if result["failed_issues"]:
                        print(f"     - Failed issues: {len(result['failed_issues'])}")
                else:
                    print(f"   [ERROR] Publish failed: {result.get('message', 'Unknown error')}")
            else:
                print(f"   [ERROR] Failed to publish: {response.status}")
                error = await response.text()
                print(f"     Error: {error}")
                return
        
        # Test 4: Verify GitHub issue info in release
        print("\n4. Verifying GitHub issue info in release...")
        async with session.get(f"{API_BASE_URL}/releases/{release_id}") as response:
            if response.status == 200:
                updated_release = await response.json()
                issues_found = 0
                
                def check_github_info(nodes):
                    nonlocal issues_found
                    for node in nodes:
                        if node.get("github_issue"):
                            issues_found += 1
                            print(f"   [OK] Node '{node['title']}' linked to Issue #{node['github_issue']['issue_number']}")
                            print(f"     URL: {node['github_issue']['issue_url']}")
                        if node.get("children"):
                            check_github_info(node["children"])
                
                check_github_info(updated_release["nodes"])
                print(f"   Total nodes with GitHub issues: {issues_found}")
            else:
                print(f"   [ERROR] Failed to get release: {response.status}")
        
        # Test 5: Test status synchronization
        print("\n5. Testing status synchronization...")
        test_node_id = "test-task-1"
        new_status = "in-development"
        
        async with session.post(
            f"{API_BASE_URL}/releases/{release_id}/nodes/{test_node_id}/sync-github",
            json={"status": new_status},
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                result = await response.json()
                if result["success"]:
                    print(f"   [OK] Status synced to GitHub: {new_status}")
                    print(f"     GitHub state: {result.get('github_state', 'unknown')}")
                else:
                    print(f"   [ERROR] Sync failed: {result.get('message', 'Unknown error')}")
            else:
                error_text = await response.text()
                if "not published to GitHub" in error_text:
                    print(f"   [INFO] Node not yet published to GitHub (expected for nested nodes)")
                else:
                    print(f"   [ERROR] Failed to sync: {response.status}")
                    print(f"     Error: {error_text}")
        
        print("\n" + "="*60)
        print("Test Summary")
        print("="*60)
        print("""
To manually verify:
1. Check your GitHub repository for the created issues
2. Verify issue hierarchy (parent issues should link to children)
3. Check issue labels match priority and status
4. Try changing status in the UI and verify GitHub updates
5. Check MongoDB for stored GitHub issue references

Next steps:
1. Configure webhook in GitHub to sync changes back to MongoDB
2. Test with real repository and project board
3. Implement bulk operations for multiple releases
""")

if __name__ == "__main__":
    # Check if credentials are set
    if not all([GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO]):
        print("\n[WARNING] GitHub credentials not configured!")
        print("Please set the following in your .env file:")
        print("  GITHUB_TOKEN=your_personal_access_token")
        print("  GITHUB_OWNER=your_github_username_or_org")
        print("  GITHUB_REPO=your_repository_name")
        print("\nCreate a token at: https://github.com/settings/tokens")
        print("Required scopes: repo (Full control of private repositories)")
    else:
        print(f"\n[OK] GitHub configured for: {GITHUB_OWNER}/{GITHUB_REPO}")
        asyncio.run(test_github_integration())