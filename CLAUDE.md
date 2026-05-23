# Curated Festivals — project rules

## Data

When adding new festivals, always update **both** files:
- `data.js` — festival data
- `lib/festivals-meta.js` — OG social sharing tags

The slug in `festivals-meta.js` must exactly match the `?f=` parameter generated in `openDetail` in `app.js`.

## Navigation

- Detail view uses `pushState({ festival: name }, '', '?f=${slug}')` on open
- `closeDetail` uses `replaceState({}, '', '/')` to restore base URL
- `popstate` listener calls `closeDetail()` only — no further history manipulation
- Touch swipe detector on `#view-detail` closes on rightward swipe > 60px as fallback

## Filters

Active filters:
- Vibe (tags)
- Country
- Date sort — upcoming first, past last

Past festivals:
- Pushed to end of list
- Rendered with `.card--past` class (opacity 0.4, rises to 0.7 on hover)
- Separated by a `.past-divider` element with text "Past festivals"

## CSS / mobile

- No transform-based animations on detail panel — caused iOS Safari crashes
- Detail open/close is pure `body.detail-open` class toggle, `display: none/block` only
- No `will-change`, no transitions on the main view switch
