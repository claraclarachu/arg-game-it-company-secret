# AGENTS.md

## Project
Vanilla JS + Vite static site. Offline ARG (`Code & Conspiracy`) — no backend, all persistence in `localStorage`. Primary language: **Traditional Chinese (zh-TW)**. Repo root is `arg-game-it-company-secret/` (git `master` → `claraclarachu/arg-game-it-company-secret`).

## Commands
- `npm run dev` — Vite dev server on `:3000` (auto-open)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve `dist/`
- `lint` script (`eslint assets/js --ext .js`) is **not installed** — don't run without adding `eslint`.

No test/typecheck/CI. Verification is `npm run build` succeeding.

## Path Gotcha
Repo path contains spaces (`03 For Testing`). Always quote or use `workdir` param:
```
workdir="/Users/pc01/Documents/03 For Testing/arg-game-it-company-secret" command="npm run build"
```
Never `cd ... &&` with unquoted paths.

## Architecture
- Entry: `index.html` → `assets/js/main.js`
- Core: `assets/js/core/state.js` (key `code_conspiracy_state`, debounced save, `STATE_VERSION=1.0.0`), `events.js` (EventBus), `vfs.js` (virtual file registry + `tryAccessPortal`/`bypassPortalAuth` for hidden `/internal/portal`), `engine.js` (puzzle evaluation + chapter progression), `i18n.js` (zh-TW/en dict)
- Apps (mounted into `#view-*`): `assets/js/apps/vscode/`, `jira/`, `whatsapp/`, `search/` — each has `index.js` as entry
- UI: `assets/js/ui/dock.js`, `settings.js` (export/import/reset), `notebook.js`
- Styles: `assets/css/main.css` (tokens/layers), `vscode.css`/`jira.css`/`whatsapp.css`/`search.css`, `responsive.css` (breakpoints `<768` mobile, `768-1024` tablet)
- PWA: `public/manifest.json` + `public/sw.js` (cache `cc-v1`), `public/` maps to `/` via `vite.config.js:publicDir`
- Data stubs: `assets/data/{chapters,files,dialogues,puzzles}/` (currently empty) + `chapters/*.json`

## Conventions
- **Do not introduce Simplified Chinese** — file content, code comments, and `dict['zh-TW']` must stay Traditional. Previous fix converted entire codebase; regressions break `zh-TW` setting.
- `vfs.js:seedFiles()` is source of truth for game content — edit there, not in `dist/`.
- Theme via `document.documentElement[data-theme="dark"|"light"]` + CSS vars in `main.css`.
- State flags use `state.hasFlag`/`setFlag` pattern; evidence via `state.addEvidence`; interface gating via `unlockedInterfaces`.
- Keep `type: module` (ESM) and Vite aliases (`@`, `@core`, `@apps`, `@ui`, `@utils`, `@data`) in `vite.config.js`.
- `GAME_PLAN.md` is the design spec — implement Chapters against it, but trust `vfs.js`/`engine.js` over prose when they diverge.
