# Scenebook — Web (Frontend)

## What this is

The React frontend for an AI-assisted screenwriting application.
Aspiring writers and indie filmmakers use this to write professionally
formatted screenplays with AI features for continuity tracking
(Story Memory) and structural analysis (Beat Sheet Sync).

This is the user-facing app. The backend lives in `../api`.

## Tech stack

- **Build**: Vite + React 18 + TypeScript
- **Editor core**: Slate.js (custom screenplay plugins, built in-house)
- **State**: Zustand (client state), TanStack Query (server state)
- **Styling**: Tailwind CSS
- **UI components**: shadcn/ui (Radix primitives + Tailwind)
- **Icons**: lucide-react
- **Toasts**: sonner
- **Command palette**: cmdk (via shadcn's `command` component)
- **Routing**: React Router v6
- **HTTP**: Native fetch wrapped in a small API client, or ky
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library + Playwright (E2E)

## Project structure

src/
├── app/ # App shell, providers, router
├── pages/ # Route-level components
│ ├── Dashboard.tsx # List of user's screenplays
│ ├── Editor.tsx # The screenplay editor page
│ └── Settings.tsx
├── editor/ # ⭐ THE CORE — Slate-based screenplay editor
│ ├── createScreenplayEditor.ts
│ ├── plugins/ # Slate plugins (one per concern)
│ ├── rendering/ # renderElement, renderLeaf
│ ├── transforms/ # Custom transform operations
│ ├── parsing/ # Scene heading, character cue parsers
│ ├── pagination/ # Page break calculation (later phase)
│ └── types.ts # ScreenplayElement union types
├── features/ # Feature modules (each self-contained)
│ ├── story-memory/ # Sidebar UI, query interface
│ ├── beat-sheet-sync/ # Beat board UI
│ ├── projects/ # Project CRUD UI
│ └── auth/
├── components/
│ ├── ui/ # ⭐ shadcn/ui components (owned, editable)
│ └── layout/ # App shell: nav, sidebars, headers
├── lib/
│ ├── api/ # API client, typed endpoints
│ ├── hooks/ # Shared React hooks
│ └── utils/ # Includes cn() helper for class merging
└── styles/ # Global CSS, Tailwind config

## UI components — shadcn/ui

We use **shadcn/ui** for all standard dashboard UI: buttons, dialogs,
dropdowns, tabs, tooltips, command palette, etc.

### How shadcn works in this project

- shadcn is **not an npm dependency**. The CLI copies component source
  into `src/components/ui/`.
- Components are **owned by us** — we edit them freely to fit the product.
  Adding a `variant="screenplay-toolbar"` to Button is the intended
  pattern, not a hack.
- Built on Radix UI primitives, so accessibility (keyboard nav, focus
  management, ARIA) comes for free.

### Adding a new component

```bash
pnpm dlx shadcn@latest add <component-name>
```

This drops the source into `src/components/ui/`. Commit it like any
other file.

### What goes where

- `src/components/ui/` — shadcn primitives. Mostly unchanged from
  the CLI output. Customizations live here when they're truly shared.
- `src/components/layout/` — app-shell components (Sidebar, TopNav,
  EditorLayout). These compose shadcn primitives.
- `src/features/<feature>/components/` — feature-specific components.
  Compose shadcn primitives and layout components. Don't define new
  global primitives here.
- `src/editor/` — **no shadcn allowed inside the editor itself.**
  The screenplay editor is pure custom code. The toolbar above it
  may use shadcn `<Button>` primitives, but Slate plugins, rendering,
  and transforms are 100% custom.

### Styling conventions

- Use Tailwind utility classes for all styling.
- Use `cn()` (from `src/lib/utils.ts`, included by shadcn) to merge
  class names conditionally.
- Don't add custom CSS unless it's screenplay rendering
  (`src/editor/rendering/screenplay.css`) or a global token in
  `src/styles/`.
- Don't theme via inline styles. Use Tailwind classes or CSS variables
  defined in `globals.css`.
- Dark mode is supported via `next-themes` (CSS variable strategy).

## Conventions

- Container/presentational pattern
- Helper files for constants and reusable functions

### Code style

- TypeScript strict mode. No `any` without a comment explaining why.
- Functional components only. No class components.
- Use named exports (not default) except for pages and routes.
- File names: `kebab-case.ts` for utilities, `PascalCase.tsx` for components.
- One component per file. Co-locate component-specific helpers in
  the same file unless they're reused.

### State management rules

- **Editor state** lives in the Slate `editor` object. Don't mirror
  it in Zustand.
- **UI state** (sidebar open, modal open, theme) → Zustand.
- **Server state** (projects, scenes, story memory data) → TanStack
  Query. Never store fetched data in Zustand.
- **Form state** → React Hook Form, not lifted state.

### Editor-specific rules

- All editor logic goes in `src/editor/`. Never reach into Slate
  internals from feature modules — go through the editor's exposed API.
- Plugins follow the `withSomething(editor)` pattern. Each plugin
  is one concern.
- `normalizeNode` rules are the source of truth for structural
  invariants. Document each rule with a comment explaining WHY.
- Never mutate document state from a useEffect. Use Slate transforms.

### Screenplay rendering CSS

- Lives in `src/editor/rendering/screenplay.css`.
- This file is **sacred** — its values are calibrated to industry-standard
  page formatting (Courier 12pt, exact margins). Changes here affect
  page counts and export fidelity.
- Tailwind utilities are fine for the editor _chrome_ (toolbars,
  sidebars) but the screenplay rendering itself uses dedicated CSS
  for precision.

## Common commands

- `pnpm dev` — start dev server on port 5173
- `pnpm build` — production build
- `pnpm test` — run Vitest unit tests
- `pnpm test:e2e` — run Playwright E2E tests
- `pnpm lint` — ESLint
- `pnpm typecheck` — tsc --noEmit
- `pnpm dlx shadcn@latest add <component>` — add a shadcn component

<!-- ## API integration -->

<!-- - Backend runs at `http://localhost:3000` in dev.
- All API calls go through `src/lib/api/`. Each endpoint has a typed
  client function. Never call fetch directly from a component.
- Auth uses HTTP-only cookies set by the backend. No localStorage
  for tokens. -->

## API integration (current: local-first)

**Phase 0 (current)**: No backend. All "API" calls go through
`src/lib/api/` which is backed by IndexedDB via Dexie.

The API layer mimics a real REST API so that when a backend is
later added, only `src/lib/api/` files change — components and
hooks stay identical.

- `src/lib/db/` — Dexie schema and database instance
- `src/lib/api/` — typed "API" functions that look like fetch
  calls but use Dexie
- All async data fetching goes through TanStack Query hooks
- Never call Dexie directly from a component or feature module

## Things to avoid

- ❌ Don't add another UI library (Material UI, Chakra, Mantine,
  Ant Design). shadcn/ui + Tailwind is the design system. If a
  component is missing, add it via shadcn CLI or build it on Radix
  primitives.
