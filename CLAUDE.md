# Curated Festivals — Project Rules

## Data

When adding new festivals, always update **both** files:
- `public/data.js` — full festival object
- `lib/festivals-meta.js` — minimal mirror for OG tags and static generation

Slug format: `name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')`

The slug in `lib/festivals-meta.js` must exactly match the slug used in `openDetail` in `app.js`.

## Routing

Festival detail pages use file-based static routing:

```
/festivals/[slug]   →   app/festivals/[slug]/page.js
```

Old `/?f=slug` links redirect permanently (301) to `/festivals/slug` via `next.config.js`.

When clicking a festival from the grid, `public/app.js` pushes `/festivals/slug` directly via `history.pushState`. When already on `/festivals/slug`, the `pushState` is skipped entirely.

## Static Generation

All festival pages are pre-built at deploy time using `generateStaticParams` in `app/festivals/[slug]/page.js`.

- `app/page.js` — fully static, no `force-dynamic`
- `app/festivals/[slug]/page.js` — SSG via `generateStaticParams`
- `/api/og` — edge function, dynamic by nature

## Navigation

- Detail view is a **CSS-only show/hide** — `body.detail-open` class toggle, `display: none/block` only, no transitions
- `openDetail` adds `body.detail-open` class only
- `closeDetail` removes `body.detail-open` class only
- **No `will-change` on any element** — remove it if you see it anywhere
- **No `transform`-based animations on the detail panel** — caused iOS Safari crashes
- Back button in detail panel calls `closeDetail()` directly — never `history.back()` or any href navigation
- Scroll position: save `window.scrollY` before opening, restore it in `closeDetail`
- Detail panel scroll resets to top on every `openDetail` call
- Deep link on page load: `DOMContentLoaded` reads `/festivals/slug` from the pathname first, falls back to `?f=slug` query param

## OG / Social Sharing

- OG tags handled server-side via `app/festivals/[slug]/page.js` `generateMetadata` + `lib/festivals-meta.js`
- The client-side `_ogImage.content` DOM mutation in `app.js` has been removed — do not re-add it
- OG image endpoint: `/api/og?f={slug}` — generates a 1200×630 branded card per festival
- Uses built-in `next/og` — not `@vercel/og`
- Use hardcoded production URL `https://discover-festivals.vercel.app` — never `process.env.VERCEL_URL`
  (`curatedfestivals.com` is the public domain but the OG edge function must use the Vercel URL for internal asset fetching such as fonts)

## Filters

Active filters:
- Vibe (tags)
- Country
- Date sort — upcoming first, past last

Past festivals:
- Pushed to end of list
- Rendered with `.card--past` class (opacity 0.4, rises to 0.7 on hover)
- Separated by a `.past-divider` element with text "Past festivals"

## CSS / Mobile Performance

- No `transform`-based animations on the detail panel — caused iOS Safari crashes
- No `will-change` on any element — remove it if you see it anywhere
- Detail open/close: pure `body.detail-open` class toggle, `display: none/block` only, no transitions
- Cards use `content-visibility: auto` with `contain-intrinsic-size: 0 280px` — do not remove
- All card `<img>` tags must have `loading="lazy"` and `decoding="async"`
- Never add transitions or animations to the main view switch

## Images

Plain `<img>` tags with `loading="lazy"` and `decoding="async"` set manually in `app.js`. `next/image` is not used because card images are created via `document.createElement` in vanilla JS. `unoptimized: true` remains in `next.config.js` — do not remove.

## Key Files

| File | Purpose |
|---|---|
| `public/data.js` | Source of truth — all festival data |
| `lib/festivals-meta.js` | Minimal mirror for OG tags and static generation |
| `app/festivals/[slug]/page.js` | Festival route — metadata + renders AppShell |
| `app/page.js` | Home page — renders AppShell, no slug |
| `app/AppShell.js` | Client component — full UI shell, accepts `initialSlug` prop |
| `public/app.js` | Vanilla JS — festival cards, filtering, detail panel, URL handling |
| `app/api/og/route.js` | Edge function — generates OG images using `next/og` |
| `next.config.js` | Redirect from `/?f=slug` → `/festivals/slug` |
