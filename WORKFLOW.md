# WORKFLOW.md — JobBoard AI

## Project
Mini LinkedIn / HH платформа вакансий с AI-ассистентом по подбору работы.

## Team

| Role | Name | Branch |
|---|---|---|
| Frontend Developer | Yerdaulet | feature/frontend-ui |
| Backend Developer | Alexey | feature/backend-api |
| AI Engineer | Arzhan | feature/ai-assistant |
| QA Engineer & Workflow Master | Ainur | feature/qa-workflow |

---

## Timeline (90 минут)

### 19:00–19:10 — Старт
- Получен доступ к GitHub репозиторию
- Все участники создали свои ветки
- Добавлены ai-rules файлы для каждой роли

### 19:10–19:35 — Базовая реализация
- **Backend**: создан Express + Prisma + SQLite бэк, схема БД, seed (5 компаний, 19 вакансий)
- **Frontend**: создан React + Vite + Tailwind проект, компоненты Layout, Header, JobCard, JobFilters
- **AI**: спроектирована архитектура tool-based ассистента
- **QA**: подготовлен план тестирования

### 19:35–20:00 — Интеграция
- **Backend**: реализованы все API endpoints с фильтрами, AI endpoint с tool calls
- **Frontend**: подключён к API, добавлены страницы /jobs, /jobs/:id, /companies/:id
- **AI**: подключён POST /api/ai/chat с jobSearchTool, companyInfoTool, skillGapTool
- **QA**: написаны 9 backend тестов (Vitest + Supertest), все зелёные

### 20:00–20:20 — Полировка
- **Backend**: обработка ошибок, CORS, /api/jobs/meta endpoint, JSON файлы в data/
- **Frontend**: loading/error states, адаптивный UI, AiAssistantPanel
- **QA**: написаны Playwright E2E тесты (4 файла, 9 сценариев)

### 20:20–20:30 — Freeze
- Финальные коммиты
- Проверка Definition of Done
- `git push` до дедлайна

---

## MCP & Sub-agents Used

| Role | MCP / Sub-agent | Для чего использовался |
|---|---|---|
| Backend | **context7 MCP** | Документация Prisma → генерация schema.prisma |
| Backend | **glm-backend MCP** | Генерация seed, routes, AI endpoint |
| Backend | **github MCP** | Управление репозиторием, пуш веток |
| Backend | API Design sub-agent | Проверка REST структуры и ответов |
| Frontend | **context7 MCP** | Документация React, Tailwind, shadcn/ui |
| Frontend | UI Review sub-agent | Проверка визуального интерфейса |
| AI | Job Matcher sub-agent | Подбор вакансий по параметрам |
| AI | Skill Advisor sub-agent | Анализ gap навыков |
| QA | **Playwright MCP** | E2E тестирование браузера |
| QA | Test Generator sub-agent | Генерация Vitest + Supertest тестов |
| QA | Code Review sub-agent | Финальная проверка Definition of Done |

---

## Backend MCP Usage Detail

### context7 MCP → Prisma Schema
```
use context7

Покажи как настроить Prisma schema для SQLite с моделями Company и Job,
где Job хранит массив skills. Нужна связь один-ко-многим.
```
**Результат:** `backend/prisma/schema.prisma` с моделями Company и Job, правильными relations.

### context7 MCP → Express TypeScript
```
use context7

Как типизировать query параметры в Express + TypeScript для фильтрации
city, grade, workFormat через Prisma findMany where условия?
```
**Результат:** типизированные фильтры в `backend/src/routes/jobs.ts`.

### glm-backend MCP → Seed Data
```
Сгенерируй Prisma seed: 5 казахстанских IT-компаний
(Kaspi.kz, Kolesa Group, Jusan Bank, 2GIS, Samruk Digital)
и 19 вакансий с разными city/grade/workFormat/skills.
```
**Результат:** `backend/prisma/seed.ts` — 5 компаний, 19 реалистичных вакансий.

