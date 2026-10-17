---
name: build-cheatsheets
description: Preview, build and validate the Rspress cheatsheet site in this folder. Use after adding or editing a cheatsheet, or when asked to run, preview or check the site.
---

# Build cheatsheets

Run from the folder that contains `rspress.config.ts` (the parent of `.claude/`).

## Commands

| Goal | Command |
|------|---------|
| Install dependencies (first time) | `npm install` |
| Validate: production build | `npm run build` (output in `doc_build/`) |
| Live preview with hot reload | `npm run dev` (default http://localhost:3000, run in background) |
| Serve the built site | `npm run preview` |

## Workflow

1. Always run `npm run build` after changing a sheet. A failure is usually an MDX syntax error: see the pitfalls in the `new-cheatsheet` skill.
2. Check the output lists the new page (e.g. `doc_build/cli/<slug>.html`).
3. Confirm the sheet is in its category's `_meta.json`, otherwise it is not ordered in the sidebar.
4. Only start `npm run dev` when the user wants to look at the result, and tell them the URL.

## Layout

```text
docs/
  index.md            home page
  _nav.json           top navigation
  cli|patterns|concepts/
    _meta.json        sidebar order
    index.md          category landing page
    <slug>.md         the sheets
rspress.config.ts     site config (default theme)
```

## Deployment

`.github/workflows/deploy.yml` builds and publishes `doc_build/` to GitHub Pages on every push to `main`. It sets `BASE_PATH=/<repo>/`, which `rspress.config.ts` reads as `base`. To test a project-pages build locally: `BASE_PATH=/<repo>/ npm run build`.

Do not edit `doc_build/` or `node_modules/`.
