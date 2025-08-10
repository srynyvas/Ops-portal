"""
Test script for closing releases and GitHub issues
"""

import asyncio
import aiohttp
import json
from datetime import datetime

API_BASE_URL = "http://localhost:8080/api/v1"

async def test_close_release():
    """Test closing a release and its GitHub issues"""
    
    print("\n" + "="*60)
    print("Testing Release Close Functionality")
    print("="*60 + "\n")
    
    async with aiohttp.ClientSession() as session:
        
        # Step 1: Get existing releases
        print("1. Getting existing releases...")
        async with session.get(f"{API_BASE_URL}/releases") as response:
            if response.status == 200:
                releases = await response.json()
                active_releases = [r for r in releases if r['status'] == 'active']
                
                if active_releases:
                    print(f"   Found {len(active_releases)} active releases")
                    test_release = active_releases[0]
                    print(f"   Using release: {test_release['name']} (ID: {test_release['id']})")
                else:
                    print("   No active releases found. Please create one first.")
                    return
            else:
                print(f"   [ERROR] Failed to get releases: {response.status}")
                return
        
        # Step 2: Close the release
        print("\n2. Closing the release...")
        closed_release = {
            **test_release,
            "status": "closed",
            "updatedAt": datetime.now().isoformat()
        }
        
        async with session.put(
            f"{API_BASE_URL}/releases/{test_release['id']}",
            json=closed_release,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                print(f"   [OK] Release closed in MongoDB")
            else:
                print(f"   [ERROR] Failed to close release: {response.status}")
                error = await response.text()
                print(f"   {error}")
                return
        
        # Step 3: Close GitHub issues
        print("\n3. Closing GitHub issues...")
        async with session.post(
            f"{API_BASE_URL}/releases/{test_release['id']}/close-github-issues",
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                result = await response.json()
                if result['success']:
                    print(f"   [OK] Closed {len(result['closed_issues'])} GitHub issues")
                    for issue in result['closed_issues']:
                        print(f"       - Issue #{issue['issue_number']} for node {issue['node_id']}")
                else:
                    print(f"   [WARNING] Some issues failed to close")
                    for failed in result['failed_issues']:
                        print(f"       - Node {failed['node_id']}: {failed['error']}")
            else:
                print(f"   [INFO] No GitHub issues to close or GitHub not configured")
        
        # Step 4: Verify the release is closed
        print("\n4. Verifying release status...")
        async with session.get(f"{API_BASE_URL}/releases/{test_release['id']}") as response:
            if response.status == 200:
                updated_release = await response.json()
                if updated_release['status'] == 'closed':
                    print(f"   [OK] Release status is 'closed'")
                else:
                    print(f"   [ERROR] Release status is '{updated_release['status']}', expected 'closed'")
            else:
                print(f"   [ERROR] Failed to get release: {response.status}")
        
        # Step 5: Check closed releases count
        print("\n5. Checking closed releases...")
        async with session.get(f"{API_BASE_URL}/releases") as response:
            if response.status == 200:
                all_releases = await response.json()
                closed_count = len([r for r in all_releases if r['status'] == 'closed'])
                active_count = len([r for r in all_releases if r['status'] == 'active'])
                print(f"   Active releases: {active_count}")
                print(f"   Closed releases: {closed_count}")
                print(f"   Total releases: {len(all_releases)}")
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60)
    print("""
Next steps:
1. Check the UI - closed release should appear in 'Closed' tab
2. Check GitHub - associated issues should be closed
3. Check MongoDB - release status should be 'closed'
""")

if __name__ == "__main__":
    asyncio.run(test_close_release())