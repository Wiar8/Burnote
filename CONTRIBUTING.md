# Contributing to burnote

Thanks for your interest. Contributions are welcome — bug fixes, improvements, and thoughtful features.

## Before you start

- Open an issue first for any non-trivial change so we can align before you invest time
- For bug fixes, a clear description of the bug and the fix is enough — no issue required
- Security vulnerabilities: see [SECURITY.md](SECURITY.md), do not open a public issue

## Development setup

### Requirements

- Node.js 20+
- An [Upstash Redis](https://upstash.com/) account (free tier is fine) — or any Redis-compatible HTTP endpoint

### Steps

```bash
git clone https://github.com/wiar8/burnote
cd burnote
cp .env.example .env.local
npm install
npm run dev
```

Fill in `.env.local` with your Upstash credentials:

```
UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx              # Home — note creation
  [id]/page.tsx         # Note view page
  api/notes/
    route.ts            # POST — create note
    [id]/route.ts       # GET — retrieve + burn note
  globals.css           # Tailwind entry, animation tokens
  layout.tsx            # Root layout, font loading, Footer

components/
  CreateNoteForm.tsx    # Client — encrypts and submits
  ViewNote.tsx          # Client — fetches and decrypts
  Footer.tsx            # Social links

lib/
  crypto.ts             # AES-256-GCM + PBKDF2, browser-only
  redis.ts              # Upstash Redis client

types/
  note.ts               # StoredNote type, expiry options

docs/
  styles/design-system.md   # Design system reference
```

## Guidelines

### Encryption

- All crypto stays in `lib/crypto.ts` and runs browser-only (Web Crypto API)
- Never transmit the password — not in headers, not in the body, not in logs
- The server should never see plaintext — keep it that way

### Code style

- TypeScript strict mode — no `any`, no suppressed errors
- Tailwind utility classes only — no inline styles, no CSS modules
- Follow the [design system](docs/styles/design-system.md) for any UI work — stone/amber palette, existing component patterns
- Use `_` for intentionally unused function parameters

### Commits

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- One logical change per commit — don't bundle unrelated changes

## Pull requests

- Keep PRs focused — one concern per PR
- Include a short description of what changed and why
- If the change touches the UI, include a screenshot
- Type check before submitting: `npx tsc --noEmit`
