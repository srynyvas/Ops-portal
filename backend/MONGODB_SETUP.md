# MongoDB Setup Guide for Ops Portal

## Why MongoDB for Release Management?

MongoDB is the perfect database for our release management system because:

1. **Natural Hierarchy**: Releases → Features → Tasks maps perfectly to MongoDB documents
2. **No Complex JOINs**: All related data stored together
3. **Flexible Schema**: Easy to add fields without migrations
4. **Rich Queries**: Powerful aggregation for analytics
5. **Scalable**: From startup to enterprise

## Quick Start Options

### Option 1: Docker (Easiest) 
```bash
# 1. Make sure Docker Desktop is running
# 2. Start MongoDB and Mongo Express
cd backend
docker-compose up -d

# MongoDB: mongodb://localhost:27017
# Web UI: http://localhost:8081 (admin/admin)
```

### Option 2: MongoDB Atlas (Cloud - Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Get your connection string
4. Update `.env`:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
   ```

### Option 3: Local Installation
1. Download from [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017`

## Switching to MongoDB Backend

### Currently Running: In-Memory Backend
The application is currently using the in-memory backend (`main.py`) which:
- Works without any database
- Stores data temporarily in memory
- Perfect for development and testing
- Data is lost when server restarts

### To Use MongoDB Backend:
1. Ensure MongoDB is running (use any option above)
2. Stop current backend (Ctrl+C)
3. Start MongoDB backend:
   ```bash
   python main_mongo.py
   ```

## Benefits of MongoDB Backend

### Data Structure Example
```javascript
// A Release document in MongoDB
{
  "_id": "release-1",
  "name": "Q1 2024 Major Release",
  "version": "2.0.0",
  "features": [
    {
      "id": "f1",
      "title": "New Dashboard",
      "tasks": [
        {
          "id": "t1",
          "title": "Design mockups",
          "status": "completed"
        },
        {
          "id": "t2", 
          "title": "Frontend implementation",
          "status": "in-progress"
        }
      ]
    }
  ],
  "deploymentHistory": [
    {
      "environment": "staging",
      "deployedAt": "2024-01-15",
      "status": "success"
    }
  ]
}
```

### Query Examples
```python
# Find all critical releases
releases = await Release.find({"priority": "critical"}).to_list()

# Get releases with specific features
releases = await Release.find({
    "features.title": {"$regex": "Dashboard", "$options": "i"}
}).to_list()

# Aggregate release metrics
pipeline = [
    {"$match": {"status": "deployed"}},
    {"$group": {
        "_id": "$type",
        "count": {"$sum": 1},
        "avgFeatures": {"$avg": {"$size": "$features"}}
    }}
]
```

## Viewing Your Data

### Using Mongo Express (Web UI)
1. Open http://localhost:8081
2. Login: admin/admin
3. Browse collections visually
4. Run queries and edit documents

### Using MongoDB Compass (Desktop App)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Visual query builder and data explorer

### Using VS Code Extension
1. Install "MongoDB for VS Code"
2. Connect to your database
3. Browse and query directly in VS Code

## Sample Data

When you start the MongoDB backend for the first time, it automatically creates:
- 3 sample releases with features and tasks
- 3 environments (dev, staging, production)
- 3 teams with members

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify port 27017 is not blocked

### "Docker: system cannot find the file"
- Start Docker Desktop application
- Wait for it to fully initialize
- Try `docker-compose up -d` again

### "Port 27017 already in use"
- MongoDB might already be running
- Check with: `netstat -an | findstr 27017`
- Stop existing MongoDB or use different port

## Production Considerations

For production deployment:
1. **Enable Authentication**: Add username/password
2. **Use Replica Sets**: For high availability
3. **Enable Sharding**: For horizontal scaling
4. **Regular Backups**: Use `mongodump` or Atlas backups
5. **Monitoring**: Use MongoDB Atlas or Prometheus
6. **Indexes**: Create indexes for common queries

## Next Steps

1. Start MongoDB using your preferred method
2. Switch to MongoDB backend: `python main_mongo.py`
3. Access the API docs: http://localhost:8080/docs
4. View data in Mongo Express: http://localhost:8081
5. The frontend will automatically use the new backend!

## Need Help?

- MongoDB Docs: https://docs.mongodb.com/
- FastAPI + MongoDB: https://www.mongodb.com/developer/languages/python/fastapi/
- Beanie ODM: https://beanie-odm.dev/