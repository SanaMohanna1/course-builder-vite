# Course Builder

An AI-driven educational platform with personalized and marketplace courses.

## 🏗️ Project Structure

```
course-builder/
├── frontend/          # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js + Express API
│   ├── data/          # Mock data
│   ├── server.js
│   └── package.json
└── package.json       # Root package.json (monorepo)
```

## 🚀 Quick Start

### Install Dependencies
```bash
npm run install:all
```

### Development
```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3000
```

### Production
```bash
npm run build        # Build frontend
npm start           # Start backend
```

## 📦 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Repository**: GitHub

## 🎯 Features

### Frontend
- React + Vite + Tailwind CSS
- Personalized and marketplace courses
- Dark mode support
- Responsive design
- Course enrollment and progress tracking

### Backend
- Node.js + Express API
- Mock data for development
- CORS enabled
- Health monitoring
- RESTful endpoints

## 📋 API Endpoints

- `GET /health` - Health check
- `GET /api/courses` - All courses
- `GET /api/courses/:id` - Specific course
- `GET /api/courses/:id/lessons` - Course lessons
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/feedback` - Submit feedback
- `GET /api/user/:id/progress` - User progress
- `GET /api/user/:id/achievements` - User achievements
- `GET /api/learning-paths` - Learning paths

## 🔧 Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL

### Backend
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment
- `FRONTEND_URL` - Frontend URL for CORS

## 📝 License

MIT
