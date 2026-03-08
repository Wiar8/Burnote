# burnote — Design System

## Design Direction

**Aesthetic**: "Classified document" meets editorial warmth.
**Tone**: Serious, trustworthy, ephemeral. Not playful, not corporate.
**Memory**: The amber "burn" in the wordmark — a signature brand moment.

> **Wordmark split**: `burn` (amber) + `ote` (stone-100) = **burnote**.
> `burn` + `note` would render as "burnnote" (double n) — incorrect.

The interface feels like a confidential form you fill out and hand over. Clean and precise. Nothing decorative exists without purpose.

---

## Color

Uses Tailwind's built-in **`stone`** scale (warm brown-gray undertones) for neutrals and **`amber`** for the brand accent. No custom color tokens.

### Palette

| Role | Tailwind class | Hex | Usage |
|---|---|---|---|
| Page background | `bg-stone-950` | `#0c0a09` | Body background |
| Surface | `bg-stone-900` | `#1c1917` | Form fields, content boxes |
| Border | `border-stone-800` | `#292524` | All borders, dividers |
| Border (toggle) | `border-stone-700` | `#44403c` | Toggle track border |
| Muted text | `text-stone-500` / `text-stone-600` | — | Secondary text, placeholders, captions |
| Primary text | `text-stone-100` | `#f5f5f4` | Body text |
| Amber accent | `text-amber-500` / `bg-amber-500` | `#f59e0b` | CTA button, brand mark, accent labels |
| Amber hover | `bg-amber-400` | `#fbbf24` | Primary button hover state |
| Error | `text-red-400` | — | Validation errors |

### Principles

- **`stone` is warm by nature** — brown-gray undertones, no dead neutral grays
- **Amber is used sparingly** — wordmark, CTA, accent labels only (60/30/10 rule)
- **No cyan, no purple gradients** — those are generic AI aesthetics
- **No gradient text** — amber applied as solid color only

---

## Typography

### Fonts

