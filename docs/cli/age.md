# age Cheatsheet

> **One-line pitch:** a simple, modern, small file-encryption tool with explicit keys and no config.

| | |
|---|---|
| **Type** | CLI |
| **Level** | Beginner |
| **Version / Context** | age 1.x (`age`, `age-keygen`) |
| **Last updated** | 2026-10-15 |
| **Tags** | `encryption` `security` `cli` |

---

## TL;DR

- **What:** encrypts files/streams to one or more **recipients** (public keys), or with a passphrase.
- **Why:** a no-fuss alternative to GPG: no keyring, no web of trust, X25519 + ChaCha20-Poly1305.
- **When:** backups, sharing a secret file, encrypting secrets for [sops](./sops).
- **Remember:** encrypt with the **public** key (`-r`), decrypt with the **identity** file (`-i`). Lose the identity file, lose the data.

---

## Mental model

```text
 age-keygen ──▶ key.txt (identity, SECRET)  ──▶ public key  age1...
                                                     │
 plaintext ── age -r age1... ──▶ file.age ── age -d -i key.txt ──▶ plaintext
```

---

## Install & setup

```bash
brew install age            # macOS
age --version
age-keygen -o key.txt       # prints: Public key: age1...
chmod 600 key.txt
```

---

## Core commands

| Goal | Command | Notes |
|------|---------|-------|
| Generate a key pair | `age-keygen -o key.txt` | Public key is printed on stderr and in a comment in the file |
| Show public key of an identity | `age-keygen -y key.txt` | |
| Encrypt for a recipient | `age -r age1... -o secret.txt.age secret.txt` | |
| Encrypt for several recipients | `age -r age1aaa -r age1bbb -o out.age in` | Any one can decrypt |
| Recipients from a file | `age -R recipients.txt -o out.age in` | One key per line |
| Encrypt with a passphrase | `age -p -o out.age in` | Prompts interactively |
| Decrypt | `age -d -i key.txt -o out in.age` | Passphrase files prompt automatically |
| ASCII-armored output | `age -a -r age1... in > out.age.asc` | Safe to paste in text |
| Encrypt for an SSH key | `age -R ~/.ssh/id_ed25519.pub -o out.age in` | Supports ed25519 and RSA |
| Decrypt with an SSH key | `age -d -i ~/.ssh/id_ed25519 out.age` | |

---

## Recipes

**Encrypt a directory**

```bash
tar czf - project/ | age -r age1... > project.tar.gz.age
age -d -i key.txt project.tar.gz.age | tar xzf -
```

**Encrypt to a GitHub user's SSH keys**

```bash
curl -s https://github.com/<user>.keys | age -R - -o out.age in
```

**Pipe without temp files**

```bash
echo "token=abc" | age -r age1... > token.age
age -d -i key.txt token.age
```

**Back up the identity safely**

```bash
age -p -o key.txt.age key.txt     # passphrase-protect the private key
```

---

## Gotchas & common mistakes

- **Avoid:** Committing `key.txt` → **Do:** keep it out of git (`.gitignore`), mode `600`.
- **Avoid:** Using `-r` with the identity file → **Do:** `-r` takes a public key (`age1...`), `-i` takes the private file.
- **Avoid:** Expecting to edit in place → **Do:** age always writes a new file or stdout.
- **Avoid:** Mixing `-p` with `-r` → **Do:** passphrase mode cannot be combined with recipients.
- **Avoid:** Expecting authentication of the sender → **Do:** age gives confidentiality + integrity, **not** sender identity (no signatures).

:::tip
Use `-o -` or omit `-o` to write to stdout, and `-` as input for stdin.
:::

:::warning
No key recovery exists. Store a copy of the identity file in a password manager or offline backup.
:::

---

## See also

- [sops](./sops): structured secret files encrypted with age
- Repo and spec: [https://github.com/FiloSottile/age](https://github.com/FiloSottile/age)
