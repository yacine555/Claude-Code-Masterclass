# Spec for route-protection

branch: claude/feature/route-protection
figma_component (if used): N/A

## Summary

Add route protection to both layout groups so that unauthenticated users cannot access dashboard pages and authenticated users are not shown public auth pages. While Firebase resolves the current auth state, both layouts display a simple loading indicator to prevent a flash of the wrong content before any redirect fires.

## Functional Requirements

- The `(public)` group layout must redirect authenticated users away (to `/heists`) using the `useUser` hook.
- The `(dashboard)` group layout must redirect unauthenticated users away (to `/login`) using the `useUser` hook.
- While the auth state is still loading (i.e. `useUser` has not yet resolved), both layouts must render a minimal loader in place of the page content.
- Once auth state is resolved, the redirect (if needed) must fire before the protected content is rendered.
- No page content should be visible to the wrong audience, even briefly.

## Possible Edge Cases

- Firebase takes longer than expected to resolve auth state — the loader must stay visible until resolution, not just for a fixed timeout.
- A user manually navigates to `/login` while already signed in — they should be redirected to `/heists`.
- A user's session expires mid-session — the dashboard layout should detect the change and redirect to `/login`.
- The `useUser` hook returns an error state — treat as unauthenticated and redirect to `/login` from dashboard routes.

## Acceptance Criteria

- Visiting any `(dashboard)` route while unauthenticated redirects to `/login`.
- Visiting any `(public)` auth route (e.g. `/login`, `/signup`) while authenticated redirects to `/heists`.
- A loading state is visible in both layout groups while auth status is unresolved.
- No protected page content is rendered before the redirect fires.
- The landing page (`/`) is exempt — it lives in `(public)` but should be accessible to everyone.

## Open Questions

- Should the landing page (`/`) redirect authenticated users to `/heists`, or remain accessible to all?
- What should the loader look like — a spinner, a skeleton, or just a blank screen with a small indicator?
- Should the redirect destination for authenticated users coming from a public page always be `/heists`, or should it respect a `?redirect=` query param?

## Testing Guidelines

Create test files in the `./tests` folder covering the following cases, without going too heavy:

- `(dashboard)` layout renders its children when user is authenticated
- `(dashboard)` layout redirects to `/login` when user is unauthenticated
- `(dashboard)` layout shows a loader while auth state is loading
- `(public)` layout renders its children when user is unauthenticated
- `(public)` layout redirects to `/heists` when user is authenticated
- `(public)` layout shows a loader while auth state is loading
