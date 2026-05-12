# WORKFLOW.md

## Project

JobBoard AI — mini LinkedIn / HH platform with AI job assistant.

## Team Roles

| Role | Name | Main Tasks |
|---|---|---|
| Frontend Developer | Yerdaulet | UI, pages, filters |
| Backend Developer | Aleksej | API, DB, Prisma, AI tools |
| AI Engineer | Arzhan | AI tools, assistant, prompts |
| QA Engineer & Workflow Master | Ainur | tests, docs, workflow |

## MCP & Sub-agents Used

| Role | MCP / Sub-agent | Purpose |
|---|---|---|
| Backend | Context7 MCP | Express, Prisma, TypeScript docs |
| Backend | API Design sub-agent | REST structure review |
| Frontend | Context7 MCP | React, Tailwind, shadcn/ui |
| Frontend | UI Review sub-agent | Interface review |
| AI | Job Matcher sub-agent | Job matching |
| AI | Skill Advisor sub-agent | Skill gap analysis |
| QA | Playwright MCP | UI testing |
| QA | Test Generator sub-agent | Test generation |

## API Endpoints Delivered

- `GET /api/jobs` — jobs with city/grade/workFormat filters
- `GET /api/jobs/:id` — job details
- `GET /api/jobs/meta` — filter values
- `GET /api/companies` — companies list
- `GET /api/companies/:id` — company with jobs
- `POST /api/ai/chat` — AI assistant with jobSearchTool, companyInfoTool, skillGapTool

## Tool Calls Architecture

AI endpoint (`POST /api/ai/chat`) demonstrates tool-call pattern:

```json
{
  "answer": "Нашёл 3 подходящих вакансии...",
  "toolCalls": [
    {
      "tool": "jobSearchTool",
      "input": { "city": "Almaty", "grade": "Junior" },
      "timestamp": "2025-05-12T19:00:00.000Z"
    }
  ],
  "jobs": [...]
}
```

## Screenshots

> _(добавить скриншоты из IDE здесь)_

## Team Reflection

### 1. Где AI сэкономил больше всего времени?
Генерация seed-данных, Prisma schema, Express boilerplate — это заняло бы в 3–4 раза больше времени вручную.

### 2. Где AI ошибался?
Типы TypeScript иногда требовали ручной корректировки. Обработка JSON-полей (skills как строка в SQLite) потребовала явного указания.

### 3. Что без AI заняло бы ×3 времени?
- Seed с 20 реалистичными вакансиями
- Tool-call архитектура AI endpoint
- TypeScript типизация всех routes

## Final Checklist

- [x] GitHub repository
- [ ] Deployed frontend
- [ ] Deployed backend
- [x] README.md
- [x] WORKFLOW.md
- [x] ai-rules/backend_aleksej.md
- [ ] ai-rules от каждого участника
- [x] MCP / sub-agents described
- [x] AI-generated commits
- [ ] Tests
- [ ] No commits after 20:30
