# Spec for navbar-logout-button

branch: claude/feature/navbar-logout-button
figma_component (if used): https://www.figma.com/design/cAed9tKpcu4kvERNwQlsUV/Page-Designs--Copy-?node-id=14-2

## Summary

Add a Logout button to the Navbar component that signs the authenticated user out of Firebase when clicked. The button is conditionally rendered — it only appears when a user is currently logged in. No redirect is required after logout.

## Functional Requirements

- The Navbar must read the current auth state from the existing `AuthContext` (via `useUser()`).
- When a user is authenticated, render a "Logout" button inside the Navbar.
- When no user is authenticated, the Logout button must not be rendered.
- Clicking the Logout button calls Firebase Auth's `signOut()` function.
- No redirect should occur after logout — the UI should simply update to reflect the signed-out state.

## Figma Design Reference

- File: https://www.figma.com/design/cAed9tKpcu4kvERNwQlsUV/Page-Designs--Copy-?node-id=14-2
- Component name: Navbar / Dashboard header
- Key visual constraints:
  - "Logout" button sits in the top-right area of the navbar, to the left of the "Create New Heist" button
  - Outlined button style — visible border, no solid fill, light/white text on dark background
  - Rounded corners consistent with the site's pill/rounded button aesthetic
  - Compact size — shorter in height than the filled CTA button beside it

## Possible Edge Cases

- `signOut()` throws a Firebase error — the UI should not crash; catch and silently ignore or log the error.
- The user is already signed out when they click — this should be a no-op (and the button won't be visible anyway due to the conditional render guard).
- Auth context is still loading (`loading === true`) — do not render the Logout button while auth state is indeterminate.

## Acceptance Criteria

- The Logout button is visible in the Navbar when `user` is non-null in `AuthContext`.
- The Logout button is not rendered when `user` is null or auth is still loading.
- Clicking the Logout button calls `signOut()` from Firebase Auth.
- After `signOut()` resolves, the button disappears (auth state updates via `onAuthStateChanged`).
- No page redirect happens on logout.

## Open Questions

- Should the button be disabled while the sign-out request is in flight to prevent double-clicks? Yes
- Should any visual feedback (spinner, label change) be shown while logout is pending? No

## Testing Guidelines

Create a test file in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Logout button is rendered when a user is present in AuthContext.
- Logout button is not rendered when `user` is null.
- Logout button is not rendered while auth is still loading.
- Clicking the Logout button calls `signOut()` exactly once.
