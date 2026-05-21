# Web App — TODOs

A standalone, frontend-only screenwriting application. Local
persistence via IndexedDB; backend integration is a future phase.

---

## ✅ Phase 1 — Web Foundations

- [x] Tailwind CSS configured for Vite
- [x] shadcn/ui initialized with components
- [x] next-themes + light/dark/system toggle
- [x] React Router v6
- [x] Routes: `/login`, `/signup`, `/`, `/settings`, `/projects/:id`
- [x] App shell with TopBar + LeftRail
- [x] Mobile drawer (Sheet) replacing rail on small screens
- [x] `@/` path alias in tsconfig + vite.config
- [x] lucide-react icons

---

## ✅ Phase 2 — Auth (stub)

- [x] AuthProvider with React Context
- [x] localStorage-backed fake auth API
- [x] Login + Signup pages (split-screen design)
- [x] ProtectedRoute + PublicRoute guards
- [x] Logout from top-bar avatar menu
- [x] Logout from Settings page

---

## ✅ Phase 3 — Local Persistence

- [x] Dexie.js installed
- [x] DB schema: `projects`, `documents` tables
- [x] `projectsApi` (list/get/create/update/duplicate/delete)
- [x] `documentsApi` (getByProjectId/upsert)
- [x] dexie-react-hooks for reactive queries

---

## ✅ Phase 4 — Dashboard

- [x] Project cards with typographic preview
- [x] Project grid (responsive 1/2/3/4 columns)
- [x] "New screenplay" tile in grid + empty state
- [x] NewProjectDialog (title + format)
- [x] Rename via native prompt (TODO: polished dialog)
- [x] Duplicate action
- [x] Delete with confirm
- [x] Settings page (profile, theme, danger zone)

---

## ✅ Phase 5 — Editor Core

- [x] Slate.js + slate-react + slate-history
- [x] 7 element types: scene_heading, action, character, parenthetical,
      dialogue, transition, shot
- [x] renderElement with mobile + desktop responsive styling
- [x] Manual element-type dropdown (EditorToolbar)
- [x] `withKeyboardFlow` plugin — Tab/Enter state machine
- [x] `withAutoFormat` plugin — INT./EXT. auto-detection
- [x] Debounced autosave (1.5s) to Dexie
- [x] Save status indicator (Saving / Saved / Error)
- [x] Page-like visual rendering (paper on canvas + shadow)
- [x] Mobile-friendly proportional indents

---

## ✅ Phase 6 — Export (Phase 1)

- [x] Fountain serializer (Slate → .fountain)
- [x] JSON export (raw Slate document)
- [x] `@media print` CSS — hides chrome, isolates page
- [x] "PDF (Preview)" via browser print

---

## 🔨 Phase 7 — Mock AI Features (current)

Visual UI for AI features. Data extracted client-side from script
content. Demonstrates how real AI features will look.

### Story Bible sidebar

- [ ] Right sidebar component (collapsible, hidden on mobile)
- [ ] Extract characters from CHARACTER elements
- [ ] Extract locations from scene_heading text
- [ ] Show appearance counts per entity
- [ ] Click character/location → jump to first appearance
- [ ] Mobile: bottom sheet or drawer access

### Beat Sheet Sync

- [ ] Horizontal beat board UI
- [ ] Hardcoded frameworks: Save the Cat, Three-Act, Hero's Journey
- [ ] Show target page for each beat
- [ ] Current page count vs targets (visual indicators)
- [ ] Framework selector

### "Ask your script" (optional)

- [ ] Chat input UI
- [ ] Mock responses based on extracted entities
- [ ] Or label as "Coming soon" placeholder

✅ **Checkpoint**: AI sidebars visible in screenshots.

---

## 📐 Phase 8 — Schema Enforcement (robustness)

- [ ] `withScreenplaySchema` plugin (normalizeNode rules):
  - [ ] Empty scene_heading reverts to action
  - [ ] Character must be followed by dialogue (auto-fix)
  - [ ] Strip non-screenplay node types on paste
  - [ ] Sanitize text on import
- [ ] Paste handler for Google Docs / Word / FDX content
- [ ] Test with messy real-world script imports

✅ **Checkpoint**: Editor handles bad input gracefully.

---

## ✨ Phase 9 — Editor Polish (industry features)

Features writers expect from any pro screenplay editor.

### Auto-format expansion

