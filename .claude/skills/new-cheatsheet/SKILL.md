---
name: new-cheatsheet
description: Create a new cheatsheet (CLI tool, architecture pattern or concept one-pager) in this folder's Rspress site, following the house template. Use when asked to write, add or draft a cheatsheet or one-pager.
---

# New cheatsheet

Sheets live in `docs/<category>/<slug>.md` and are rendered by Rspress (default theme, MDX).

## Steps

1. **Pick the type** and copy its template from `templates/` in this skill:
   - CLI tool or command usage → `templates/cli.md` → `docs/cli/`
   - Architecture or design pattern → `templates/pattern.md` → `docs/patterns/`
   - Notion / one-pager → `templates/concept.md` → `docs/concepts/`
2. **Name the file** in lowercase kebab-case (`git-rebase.md`, `circuit-breaker.md`).
3. **Fill the template.** Keep the header table, TL;DR and Gotchas. Remove sections that do not apply. Never leave placeholder text.
4. **Register it** in the category's `docs/<category>/_meta.json` (ordered array of file names without extension, `index` first).
5. **Log it** in `CHANGELOG.md` under `## [Unreleased]` → `### Added` (or `### Changed` / `### Fixed` for edits), following Keep a Changelog.
6. **Validate** with the `build-cheatsheets` skill (`npm run build` must pass).
7. Report the file path and anything you were unsure about.

## House rules

- Write everything in **English**, even if the conversation is in French.
- Target one screen: roughly 60-100 lines. Prefer tables over long lists.
- Verify commands and flags against the official docs or `--help` when the tool is installed. Say so if you could not verify.
- **No emoji anywhere** (headings, tables, bullets, home page icons). Write gotchas as `- **Avoid:** mistake → **Do:** fix` and tables as `Pros | Cons`.
- Set `Last updated` to today's date.
- Cross-link related sheets with relative links, e.g. `[age](./age)` in the same folder or `[sops](../cli/sops)` across folders. Never link to a sheet that does not exist.

## MDX pitfalls (the build fails or renders wrong otherwise)

- No HTML comments (`<!-- -->`).
- No bare `<https://...>` autolinks: use `[text](https://...)`.
- Wrap `<placeholder>` and `{braces}` in backticks or code blocks, never in plain text.
- No `[[wikilinks]]` and no GitHub alerts (`> [!TIP]`). Use containers:

  ```md
  :::tip
  Text
  :::
  ```

  Available kinds: `tip`, `info`, `note`, `warning`, `danger`.
- Mermaid is enabled (`rspress-plugin-mermaid`): use a ```` ```mermaid ```` code block for flows, sequences and class diagrams. Use a `text` block only for tiny ASCII sketches.
- Use `---` rules between sections as in the templates.
