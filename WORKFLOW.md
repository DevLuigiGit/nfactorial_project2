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
| Backend | Context7 MCP | Prisma schema docs → генерация schema.prisma |
| Backend | glm-backend MCP | Генерация routes, seed, AI endpoint |
| Backend | github MCP | Управление репозиторием, пуш веток |
| Backend | API Design sub-agent | Проверка REST структуры ответов |
| Frontend | Context7 MCP | React, Tailwind, shadcn/ui |
| Frontend | UI Review sub-agent | Проверка интерфейса |
| AI | Job Matcher sub-agent | Подбор вакансий |
| AI | Skill Advisor sub-agent | Анализ навыков |
| QA | Playwright MCP | UI тестирование |
| QA | Test Generator sub-agent | Генерация тестов |

## Backend MCP Usage Detail

### context7 MCP → Prisma Schema
Промпт отправленный в context7:
```
use context7

Покажи как правильно настроить Prisma schema для SQLite с моделями
Company и Job, где Job хранит массив skills. Нужна связь один-ко-многим.
```
Результат: сгенерирована `backend/prisma/schema.prisma` с моделями Company и Job.

### context7 MCP → Express Routes
Промпт:
```
use context7

Как типизировать query параметры в Express + TypeScript для фильтрации:
city, grade, workFormat через Prisma findMany where условия?
```
Результат: сгенерированы типизированные фильтры в `src/routes/jobs.ts`.

### glm-backend MCP → Seed Data
Промпт:
```
Сгенерируй Prisma seed файл: 5 казахстанских IT-компаний
(Kaspi.kz, Kolesa Group, Jusan Bank, 2GIS, Samruk Digital)
и 20 вакансий с разными city/grade/workFormat/skills.
```
Результат: `backend/prisma/seed.ts` — 5 компаний, 20 реалистичных вакансий.

### glm-backend MCP → AI Tool-based Endpoint
Промпт:
```
Сгенерируй Express endpoint POST /api/ai/chat с архитектурой tool calls:
- jobSearchTool (фильтрует вакансии из Prisma)
- companyInfoTool (получает компанию из Prisma)  
- skillGapTool (сравнивает навыки с требованиями вакансии)
Ответ должен возвращать { answer, toolCalls, jobs }
```
Результат: `backend/src/routes/ai.ts` с тремя tools и логированием вызовов.

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