### glm-backend MCP → AI Tool-based Endpoint
```
Сгенерируй Express endpoint POST /api/ai/chat с tool calls:
- jobSearchTool (фильтрует вакансии из Prisma)
- companyInfoTool (информация о компании)
- skillGapTool (сравнивает навыки с требованиями)
Ответ: { answer, toolCalls, jobs }
```
**Результат:** `backend/src/routes/ai.ts` с тремя tools и логированием.

---

## QA Evidence

### Backend тесты — 9/9 ✅
```
backend/src/routes/jobs.test.ts

✓ GET /api/jobs returns array
✓ GET /api/jobs?grade=Junior returns only Junior jobs
✓ GET /api/jobs?city=Almaty returns only Almaty jobs
✓ GET /api/jobs/meta returns filter options
✓ GET /api/jobs/:id returns job with company
✓ GET /api/jobs/:id returns 404 for unknown id
✓ GET /api/companies returns array
✓ GET /api/companies/:id returns company with jobs
✓ POST /api/ai/chat returns answer and toolCalls
```

### E2E тесты (Playwright)
```
tests/e2e/navigation.spec.ts   — home page, header, routing (3 tests)
tests/e2e/jobs.spec.ts         — job list, filters visible, content (3 tests)
tests/e2e/job-detail.spec.ts   — job detail page (2 tests)
tests/e2e/ai-assistant.spec.ts — AI panel visible, responds (2 tests)
```

### Playwright MCP — пример промпта
```
use playwright

Напиши Playwright тест:
1. Открыть /jobs
2. Проверить что список вакансий загружается
3. Проверить что фильтры видны
4. Кликнуть на вакансию → открывается /jobs/:id
5. Проверить что страница содержит salary или skills
```

---

## AI Tool Calls — доказательство

`POST /api/ai/chat` всегда возвращает `toolCalls` с логом вызовов:

```json
{
  "answer": "Нашёл 3 подходящих вакансии:\n• Frontend Developer в Kaspi.kz...",
  "toolCalls": [
    {
      "tool": "jobSearchTool",
      "input": { "city": "Almaty", "grade": "Junior", "skills": ["React"] },
      "timestamp": "2026-05-12T19:15:00.000Z"
    }
  ],
  "jobs": [...]
}
```

---

## Team Reflection

### 1. Где AI сэкономил больше всего времени?
- **Seed данные:** 19 реалистичных вакансий с казахстанскими компаниями — вручную заняло бы 30+ минут
- **Boilerplate:** Express + Prisma + TypeScript настройка — 20 минут вместо 60
- **Тесты:** 9 backend тестов сгенерированы за 2 минуты
- **WORKFLOW.md и документация:** структурирована и заполнена AI

### 2. Где AI ошибался?
- TypeScript типы для Express Request query параметров требовали ручной корректировки
- JSON.parse для skills поля в SQLite — AI не учёл что Prisma не поддерживает arrays в SQLite
- Playwright тесты иногда генерировал с жёсткими CSS-селекторами — переписывали на role-based

### 3. Что без AI заняло бы ×3 времени?
| Задача | С AI | Без AI |
|---|---|---|
| Seed 19 вакансий | 2 мин | 30 мин |
| Prisma schema + migrations | 3 мин | 20 мин |
| AI tool-based endpoint | 5 мин | 45 мин |
| 9 backend тестов | 3 мин | 25 мин |
| WORKFLOW.md | 5 мин | 40 мин |

---

## Definition of Done ✅

- [x] GitHub репозиторий: `github.com/arzhan-hub/nfactorial_project2`
- [ ] Деплой frontend (Vercel/Netlify)
- [ ] Деплой backend (Railway)
- [x] README.md с инструкцией запуска
- [x] WORKFLOW.md с timeline и рефлексией
- [x] `ai-rules/backend_alexey.md`
- [x] `ai-rules/frontend_arzhan.md`
- [x] `ai-rules/qa_ainur.md`
- [ ] `ai-rules/ai_arzhan.md` (AI Engineer)
- [x] MCP / sub-agents использованы и задокументированы
- [x] AI-generated коммиты в git log
- [x] Backend тесты: 9/9 ✅
- [x] E2E тесты (Playwright): 4 файла, 9 сценариев
- [x] Коммиты до 20:30
