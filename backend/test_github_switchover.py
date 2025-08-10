"""
Test script to demonstrate GitHub Cloud/Enterprise switchover mechanism
"""

import os
import asyncio
import aiohttp
from dotenv import load_dotenv, set_key
from pathlib import Path

API_BASE_URL = "http://localhost:8080/api/v1"
ENV_FILE = Path(__file__).parent / ".env"

async def check_current_config():
    """Check and display current GitHub configuration"""
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{API_BASE_URL}/github/config-status") as response:
            if response.status == 200:
                config = await response.json()
                return config
            return None

async def display_config(config):
    """Display configuration in a readable format"""
    if not config:
        print("   [ERROR] Could not fetch configuration")
        return
    
    print(f"   Status: {'[OK] Configured' if config['configured'] else '[X] Not Configured'}")
    print(f"   Mode: {config['type'].upper()}")
    print(f"   Repository: {config['owner']}/{config['repo']}")
    print(f"   Has Token: {'Yes' if config['has_token'] else 'No'}")
    
    if config['type'] == 'enterprise' and 'enterprise_url' in config:
        print(f"   Enterprise URL: {config['enterprise_url']}")

async def test_cloud_mode():
    """Test GitHub Cloud configuration"""
    print("\n" + "="*60)
    print("Testing GitHub Cloud Mode (GITHUB_ENTERPRISE=false)")
    print("="*60 + "\n")
    
    print("Current Configuration:")
    config = await check_current_config()
    await display_config(config)
    
    if config and config['type'] == 'cloud':
        print("\n   [OK] Cloud mode is active")
        print("   Using: GitHub.com")
        print(f"   Repository: https://github.com/{config['owner']}/{config['repo']}")
    else:
        print("\n   [INFO] Not in cloud mode")

async def simulate_enterprise_switch():
    """Simulate switching to enterprise mode"""
    print("\n" + "="*60)
    print("Simulating Enterprise Mode Switch")
    print("="*60 + "\n")
    
    print("To switch to Enterprise mode:")
    print("1. Edit .env file and change: GITHUB_ENTERPRISE=true")
    print("2. Restart the backend server")
    print("3. The system will automatically use GITHUB_ENTERPRISE_* variables")
    
    print("\nEnterprise configuration that would be used:")
    print(f"   URL: {os.getenv('GITHUB_ENTERPRISE_URL', 'not set')}")
    print(f"   Owner: {os.getenv('GITHUB_ENTERPRISE_OWNER', 'not set')}")
    print(f"   Repository: {os.getenv('GITHUB_ENTERPRISE_REPO', 'not set')}")
    print(f"   Token: {'Set' if os.getenv('GITHUB_ENTERPRISE_TOKEN') else 'Not set'}")

async def show_api_endpoints():
    """Show the API endpoints for both modes"""
    print("\n" + "="*60)
    print("API Endpoints for Different Modes")
    print("="*60 + "\n")
    
    from github_integration_simple import GitHubIntegrationSimple
    
    # Cloud endpoints
    print("1. GitHub Cloud (GITHUB_ENTERPRISE=false):")
    cloud = GitHubIntegrationSimple(
        token="dummy",
        owner=os.getenv("GITHUB_CLOUD_OWNER", "owner"),
        repo=os.getenv("GITHUB_CLOUD_REPO", "repo"),
        enterprise_url=None
    )
    print(f"   API Base: {cloud.api_base}")
    print(f"   Issues URL: {cloud.base_url}/issues")
    
    # Enterprise endpoints
    print("\n2. GitHub Enterprise (GITHUB_ENTERPRISE=true):")
    enterprise = GitHubIntegrationSimple(
        token="dummy",
        owner=os.getenv("GITHUB_ENTERPRISE_OWNER", "owner"),
        repo=os.getenv("GITHUB_ENTERPRISE_REPO", "repo"),
        enterprise_url=os.getenv("GITHUB_ENTERPRISE_URL", "https://github.company.com")
    )
    print(f"   API Base: {enterprise.api_base}")
    print(f"   Issues URL: {enterprise.base_url}/issues")

def show_env_contents():
    """Display current .env configuration"""
    print("\n" + "="*60)
    print("Current Environment Configuration")
    print("="*60 + "\n")
    
    load_dotenv()
    
    is_enterprise = os.getenv("GITHUB_ENTERPRISE", "false").lower() == "true"
    print(f"GITHUB_ENTERPRISE = {os.getenv('GITHUB_ENTERPRISE', 'not set')} {'← Currently Active' if is_enterprise else ''}")
    
    print("\nCloud Configuration (used when GITHUB_ENTERPRISE=false):")
    print(f"  GITHUB_CLOUD_OWNER = {os.getenv('GITHUB_CLOUD_OWNER', 'not set')}")
    print(f"  GITHUB_CLOUD_REPO = {os.getenv('GITHUB_CLOUD_REPO', 'not set')}")
    print(f"  GITHUB_CLOUD_TOKEN = {'[REDACTED]' if os.getenv('GITHUB_CLOUD_TOKEN') else 'not set'}")
    
    print("\nEnterprise Configuration (used when GITHUB_ENTERPRISE=true):")
    print(f"  GITHUB_ENTERPRISE_URL = {os.getenv('GITHUB_ENTERPRISE_URL', 'not set')}")
    print(f"  GITHUB_ENTERPRISE_OWNER = {os.getenv('GITHUB_ENTERPRISE_OWNER', 'not set')}")
    print(f"  GITHUB_ENTERPRISE_REPO = {os.getenv('GITHUB_ENTERPRISE_REPO', 'not set')}")
    print(f"  GITHUB_ENTERPRISE_TOKEN = {'[REDACTED]' if os.getenv('GITHUB_ENTERPRISE_TOKEN') else 'not set'}")

async def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("GitHub Cloud/Enterprise Switchover Test")
    print("="*60)
    
    # Show current env configuration
    show_env_contents()
    
    # Test current mode
    await test_cloud_mode()
    
    # Show API endpoints
    await show_api_endpoints()
    
    # Show how to switch
    await simulate_enterprise_switch()
    
    print("\n" + "="*60)
    print("Switchover Instructions")
    print("="*60)
    print("""
To switch between Cloud and Enterprise:

1. Open .env file
2. Change GITHUB_ENTERPRISE value:
   - Set to 'false' for GitHub.com
   - Set to 'true' for GitHub Enterprise
3. Restart the backend server
4. The system automatically uses the appropriate configuration

Example for Enterprise mode:
   GITHUB_ENTERPRISE=true
   
   Then ensure these are set with real values:
   GITHUB_ENTERPRISE_URL=https://github.yourcompany.com
   GITHUB_ENTERPRISE_TOKEN=your_enterprise_token
   GITHUB_ENTERPRISE_OWNER=your_org
   GITHUB_ENTERPRISE_REPO=your_repo

The UI will automatically detect and display the active mode!
""")

if __name__ == "__main__":
    asyncio.run(main())