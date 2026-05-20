# CodeMentor AI – Intelligent Coding Interview & Evaluation Platform

A full-stack production-ready interview platform built with React, Tailwind CSS, Spring Boot, MySQL, and AI-powered code review.

## Features

- User authentication with JWT and role-based access
- Coding question library with difficulty levels
- In-browser code editor and solution submission
- AI code review, complexity analysis, and interview feedback
- Submission history, analytics dashboard, and leaderboard
- Admin panel to manage questions and users
- Docker-ready backend and frontend

## Project Structure

- `backend/` – Spring Boot REST API
- `frontend/` – React application with Tailwind CSS
- `docker-compose.yml` – Docker services for backend, frontend, and MySQL
- `.env.example` – Environment variable templates

## Quick Start

1. Copy `.env.example` to `.env` and fill in values.
2. Run `docker-compose up --build`.
3. Access frontend at `http://localhost:3000`.
4. API base URL: `http://localhost:8080/api`.

## Local Development

### Backend

```bash
cd backend
mvn clean package
java -jar target/codementor-ai-backend-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Documentation

OpenAPI docs are available at `http://localhost:8080/swagger-ui/index.html` after backend startup.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Questions
- `GET /api/questions`
- `GET /api/questions/{id}`
- `POST /api/questions` (admin)
- `PUT /api/questions/{id}` (admin)
- `DELETE /api/questions/{id}` (admin)

### Submissions
- `GET /api/submissions` (user/admin)
- `POST /api/submissions`
- `GET /api/submissions/{id}`

### AI Review
- `POST /api/ai/review`

### Dashboard
- `GET /api/dashboard/profile`
- `GET /api/dashboard/analytics`
- `GET /api/dashboard/leaderboard`

## Database Schema

- `users`
- `questions`
- `submissions`
- `ai_feedback`
- `leaderboard`

## Docker

- Backend uses `Dockerfile.backend`
- Frontend uses `Dockerfile.frontend`
- MySQL service with initialized schema

## Notes

- The AI module is configured to call OpenAI or Groq API via environment variables.
- Sample coding questions are loaded on startup.

