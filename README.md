# Book Library

A small, type‑safe full‑stack app to manage books and authors.

- Frontend: React 19 + Vite 5 + Tailwind CSS 4
- State/data: TanStack Query 5, tables via @tanstack/react-table v8
- Forms: Formik + Yup in accessible react-modal dialogs
- Backend: Express 4 + Prisma 6 (PostgreSQL) on Node.js 20+
- Tests: Vitest 3 + @testing-library/react (jsdom)

## Features

- Books and Authors CRUD with optimistic UI via TanStack Query
- Search a single item by exact title/id (books) or name/id (authors) without extra network requests
- Reusable UI primitives: Button, Modal, ConfirmModal, DataTable
- Consistent API responses using snake_case for timestamps/foreign keys
- Fully typed backend handlers, friendly Prisma error mapping

## Quick start

Prerequisites:
- Node.js 20+
- Docker (for PostgreSQL)

### 1) Start the database

```
docker compose up -d db
```

Default credentials (configurable via .env):
- POSTGRES_USER=booklib
- POSTGRES_PASSWORD=booklib
- POSTGRES_DB=booklib
- Exposed on localhost:5432

You can also connect via Prisma using:
- DATABASE_URL=postgresql://booklib:booklib@localhost:5432/booklib

### 2) Install dependencies and generate Prisma client

```
npm install
npm run prisma:generate
```

### 3) Apply database migrations

```
npm run prisma:migrate
```

### 4) Start the API server (Express)

```
npm run dev:server
```
- API base URL: http://localhost:5174
- Health check: GET /api/health

### 5) Start the frontend (Vite)

```
npm run dev
```
- Web app: http://localhost:5173
- The Vite dev server proxies /api to http://localhost:5174 (see vite.config.ts)

## Scripts

- dev — start the frontend dev server
- dev:server — start the Express API with tsx
- build — type‑check and build the frontend
- preview — preview the built frontend
- lint — run ESLint
- prisma:generate — generate Prisma client
- prisma:migrate — apply migrations (dev)
- prisma:studio — open Prisma Studio
- test — run all tests once
- test:watch — run tests in watch mode
- test:coverage — run tests with coverage

## Configuration

Create a .env at the project root if you need to override defaults:

- DATABASE_URL=postgresql://booklib:booklib@localhost:5432/booklib
- PORT=5174 (backend, optional)

The docker-compose service reads POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB (default to booklib).

## API overview

Base URL: http://localhost:5174

Errors: `{ error: string }` with HTTP 400 (validation), 404 (not found), 500 (unexpected). Timestamps and foreign keys use snake_case.

Authors:
- GET /api/authors — list authors
- GET /api/authors/:id — fetch a single author
- POST /api/authors — create `{ name }`
- PUT /api/authors/:id — update `{ name? }`
- DELETE /api/authors/:id — delete

Books:
- GET /api/books — list books (includes `author` name)
- GET /api/books/:id — fetch a single book
- POST /api/books — create `{ title, author_id? }` (author_id can be null)
- PUT /api/books/:id — update `{ title?, author_id? }`
- DELETE /api/books/:id — delete

## Frontend

- Routes
  - `/` — Books page (list, search, add/edit/delete in modals)
  - `/authors` — Authors page (list, search, add/edit/delete in modals)
- Data layer: TanStack Query for fetching/caching/mutations
- Tables: shared `DataTable` powered by @tanstack/react-table v8
- Forms: Formik + Yup inside `react-modal` dialogs
- UI: Tailwind CSS v4 utilities;

## Backend

- Express + Prisma (PostgreSQL) listening on port 5174 by default
- Prisma models for `Author` and `Book` (see prisma/schema.prisma)
- Consistent response mapping to `snake_case` (`created_at`, `author_id`)
- Typed request/response handlers and safe Prisma error handling (P2003 invalid FK, P2025 not found)

## Project structure

- prisma/
  - schema.prisma — Prisma schema and models
- server/
  - index.ts — Express app and routes
  - prisma.ts — Prisma client singleton
  - authors/ — find/create/update/delete handlers
  - books/ — find/create/update/delete handlers
- src/
  - App.tsx, pages/ (Home.tsx, Authors.tsx)
  - components/
    - shared/ (Header, Button, Modal, ConfirmModal, DataTable, SectionCard)
    - books/ (BooksSection, BookFormModal)
    - authors/ (AuthorsSection, AuthorFormModal)
  - hooks/ (useBooks, useBook, useAuthors, useAuthor, useTableState)
  - lib/queryClient.ts — QueryClient instance
- shared/
  - types.ts — shared interfaces
- docker-compose.yml — Postgres service
- vite.config.ts — dev server with /api proxy and vitest config

## Testing

- Run all tests: `npm run test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`

Setup:
- Vitest with jsdom (vite.config.ts)
- Setup file `vitest.setup.ts` enables @testing-library/jest-dom
- Frontend tests under `src/**/__tests__` and hooks
- Backend handler tests under `server/__tests__` (Prisma mocked)

## Troubleshooting

- API 500 errors: make sure Postgres is up, a Prisma client is generated, and migrations are applied (`npm run prisma:generate` then `npm run prisma:migrate`).
- Check health: GET /api/health should return `{ status: "ok", db: true }`.
- Frontend cannot reach API: ensure the API runs on 5174 and the Vite proxy is active.
- TypeScript errors: run `npm run build` to type‑check the frontend.

## FAQ

- Can I run the frontend build without the API?
  - Yes. `npm run build && npm run preview` serves the static frontend. API calls will still target `/api`; set up a proxy or run the API for full functionality.
- How do I inspect the database?
  - `npm run prisma:studio` opens Prisma Studio in the browser.

## License

MIT

