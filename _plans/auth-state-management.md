# Plan: Auth State Management

## Context

The app has Firebase auth configured (`lib/firebase.ts`) but no global auth state layer. Components have no way to know who is logged in. This plan wires up a React context + `useUser` hook so any Client Component can access the current user, the dashboard routes are protected, and the landing page redirects based on auth status.

---

## Files to Create

### 1. `contexts/AuthContext.tsx` ← core new file
Client Component. Registers one `onAuthStateChanged` listener on mount, maps the Firebase user to `{ uid, email, displayName }`, exposes `{ user, loading }` via context.

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { ReactNode } from "react";

export type AppUser = { uid: string; email: string | null; displayName: string | null };
type AuthContextValue = { user: AppUser | null; loading: boolean };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser
        ? { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName }
        : null
      );
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useUser(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useUser must be used within an AuthProvider. Wrap your app with <AuthProvider> in app/layout.tsx.");
  }
  return context;
}
```

### 2. `tests/components/AuthContext.test.tsx` ← new test file
Mocks `firebase/auth` and `@/lib/firebase` to avoid real network calls.

Key test cases (per spec):
- `useUser` returns `null` user when listener fires with no user
- `useUser` returns user object when listener fires with a user
- `useUser` throws a descriptive error when called outside `AuthProvider`
- `AuthProvider` renders children correctly
- `loading` is `true` before listener resolves, `false` after

Mock strategy:
```ts
vi.mock("firebase/auth", () => ({ onAuthStateChanged: vi.fn(), getAuth: vi.fn() }));
vi.mock("@/lib/firebase", () => ({ auth: {} }));
```
Use `act()` to flush state updates when calling the captured callback manually.

---

## Files to Modify

### 3. `app/layout.tsx`
Import `AuthProvider` and wrap `{children}`. File stays a Server Component (no `"use client"`) so `metadata` export remains valid — Next.js handles the Server→Client boundary automatically.

```tsx
import { AuthProvider } from "@/contexts/AuthContext";
// ...
<body><AuthProvider>{children}</AuthProvider></body>
```

### 4. `app/(public)/page.tsx`
Add `"use client"`. Use `useUser` + `useRouter` to redirect:
- While `loading`: return `null`
- `user` present: `router.replace("/heists")`
- No user: `router.replace("/login")`
- Return `null` at all times (pure routing logic, no UI content needed)

### 5. `app/(dashboard)/layout.tsx`
Add `"use client"`. Route guard for all `/heists/*` pages:
- `loading || !user` → return `null` + `useEffect` fires `router.replace("/login")`
- User confirmed → render `<Navbar /><main>{children}</main>`

Use `router.replace` (not `push`) to avoid back-button redirect loops.

### 6. `app/(dashboard)/heists/page.tsx`
Add `"use client"`. Call `useUser()` and personalize the heading:
```tsx
<h2>{user?.displayName ? `${user.displayName}'s Active Heists` : "Your Active Heists"}</h2>
```

---

## Implementation Order

1. `contexts/AuthContext.tsx` — no dependencies on other new files
2. `app/layout.tsx` — depends on AuthContext
3. `app/(public)/page.tsx` — depends on AuthContext
4. `app/(dashboard)/layout.tsx` — depends on AuthContext
5. `app/(dashboard)/heists/page.tsx` — depends on AuthContext
6. `tests/components/AuthContext.test.tsx` — tests the complete context

---

## Out of Scope

- Server-side session helpers (Firebase Admin SDK / cookies) — mentioned in open questions but not in this spec's scope
- Timeout for offline / slow auth resolution — Firebase caches auth state locally via IndexedDB, resolving this edge case without extra code
- DO NOT use the hook in the application yet

---

## Verification

```bash
# Run all tests (should see new AuthContext tests pass)
npm test

# Run only the new test file
npm test -- AuthContext

# Start dev server and verify:
# 1. Visit http://localhost:3000 → redirects to /login (not logged in)
# 2. Log in → redirects to /heists, heading shows displayName if set
# 3. Visit /heists directly while logged out → redirects to /login
# 4. Sign in on one tab, sign out on another → dashboard redirects automatically
npm run dev
```
