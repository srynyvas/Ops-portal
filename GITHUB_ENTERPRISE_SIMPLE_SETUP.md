# GitHub Enterprise Support - Simple Configuration Guide

## Overview

The Ops Portal now supports both GitHub.com and GitHub Enterprise Server with a simple true/false flag switchover mechanism. All configurations are pre-defined in the `.env` file, and you just need to flip a switch to change between them.

## How It Works

### Single Flag Control

```env
GITHUB_ENTERPRISE=false  # Use GitHub.com
GITHUB_ENTERPRISE=true   # Use GitHub Enterprise
```

That's it! Just change this one value and restart the backend.

## Configuration Structure

Your `.env` file contains both configurations:

```env
# Switch Flag
GITHUB_ENTERPRISE=false

# GitHub Cloud Configuration (used when GITHUB_ENTERPRISE=false)
GITHUB_CLOUD_TOKEN=your_github_com_token
GITHUB_CLOUD_OWNER=your_github_username
GITHUB_CLOUD_REPO=your_repository

# GitHub Enterprise Configuration (used when GITHUB_ENTERPRISE=true)
GITHUB_ENTERPRISE_URL=https://github.yourcompany.com
GITHUB_ENTERPRISE_TOKEN=your_enterprise_token
GITHUB_ENTERPRISE_OWNER=your_enterprise_org
GITHUB_ENTERPRISE_REPO=your_enterprise_repo
```

## Quick Start

### Step 1: Configure Both Environments

Edit your `.env` file and set up both configurations:

```env
# For GitHub.com
GITHUB_CLOUD_TOKEN=ghp_your_github_token_here
GITHUB_CLOUD_OWNER=your-username
GITHUB_CLOUD_REPO=your-repo

# For Enterprise
GITHUB_ENTERPRISE_URL=https://github.company.com
GITHUB_ENTERPRISE_TOKEN=ghp_enterprise_token_here
GITHUB_ENTERPRISE_OWNER=enterprise-org
GITHUB_ENTERPRISE_REPO=enterprise-repo
```

### Step 2: Choose Your Environment

Set the flag to select which configuration to use:

- **For GitHub.com**: `GITHUB_ENTERPRISE=false`
- **For Enterprise**: `GITHUB_ENTERPRISE=true`

### Step 3: Restart Backend

```bash
# Stop the backend (Ctrl+C)
# Start it again
python main_mongo_updated.py
```

The system automatically uses the appropriate configuration based on the flag.

## Testing the Configuration

### Check Current Mode

```bash
curl http://localhost:8080/api/v1/github/config-status
```

**Response for Cloud mode (GITHUB_ENTERPRISE=false):**
```json
{
  "configured": true,
  "owner": "your-username",
  "repo": "your-repo",
  "type": "cloud"
}
```

**Response for Enterprise mode (GITHUB_ENTERPRISE=true):**
```json
{
  "configured": true,
  "owner": "enterprise-org",
  "repo": "enterprise-repo",
  "type": "enterprise",
  "enterprise_url": "https://github.company.com"
}
```

### Run Test Script

```bash
cd backend
python test_github_switchover.py
```

This will show:
- Current configuration
- Active mode (cloud or enterprise)
- API endpoints being used

## UI Indicators

The UI automatically detects and displays the current mode:

- **Cloud Mode**: Shows `GitHub.com: owner/repo`
- **Enterprise Mode**: Shows `Enterprise: owner/repo`
- **Status Indicator**: Green dot = configured, Red dot = not configured

## Common Use Cases

### Development Environment
Use GitHub.com for development:
```env
GITHUB_ENTERPRISE=false
```

### Production Environment
Use GitHub Enterprise for production:
```env
GITHUB_ENTERPRISE=true
```

### Testing Both
Simply flip the flag to test with different environments without changing multiple variables.

## Advantages of This Approach

1. **Simple**: Just one flag to change
2. **No Confusion**: All settings are pre-configured
3. **Quick Switch**: Change environments in seconds
4. **Error-Free**: No risk of mixing configurations
5. **Clear Structure**: Both configs visible in one place

## Troubleshooting

### Issue: Configuration not changing
**Solution**: Make sure to restart the backend after changing the flag

### Issue: Enterprise URL not working
**Solution**: Don't include `/api/v3` in the URL - just the base URL

### Issue: Token errors
**Solution**: Ensure you're using the correct token for each environment:
- GitHub.com tokens from: https://github.com/settings/tokens
- Enterprise tokens from: https://YOUR_ENTERPRISE/settings/tokens

## Example Scenarios

### Scenario 1: Switching from Development to Production

```bash
# Development work on GitHub.com
GITHUB_ENTERPRISE=false  # Your code on GitHub.com

# Ready for production deployment
GITHUB_ENTERPRISE=true   # Switch to company's GitHub Enterprise

# Restart backend - done!
```

### Scenario 2: Testing Enterprise Features

```bash
# Normal operation
GITHUB_ENTERPRISE=false

# Test enterprise-specific features
GITHUB_ENTERPRISE=true
# Test your features
# Switch back when done
GITHUB_ENTERPRISE=false
```

## Security Notes

1. **Keep tokens secure**: Never commit `.env` file to version control
2. **Use different tokens**: Don't reuse tokens between environments
3. **Minimal permissions**: Only grant necessary scopes to tokens
4. **Regular rotation**: Update tokens periodically

## API Endpoints

The system automatically configures the correct endpoints:

| Mode | Flag Value | API Endpoint |
|------|------------|--------------|
| Cloud | `false` | `https://api.github.com/repos/{owner}/{repo}` |
| Enterprise | `true` | `https://{enterprise_url}/api/v3/repos/{owner}/{repo}` |

## Summary

With this simple flag-based approach:
1. Configure both environments once in `.env`
2. Use `GITHUB_ENTERPRISE=true/false` to switch
3. Restart backend
4. System automatically uses the correct configuration

No need to remember multiple variables or worry about misconfiguration. Just flip the switch!