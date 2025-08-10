# API Configuration Guide

## Overview
This application is configured to work with backend APIs for full functionality. All API endpoints are centrally configured and easily customizable.

## Quick Setup

1. **Configure your API endpoint**
   - Copy `.env` file and update `VITE_API_BASE_URL` with your backend URL
   - Default: `http://localhost:8080`

2. **Update API version if needed**
   - Set `VITE_API_VERSION` in `.env` file
   - Default: `v1`

## Configuration Files

### 1. Environment Variables (`.env`)
Primary configuration for API endpoints and settings:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_VERSION=v1
```

### 2. API Configuration (`src/config/apiConfig.ts`)
Central configuration file for all API endpoints:
- Base URL configuration
- API version management
- Timeout and retry settings
- Request headers
- All endpoint definitions

### 3. API Client (`src/services/apiClient.ts`)
Robust API client with:
- Automatic retries for failed requests
- Request timeout handling
- Error handling and recovery
- Request cancellation support
- Response type safety

## API Endpoints Structure

All endpoints follow RESTful conventions:

### Release Management
- `GET /api/v1/releases` - List all releases
- `GET /api/v1/releases/:id` - Get specific release
- `POST /api/v1/releases` - Create new release
- `PUT /api/v1/releases/:id` - Update release
- `DELETE /api/v1/releases/:id` - Delete release
- `POST /api/v1/releases/:id/deploy` - Deploy release
- `POST /api/v1/releases/:id/rollback` - Rollback release
- `POST /api/v1/releases/:id/approve` - Approve release
- `POST /api/v1/releases/:id/reject` - Reject release

### Workflow Management
- `GET /api/v1/workflows` - List workflows
- `POST /api/v1/workflows/:id/execute` - Execute workflow
- `GET /api/v1/workflows/:id/status` - Get workflow status

### Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/dashboard/metrics` - Performance metrics
- `GET /api/v1/dashboard/health` - System health

### Environments
- `GET /api/v1/environments` - List environments
- `GET /api/v1/environments/:id/status` - Environment status
- `GET /api/v1/environments/:id/health` - Health checks

## Customization

### Modify API Endpoints
Edit `src/config/apiConfig.ts`:
```typescript
endpoints: {
  releases: {
    list: '/your-custom-path',
    // ... other endpoints
  }
}
```

### Add New API Endpoints
1. Add endpoint definition in `apiConfig.ts`
2. Create service method in relevant service file
3. Use the apiClient to make the request

### Configure Request Settings
In `src/config/apiConfig.ts`:
```typescript
export const apiConfig = {
  timeout: 30000,        // Request timeout in ms
  retryAttempts: 3,      // Number of retry attempts
  retryDelay: 1000,      // Delay between retries
  headers: {             // Default headers
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  }
}
```

## Error Handling

The application includes automatic fallback mechanisms:
- API failures gracefully degrade to empty states
- Error messages are displayed to users
- Retry logic for transient failures
- Offline mode detection

## Testing with Mock Backend

For development without a backend:
1. Set `VITE_ENABLE_MOCK_MODE=true` in `.env`
2. The app will use fallback data when API calls fail
3. Console will log all API attempts for debugging

## Authentication

If your API requires authentication:
1. Set `VITE_API_KEY` in `.env`
2. Or implement token-based auth in `apiClient.ts`
3. Headers are automatically included in all requests

## WebSocket Support

For real-time updates:
```env
VITE_WS_URL=ws://localhost:8080/ws
```

## Troubleshooting

### CORS Issues
Ensure your backend allows requests from your frontend URL:
- Add appropriate CORS headers
- Or use a proxy in development

### Connection Refused
- Verify backend is running
- Check the API URL is correct
- Ensure no firewall blocking

### Timeout Errors
- Increase timeout in `apiConfig.ts`
- Check network connectivity
- Verify backend performance

## Example Backend Implementation

Your backend should implement these endpoints to work with this frontend:

```javascript
// Express.js example
app.get('/api/v1/releases', (req, res) => {
  res.json({
    releases: [...],
    total: 100,
    page: 1,
    totalPages: 10
  });
});

app.post('/api/v1/releases', (req, res) => {
  const newRelease = req.body;
  // Create release logic
  res.json(newRelease);
});
```

## Support

For issues or questions:
- Check console for detailed error messages
- Verify network tab in browser DevTools
- Ensure all environment variables are set correctly