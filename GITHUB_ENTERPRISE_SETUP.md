# GitHub Enterprise Support Guide

## Overview

The Ops Portal Release Management system now supports both GitHub.com and GitHub Enterprise Server integrations. You can seamlessly switch between them using environment configuration.

## Features

### Supported Platforms
- ✅ **GitHub.com** (Cloud) - Default configuration
- ✅ **GitHub Enterprise Server** - Self-hosted GitHub instances
- ✅ Automatic URL detection and API endpoint configuration
- ✅ Visual indicator in UI showing current configuration

### What Works
- Create issues from release nodes
- Sync status between releases and GitHub issues
- Close issues when releases are closed
- Hierarchical issue linking (parent-child relationships)
- Works with both cloud and enterprise GitHub instances

## Configuration

### 1. GitHub Cloud (GitHub.com)

For standard GitHub.com integration, set these in your `.env` file:

```env
# GitHub Type
GITHUB_TYPE=cloud

# GitHub Credentials
GITHUB_TOKEN=ghp_your_github_personal_access_token
GITHUB_OWNER=your-username-or-organization
GITHUB_REPO=your-repository-name
```

### 2. GitHub Enterprise Server

For GitHub Enterprise Server integration, set these in your `.env` file:

```env
# GitHub Type
GITHUB_TYPE=enterprise

# GitHub Enterprise Server URL (without /api/v3)
GITHUB_ENTERPRISE_URL=https://github.yourcompany.com

# GitHub Enterprise Credentials
GITHUB_TOKEN=your_enterprise_personal_access_token
GITHUB_OWNER=your-enterprise-username-or-org
GITHUB_REPO=your-repository-name
```

### Common Enterprise URLs

Examples of typical GitHub Enterprise URLs:
- `https://github.company.com`
- `https://git.enterprise.local`
- `https://github-enterprise.company.internal`
- `https://git.mycompany.io`

**Note:** Do NOT include `/api/v3` in the URL - the system will add it automatically.

## Token Requirements

### GitHub.com Token
1. Go to https://github.com/settings/tokens
2. Generate a new token (classic)
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `project` (optional, for project board integration)

### GitHub Enterprise Token
1. Go to `https://YOUR_ENTERPRISE_URL/settings/tokens`
2. Generate a new token
3. Select the same scopes as above
4. Ensure the token is generated from your enterprise server, not github.com

## How It Works

### API Endpoint Detection

The system automatically configures the correct API endpoints:

- **GitHub.com**: `https://api.github.com/repos/{owner}/{repo}`
- **Enterprise**: `https://{enterprise_url}/api/v3/repos/{owner}/{repo}`

### URL Structure Differences

| Platform | Base URL | API Endpoint |
|----------|----------|--------------|
| GitHub.com | N/A | `https://api.github.com` |
| Enterprise | `https://github.company.com` | `https://github.company.com/api/v3` |

## UI Indicators

The UI automatically detects and displays the current configuration:

- **Green dot**: GitHub is configured and ready
- **Red dot**: GitHub is not configured
- **Text indicator**: Shows "GitHub.com" or "Enterprise" with the repository path

Example displays:
- `GitHub.com: srynyvas/Ops-portal`
- `Enterprise: enterprise-org/internal-project`

## Testing Your Configuration

### 1. Check Configuration Status

```bash
curl http://localhost:8080/api/v1/github/config-status
```

Expected response for cloud:
```json
{
  "configured": true,
  "owner": "your-username",
  "repo": "your-repo",
  "has_token": true,
  "type": "cloud"
}
```

Expected response for enterprise:
```json
{
  "configured": true,
  "owner": "enterprise-org",
  "repo": "your-repo",
  "has_token": true,
  "type": "enterprise",
  "enterprise_url": "https://github.company.com"
}
```

### 2. Test Script

Run the provided test script:

```bash
cd backend
python test_github_enterprise.py
```

### 3. Manual Test

1. Create a release in the UI
2. Add some nodes
3. Click "Publish to GitHub"
4. Check your GitHub instance for created issues

## Switching Between Configurations

To switch from GitHub.com to Enterprise (or vice versa):

1. Stop the backend server
2. Update the `.env` file with new configuration
3. Restart the backend server
4. The UI will automatically detect the new configuration

## Troubleshooting

### Common Issues

#### 1. SSL Certificate Errors (Enterprise)
If your enterprise server uses self-signed certificates:
- Ensure certificates are properly installed on the server
- Consider using `verify=False` in production (not recommended)

#### 2. Authentication Failures
- Verify token has correct scopes
- Ensure token is from the correct server (cloud vs enterprise)
- Check token hasn't expired

#### 3. URL Configuration
- Don't include trailing slashes in `GITHUB_ENTERPRISE_URL`
- Don't include `/api/v3` in the enterprise URL
- Ensure the URL is accessible from your backend server

#### 4. CORS Issues
For enterprise servers, you may need to configure CORS on the GitHub Enterprise instance.

### Debug Mode

To see detailed API calls, check the backend console output when publishing to GitHub.

## Security Considerations

1. **Token Storage**: Store tokens securely, never commit them to version control
2. **Network Security**: Ensure secure connection to enterprise servers
3. **Access Control**: Use tokens with minimal required permissions
4. **Audit Logging**: Enterprise servers typically have audit logs - monitor them

## Example Configurations

### Small Team on GitHub.com
```env
GITHUB_TYPE=cloud
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=small-team
GITHUB_REPO=project-releases
```

### Enterprise with Internal Server
```env
GITHUB_TYPE=enterprise
GITHUB_ENTERPRISE_URL=https://github.internal.company.com
GITHUB_TOKEN=ghp_enterprise_token_xxx
GITHUB_OWNER=engineering-dept
GITHUB_REPO=release-management
```

### Multi-Environment Setup

You can have different configurations for different environments:

**Development (.env.development)**
```env
GITHUB_TYPE=cloud
GITHUB_TOKEN=dev_token
GITHUB_OWNER=dev-team
GITHUB_REPO=dev-releases
```

**Production (.env.production)**
```env
GITHUB_TYPE=enterprise
GITHUB_ENTERPRISE_URL=https://github.production.company.com
GITHUB_TOKEN=prod_token
GITHUB_OWNER=prod-team
GITHUB_REPO=prod-releases
```

## API Reference

### Configuration Endpoint
`GET /api/v1/github/config-status`

Returns the current GitHub configuration status.

### Publishing Endpoint
`POST /api/v1/releases/{release_id}/publish-to-github`

Publishes a release and its nodes to GitHub as issues.

### Sync Endpoint
`POST /api/v1/releases/{release_id}/nodes/{node_id}/sync-github`

Syncs a node's status with its GitHub issue.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs for detailed error messages
3. Ensure all environment variables are correctly set
4. Verify network connectivity to GitHub servers

The system is designed to work seamlessly with both GitHub.com and any GitHub Enterprise Server instance, providing flexibility for different organizational needs.