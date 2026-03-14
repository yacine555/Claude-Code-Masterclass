# Plan: Heist Card Component

## Context

`/heists` page renders heists as plain `<li>` text in 3 sections (active, assigned, expired). Need card components with links, skeleton loader, 3-column grid — showing only active + assigned (removing expired).

## Files to Create

- `components/HeistCard/HeistCard.tsx`, `HeistCard.module.css`, `index.ts`
- `components/HeistCardSkeleton/HeistCardSkeleton.tsx`, `HeistCardSkeleton.module.css`, `index.ts`
- `app/(dashboard)/heists/heists.module.css`
- `tests/components/HeistCard/HeistCard.test.tsx`
- `tests/(dashboard)/heists/heists.test.tsx`

## Files to Modify

- `app/(dashboard)/heists/page.tsx` — replace `<li>` with cards, remove expired section, add grid

## Implementation

### 1. `HeistCard` component

- Props: `heist: Heist`
- Title as `<Link href={/heists/${heist.id}}>`, createdByCodename, assignedToCodename, deadline (formatted)
- CSS module: card bg `var(--color-light)`, border-radius, padding, hover state
- Follow existing component folder pattern (Skeleton, Navbar)

### 2. `HeistCardSkeleton` component

- Reuse shimmer animation pattern from `Skeleton.module.css`
- Match approximate HeistCard shape: title line + 2-3 detail lines
- No props

### 3. Update `/heists` page

- Remove expired section entirely
- `HeistList` renders `HeistCard` instead of `<li>`
- Loading: render 3x `HeistCardSkeleton` in grid
- Empty state: hide section entirely (no message)
- Import grid styles from `heists.module.css`

### 4. Page styles

- `.grid` — `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px`

### 5. Tests

**HeistCard tests:**
- Renders title as link to `/heists/[id]`
- Displays codenames and deadline
- HeistCardSkeleton renders without error

**Page tests:**
- Filters out expired heists (only active + assigned sections)
- Shows skeleton grid while loading

## Reuse

- Shimmer animation from `Skeleton.module.css`
- `Heist` type from `types/firestore/heist.ts`
- `useHeists` hook from `hooks/useHeists.ts`

## Unresolved Questions

None — spec answers clarified: show creator codename, assignee codename, due date; empty state = don't display section.
