# Vim Navigation Cheatsheet

> **One-line pitch:** move around a file in a few keystrokes instead of holding arrow keys.

| | |
|---|---|
| **Type** | CLI |
| **Level** | Intermediate |
| **Version / Context** | Vim 9 / Neovim (all motions below work in both) |
| **Last updated** | 2026-10-15 |
| **Tags** | `vim` `neovim` `navigation` `motions` |

---

## TL;DR

- **What:** motions are keys that move the cursor. Any motion can follow an operator (`d`, `c`, `y`, `v`) and take a count.
- **Why:** `d}` deletes to the end of the paragraph, `ct)` changes up to the next `)`: navigation and editing share one grammar.
- **Remember:** prefer **jumps** (search, `f`, `}`, marks) over repeated `j`/`l`, and use `Ctrl-o` to come back.

---

## Mental model

```text
[count] [operator] [motion]
   3        d         w       delete 3 words
            y         $       yank to end of line
   2        }                 jump 2 paragraphs down
```

A motion is either **characterwise** (`w`, `f`), **linewise** (`j`, `G`, `}`) or **exclusive/inclusive** at its end point (`t` is exclusive, `f` inclusive).

---

## Core motions

### Within a line

| Goal | Keys | Notes |
|------|------|-------|
| First column | `0` | |
| First non-blank character | `^` | Usually what you want |
| End of line | `$` | `d$` / `c$` act up to the end |
| Last non-blank character | `g_` | Ignores trailing spaces |
| Jump to character | `f{c}` / `F{c}` | Forward / backward, lands **on** it |
| Jump before character | `t{c}` / `T{c}` | Lands **just before** it |
| Repeat / reverse the last `f` `t` | `;` / `,` | |

### Words

| Goal | Keys | Notes |
|------|------|-------|
| Next word start / previous word start | `w` / `b` | Punctuation counts as a word |
| End of word / end of previous word | `e` / `ge` | |
| Same, whitespace-separated only | `W` `B` `E` | `foo.bar(x)` is one WORD |

### Lines, paragraphs, blocks

| Goal | Keys | Notes |
|------|------|-------|
| Paragraph down / up | `}` / `{` | Blank-line delimited |
| Sentence forward / back | `)` / `(` | |
| Matching bracket | `%` | `()` `[]` `{}` |
| Start of enclosing block | `[{` or `[(` | Counts work: `2[{` |
| End of enclosing block | `]}` or `])` | |
| Next / previous function start | `]]` / `[[` | Language-dependent; Neovim treesitter may remap |
| Wrapped screen line down / up | `gj` / `gk` | Instead of `j` `k` on wrapped text |

### Screen and file

| Goal | Keys | Notes |
|------|------|-------|
| Top / middle / bottom of screen | `H` / `M` / `L` | `3H` is 3 lines from the top |
| Half page down / up | `Ctrl-d` / `Ctrl-u` | Cursor moves with the view |
| Full page down / up | `Ctrl-f` / `Ctrl-b` | |
| Scroll one line, cursor stays | `Ctrl-e` / `Ctrl-y` | |
| Center / top / bottom cursor line | `zz` / `zt` / `zb` | Move the view, not the cursor |
| First / last line | `gg` / `G` | |
| Go to line N | `{N}G` or `:N` | `42G`, `:42` |
| Go to N% of the file | `{N}%` | `50%` is the middle |

---

## Search as navigation

| Goal | Keys | Notes |
|------|------|-------|
| Search forward / backward | `/pat` / `?pat` | `n` next, `N` previous |
| Word under cursor, next / previous | `*` / `#` | Whole word match |
| Same, partial match | `g*` / `g#` | |
| Operate up to a match | `d/foo` + `Enter` | Search is a motion too |
| Select next match and operate | `gn` | `cgn` then `.` to repeat on each match |
| Go to local / global definition | `gd` / `gD` | Heuristic, no LSP needed |
| Open file under cursor | `gf` | |

---

## Marks and jumps

| Goal | Keys | Notes |
|------|------|-------|
| Set mark | `ma` | Lowercase = per file, uppercase (`mA`) = global |
| Jump to mark (exact position) | `` `a `` | Backtick |
| Jump to mark (line start) | `'a` | Apostrophe |
| Back / forward in the jump list | `Ctrl-o` / `Ctrl-i` | Jumps: search, `G`, `}`, marks... |
| Back / forward in the change list | `g;` / `g,` | Previous edit positions |
| Last position before the last jump | ``` `` ``` | Toggle between two places |
| Last edit position | `` `. `` | |
| Last insert position, enter insert | `gi` | Resume typing where you stopped |
| Reselect last visual selection | `gv` | |
| List marks / jumps | `:marks` / `:jumps` | |

---

## Recipes

**Edit inside delimiters from anywhere on the line**

```text
ci(     change inside the nearest (...)
dt,     delete up to the next comma
yi"     yank the content of the quoted string
```

**Delete a whole block**

```text
d}      delete to the end of the paragraph
d%      from a bracket, delete to its match
```

**Find and change every occurrence by hand**

```text
*       search the word under the cursor
cgn     change the next match
.       repeat on the next match (n to skip one)
```

**Keep the cursor centered while paging**

```vim
nnoremap <C-d> <C-d>zz
nnoremap <C-u> <C-u>zz
nnoremap n nzzzv
nnoremap N Nzzzv
```

**Jump between two files' positions**

```text
Ctrl-^  toggle between the current and the alternate buffer
```

---

## Gotchas & common mistakes

- **Avoid:** Spamming `w` across punctuation → **Do:** use `W` or `f{c}` to skip further.
- **Avoid:** `'a` when you want the exact spot → **Do:** the backtick `` `a `` restores the column.
- **Avoid:** Mixing up `Ctrl-o` and `g;` → **Do:** `Ctrl-o` follows your **jumps**, `g;` follows your **edits**.
- **Avoid:** `j` / `k` on a wrapped line skips visual lines → **Do:** use `gj` / `gk` or map them.
- **Avoid:** Counting lines to move 17 down → **Do:** turn on `set relativenumber` and type `17j`.

:::tip
`set number relativenumber` shows, in the left margin, how many lines each line is away from the cursor. If the margin shows `7` on a line below you, type `7j` to land on it, or `d7j` to delete everything from the cursor line down to it (the cursor line plus 7 more).
:::

:::warning
`{` `}` `(` `)` depend on blank lines and punctuation. In dense code they may jump further than a visual "block". Use `%` or `[{` there.
:::

---

## See also

- [Vim motion reference](https://vimhelp.org/motion.txt.html)
- [Vim jump motions](https://vimhelp.org/motion.txt.html#jump-motions)
- Built-in tutorial: run `vimtutor` in a terminal
