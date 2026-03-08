# Security Policy

## Supported Versions

Only the latest version of burnote at [burnote.wiar8.com](https://burnote.wiar8.com) receives security fixes.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email: [sebastian@wiar8.com](mailto:sebastian@wiar8.com)

Include as much detail as possible:
- A description of the vulnerability and its potential impact
- Steps to reproduce the issue
- Any relevant proof-of-concept (keep it minimal — do not exfiltrate real user data)

You can expect an acknowledgment within 48 hours and a resolution timeline within 7 days for critical issues.

## Security Architecture

Burnote is a zero-knowledge system. Understanding the threat model helps scope what is and isn't a vulnerability:

**In scope:**
- Weaknesses in client-side encryption (`lib/crypto.ts`) — AES-256-GCM, PBKDF2 key derivation
- Logic bugs that could expose plaintext or the password to the server
- Burn-after-read bypass (note surviving after first read)
- Cross-site scripting (XSS) — any path to injecting script into the revealed secret
- CSRF or authentication issues on the API routes
- Redis key enumeration or unauthorized access to stored ciphertext

**Out of scope:**
- An attacker who controls both ends of the communication (we can't protect against that)
- Brute-forcing a weak password chosen by the user — that's a user education issue, not a code bug
- The server reading ciphertext — that is expected and by design; only the encrypted blob is stored
- Denial-of-service attacks against the Redis store

## Cryptographic Details

| Property | Value |
|---|---|
| Encryption | AES-256-GCM |
| Key derivation | PBKDF2-SHA-256, 200,000 iterations |
| IV | 12 bytes, random per note |
| Salt | 16 bytes, random per note |
| Execution | Browser-only (Web Crypto API) |

The server stores `{ ciphertext, iv, salt }`. It never sees the password or plaintext.
