# Course Builder Backend API

A Node.js/Express backend service for the Course Builder platform.

## Features

- RESTful API for course management
- User progress tracking
- Feedback system
- Health monitoring
- CORS enabled for frontend integration

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/feedback` - Submit course feedback

### User Progress
- `GET /api/user/:id/progress` - Get user learning progress

## Environment Variables

Copy `env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `DATABASE_URL` - Database connection string (optional)
- `JWT_SECRET` - JWT signing secret (optional)

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm start
```

## Deployment

This service is designed to be deployed on Railway with automatic deployments from GitHub.
