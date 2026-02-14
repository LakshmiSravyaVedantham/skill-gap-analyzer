# Skill Gap Analyzer

Paste a job posting + your skills/resume. AI identifies what you're missing and creates a personalized learning path.

## Features

- **Match Score** - How well you fit the job (1-100%)
- **Matched Skills** - Skills you already have
- **Missing Skills** - What you need to learn with difficulty and time estimates
- **Learning Path** - Phased plan with free resources
- **Quick Wins** - Actions you can take this week
- **Resume Tips** - How to tailor your resume for the specific job

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm start            # Port 3003

# Frontend
cd frontend
npm install
npm run dev          # Port 3000
```

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Express.js
- **AI**: Claude API (Anthropic)