- ❌ Don't `npm install` shadcn — there is no shadcn package.
  Components are copied into the codebase via the CLI.
- ❌ Don't import shadcn components from `@shadcn/...` — they live
  at `@/components/ui/...` (your code).
- ❌ Don't use shadcn primitives inside the Slate editor (`src/editor/`).
  The editor is pure custom code.
- ❌ Don't add a rich text library (Tiptap, Draft.js, Lexical).
  Slate was chosen deliberately. Build editor features as Slate plugins.
- ❌ Don't add Redux. Zustand is plenty for our scope.
- ❌ Don't put screenplay business logic in components. It belongs
  in `src/editor/` so it's reusable in serialization, AI features,
  and export.
- ❌ Don't fetch data in components with useEffect. Use TanStack
  Query.
- ❌ Don't import from `../../../`. Use the `@/` path alias
  configured in `tsconfig.json` and `vite.config.ts`.
- ❌ Don't add custom CSS outside `screenplay.css` and `globals.css`.
  Tailwind classes for everything else.
- ❌ Don't call Dexie directly from components or feature modules.
  Always go through `src/lib/api/`. This is the seam where the
  backend will eventually plug in.
- ❌ Don't tightly couple components to local storage. They should
  work identically when the API becomes a real HTTP layer.

## Current phase

Phase 0 — Foundations. Placeholder service only. The editor module
is mostly empty scaffolding. See `TODOS.md` for the current task list.
