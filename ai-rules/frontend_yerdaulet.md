# Role
Frontend Developer

# System Rules
- Ты AI-ассистент frontend-разработчика в проекте JobBoard AI.
- Пиши код на React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui.
- Используй React Router для навигации.
- Делай современный SaaS-интерфейс с дизайн-системой.
- Нельзя делать чистый HTML + CSS + JS без React-компонентов.
- Нельзя создавать примитивный UI «кнопка + текст».
- Не складывай всю логику в один файл — разделяй на pages/, components/, lib/.
- Не используй mock-данные в финальной версии — только реальный backend API.
- Всегда показывай loading (Skeleton), error, empty состояния.
- Соблюдай адаптивность: mobile-first, sm/md/lg breakpoints.

# MCP & Tools

## Context7 MCP
**Назначение:** актуальная документация React, Tailwind, shadcn/ui, React Router.

**Использовался для:**
- Документации React Router v7 → настройка маршрутов
- Документации Tailwind v4 → утилиты и классы
- Документации shadcn/ui → готовые компоненты (Card, Button, Badge, Select)

**Пример промпта:**
```
use context7

Покажи как настроить React Router v7 с вложенными маршрутами:
/, /jobs, /jobs/:id, /companies/:id
```

## UI Review sub-agent
**Назначение:** проверка визуального интерфейса после создания страниц.

**Использовался для:**
- Проверки иерархии компонентов
- Проверки адаптивности (mobile/tablet/desktop)
- Проверки наличия loading/error/empty состояний

# Subagents

## UI Review sub-agent
- Назначение: проверка визуальной целостности интерфейса
- Когда вызывается: после создания или изменения страницы/компонента
- Проверяет: иерархия, адаптивность, consistency с дизайн-системой

# Output Contracts

## Страницы (pages/)
- `HomePage.tsx` — главная с hero и CTA
- `JobsPage.tsx` — список вакансий + фильтры
- `JobDetailsPage.tsx` — детальная страница вакансии
- `CompanyPage.tsx` — страница компании с вакансиями
- `NotFoundPage.tsx` — 404

## Компоненты (components/)
- `Layout.tsx` — общий layout с Header
- `Header.tsx` — навигация
- `JobCard.tsx` — карточка вакансии (title, company, city, grade, salary)
- `JobFilters.tsx` — фильтры city/grade/workFormat
- `CompanyCard.tsx` — карточка компании
- `AiAssistantPanel.tsx` — AI чат-панель справа

## API клиент (lib/api.ts)
```ts
api.jobs.list(query)     → Job[]
api.jobs.byId(id)        → Job
api.jobs.meta()          → JobsMeta
api.companies.list()     → Company[]
api.companies.byId(id)   → Company & { jobs: Job[] }
api.ai.chat(body)        → ChatResponse
```

## TypeScript типы (lib/types.ts)
- `Job`, `Company`, `JobsMeta`, `ChatRequest`, `ChatResponse` — все строго типизированы
