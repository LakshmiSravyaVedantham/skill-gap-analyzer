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
npm run dev          # Port 5176
```

### AI Setup (choose one - both are FREE)

| Provider | Best For | Setup |
|----------|----------|-------|
| **Groq** (cloud) | Deployment, sharing | Get free key at [console.groq.com/keys](https://console.groq.com/keys), add `GROQ_API_KEY` to `.env` |
| **Ollama** (local) | Development, offline | Install from [ollama.com](https://ollama.com), run `ollama pull llama3.2:3b` |

If both are configured, Groq is used first with Ollama as fallback.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Express.js
- **AI**: Groq (cloud) / Ollama (local) - both free, no paid API needed
