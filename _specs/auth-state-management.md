# Spec for auth-state-management

branch: claude/feature/auth-state-management
figma_component (if used): N/A

## Summary

Introduce a global authentication state layer so any component or page in the app can access the currently authenticated user via a `useUser` hook. The hook returns `null` when logged out and a user object when logged in. Auth state is driven by a realtime listener (e.g. Firebase `onAuthStateChanged`) so the UI stays in sync automatically. This spec covers only the state management infrastructure — no new login, signup, or logout flows.

## Functional Requirements

- A React context (`AuthContext`) wraps the entire app and holds the current user state.
- The context initialises a single realtime auth listener on mount and tears it down on unmount.
- While the initial auth check is in progress, a loading/pending state is exposed so consumers can avoid flash-of-wrong-content.
- A `useUser` hook is exported. Calling it from any component returns the current user object (or `null` if logged out).
- The hook is usable in both Client Components and Server Component boundaries (only Client Components can call hooks directly; Server Components receive user data via props or server-side helpers if needed).
- The existing landing page (`app/(public)/page.tsx`) has a TODO for routing users based on auth state — this component should be updated to use `useUser` and implement that routing logic.
- The dashboard pages (`/heists`, `/heists/create`) reference user-specific content ("Your Active Heists", "Heists You've Assigned") — these should be updated to consume `useUser` and use the user's identity where relevant.
- No component outside of the auth provider should directly import or call Firebase (or equivalent) auth methods — all auth state is sourced through `useUser`.

## Figma Design Reference (only if referenced)

N/A — this feature has no UI of its own.

## Possible Edge Cases

- Auth listener fires before the component tree is ready — loading state must be initialised before the first render.
- User is signed in on one tab and signs out on another — the realtime listener should reflect the change without a page reload.
- Firebase (or auth provider) SDK is not yet initialised when the listener is registered — initialisation order must be guaranteed.
- `useUser` is called outside of the `AuthProvider` tree — should throw a clear, descriptive error rather than silently returning undefined.
- Network offline on initial load — the auth listener may not resolve; the loading state should not block the UI indefinitely.

## Acceptance Criteria

- `useUser()` returns `null` when no user is authenticated and a user object when authenticated.
- `useUser()` can be called from any Client Component without additional setup.
- Calling `useUser()` outside of `AuthProvider` throws a descriptive error.
- The auth listener is registered once per app session and cleaned up correctly when the provider unmounts.
- A loading/pending state is available so consumers can conditionally render while auth status is resolving.
- The landing page routing logic (to `/heists` when logged in, to `/login` when not) is implemented using `useUser`.
- Dashboard pages use `useUser` to access the current user's identity where user-specific labels appear.
- No additional calls to the Firebase auth SDK are scattered across components.

## Open Questions

- Which user fields does the app need from the auth provider (uid, email, displayName, photoURL)? uid, email, displayName,
- Should the context expose the raw provider user object or a mapped subset? no
- Should a loading state cause a full-page spinner, a skeleton, or simply suppress rendering until resolved? yes
- Are there Server Components that need access to the current user (e.g. for data fetching)? If so, a server-side session helper may be needed alongside the client-side hook. yes
- Should unauthenticated users hitting dashboard routes be automatically redirected to `/login`? (This is a guard, not login flow — clarify scope.) yes

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` returns `null` when no user is present in the context.
- `useUser` returns the user object when a user is present in the context.
- `useUser` throws when called outside of `AuthProvider`.
- The `AuthProvider` renders children correctly.
- The loading state is `true` before the auth listener resolves and `false` afterwards.
