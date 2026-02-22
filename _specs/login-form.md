# Spec for login-form

branch: claude/feature/login-form
figma_component (if used): N/A

## Summary

Wire up the existing login form in `AuthForm` (when `mode="login"`) to Firebase Authentication. When a user submits valid credentials, sign them in with Firebase and show an inline success message in place of the form. No redirect is needed — the success state is displayed on the same page.

## Functional Requirements

- When `mode="login"`, the form submit handler must call Firebase Auth's `signInWithEmailAndPassword` with the provided email and password.
- The submit button must be disabled and show a loading state while the Firebase request is in flight.
- On successful sign-in, replace the form with a success message (e.g. "You're logged in!").
- On failure, display an inline form-level error message. Do not clear the email/password fields.
- Existing client-side validation (required fields, email format, minimum password length) must still run before the Firebase call is made.

## Possible Edge Cases

- Wrong password — Firebase returns `auth/wrong-password` or `auth/invalid-credential`; show a user-friendly message.
- Email not registered — Firebase returns `auth/user-not-found`; show a user-friendly message.
- Too many failed attempts — Firebase returns `auth/too-many-requests`; surface an appropriate message.
- Network error — catch all unknown errors and show a generic fallback message.
- Double submission — the button is disabled while loading, so a second click should be a no-op.

## Acceptance Criteria

- Submitting the form with correct credentials signs the user in via Firebase.
- A success message is shown after a successful login; the form fields are no longer visible.
- Submitting with wrong credentials displays a relevant inline error message without navigating away.
- The submit button is disabled while the request is in flight.
- Existing field-level validation still triggers correctly before any Firebase call.
- No page redirect occurs after login.

## Open Questions

- Should the success message include the user's codename/display name? (e.g. "Welcome back, Agent Falcon!")
- Should the success state persist if the user navigates back to `/login`, or should it reset?

## Testing Guidelines

Create a test file in the `./tests` folder for the `AuthForm` component in login mode, covering the following cases, without going too heavy:

- Submitting valid credentials calls `signInWithEmailAndPassword` exactly once.
- A success message is shown after a successful sign-in.
- A Firebase `auth/invalid-credential` error displays an inline error message.
- A generic/unknown Firebase error displays a fallback error message.
- The submit button is disabled while the request is in flight.
- Existing validation still prevents submission when email or password fields are empty.
