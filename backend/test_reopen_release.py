"""
Test script for reopening closed releases with reason tracking
"""

import asyncio
import aiohttp
import json
from datetime import datetime

API_BASE_URL = "http://localhost:8080/api/v1"

async def test_reopen_release():
    """Test reopening a closed release with reason"""
    
    print("\n" + "="*60)
    print("Testing Release Reopen Functionality")
    print("="*60 + "\n")
    
    async with aiohttp.ClientSession() as session:
        
        # Step 1: Get closed releases
        print("1. Getting closed releases...")
        async with session.get(f"{API_BASE_URL}/releases") as response:
            if response.status == 200:
                releases = await response.json()
                closed_releases = [r for r in releases if r['status'] == 'closed']
                
                if closed_releases:
                    print(f"   Found {len(closed_releases)} closed releases")
                    test_release = closed_releases[0]
                    print(f"   Using release: {test_release['name']} (ID: {test_release['id']})")
                else:
                    print("   No closed releases found. Creating one for testing...")
                    # Create and close a test release
                    test_release = await create_and_close_test_release(session)
                    if not test_release:
                        return
            else:
                print(f"   [ERROR] Failed to get releases: {response.status}")
                return
        
        # Step 2: Display current status history
        print("\n2. Current status history:")
        if 'statusHistory' in test_release and test_release['statusHistory']:
            for entry in test_release['statusHistory'][-3:]:  # Show last 3 entries
                action = entry.get('action', entry.get('status', 'unknown'))
                reason = entry.get('reason', 'No reason provided')
                timestamp = entry.get('timestamp', 'Unknown time')
                print(f"   - {action}: {reason} ({timestamp})")
        else:
            print("   No status history found")
        
        # Step 3: Reopen the release
        print("\n3. Reopening the release...")
        reopen_reason = "Additional features required based on stakeholder feedback"
        
        reopened_release = {
            **test_release,
            "status": "active",
            "updatedAt": datetime.now().isoformat(),
            "statusHistory": test_release.get('statusHistory', []) + [
                {
                    "action": "reopened",
                    "reason": reopen_reason,
                    "timestamp": datetime.now().isoformat(),
                    "user": "Test User",
                    "previousStatus": "closed",
                    "newStatus": "active"
                }
            ]
        }
        
        async with session.put(
            f"{API_BASE_URL}/releases/{test_release['id']}",
            json=reopened_release,
            headers={"Content-Type": "application/json"}
        ) as response:
            if response.status == 200:
                print(f"   [OK] Release reopened in MongoDB")
                print(f"   Reason: {reopen_reason}")
            else:
                print(f"   [ERROR] Failed to reopen release: {response.status}")
                error = await response.text()
                print(f"   {error}")
                return
        
        # Step 4: Verify the release is reopened
        print("\n4. Verifying release status...")
        async with session.get(f"{API_BASE_URL}/releases/{test_release['id']}") as response:
            if response.status == 200:
                updated_release = await response.json()
                if updated_release['status'] == 'active':
                    print(f"   [OK] Release status is 'active'")
                    
                    # Check status history
                    if 'statusHistory' in updated_release:
                        latest_entry = updated_release['statusHistory'][-1] if updated_release['statusHistory'] else None
                        if latest_entry and latest_entry.get('action') == 'reopened':
                            print(f"   [OK] Reopen reason documented: {latest_entry.get('reason')}")
                        else:
                            print(f"   [WARNING] Reopen entry not found in status history")
                else:
                    print(f"   [ERROR] Release status is '{updated_release['status']}', expected 'active'")
            else:
                print(f"   [ERROR] Failed to get release: {response.status}")
        
        # Step 5: Check releases count
        print("\n5. Checking release counts...")
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
1. Check the UI - reopened release should appear in 'Active' tab
2. Verify the reopen reason is stored in status history
3. Check MongoDB - release status should be 'active'
""")

async def create_and_close_test_release(session):
    """Create a test release and close it for testing"""
    
    # Create release
    test_release = {
        "id": f"test-reopen-{datetime.now().timestamp()}",
        "name": f"Test Release for Reopen {datetime.now().strftime('%H:%M:%S')}",
        "version": "1.0.0",
        "description": "Test release for reopen functionality",
        "category": "minor",
        "tags": ["test"],
        "targetDate": "2024-12-31",
        "environment": "development",
        "status": "active",
        "statusHistory": [],
        "nodeCount": 0,
        "completion": 50,
        "preview": {"centralNode": "Test", "branches": []},
        "nodes": []
    }
    
    async with session.post(
        f"{API_BASE_URL}/releases",
        json=test_release,
        headers={"Content-Type": "application/json"}
    ) as response:
        if response.status != 200:
            print("   [ERROR] Failed to create test release")
            return None
        created_release = await response.json()
    
    # Close it
    closed_release = {
        **created_release,
        "status": "closed",
        "statusHistory": [
            {
                "action": "closed",
                "reason": "Initial testing complete",
                "timestamp": datetime.now().isoformat(),
                "user": "Test User",
                "previousStatus": "active",
                "newStatus": "closed"
            }
        ]
    }
    
    async with session.put(
        f"{API_BASE_URL}/releases/{created_release['id']}",
        json=closed_release,
        headers={"Content-Type": "application/json"}
    ) as response:
        if response.status != 200:
            print("   [ERROR] Failed to close test release")
            return None
        return closed_release

if __name__ == "__main__":
    asyncio.run(test_reopen_release())