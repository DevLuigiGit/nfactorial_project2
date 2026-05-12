# Role
Backend Developer

# System Rules
- Ты AI-ассистент backend-разработчика в проекте JobBoard AI.
- Пиши код только на Node.js + Express + TypeScript.
- Используй Prisma + SQLite (dev) / PostgreSQL (production).
- API должен быть RESTful с корректными HTTP-статусами.
- Не храни данные в массивах — только через Prisma и базу.
- Не смешивай routes и бизнес-логику в одном файле.
- Всегда добавляй обработку ошибок с понятными сообщениями.
- Не изменяй код других участников без явного согласования.

# MCP & Tools

## context7 MCP
**Назначение:** получение актуальной документации библиотек прямо в контексте AI-ассистента.

**Использовался для:**
- Получения документации Prisma ORM → генерация корректной `schema.prisma` с моделями `Company` и `Job`
- Документации Express.js → генерация роутеров с правильной типизацией Request/Response
- Документации TypeScript → правильные типы для query-параметров фильтрации

**Пример промпта с context7:**
```
use context7

Покажи как правильно настроить Prisma schema для SQLite с моделями Company и Job,
где Job хранит массив skills. Нужна связь один-ко-многим.
```

**Результат:** сгенерирована `prisma/schema.prisma` с правильными relations и полями.

## glm-backend MCP (GLM 5.1)
**Назначение:** генерация backend кода через специализированную AI-модель.

**Использовался для:**
- Генерации Prisma seed файла с 5 компаниями и 20 вакансиями
- Генерации Express routes с фильтрацией
- Генерации AI tool-based endpoint (`/api/ai/chat`)

**Пример промпта:**
```
Сгенерируй Express router для GET /api/jobs с фильтрами city, grade, workFormat.
Используй Prisma findMany с where условиями. TypeScript.
```

**Результат:** сгенерированы `src/routes/jobs.ts`, `src/routes/companies.ts`, `src/routes/ai.ts`.

## github MCP
**Назначение:** управление репозиторием прямо из Claude Code.

**Использовался для:**
- Создания и пуша ветки `feature/backend-api`
- Коммитов с AI-generated сообщениями

# Subagents

## API Design sub-agent
- Проверял корректность REST naming конвентий
- Проверял структуру JSON ответов
- Проверял покрытие edge-cases (404, 500)

## Test Generator sub-agent
- Генерировал Vitest + Supertest тесты для всех endpoints
- Результат: 9 тестов, все зелёные

# Output Contracts

## Prisma Schema (сгенерирована через context7 + промпт)
```prisma
model Company {
  id, name, description, logoUrl, website, city, jobs[]
}
model Job {
  id, title, description, city, grade, workFormat,
  salaryFrom, salaryTo, skills (JSON string), companyId
}
```

## REST API (сгенерировано через glm-backend)
- `GET /api/jobs` — список с фильтрами (city, grade, workFormat)
- `GET /api/jobs/:id` — вакансия с компанией
- `GET /api/jobs/meta` — доступные значения фильтров
- `GET /api/companies` — список компаний
- `GET /api/companies/:id` — компания с вакансиями
- `POST /api/ai/chat` — AI с tool calls

## AI Tool Calls Response
```json
{
  "answer": "Нашёл 3 вакансии...",
  "toolCalls": [
    { "tool": "jobSearchTool", "input": {...}, "timestamp": "..." }
  ],
  "jobs": [...]
}
```
