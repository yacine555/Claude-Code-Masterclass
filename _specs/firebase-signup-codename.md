# Spec for firebase-signup-codename

branch: claude/feature/firebase-signup-codename
figma_component (if used): N/A

## Summary

Wire the existing `AuthForm` component to Firebase Authentication for the signup flow. On successful account creation, generate a random PascalCase codename from three word sets and set it as the user's `displayName`. Also create a corresponding document in the Firestore `users` collection containing the user's `id` and `codename` — no email stored.

## Functional Requirements

- When `AuthForm` is rendered in `mode="signup"` and submitted with valid credentials, call Firebase Auth's `createUserWithEmailAndPassword` using the `auth` export from `lib/firebase.ts`.
- After a successful account creation, generate a random codename by selecting one word from each of three distinct word sets and joining them in PascalCase (e.g. `SilentCrimsonFox`).
- Update the newly created user's Firebase Auth profile by setting `displayName` to the generated codename.
- Create a new document in the Firestore `users` collection (using the `db` export from `lib/firebase.ts`) containing:
  - `id` — the Firebase Auth user UID
  - `codename` — the generated display name
  - Do **not** store the user's email.
- While the signup request is in flight, the submit button should be disabled to prevent double submissions.
- On a successful signup, redirect the user to the `/heists` dashboard route.
- On failure, display a clear, user-friendly error message inside the form (e.g. "This email is already in use." for `auth/email-already-in-use`).

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- Email already registered in Firebase → surface a friendly error, do not crash.
- Weak password rejected by Firebase (e.g. too short) → surface the Firebase error message.
- Network failure mid-request → show a generic error and re-enable the submit button.
- `updateProfile` or Firestore write fails after the Auth account is created → the user exists in Auth but may lack a codename; the error should be caught and surfaced without breaking the app.
- Codename generation should never produce duplicates within a single session (each word set must have enough unique entries to make collisions negligible).
- The three word sets must each be distinct categories so combinations feel meaningful (e.g. adjective + colour + animal).

## Acceptance Criteria

- Submitting the signup form with a valid email and password creates a new Firebase Auth user.
- The created user's `displayName` in Firebase Auth is set to a PascalCase codename composed of one word from each of the three word sets.
- A document exists in the `users` Firestore collection with fields `id` (matching the Firebase UID) and `codename` (matching the Auth `displayName`). No email field is present.
- The form submit button is disabled while the request is pending.
- A successful signup redirects the user to `/heists`.
- Firebase errors (duplicate email, weak password, network error) are displayed to the user in the form without a page crash.
- No email address is written to Firestore at any point.

## Open Questions

- Should the codename be re-rolled if it already exists in the `users` collection, or is collision probability considered low enough to skip the uniqueness check? Yes
- Where should word sets live — inline in a utility module, or in a separate data file? seperate data file
- Should a failed `updateProfile` / Firestore write trigger a rollback (delete the Auth user), or is a silent retry sufficient? silent retry
- After signup, should the user land on a "welcome" screen that shows their generated codename before proceeding to `/heists`?  Yes

## Testing Guidelines

Create a test file(s) in the `./tests` folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Codename generator returns a string in valid PascalCase format composed of exactly three words (one from each set).
- Codename generator never returns the same word from two different sets in the same output.
- `AuthForm` in `mode="signup"`: submitting with valid credentials calls `createUserWithEmailAndPassword` with the correct email and password.
- On successful signup, `updateProfile` is called with a non-empty `displayName`.
- On successful signup, a Firestore document is written with `id` and `codename` but without an `email` field.
- The submit button is disabled while the async signup request is pending.
- A Firebase `auth/email-already-in-use` error results in a visible error message rendered in the form.
