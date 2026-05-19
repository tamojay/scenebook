# Scenebook

An AI-assisted screenwriting application for aspiring writers and indie
filmmakers. Professional screenplay formatting with continuity tracking
(Story Memory) and structural analysis (Beat Sheet Sync).

## Structure

This repository contains two independent applications:

- **[`web/`](./web)** — React frontend (Vite + Slate.js)
- **[`api/`](./api)** — NestJS backend (Fastify + PostgreSQL)

Each project has its own `README.md`, `CLAUDE.md`, and `TODOS.md`.
See those for details.

## Local development

Run the two apps in separate terminals:

```bash
# Terminal 1
cd web && pnpm dev

# Terminal 2
cd api && pnpm start:dev
```

- Web runs at http://localhost:5173
- API runs at http://localhost:3000

## Status

🏗️ Phase 0 — Foundations. See each project's `TODOS.md`.
EOF
