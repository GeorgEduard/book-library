# Book Library — Full‑stack app (React + Express + Prisma)

This project is a small full‑stack Book Library application:
- Frontend: React + Vite + TailwindCSS. CRUD for books and authors is performed in modals using Formik + Yup with validation and inline author creation in the book form.
- Backend: Node.js + TypeScript + Express + Prisma (PostgreSQL). Exposes list, get‑by‑id, and full CRUD endpoints for authors and books.
- Dev infra: Docker Compose for Postgres, Prisma schema/migrations, Vite dev server with API proxy.

## Getting started

Prerequisites:
- Node.js 20+
- Docker (for the Postgres database)

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
- The API starts on http://localhost:5174
- Health: GET /api/health

### 5) Start the frontend (Vite)

```
npm run dev
```
- Vite runs on http://localhost:5173
- All "/api" calls are proxied to http://localhost:5174 (see vite.config.ts)

## Environment

Backend uses Prisma. Configure the database via .env at project root:
- DATABASE_URL=postgresql://booklib:booklib@localhost:5432/booklib
- PORT=5174 (optional)

The docker‑compose service uses these vars (with defaults):
- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

## API overview

Base URL: http://localhost:5174

Common response fields use snake_case for timestamps/foreign keys (e.g., created_at, author_id).

Authors:
- GET /api/authors — list authors
- GET /api/authors/:id — find one
- POST /api/authors — create { name }
- PUT /api/authors/:id — update { name? }
- DELETE /api/authors/:id — delete

Books:
- GET /api/books — list books (includes author name)
- GET /api/books/:id — find one
- POST /api/books — create { title, author_id? } (author_id can be null)
- PUT /api/books/:id — update { title?, author_id? }
- DELETE /api/books/:id — delete

Errors are returned as { error: string }. 400 for validation issues, 404 when not found, 500 for unexpected errors.

## Frontend overview

- Routes: 
  - "/" — Books page (list, search, add/edit/delete in modals)
  - "/authors" — Authors page (list, search, add/edit/delete in modals)
- State/data fetching: TanStack Query (React Query)
- Forms/validation: Formik + Yup in react-modal dialogs
- Search: type at least three letters; matches by exact > startsWith > includes (local, no extra requests)
- Styling: TailwindCSS with a bright, library‑suited theme

## Project structure (high level)
- prisma/
  - schema.prisma — models for Author and Book
- server/
  - index.ts — Express app registering routes
  - prisma.ts — Prisma client singleton
  - authors/ — CRUD handlers (findAuthors, findAuthor, createAuthor, updateAuthor, deleteAuthor)
  - books/ — CRUD handlers (findBooks, findBook, createBook, updateBook, deleteBook)
- src/
  - App.tsx, pages/ (Home.tsx, Authors.tsx)
  - hooks/ (useBooks, useBook, useAuthors, useAuthor)
  - components/ (Header, Footer, SectionCard, Modal, ConfirmModal, BookFormModal, AuthorFormModal, BooksSection, AuthorsSection)
  - lib/queryClient.ts — fetch helpers and QueryClient
- shared/
  - types.ts — shared TypeScript interfaces
- docker-compose.yml — Postgres service
- vite.config.ts — dev server with /api proxy

## NPM scripts
- dev — start Vite
- dev:server — start Express API with tsx
- build — type‑check and build frontend
- lint — run ESLint
- prisma:generate — generate Prisma client
- prisma:migrate — apply migrations
- prisma:studio — open Prisma Studio

## Troubleshooting
- 500 errors on API: ensure Postgres is running, Prisma client is generated, and migrations are applied (`npm run prisma:generate` and `npm run prisma:migrate`).
- Use GET /api/health to verify DB connectivity (db=true means OK).
- If the frontend can’t reach the API, confirm Vite proxy in vite.config.ts and that the API runs on port 5174.
