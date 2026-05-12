# JobBoard AI

Mini LinkedIn / HH platform with AI job assistant.

## Team

| Role | Name | Branch |
|---|---|---|
| Frontend Developer | Yerdaulet | feature/frontend-ui |
| Backend Developer | Aleksej | feature/backend-api |
| AI Engineer | Arzhan | feature/ai-assistant |
| QA / Workflow | Ainur | feature/qa-workflow |

## Features

- Jobs list with filters (city, grade, work format)
- Job details page
- Company page with jobs
- AI job assistant with tool calls (jobSearchTool, companyInfoTool, skillGapTool)

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma + SQLite
- **AI**: Tool-based assistant (rule-based with tool call logging)

## Run Backend Locally

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Server starts at `http://localhost:3001`

## API Reference

```
GET  /api/jobs                        — All jobs
GET  /api/jobs?city=Almaty&grade=Junior&workFormat=Remote  — Filtered
GET  /api/jobs/meta                   — Available filter values
GET  /api/jobs/:id                    — Job details
GET  /api/companies                   — All companies
GET  /api/companies/:id               — Company with jobs
GET  /api/health                      — Health check

POST /api/ai/chat                     — AI assistant
```

### POST /api/ai/chat — Examples

Search jobs:
```json
{ "city": "Almaty", "grade": "Junior", "skills": ["React"] }
```

Company info:
```json
{ "companyId": "<id>" }
```

Skill gap:
```json
{ "jobId": "<id>", "userSkills": ["React", "HTML", "CSS"] }
```

Response always includes `toolCalls` array showing which tools were called.

## Deploy (Production — PostgreSQL)

1. Change `prisma/schema.prisma` datasource provider to `postgresql`
2. Set `DATABASE_URL` to PostgreSQL connection string
3. `npx prisma migrate deploy`
4. `npm run build && npm start`

## Tests

```bash
cd backend
npm test
```
