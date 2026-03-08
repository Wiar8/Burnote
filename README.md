# burnote

> Share secrets that disappear.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Security](https://img.shields.io/badge/encryption-AES--256--GCM-blue.svg)](#security)

Burnote lets you share sensitive text — passwords, tokens, private messages — through a short link protected by a password. The server **never** sees your content. Everything is encrypted and decrypted in the browser.

---

## How it works

```
You write a note + set a password
        ↓
Browser encrypts it (AES-256-GCM)
        ↓
Only the ciphertext is stored — server is blind
        ↓
You share the link + password separately
        ↓
Recipient opens link, enters password, browser decrypts
        ↓
Note disappears (optional: burn after read)
```

---

## Features

- **Zero-knowledge** — the server stores only encrypted blobs, never plaintext or passwords
- **Burn after read** — notes self-destruct after the first view
- **Auto-expiry** — notes expire after 1h, 24h, or 7 days
- **No accounts** — anonymous by design
- **Short links** — clean, shareable URLs

---

## Security

Burnote follows a zero-knowledge architecture. The encryption key (your password) never leaves your device. It is never sent to the server, never logged, and never stored.

**Encryption:** AES-256-GCM via the native Web Crypto API
**Key derivation:** PBKDF2 with SHA-256, 200,000 iterations
**Transport:** TLS for all network communication

> If you find a security vulnerability, please **do not** open a public issue. See [SECURITY.md](SECURITY.md) — email [sebastian@wiar8.com](mailto:sebastian@wiar8.com) instead.

---

## Getting started

```bash
git clone https://github.com/wiar8/burnote
cd burnote
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

See [CONTRIBUTING.md](CONTRIBUTING.md) for environment setup and full development guide.

---

## Self-hosting

Burnote is designed to be self-hosted. You need:

- A Redis-compatible store (Upstash, Redis Cloud, or self-hosted)
- A Node.js hosting environment (Vercel, Railway, Fly.io, etc.)

See [docs/self-hosting.md](docs/self-hosting.md) for step-by-step instructions.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## License

[MIT](LICENSE)
