# My Cheatsheets

Personal cheatsheets on CLI tools, architecture patterns and key concepts. Written in Markdown, rendered as a static site with [Rspress](https://rspress.rs) (default theme) and published to GitHub Pages.

## Content

| Category | Folder | What it holds |
|----------|--------|---------------|
| CLI | `docs/cli/` | Commands, flags and recipes for everyday tools |
| Patterns | `docs/patterns/` | Architecture patterns: structure, trade-offs, when to use |
| Concepts | `docs/concepts/` | One-pagers: mental model, key terms, minimal example |

Current CLI sheets: `age`, `git-rebase`, `sops`, `vim`.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev       # live preview, http://localhost:3000
npm run build     # production build into doc_build/
npm run preview   # serve the production build
```

## Project layout

```text
docs/
  index.md              home page
  _nav.json             top navigation
  cli|patterns|concepts/
    _meta.json          sidebar order
    index.md            category landing page
    <slug>.md           the sheets
rspress.config.ts       site configuration
.github/workflows/      GitHub Pages deployment
.claude/skills/         Claude Code skills to write sheets consistently
```

## Writing a sheet

Every sheet follows the same structure: header table, TL;DR, then the sections that fit its type. Templates are in `.claude/skills/new-cheatsheet/templates/`.

1. Copy the template matching the type (`cli.md`, `pattern.md`, `concept.md`) into the right `docs/` folder, in kebab-case.
2. Fill it in English and keep it to roughly one screen.
3. Add the file name to the folder's `_meta.json`.
4. Run `npm run build` to validate.

With [Claude Code](https://claude.com/claude-code), the `new-cheatsheet` and `build-cheatsheets` skills in `.claude/skills/` do this for you.

### Conventions

- English only, no emoji.
- Mermaid diagrams are supported with a `mermaid` code block.
- Sheets are MDX: no HTML comments, no bare `<https://...>` links, and wrap `<placeholder>` and `{braces}` in backticks.
- Callouts use containers (`:::tip`, `:::warning`), not GitHub alerts.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to `main`.

1. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.
2. Push to `main`.
3. The site is served at `https://<user>.github.io/<repo>/`.

The workflow sets `BASE_PATH=/<repo>/`, which `rspress.config.ts` uses as the site `base`. To reproduce it locally: `BASE_PATH=/<repo>/ npm run build`.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[0BSD](./LICENSE): do whatever you want with it, no attribution required.
