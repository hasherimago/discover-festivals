# Curated Festivals — project rules

## Data

When adding new festivals, always update **both** files:
- `data.js` — festival data
- `lib/festivals-meta.js` — OG social sharing tags

The slug in `festivals-meta.js` must exactly match the `?f=` parameter generated in `openDetail` in `app.js`. Check the slugify function there.

## Navigation

- Detail view is a **CSS-only show/hide** — no History API
- `openDetail` adds `body.detail-open` class only
- `closeDetail` removes `body.detail-open` class only
- **No `pushState`, `replaceState`, or `popstate` listener** — these caused iOS Safari crashes and were removed
- Deep link on page load: `DOMContentLoaded` reads `?f=` from the URL and opens the matching festival
- Back button in detail panel calls `closeDetail()` directly — never `history.back()` or any href navigation
- Scroll position: save `window.scrollY` before opening, restore it in `closeDetail`
- Detail panel scroll resets to top on every `openDetail` call

## OG / Social sharing

- OG tags are handled **server-side only** via Next.js (`app/page.js` `generateMetadata` + `lib/festivals-meta.js`)
- The client-side `_ogImage.content` DOM mutation in `app.js` has been removed — do not re-add it
- OG image endpoint: `/api/og?f={slug}` — generates a 1200×630 branded card per festival
- Use hardcoded production URL `https://discover-festivals.vercel.app` — never `process.env.VERCEL_URL`

## Filters

Active filters:
- Vibe (tags)
- Country
- Date sort — upcoming first, past last

Past festivals:
- Pushed to end of list
- Rendered with `.card--past` class (opacity 0.4, rises to 0.7 on hover)
- Separated by a `.past-divider` element with text "Past festivals"

## CSS / mobile performance

- No `transform`-based animations on the detail panel — caused iOS Safari crashes
- No `will-change` on any element — remove it if you see it anywhere
- Detail open/close: pure `body.detail-open` class toggle, `display: none/block` only, no transitions
- Cards use `content-visibility: auto` with `contain-intrinsic-size: 0 280px` — do not remove
- All card `<img>` tags must have `loading="lazy"` and `decoding="async"`
- Never add transitions or animations to the main view switch
