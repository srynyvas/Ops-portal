# Ops Portal Backend API

A FastAPI backend service for the Ops Portal Release Management System with MongoDB integration.

## Features

- RESTful API for release management
- **MongoDB database for persistent, hierarchical data storage**
- Document-based structure perfect for nested release data
- CORS enabled for frontend integration
- Comprehensive endpoints for releases, environments, teams, and workflows
- Interactive API documentation
- Automatic sample data initialization

## MongoDB Setup

### Option 1: Using Docker (Recommended)
```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# MongoDB will be available at: mongodb://localhost:27017
# Mongo Express (Web UI) at: http://localhost:8081
```

### Option 2: Local MongoDB Installation
1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. MongoDB will be available at: `mongodb://localhost:27017`

### Option 3: MongoDB Atlas (Cloud)
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URL` in `.env` file

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

### With MongoDB (Recommended)
```bash
# Start the MongoDB-backed server
python main_mongo.py
```

Or using uvicorn directly:
```bash
uvicorn main_mongo:app --reload --port 8080
```

### With In-Memory Storage (No database required)
```bash
# Start the in-memory backend (original version)
python main.py
```

### Production Mode
```bash
uvicorn main_mongo:app --host 0.0.0.0 --port 8080 --workers 4
```

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): http://localhost:8080/docs
- Alternative API docs (ReDoc): http://localhost:8080/redoc

## Available Endpoints

### Releases
- `GET /api/v1/releases` - List all releases (with pagination)
- `GET /api/v1/releases/{id}` - Get specific release
- `POST /api/v1/releases` - Create new release
- `PUT /api/v1/releases/{id}` - Update release
- `DELETE /api/v1/releases/{id}` - Delete release
- `POST /api/v1/releases/{id}/deploy` - Deploy release
- `POST /api/v1/releases/{id}/rollback` - Rollback release
- `POST /api/v1/releases/{id}/approve` - Approve release
- `POST /api/v1/releases/{id}/reject` - Reject release
- `GET /api/v1/releases/{id}/metrics` - Get release metrics
- `GET /api/v1/releases/{id}/history` - Get release history
- `GET /api/v1/releases/analytics` - Get analytics

### Environments
- `GET /api/v1/environments` - List all environments
- `GET /api/v1/environments/{id}/status` - Get environment status

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/metrics` - Get metrics
- `GET /api/v1/dashboard/health` - Get system health

### Teams
- `GET /api/v1/teams` - List all teams
- `GET /api/v1/teams/{id}/members` - Get team members

### Workflows
- `GET /api/v1/workflows` - List all workflows

### Health Check
- `GET /health` - Service health check

## Sample Data

The server initializes with sample release data for testing:
- Q1 2024 Major Release (v2.0.0)
- Security Patch (v1.9.1)
- Performance Improvements (v1.10.0)

## Configuration

Configuration can be modified in the `.env` file:
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8080)
- `RELOAD`: Auto-reload on code changes (default: True)

## Testing the API

### Using curl
```bash
# Get all releases
curl http://localhost:8080/api/v1/releases

# Create a new release
curl -X POST http://localhost:8080/api/v1/releases \
  -H "Content-Type: application/json" \
  -d '{"name":"New Release","version":"1.0.0","description":"Test release"}'

# Get specific release
curl http://localhost:8080/api/v1/releases/release-1
```

### Using the Frontend
The frontend application at http://localhost:3000 or http://localhost:3001 will automatically connect to this backend.

## Development

To extend the API:
1. Add new models in the Pydantic models section
2. Add new endpoints following the existing pattern
3. Update the in-memory database as needed
4. Consider adding persistent storage using SQLAlchemy

## Why MongoDB for Release Management?

MongoDB is perfect for this application because:

1. **Hierarchical Data Structure**: Releases contain features, which contain tasks - MongoDB's document model handles this naturally
2. **Flexible Schema**: Easy to add new fields to releases without migrations
3. **Rich Queries**: Powerful aggregation pipeline for analytics
4. **Scalability**: Handles growth from small teams to enterprise scale
5. **Performance**: Fast reads/writes for complex nested documents
6. **No JOINs Required**: All related data stored together in documents

## Data Model Benefits

Our MongoDB structure provides:
- **Releases** as complete documents with embedded features and tasks
- **Environments** with configuration and deployment history
- **Teams** with member lists and project associations
- **Workflows** with customizable steps and triggers

## Future Enhancements

- Implement authentication and authorization (JWT)
- Add WebSocket support for real-time updates
- Implement caching with Redis
- Add comprehensive logging with structured logs
- Create unit and integration tests
- Add GraphQL API alongside REST
- Implement CI/CD pipeline tracking
- Add audit logs for compliance