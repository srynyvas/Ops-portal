# GitHub Integration Setup Guide

## Overview
The Release Management Tool now includes full GitHub integration, allowing you to:
- Create GitHub issues from release nodes
- Sync status changes bidirectionally
- Track issue links directly in the UI
- Maintain hierarchy with parent-child issue relationships

## Setup Instructions

### 1. Configure GitHub Credentials

Create or update the `.env` file in the `backend` directory:

```bash
# backend/.env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username_or_organization
GITHUB_REPO=your_repository_name

# Example:
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=srynyvas
GITHUB_REPO=ops-portal
```

To create a GitHub Personal Access Token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `repo` (Full control of private repositories)
4. Copy the generated token

### 2. Start the Services

```bash
# Terminal 1: Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Terminal 2: Start Backend
cd backend
py -3.11 main_mongo_updated.py

# Terminal 3: Start Frontend
cd "Mission control"
npm run dev
```

### 3. Test the Integration

Run the test script to verify everything works:

```bash
cd backend
py -3.11 test_github_integration.py
```

## Using GitHub Integration

### Publishing a Release to GitHub

1. Open the Release Management Tool in your browser
2. Create or load a release with nodes
3. Save the release to MongoDB (Save button)
4. Click "Publish to GitHub" button in the toolbar
5. View created issues with links in each node

### Features in the UI

#### Node Cards
- GitHub issue links appear as badges (e.g., `#123`)
- Click the link to open the issue in GitHub
- Icons show sync status

#### Properties Panel
When you click the settings icon on a node:
- **GitHub Issue** section shows if published
- **Sync Status to GitHub** button updates the issue
- Status changes auto-sync when the node has a GitHub issue

#### Automatic Status Sync
When you change a node's status in the Properties panel:
- If the node has a GitHub issue, it auto-syncs
- GitHub issue state updates (open/closed)
- Labels update to reflect new status
- Comment added to issue showing the change

### Status Mapping

| Our Status | GitHub State | GitHub Label |
|------------|--------------|--------------|
| planning | open | status:planning |
| in-development | open | status:in-progress |
| testing | open | status:testing |
| ready-for-release | open | status:ready |
| released | closed | status:released |
| blocked | open | status:blocked |
| on-hold | open | status:on-hold |

### GitHub Issue Hierarchy

The integration maintains parent-child relationships:
- Release nodes become parent issues
- Feature nodes create sub-issues
- Task nodes create nested sub-issues
- Parent issues get comments linking to children

## Testing Workflow

1. **Create a Test Release**
   - Add a release with features and tasks
   - Set descriptions, assignees, and priorities

2. **Publish to GitHub**
   - Click "Publish to GitHub"
   - Check the success message for issue numbers

3. **Verify in GitHub**
   - Open your repository's Issues tab
   - Check that all nodes created issues
   - Verify labels match priorities and status
   - Check parent-child linking via comments

4. **Test Status Sync**
   - Change a node's status in the UI
   - Check GitHub issue updates automatically
   - Try the manual "Sync Status to GitHub" button

5. **Verify MongoDB Storage**
   - GitHub issue info persists in MongoDB
   - Reload the page - links remain
   - Check `github_issue` field in node data

## API Endpoints

### Check GitHub Configuration
```
GET /api/v1/github/config-status
```

### Publish Release to GitHub
```
POST /api/v1/releases/{release_id}/publish-to-github
```

### Sync Node Status
```
POST /api/v1/releases/{release_id}/nodes/{node_id}/sync-github
Body: { "status": "new-status" }
```

## Troubleshooting

### "GitHub integration not configured"
- Check `.env` file has all three variables
- Restart the backend after adding credentials
- Verify token has `repo` scope

### Issues not creating
- Check GitHub API rate limits
- Verify repository exists and is accessible
- Check backend logs for detailed errors

### Status sync failing
- Ensure node was published to GitHub first
- Check GitHub token permissions
- Verify issue still exists in GitHub

## Next Steps

### Webhook Integration (Coming Soon)
To sync GitHub changes back to MongoDB:
1. Set up GitHub webhook for issue events
2. Point to your backend endpoint
3. Auto-update MongoDB when issues change in GitHub

### Advanced Features to Implement
- Bulk operations for multiple releases
- GitHub Project board integration
- Milestone mapping for releases
- Pull request linking to tasks
- Automated release notes generation

## Support

For issues or questions:
- Check backend logs: `backend/logs/`
- MongoDB data: `ops_portal.releases` collection
- GitHub API status: https://www.githubstatus.com/

## Security Notes

- Never commit `.env` files to version control
- Use environment-specific tokens
- Rotate tokens regularly
- Limit token scope to minimum required permissions