"""
Simple test to verify GitHub API connection
"""

import os
import asyncio
import aiohttp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_OWNER = os.getenv("GITHUB_OWNER", "")
GITHUB_REPO = os.getenv("GITHUB_REPO", "")

async def test_github_api():
    """Test direct GitHub API connection"""
    
    print(f"Testing GitHub API with: {GITHUB_OWNER}/{GITHUB_REPO}")
    print("-" * 50)
    
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # Test 1: Check repository access
    print("\n1. Testing repository access...")
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}",
            headers=headers
        ) as response:
            if response.status == 200:
                repo = await response.json()
                print(f"   [OK] Repository found: {repo['full_name']}")
                print(f"   Description: {repo.get('description', 'No description')}")
                print(f"   Private: {repo.get('private', False)}")
            else:
                print(f"   [ERROR] Failed to access repository: {response.status}")
                error = await response.text()
                print(f"   {error}")
                return
    
    # Test 2: Create a test issue
    print("\n2. Creating a test issue...")
    issue_data = {
        "title": "[TEST] GitHub Integration Test Issue",
        "body": "This is a test issue created to verify GitHub integration.\n\n**Test Details:**\n- Created by: test_github_simple.py\n- Purpose: Verify API access\n\nThis issue can be safely deleted.",
        "labels": ["test", "automated"]
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues",
            headers=headers,
            json=issue_data
        ) as response:
            if response.status == 201:
                issue = await response.json()
                print(f"   [OK] Issue created successfully!")
                print(f"   Issue #: {issue['number']}")
                print(f"   URL: {issue['html_url']}")
                issue_number = issue['number']
            else:
                print(f"   [ERROR] Failed to create issue: {response.status}")
                error = await response.text()
                print(f"   {error}")
                
                if response.status == 404:
                    print("\n   Possible causes:")
                    print("   - Repository doesn't have issues enabled")
                    print("   - Repository name or owner is incorrect")
                elif response.status == 401:
                    print("\n   Authentication failed. Check your GitHub token.")
                elif response.status == 403:
                    print("\n   Permission denied. Ensure your token has 'repo' scope.")
                return
    
    # Test 3: Update the issue
    print("\n3. Updating the test issue...")
    update_data = {
        "state": "closed",
        "state_reason": "completed"
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.patch(
            f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{issue_number}",
            headers=headers,
            json=update_data
        ) as response:
            if response.status == 200:
                print(f"   [OK] Issue closed successfully!")
            else:
                print(f"   [ERROR] Failed to update issue: {response.status}")
                error = await response.text()
                print(f"   {error}")
    
    print("\n" + "="*50)
    print("GitHub API test completed!")
    print(f"Check your repository: https://github.com/{GITHUB_OWNER}/{GITHUB_REPO}/issues")

if __name__ == "__main__":
    if not all([GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO]):
        print("[ERROR] GitHub credentials not configured!")
        print("Please set the following in your .env file:")
        print("  GITHUB_TOKEN=your_personal_access_token")
        print("  GITHUB_OWNER=your_github_username")
        print("  GITHUB_REPO=your_repository_name")
    else:
        asyncio.run(test_github_api())