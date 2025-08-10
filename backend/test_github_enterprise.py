"""
Test script for GitHub Enterprise and Cloud configurations
"""

import asyncio
import aiohttp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_BASE_URL = "http://localhost:8080/api/v1"

async def test_github_config():
    """Test GitHub configuration detection"""
    
    print("\n" + "="*60)
    print("Testing GitHub Configuration")
    print("="*60 + "\n")
    
    async with aiohttp.ClientSession() as session:
        
        # Check current configuration
        print("1. Checking GitHub configuration status...")
        async with session.get(f"{API_BASE_URL}/github/config-status") as response:
            if response.status == 200:
                config = await response.json()
                print(f"   Configuration Status: {'Configured' if config['configured'] else 'Not Configured'}")
                print(f"   Type: {config.get('type', 'unknown')}")
                print(f"   Owner: {config.get('owner', 'not set')}")
                print(f"   Repository: {config.get('repo', 'not set')}")
                print(f"   Has Token: {'Yes' if config.get('has_token') else 'No'}")
                
                if config.get('type') == 'enterprise':
                    print(f"   Enterprise URL: {config.get('enterprise_url', 'not set')}")
                    
                return config
            else:
                print(f"   [ERROR] Failed to get config: {response.status}")
                return None

async def test_enterprise_mode():
    """Test with enterprise configuration"""
    
    print("\n" + "="*60)
    print("Testing GitHub Enterprise Mode")
    print("="*60 + "\n")
    
    # Save current env values
    original_type = os.getenv("GITHUB_TYPE")
    original_url = os.getenv("GITHUB_ENTERPRISE_URL")
    
    # Set enterprise mode
    os.environ["GITHUB_TYPE"] = "enterprise"
    os.environ["GITHUB_ENTERPRISE_URL"] = "https://github.example.com"
    
    print("Environment set to:")
    print(f"  GITHUB_TYPE: enterprise")
    print(f"  GITHUB_ENTERPRISE_URL: https://github.example.com")
    
    # Note: This would require restarting the backend to take effect
    print("\nNote: Backend restart required for environment changes to take effect")
    print("To test enterprise mode:")
    print("1. Update .env file with GITHUB_TYPE=enterprise")
    print("2. Set GITHUB_ENTERPRISE_URL to your enterprise server")
    print("3. Restart the backend")
    
    # Restore original values
    if original_type:
        os.environ["GITHUB_TYPE"] = original_type
    else:
        os.environ.pop("GITHUB_TYPE", None)
        
    if original_url:
        os.environ["GITHUB_ENTERPRISE_URL"] = original_url
    else:
        os.environ.pop("GITHUB_ENTERPRISE_URL", None)

async def test_api_url_generation():
    """Test API URL generation for different configurations"""
    
    print("\n" + "="*60)
    print("Testing API URL Generation")
    print("="*60 + "\n")
    
    from github_integration_simple import GitHubIntegrationSimple
    
    # Test cloud configuration
    print("1. GitHub Cloud (github.com):")
    cloud_github = GitHubIntegrationSimple(
        token="test_token",
        owner="test_owner",
        repo="test_repo",
        enterprise_url=None
    )
    print(f"   API Base: {cloud_github.api_base}")
    print(f"   Repo URL: {cloud_github.base_url}")
    
    # Test enterprise configuration
    print("\n2. GitHub Enterprise:")
    enterprise_github = GitHubIntegrationSimple(
        token="test_token",
        owner="test_owner",
        repo="test_repo",
        enterprise_url="https://github.company.com"
    )
    print(f"   API Base: {enterprise_github.api_base}")
    print(f"   Repo URL: {enterprise_github.base_url}")
    
    # Test enterprise with trailing slash
    print("\n3. GitHub Enterprise (with trailing slash):")
    enterprise_github2 = GitHubIntegrationSimple(
        token="test_token",
        owner="test_owner",
        repo="test_repo",
        enterprise_url="https://github.company.com/"
    )
    print(f"   API Base: {enterprise_github2.api_base}")
    print(f"   Repo URL: {enterprise_github2.base_url}")

async def main():
    """Run all tests"""
    
    print("\n" + "="*60)
    print("GitHub Enterprise Support Test Suite")
    print("="*60)
    
    # Test current configuration
    config = await test_github_config()
    
    # Test API URL generation
    await test_api_url_generation()
    
    # Show enterprise configuration instructions
    await test_enterprise_mode()
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60)
    
    print("""
How to Switch Between GitHub Cloud and Enterprise:

1. For GitHub Cloud (github.com):
   - Set in .env:
     GITHUB_TYPE=cloud
     GITHUB_TOKEN=your_github_token
     GITHUB_OWNER=your_username_or_org
     GITHUB_REPO=your_repository

2. For GitHub Enterprise:
   - Set in .env:
     GITHUB_TYPE=enterprise
     GITHUB_ENTERPRISE_URL=https://github.yourcompany.com
     GITHUB_TOKEN=your_enterprise_token
     GITHUB_OWNER=your_enterprise_username_or_org
     GITHUB_REPO=your_repository

3. Restart the backend after changing configuration

4. The UI will automatically detect and display the configuration type
""")

if __name__ == "__main__":
    asyncio.run(main())