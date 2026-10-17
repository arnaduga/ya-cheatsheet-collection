# Git Rebase Cheatsheet

> **One-line pitch:** replay your commits on top of another base to get a clean, linear history.

| | |
|---|---|
| **Type** | CLI |
| **Level** | Intermediate |
| **Version / Context** | git ≥ 2.38 (`--update-refs`) |
| **Last updated** | 2026-10-15 |
| **Tags** | `git` `history` `workflow` |

---

## TL;DR

- **What:** rewrites commits by re-applying them one by one onto a new base (new SHAs).
- **Why:** linear history, tidy commits before review, no noisy merge commits.
- **When:** on **your own, unpushed** (or solely-owned) branches.
- **Remember:** never rebase commits others already pulled. If you must push after a rebase, use `--force-with-lease`.

---

## Mental model

```text
Before                       After: git rebase main (on feature)

A---B---C   main             A---B---C           main
     \                                \
      D---E   feature                  D'--E'    feature
```

`D'` and `E'` have the same changes as `D` and `E` but **different SHAs**.

---

## Core commands

| Goal | Command | Notes |
|------|---------|-------|
| Rebase current branch onto main | `git rebase main` | Fetch first: `git fetch && git rebase origin/main` |
| Interactive rebase of last N commits | `git rebase -i HEAD~N` | Edit, reorder, squash, drop |
| Interactive from the fork point | `git rebase -i $(git merge-base HEAD main)` | Whole branch |
| Move a branch segment elsewhere | `git rebase --onto <newbase> <oldbase> [branch]` | See recipes |
| Rebase all the way, including root | `git rebase -i --root` | Rewrite the first commit |
| Keep merge commits | `git rebase --rebase-merges main` | Preserves topology |
| Update stacked branches too | `git rebase --update-refs main` | Moves intermediate branch pointers |
| Pull with rebase | `git pull --rebase` | Or `git config --global pull.rebase true` |

### While a rebase is running

| Action | Command |
|--------|---------|
| Resolve conflict, then continue | `git add <files> && git rebase --continue` |
| Skip the current commit | `git rebase --skip` |
| Cancel everything, back to start | `git rebase --abort` |
| See what is left to do | `git status` |

### Interactive todo keywords

| Key | Effect |
|-----|--------|
| `pick` (`p`) | Keep the commit as is |
| `reword` (`r`) | Keep changes, edit message |
| `edit` (`e`) | Stop to amend the commit or split it |
| `squash` (`s`) | Meld into previous, combine messages |
| `fixup` (`f`) | Meld into previous, discard message |
| `drop` (`d`) | Remove the commit |
| `exec` (`x`) | Run a shell command (e.g. tests) after the commit |

---

## Recipes

**Clean up before opening a PR (autosquash)**

```bash
git commit --fixup <sha>               # mark a fix for an earlier commit
git rebase -i --autosquash main        # fixups are auto-ordered
git config --global rebase.autoSquash true   # make it the default
```

**Move a branch off the wrong base**

```bash
# feature was branched from next, but should sit on main
git rebase --onto main next feature
```

**Remove a range of commits from the middle**

```bash
git rebase --onto <A> <B>      # drops commits in (A, B]
```

**Run tests on every commit**

```bash
git rebase -i main --exec "make test"
```

**Split a commit**

```bash
git rebase -i <sha>~1          # mark it `edit`
git reset HEAD^                # unstage everything
git add -p && git commit       # repeat per logical chunk
git rebase --continue
```

**Push after a rebase safely**

```bash
git push --force-with-lease    # refuses if remote has commits you haven't seen
```

**Undo a bad rebase**

```bash
git reflog                     # find the entry before "rebase (start)"
git reset --hard HEAD@{N}
```

---

## Gotchas & common mistakes

- **Avoid:** `git push --force` → **Do:** `--force-with-lease` (or `--force-if-includes`).
- **Avoid:** Rebasing a shared branch (`main`, a colleague's branch) → **Do:** merge instead.
- **Avoid:** Panicking mid-conflict → **Do:** `git rebase --abort` always restores the original state.
- **Avoid:** "Ours/theirs" confusion → **Do:** during a rebase, **ours = the branch you rebase onto**, **theirs = your commit being replayed**.
- **Avoid:** Losing work after a rebase → **Do:** the old commits remain in `git reflog` for ~90 days.

:::tip
Enable `git config --global rerere.enabled true` so git remembers conflict resolutions and replays them.
:::

:::warning
A rebase rewrites history. Signed commits lose their signatures unless you re-sign (`--gpg-sign`).
:::

---

## See also

- Official docs: [https://git-scm.com/docs/git-rebase](https://git-scm.com/docs/git-rebase)
- Pro Git, "Rebasing": [https://git-scm.com/book/en/v2/Git-Branching-Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