- [ ] `CUT TO:`, `FADE IN.`, `FADE OUT.`, `DISSOLVE TO:` → transition
- [ ] Smart quotes (" → " ")
- [ ] Em-dash and ellipsis auto-conversion
- [ ] Auto-uppercase: scene headings, characters, transitions

### Autocomplete

- [ ] Character cue autocomplete (after first appearance)
- [ ] Location autocomplete in scene_heading
- [ ] Time-of-day autocomplete (DAY / NIGHT / CONTINUOUS / LATER / MORNING)

### Navigation & search

- [ ] Scene navigator sidebar (list all scenes, click to jump)
- [ ] Find & replace (`Cmd+F`)
- [ ] Jump to scene by number
- [ ] Keyboard shortcuts panel (modal)

### Status bar

- [ ] Live word count
- [ ] Live scene count
- [ ] Approximate page count (line-based)
- [ ] Zoom controls (75% / 100% / 125%)

### Title page

- [ ] Dedicated title page editor (Title / Author / Contact / Draft Date)
- [ ] Included in exports

### Comfort modes

- [ ] Focus mode (current scene only)
- [ ] Typewriter mode (current line vertically centered)
- [ ] Spell check toggle

---

## 📄 Phase 10 — Production-Grade PDF Engine

The "matches Final Draft to the page" project. Substantial work,
own phase.

- [ ] Line-measurement engine (Courier 12pt @ industry widths)
- [ ] Element wrap widths:
  - [ ] Action: 58 chars
  - [ ] Dialogue: 35 chars
  - [ ] Parenthetical: 17 chars
- [ ] 55 lines per page baseline
- [ ] Page-break rules:
  - [ ] Scene heading never ends a page
  - [ ] `(MORE)` / `CHARACTER (CONT'D)` for split dialogue
  - [ ] Parentheticals stay with their dialogue
  - [ ] Action paragraphs don't split mid-sentence
- [ ] First page accounts for title block height
- [ ] Validation: side-by-side match with Final Draft export

---

## 🎬 Phase 11 — Pre-production Tools

The features that take Scenebook beyond "just an editor" into
StudioBinder/Celtx territory.

### Scene management

- [ ] Index card / corkboard view (drag to reorder scenes)
- [ ] Outline view (collapsed scene summaries)
- [ ] Lock scenes (production drafts)
- [ ] Omit scene (greyed out, not renumbered)
- [ ] Auto scene numbering (with A-pages: 5A between 5 and 6)

### Revision system

- [ ] Revision marks (colored asterisks in margin)
- [ ] Industry color cycle (Blue/Pink/Yellow/Green/Goldenrod/Buff/Salmon/Cherry)
- [ ] Lock pages
- [ ] Compare two drafts (side-by-side diff)
- [ ] Manual snapshots (named versions)

### Reports

- [ ] Scene report (INT/EXT, time, characters, page count)
- [ ] Character report (lines per character, scenes appeared)
- [ ] Location report
- [ ] Cast report

### Tagging (StudioBinder-style)

- [ ] Tag props, wardrobe, vehicles, FX in the script
- [ ] Auto-extract tags by category
- [ ] Tag report per scene

### Dual dialogue

- [ ] Two characters speaking side-by-side
- [ ] Toolbar action to convert sequential dialogue → dual

---

## 📥 Phase 12 — Import & Round-Trip

- [ ] Fountain import (drag-drop or file picker)
- [ ] FDX import (Final Draft XML)
- [ ] FDX export
- [ ] Plain text export
- [ ] Import preserves all element types
- [ ] Round-trip test: export → import → identical document

---

## 🚀 Phase 13 — Polish & Ship

- [ ] Loading skeletons everywhere data loads
- [ ] Empty states for every list
- [ ] Error boundaries
- [ ] Command palette (`Cmd+K`) — global nav + actions
- [ ] Onboarding tour for first-time users
- [ ] Landing page for logged-out users
- [ ] OpenGraph metadata + favicon polish
- [ ] Deploy to Vercel / Cloudflare Pages
- [ ] Custom domain (optional)
- [ ] GitHub README with screenshots + demo GIF
- [ ] Portfolio entry

---

## 🔮 Future — Backend & Beyond

After the portfolio phase. Each its own multi-week project.

### Backend integration

- [ ] NestJS + Fastify API live
- [ ] Real auth (JWT / OAuth)
- [ ] Cloud sync (replace IndexedDB primary store)
- [ ] Multi-device sync

### Real AI features (Claude API)

- [ ] Story Memory pipeline (fact extraction, continuity flags)
- [ ] Beat Sheet Sync structural analysis
- [ ] "Ask your script" with real RAG over scenes
- [ ] Dialogue voice consistency analysis

### Collaboration (Yjs + Hocuspocus)

- [ ] Real-time co-editing
- [ ] Comments threaded on lines
- [ ] @-mentions
- [ ] Suggestion mode (track changes)
- [ ] Read-only share links

### Mobile

- [ ] iOS / Android PWA install
- [ ] Native mobile reader
- [ ] Touch-optimized editing
