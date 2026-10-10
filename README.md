# CampusFlow

CampusFlow is a full-stack student productivity platform for managing tasks, study sessions, subjects, notes, and academic analytics. The app includes a secure Express + MongoDB backend and a responsive Vite + React frontend.

## Features
- Task management with filters, sorting, search, and completion tracking
- Subject organization with progress tracking
- Notes with subject and tag filters
- Study session scheduling and tracking
- Dashboard analytics and weekly productivity charts
- Authentication and protected routes
- Responsive layout with sidebar navigation

## Tech Stack
- Frontend: React, Vite, React Router, Recharts, Lucide, date-fns
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Testing: Vitest, Supertest, Testing Library

## Architecture
- rontend/ contains the React app
- server/ contains the Express API and Mongoose models

## Frontend setup
`ash
cd frontend
npm install
npm run dev
`

## Backend setup
`ash
cd server
npm install
cp .env.example .env
npm run dev
`

## Environment variables
Create .env files based on the provided .env.example files.

## MongoDB
The server connects to MongoDB via MONGODB_URI. If no URI is provided, it falls back to an in-memory MongoDB instance for development, which is useful for local testing without an external database.

## Testing
`ash
cd frontend
npm run test

cd ../server
npm run test
`

## Deployment
Deploy the frontend as a static site and the backend as a Node.js service. Configure production environment variables and a persistent MongoDB instance.

## Security
- Never commit production secrets
- Use HttpOnly cookies for auth
- Validate all request inputs
- Store passwords as bcrypt hashes
