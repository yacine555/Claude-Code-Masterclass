# Plan: Navbar Logout Button

## Context

The `Navbar` component currently has no auth integration — it renders a static layout regardless of whether a user is signed in. The spec requires a "Logout" button that conditionally appears when the user is authenticated, calls Firebase's `signOut()` on click, and is disabled while the sign-out request is in flight. No redirect is needed; the button simply disappears once auth state clears via `onAuthStateChanged`.

---

## Files to Modify

### 1. `components/Navbar/Navbar.tsx`

**Convert to a client component** (add `"use client"` — required for hooks).

**New imports:**
- `useState` from `react`
- `useUser` from `@/contexts/AuthContext`
- `signOut` from `firebase/auth`
- `auth` from `@/lib/firebase`

**New logic inside the component:**
- Call `const { user, loading } = useUser();`
- Add `const [isSigningOut, setIsSigningOut] = useState(false);`
- Add `handleLogout` async function: sets `isSigningOut(true)`, calls `await signOut(auth)`, on error silently resets `isSigningOut(false)`. On success, no reset needed — `onAuthStateChanged` fires → `user` becomes null → button unmounts.

**New JSX** inside `<ul>`, before the existing "Create New Heist" link:
```
{!loading && user && (
  <li>
    <button onClick={handleLogout} disabled={isSigningOut}>
      Logout
    </button>
  </li>
)}
```

---

### 2. `tests/components/Navbar.test.tsx`

The existing test file has no auth mocking and will break once `useUser()` is called. Rewrite to add:

**Module mocks (top-level):**
- `vi.mock("firebase/auth", ...)` — mock `signOut` with a tracked `vi.fn()`
- `vi.mock("@/lib/firebase", ...)` — `{ auth: {} }`
- `vi.mock("@/contexts/AuthContext", ...)` — mock `useUser` as a `vi.fn()`

**`beforeEach`:** configure `useUser` to return `{ user: null, loading: false }` by default; `vi.clearAllMocks()`

**Fix pre-existing bug:** "renders the Create Heist link" uses `/create heist/i` — change to `/create new heist/i` to match actual link text.

**New tests:**
1. Logout button renders when `user` is non-null and `loading` is false
2. Logout button is not rendered when `user` is null
3. Logout button is not rendered while `loading` is true
4. Clicking the Logout button calls `signOut` exactly once

---

## Key Files for Reference

| File | Role |
|---|---|
| `components/Navbar/Navbar.tsx` | Component to modify |
| `contexts/AuthContext.tsx` | `useUser()` — returns `{ user: AppUser \| null, loading: boolean }` |
| `lib/firebase.ts` | Exports `auth` instance |
| `tests/components/Navbar.test.tsx` | Test file to update |
| `tests/components/AuthContext.test.tsx` | Pattern reference for mocking `firebase/auth` |

---

## Verification

1. Run `npm test` — all tests must pass (including the pre-existing Navbar bug fix)
2. Run `npm run dev`, log in via `/signup` or `/login`
3. Navigate to `/heists` — confirm the Logout button is visible in the Navbar
4. Click Logout — confirm the button disappears and no redirect occurs
5. Verify the button is absent when visiting the page while logged out