| Role | Font | Tailwind class | Why |
|---|---|---|---|
| **Display / Wordmark** | [Fraunces](https://fonts.google.com/specimen/Fraunces) | `font-display` | Variable serif — editorial, distinctive, carries brand weight |
| **UI / Body** | [Outfit](https://fonts.google.com/specimen/Outfit) | `font-sans` | Geometric sans — clean, readable, not generic |
| **Monospace** | Geist Mono | `font-mono` | Reserved for code-like data: URLs, revealed secrets |

Fonts are loaded via `next/font/google` and injected as CSS variables on `<html>`. The `@theme inline` block in `globals.css` maps them to Tailwind utilities.

> **Anti-pattern avoided**: Monospace as the entire UI font — that's lazy "developer tool" shorthand. Monospace is reserved for actual data output.

### Scale

| Role | Class | Size | Notes |
|---|---|---|---|
| Wordmark | `text-5xl font-black` | 3rem | Fraunces, `tracking-tight leading-none` |
| Body / inputs | `text-sm` | 0.875rem | |
| Small labels | `text-xs` | 0.75rem | Accent labels, captions, errors |

### Hierarchy

Weight contrast (900 vs 400) and size contrast (3rem vs 0.875rem) — not many sizes clustered together.

---

## Spacing & Layout

| Property | Value | Class |
|---|---|---|
| Container max-width | 440px | `max-w-[440px]` |
| Page padding | 24px horizontal, 64px vertical | `px-6 py-16` |
| Page centering | Flex center (vertical + horizontal) | `flex min-h-screen items-center justify-center` |
| Header → form gap | 48px | `mb-12` |
| Form element gap | 12px | `space-y-3` |

### Principles

- Left-aligned content within the centered column
- No nested cards — flatten the hierarchy
- No wrapper cards around the form — fields stand alone

---

## Motion & Animation

### Tokens (defined in `globals.css` via `@theme`)

```css
--animate-fade-up: fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
--animate-fade-in: fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
```

Easing `cubic-bezier(0.16, 1, 0.3, 1)` = **ease-out-expo** — confident, decelerates naturally.

### Page entrance choreography

| Element | Class | Delay |
|---|---|---|
| Header (wordmark + tagline) | `animate-fade-up` | 0ms |
| Form | `animate-fade-up` | 90ms (inline `style`) |

### Micro-interactions

| Interaction | Implementation | Duration |
|---|---|---|
| Form field focus | `focus:border-amber-500/50` | `transition-colors duration-200` |
| Primary button hover | `hover:bg-amber-400` | `transition-all duration-150` |
| Primary button press | `active:scale-[0.97]` | `transition-all duration-150` |
| Secondary button hover | `hover:border-amber-500/40` | `transition-all duration-150` |
| Ghost button hover | `hover:text-stone-100` | `transition-colors` |
| Toggle track | `peer-checked:border-amber-500/50 peer-checked:bg-amber-500/10` | `transition-colors duration-200` |
| Toggle thumb | `peer-checked:translate-x-4 peer-checked:bg-amber-500` | `transition-all duration-200` |
| Error / success reveal | `animate-fade-in` | 350ms |

### Rules

- Only animate `transform` and `opacity` — no layout properties
- No bounce/elastic easing — real objects decelerate smoothly
- `prefers-reduced-motion` respected globally in `globals.css`

---

## Component Patterns

### Form Fields

```
Tailwind: border border-stone-800 bg-stone-900 px-4 py-3
          text-sm text-stone-100 placeholder:text-stone-600
          rounded-lg focus:outline-none focus:border-amber-500/50
          transition-colors duration-200
```

Shared via the `field` constant in `CreateNoteForm.tsx`. No outer wrapper.

### Primary Button (amber CTA)

```
Tailwind: bg-amber-500 text-stone-950 font-semibold
          rounded-lg px-4 py-3 text-sm
          hover:bg-amber-400 active:scale-[0.97]
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150
```

One per view. Never two primary buttons on screen at once.

### Secondary Button (outlined)

```
Tailwind: border border-stone-800 bg-stone-900 text-stone-100
          rounded-lg px-4 py-2.5 text-sm
          hover:border-amber-500/40 active:scale-[0.97]
          transition-all duration-150
```

Used for: "Copy link".

### Ghost Button (text-only)

```
Tailwind: text-stone-500 px-4 py-2.5 text-sm rounded-lg
          hover:text-stone-100 transition-colors
```

Used for: "New note".

### Custom Toggle (burn-after-read)

CSS-only via Tailwind `peer` pattern:

```
Track:  w-8 h-4 rounded-full border border-stone-700 bg-stone-900
        peer-checked:border-amber-500/50 peer-checked:bg-amber-500/10
        transition-colors duration-200

Thumb:  absolute top-0.5 left-0.5 w-3 h-3 rounded-full
        bg-stone-600 peer-checked:translate-x-4 peer-checked:bg-amber-500
        transition-all duration-200
```

Hidden native checkbox (`sr-only peer`) drives state — screen-reader accessible.

### Accent Label

```
Tailwind: text-xs text-amber-500 uppercase tracking-widest font-medium
```

Used to introduce state: "Secret link ready", "Secret note", "Burned — cannot be viewed again".

### Monospace Content Box (revealed secret)

```
Tailwind: font-mono text-sm text-stone-100 whitespace-pre-wrap break-all
          leading-relaxed rounded-lg border border-stone-800 bg-stone-900
          px-5 py-4
```

---

## UX Writing

| Context | Copy |
|---|---|
| Wordmark tagline | "A secret link that disappears." |
| Textarea placeholder | "Paste a password, token, or private message..." |
| Password placeholder (create) | "Encryption password" |
| Password placeholder (view) | "Password" |
| Submit CTA | "Create secret link" |
| Encrypting state | "Encrypting..." |
| Success label | "Secret link ready" |
| Security notice | "Encrypted in your browser — the server sees only ciphertext." |
| Share reminder | "Share the link and password separately — the server cannot read your note." |
| View page label | "Secret note" |
| View CTA | "Reveal secret" |
| Decrypting state | "Decrypting..." |
| Burned notice | "Burned — cannot be viewed again" |
| Wrong password error | "Wrong password — could not decrypt." |
| Not found error | "Note not found or already burned." |

### Principles

- One idea per line — no multi-sentence descriptions where a phrase suffices
- No redundancy — don't re-explain what the user can already see
- Amber accent labels are declarative — they mark state, not description

---

## Accessibility

- Focus states: `focus:border-amber-500/50` on all inputs; browser default outline on buttons
- Custom toggle: hidden native checkbox with `sr-only` — keyboard and screen-reader accessible
- Color is never the sole conveyor of information (errors have text, not just color)
- Font sizes: minimum `text-xs` (12px) for labels, `text-sm` (14px) for inputs
- `prefers-reduced-motion` handled globally — animations disabled at 0.01ms
- Semantic HTML throughout: `<main>`, `<header>`, `<form>`, `<label>`, `<button type="submit">`
- `autoFocus` on password input in `ViewNote` — keyboard users land directly on the task
