# Plan: Route Protection

## Context

The app has two layout groups — `(public)` for unauthenticated pages and `(dashboard)` for authenticated pages — but neither enforces access control. The `(dashboard)` layout already has a redirect stub using `useUser` and `router.replace`, but it returns `null` for both the loading and unauthenticated states, collapsing them together. The `(public)` layout is a plain wrapper with no auth awareness at all. This plan adds proper route guards to both layouts and replaces the blank-screen loading state with a minimal visible loader.

The landing page (`/`) lives in `(public)` but must remain accessible to all users — only `/login` and `/signup` should redirect authenticated users.

---

## Files to Modify

### 1. `app/(dashboard)/layout.tsx`

**Already has:** `useUser`, `useRouter`, `useEffect` redirect to `/login` when `!loading && !user`.

**One change — split the combined null return:**

Current:
```
if (loading || !user) return null;
```

Replace with:
```
if (loading) return <p role="status" aria-live="polite">Loading…</p>;
if (!user) return null;  // redirect is already firing via useEffect
```

No other changes. The redirect `useEffect` and the layout JSX are already correct.

---

### 2. `app/(public)/layout.tsx`

**Currently:** a plain server component wrapper, no auth logic.

**Changes:**
- Add `"use client"` directive
- Import `useEffect` from `react`
- Import `useRouter`, `usePathname` from `next/navigation`
- Import `useUser` from `@/contexts/AuthContext`
- Add hooks: `useUser()`, `useRouter()`, `usePathname()`
- Add `useEffect`: if `!loading && user && pathname !== "/"` → `router.replace("/heists")`
- Add early return: `if (loading) return <p role="status" aria-live="polite">Loading…</p>;`
- Keep existing JSX: `<main className="public">{children}</main>`

The `pathname !== "/"` guard ensures the landing page remains accessible to authenticated users.

---

## New Test Files

### 3. `tests/layouts/DashboardLayout.test.tsx` (new file)

Follow the mock pattern from `tests/components/Navbar.test.tsx`.

**Mocks:**
- `@/contexts/AuthContext`: `{ useUser: vi.fn() }`
- `next/navigation`: `{ useRouter: () => ({ replace: mockReplace }) }`
- `@/components/Navbar`: `{ default: () => <div>Navbar</div> }`

**`beforeEach`:** `vi.clearAllMocks()`

**Tests (3):**
1. Renders children when user is authenticated (`user` set, `loading: false`)
2. Calls `router.replace("/login")` and renders nothing when unauthenticated (`user: null`, `loading: false`)
3. Shows loader element (`role="status"`) when `loading: true`

---

### 4. `tests/layouts/PublicLayout.test.tsx` (new file)

Same mock pattern.

**Mocks:**
- `@/contexts/AuthContext`: `{ useUser: vi.fn() }`
- `next/navigation`: `{ useRouter: () => ({ replace: mockReplace }), usePathname: vi.fn() }`

**`beforeEach`:** `vi.clearAllMocks()`

**Tests (4):**
1. Renders children when user is unauthenticated (`user: null`, `loading: false`)
2. Calls `router.replace("/heists")` when authenticated on `/login` path
3. Does NOT redirect when authenticated on `/` path
4. Shows loader element (`role="status"`) when `loading: true`

---

## Key Files for Reference

| File | Role |
|---|---|
| `app/(dashboard)/layout.tsx` | Modify — split `loading \|\| !user` return |
| `app/(public)/layout.tsx` | Modify — add full auth guard |
| `contexts/AuthContext.tsx` | `useUser` returns `{ user: AppUser \| null, loading: boolean }` |
| `tests/components/Navbar.test.tsx` | Mock pattern: `vi.mock("@/contexts/AuthContext", () => ({ useUser: vi.fn() }))` |

---

## Verification

1. Run `npm test -- layout` — all tests in both new layout test files must pass
2. Run `npm run dev`
3. While logged out: navigate to `/heists` → confirm redirect to `/login`
4. While logged in: navigate to `/login` → confirm redirect to `/heists`
5. While logged in: navigate to `/` → confirm landing page is accessible (no redirect)
6. Slow network: confirm a loading indicator appears briefly before redirect fires on both groups
