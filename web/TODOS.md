# Web App — TODOs

A standalone, frontend-only screenwriting application. Local
persistence via IndexedDB; backend added later as a separate phase.

---

## Phase 1 — Web Foundations 🏗️

### Tailwind & shadcn setup

- [ ] Install Tailwind CSS and configure for Vite
- [ ] Verify Tailwind classes work in App.tsx
- [ ] Run `pnpm dlx shadcn@latest init`
  - TypeScript, default style, slate base color
  - Verify `src/components/ui/` and `src/lib/utils.ts` created
- [ ] Add initial shadcn components:
      button card dialog dropdown-menu input label select
      separator sheet tabs tooltip badge skeleton sonner
- [ ] Install `next-themes` for dark mode
- [ ] Add `<ThemeProvider>` to app root
- [ ] Add a theme toggle button (sun/moon icon) as smoke test

### Routing & app shell

- [ ] Install React Router v6
- [ ] Set up routes:
  - [ ] `/` — Dashboard
  - [ ] `/projects/:id` — Editor
  - [ ] `/settings` — Settings
- [ ] Build `<AppLayout>` with sidebar + top nav + main area
- [ ] Build `<EditorLayout>` for editor page (different chrome)
- [ ] Add lucide-react and use icons in the sidebar

### Developer experience

- [ ] Configure `@/` path alias in tsconfig + vite.config
- [ ] Set up ESLint + Prettier
- [ ] Add Husky + lint-staged
- [ ] Write README with setup instructions

✅ **Checkpoint**: App looks like a real product. Routes work.
Dark mode works. Nothing real inside yet.

---

## Phase 2 — Local Persistence 💾

- [ ] Install Dexie.js
- [ ] Create `src/lib/db/schema.ts` with Dexie schema:
  - `projects` table
  - `documents` table (Slate JSON storage)
- [ ] Create `src/lib/db/client.ts` exporting the Dexie instance
- [ ] Create `src/lib/api/projects.ts` with typed functions:
  - `list`, `get`, `create`, `update`, `delete`, `duplicate`
- [ ] Create `src/lib/api/documents.ts` similarly
- [ ] Install TanStack Query, add `<QueryClientProvider>`
- [ ] Create `src/lib/hooks/useProjects.ts` etc — TanStack Query hooks
- [ ] Seed with 2–3 example screenplays on first run (dummy data)

✅ **Checkpoint**: Can create/list/delete projects from the browser
console. Data persists across refresh.

---

## Phase 3 — Dashboard UI 📋

- [ ] Build `<ProjectCard>` showing title, page count, last edited
- [ ] Build dashboard page with project grid/list view toggle
- [ ] Build `<NewProjectDialog>` — name, format (feature/TV hour/short)
- [ ] Add project actions: rename, duplicate, delete (with confirm)
- [ ] Add search bar (filters project list)
- [ ] Add sort dropdown (recent / alphabetical / page count)
- [ ] Build empty state for new users
- [ ] Build `<Settings>` page (theme, default format, profile placeholder)
- [ ] Add command palette (`Cmd+K` / `Ctrl+K`) for quick nav

✅ **Checkpoint**: Dashboard is fully usable. Can manage multiple
screenplays without touching code.

---

## Phase 4 — Editor Core 📝

### Slate setup

- [ ] Install `slate`, `slate-react`, `slate-history`
- [ ] Create `src/editor/types.ts` — ScreenplayElement union
- [ ] Create `src/editor/createScreenplayEditor.ts`
- [ ] Render a basic Slate editor in `<EditorPage>`

### Element types

- [ ] Implement `renderElement.tsx` for all 7 element types:
      scene_heading, action, character, parenthetical, dialogue,
      transition, shot
- [ ] Create `src/editor/rendering/screenplay.css` with industry-
      standard margins (Courier 12pt, calibrated)
- [ ] Build a manual element-type toolbar (temporary, replaced later)

### Plugins

- [ ] `withScreenplaySchema` — normalizeNode rules for structural integrity
- [ ] `withAutoFormat` — detect INT./EXT. and convert to scene_heading
- [ ] `withKeyboardFlow` — Tab/Enter state machine
- [ ] Add Slate's built-in `withHistory`

### Persistence integration

- [ ] Debounced autosave (2s) to `documents` table via API layer
- [ ] Show save status indicator: Saving / Saved / Offline
- [ ] Load document JSON on editor mount

✅ **Checkpoint**: Can write a full short film in the editor.
Keyboard flow feels professional. Saves persist.

---

## Phase 5 — Editor Polish ✨

- [ ] Format toolbar above editor (dropdown to change element type)
- [ ] Page count in status bar (approximate, count-based for now)
- [ ] Character autocomplete (after a character is introduced)
- [ ] Location autocomplete in scene headings
- [ ] Find & replace (`Cmd+F` / `Cmd+R`)
- [ ] Keyboard shortcuts panel (modal showing all shortcuts)
- [ ] Scene navigator sidebar (list of scenes, click to jump)

✅ **Checkpoint**: Editor feels like a professional writing tool.

---

## Phase 6 — Export 📤

- [ ] Build Fountain serializer (Slate JSON → Fountain string)
- [ ] Add "Download as Fountain" action
- [ ] Build JSON download (raw Slate doc) for portability
- [ ] Add `@media print` CSS for screenplay rendering
- [ ] Add "Print / Save as PDF" button (uses browser print)
- [ ] Optional: install `react-pdf` and build programmatic PDF export
- [ ] Build Fountain _import_ (drag-drop or file picker)

✅ **Checkpoint**: Writers can get their work out of the app in
multiple formats. Round-trip Fountain works.

---

## Phase 7 — Mock AI Features 🤖

These are UI-only — populated with fake data extracted client-side
via simple parsing. They demonstrate what the AI features will
look like once the backend exists.

### Story Bible sidebar

- [ ] Build sidebar that lists characters (parsed from CHARACTER
      elements in the document)
- [ ] List locations (parsed from scene headings)
- [ ] Click character/location → jump to first appearance
- [ ] Show count of appearances per character/location

### Beat Sheet sidebar

- [ ] Build horizontal beat board UI
- [ ] Hardcoded Save the Cat beats with target page numbers
- [ ] Manually assign which scenes map to which beats (or just show
      the structure)
- [ ] Show current page count vs target

### "Ask your script" mock

- [ ] Input field for natural language queries
- [ ] Returns fake but plausible responses about the script
- [ ] Or: just label this section "Coming soon: AI features"
      if you don't want to fake it

✅ **Checkpoint**: App screenshots show AI-powered features.
Recruiters and demo viewers see the future.

---

## Phase 8 — Polish & Ship 🚀

- [ ] Loading states (skeletons) everywhere data loads
- [ ] Empty states (no projects yet, no scenes yet)
- [ ] Error states (something went wrong)
- [ ] Onboarding tour for first-time users (optional)
- [ ] Landing page at `/` for logged-out users (or just the dashboard)
- [ ] Add OpenGraph metadata for sharing
- [ ] Deploy to Vercel or Cloudflare Pages
- [ ] Custom domain (optional)
- [ ] Add to your portfolio + GitHub README

✅ **Checkpoint**: Shareable URL. Looks great in screenshots.
Reflects your craft in your portfolio.

---

## Future (After Portfolio Phase) 🔮

- [ ] Backend integration (NestJS API)
- [ ] User authentication
- [ ] Real Story Memory pipeline (Claude API)
- [ ] Real Beat Sheet Sync analysis (Claude API)
- [ ] Real-time collaboration (Yjs)
- [ ] Mobile responsive editor (currently desktop-only by design)
