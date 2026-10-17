# SOPS Cheatsheet

> **One-line pitch:** encrypt only the *values* of YAML/JSON/ENV/INI files so secrets can live in git with readable diffs.

| | |
|---|---|
| **Type** | CLI |
| **Level** | Intermediate |
| **Version / Context** | sops 3.x with age (also KMS, GCP KMS, Azure KV, PGP) |
| **Last updated** | 2026-10-15 |
| **Tags** | `secrets` `encryption` `gitops` |

---

## TL;DR

- **What:** keeps file structure and keys in clear text, encrypts values, stores metadata and a MAC in a `sops:` block.
- **Why:** reviewable, mergeable, versionable encrypted config.
- **When:** secrets in Git for Kubernetes/Helm, Terraform, app config, CI.
- **Remember:** configure `.sops.yaml` once, then `sops edit file.yaml` and forget about keys.

---

## Mental model

```text
 secrets.yaml                      secrets.enc.yaml
 db:                               db:
   password: hunter2   ── sops ──▶   password: ENC[AES256_GCM,data:...]
 api_key: abc                      api_key: ENC[AES256_GCM,data:...]
                                   sops:
                                     age: [recipient: age1..., enc: ...]
                                     mac: ENC[...]
```

A random **data key** encrypts the values. The data key is itself encrypted for each recipient (age, KMS, PGP...).

---

## Install & setup (with age)

```bash
brew install sops age
age-keygen -o key.txt                       # public key: age1...

# where sops looks for the private key
export SOPS_AGE_KEY_FILE=$PWD/key.txt
# default: $XDG_CONFIG_HOME/sops/age/keys.txt
#          (macOS: ~/Library/Application Support/sops/age/keys.txt)
```

`.sops.yaml` at the repo root:

```yaml
creation_rules:
  - path_regex: secrets/.*\.ya?ml$
    encrypted_regex: '^(data|stringData|password|token|.*_key)$'
    age: >-
      age1aaa...,
      age1bbb...
```

---

## Core commands

| Goal | Command | Notes |
|------|---------|-------|
| Create / edit an encrypted file | `sops edit secrets/app.yaml` | Opens `$EDITOR`, re-encrypts on save |
| Encrypt a file to stdout | `sops encrypt secrets.yaml > secrets.enc.yaml` | Rules from `.sops.yaml` |
| Encrypt in place | `sops encrypt -i secrets.yaml` | |
| Decrypt to stdout | `sops decrypt secrets.enc.yaml` | |
| Decrypt in place | `sops decrypt -i secrets.enc.yaml` | Careful: leaves plaintext on disk |
| Extract one value | `sops decrypt --extract '["db"]["password"]' f.yaml` | |
| Set a value | `sops set f.yaml '["db"]["password"]' '"new"'` | Value is JSON |
| Add/remove recipients after editing `.sops.yaml` | `sops updatekeys f.yaml` | |
| Rotate the data key | `sops rotate -i f.yaml` | Do after removing a recipient |
| Force formats | `--input-type json --output-type yaml` | For stdin or odd extensions |

Older syntax `sops -e`, `sops -d`, `sops file` still works.

### Selecting what gets encrypted

| Flag / key | Effect |
|------------|--------|
| `--encrypted-regex '^(data)$'` | Only keys matching the regex |
| `--unencrypted-regex` | Everything except matching keys |
| `--encrypted-suffix _secret` | Only keys ending with the suffix |
| `--unencrypted-suffix _unencrypted` | Default behavior inverse |

---

## Recipes

**Inject secrets into a process without writing files**

```bash
sops exec-env secrets.enc.env './run-app.sh'
sops exec-file secrets.enc.yaml 'my-tool --config {}'
```

**Kubernetes Secret**

```bash
sops encrypt --encrypted-regex '^(data|stringData)$' secret.yaml > secret.enc.yaml
sops decrypt secret.enc.yaml | kubectl apply -f -
```

**Add a teammate**

```bash
# 1. add their age1... key in .sops.yaml
sops updatekeys secrets/app.yaml
```

**Remove someone's access**

```bash
# 1. remove their key in .sops.yaml
sops updatekeys secrets/app.yaml
sops rotate -i secrets/app.yaml     # and rotate the secrets themselves
```

**Readable git diffs**

```bash
echo '*.enc.yaml diff=sopsdiffer' >> .gitattributes
git config diff.sopsdiffer.textconv "sops decrypt"
```

---

## Gotchas & common mistakes

- **Avoid:** `sops: no matching creation rules` → **Do:** the file path must match a `path_regex` in `.sops.yaml` (looked up from the current dir upward).
- **Avoid:** "Failed to get the data key" → **Do:** `SOPS_AGE_KEY_FILE` unset or key not among recipients.
- **Avoid:** Hand-editing encrypted values → **Do:** the MAC check fails; always use `sops edit`.
- **Avoid:** Encrypting everything → **Do:** restrict with `encrypted_regex` so diffs and reviews stay useful.
- **Avoid:** Removing a recipient and calling it done → **Do:** they still have the old data key and git history: `rotate` and change the actual secrets.
- **Avoid:** Keys in clear text → **Do:** key *names* stay readable by design; don't put secrets in key names.

:::tip
`sops decrypt` into a pipe or `exec-env` avoids ever writing plaintext secrets to disk.
:::

:::warning
`sops decrypt -i` and a forgotten plaintext file are the most common leaks. Add the plaintext name to `.gitignore`.
:::

---

## See also

- [age](./age): key generation and file encryption
- Docs: [https://getsops.io/docs/](https://getsops.io/docs/)
- Repo: [https://github.com/getsops/sops](https://github.com/getsops/sops)
