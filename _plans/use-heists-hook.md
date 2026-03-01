# Plan: useHeists Hook

## Context

The `/heists` page has three placeholder sections (active, assigned, expired) with no data. Need a real-time Firestore hook to populate them. No `onSnapshot` usage exists yet in the codebase — this is the first real-time listener.

## Files to Create

- `hooks/useHeists.ts` — hook with `onSnapshot` listener
- `hooks/index.ts` — barrel re-export
- `tests/hooks/useHeists.test.tsx`

## Files to Modify

- `app/(dashboard)/heists/page.tsx` — call hook 3x, render titles
- `firestore.indexes.json` — add composite indexes

## Implementation

### 1. `hooks/useHeists.ts`

- Accept `mode: 'active' | 'assigned' | 'expired'`
- Return `{ heists: Heist[], loading: boolean, error: Error | null }`
- Get `user` from `useUser()`
- In `useEffect`, build query per mode using `collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)`:
  - `active`: `where('assignedTo', '==', user.uid)` + `where('deadline', '>', new Date())`
  - `assigned`: `where('createdBy', '==', user.uid)` + `where('deadline', '>', new Date())`
  - `expired`: `where('deadline', '<=', new Date())` then client-side filter `finalStatus !== null`
- Subscribe via `onSnapshot(q, snapshot => ...)`, return unsubscribe cleanup
- If no user yet, skip query and return empty/loading

### 2. `hooks/index.ts`

Re-export `useHeists`

### 3. Update `app/(dashboard)/heists/page.tsx`

- Call `useHeists('active')`, `useHeists('assigned')`, `useHeists('expired')`
- Under each `<h2>`, render `<ul>` of `heist.title` items
- Show "Loading..." while loading, error message if error

### 4. Update `firestore.indexes.json`

Add two composite indexes:
- `(assignedTo ASC, deadline ASC)` on `heists` collection
- `(createdBy ASC, deadline ASC)` on `heists` collection

### 5. Tests

Mock `onSnapshot` from `firebase/firestore`, `useUser` from AuthContext, `db` from `lib/firebase`.

Test cases:
- Returns loading true before snapshot fires
- `'active'` mode: calls `where('assignedTo', ...)` + `where('deadline', '>', ...)`
- `'assigned'` mode: calls `where('createdBy', ...)` + `where('deadline', '>', ...)`
- `'expired'` mode: filters out null `finalStatus` client-side
- Calls unsubscribe on unmount
- Sets error state on snapshot error
- Heists page renders titles under each section

## Key Reusable Code

- `heistConverter` from `types/firestore/heist.ts` — handles Timestamp→Date
- `COLLECTIONS.HEISTS` from `types/firestore/index.ts`
- `useUser()` from `contexts/AuthContext.tsx`
- `db` from `lib/firebase.ts`
- Mock patterns from `tests/components/CreateHeistForm.test.tsx`

## Verification

1. `npm test -- useHeists` — all pass
2. `npm run build` — no type errors
3. Dev server: `/heists` shows real-time heist titles in correct sections
