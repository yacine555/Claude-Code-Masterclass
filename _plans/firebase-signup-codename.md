# Plan: Firebase Signup with Random Codename

## Context

The `AuthForm` component currently only validates fields and logs to the console — it has no Firebase integration. This plan wires up the signup flow to Firebase Auth, adds a random PascalCase codename generator, stores a minimal user document in Firestore, and introduces a welcome screen that reveals the generated codename before redirecting to the dashboard.

Decisions from the spec:
- Word collision probability is treated as negligible (no uniqueness check against Firestore)
- Word sets live in a separate data file
- Failed `updateProfile` or Firestore write: silent (no rollback of the Auth account)
- A welcome screen showing the codename is required before `/heists`

---

## Files to Create

### 1. `lib/wordSets.ts`
Three exported arrays of strings — one per category. Categories must be distinct (e.g. adjectives, colors, animals). Each array should have ≥20 unique entries to keep collision probability negligible.

### 2. `lib/codename.ts`
Exports a single `generateCodename()` function:
- Picks one random entry from each of the three word arrays in `wordSets.ts`
- Capitalises the first letter of each word
- Joins them with no separator (PascalCase result, e.g. `SilentCrimsonFox`)

### 3. `app/(public)/welcome/page.tsx`
A **client component** (`"use client"`):
- Reads the `codename` query param via `useSearchParams()` from `next/navigation`
- Displays a welcome message with the codename prominently shown
- Renders a CTA button that calls `router.replace("/heists")` via `useRouter()`
- Lives in the `(public)` route group (no auth guard / Navbar)

---

## Files to Modify

### 4. `components/AuthForm/AuthForm.tsx`
Add signup-specific Firebase logic inside `handleSubmit` when `mode === "signup"`:

**New imports:**
- `createUserWithEmailAndPassword`, `updateProfile` from `firebase/auth`
- `setDoc`, `doc` from `firebase/firestore`
- `auth`, `db` from `@/lib/firebase`
- `generateCodename` from `@/lib/codename`
- `useRouter` from `next/navigation`

**New state:** `isLoading: boolean` (default `false`)

**handleSubmit flow (signup mode only):**
1. Set `isLoading = true`
2. Call `createUserWithEmailAndPassword(auth, email, password)`
3. Generate codename via `generateCodename()`
4. Call `updateProfile(userCredential.user, { displayName: codename })` — catch and ignore errors silently
5. Call `setDoc(doc(db, "users", userCredential.user.uid), { id: userCredential.user.uid, codename })` — catch and ignore errors silently
6. `router.replace(`/welcome?codename=${codename}`)``
7. On any Firebase error: map known codes to friendly messages, set `isLoading = false`
   - `auth/email-already-in-use` → "This email is already registered."
   - `auth/weak-password` → "Password is too weak."
   - Fallback → "Something went wrong. Please try again."

**Submit button:** add `disabled={isLoading}` attribute

---

## Tests to Create

### 5. `tests/lib/codename.test.ts`
- `generateCodename()` returns a non-empty string
- Result is valid PascalCase (first letter of each segment is uppercase, no spaces)
- Result is composed of exactly three capitalised words (each from its own set)
- Words from different sets are not the same (no set overlaps used in same output)

### 6. `tests/components/AuthForm.signup.test.tsx`
Mock strategy: `vi.mock("firebase/auth", ...)` and `vi.mock("firebase/firestore", ...)` following the existing pattern in `tests/components/AuthContext.test.tsx`.

Tests:
- Submitting with valid credentials calls `createUserWithEmailAndPassword` with the correct email and password
- On success, `updateProfile` is called with a non-empty `displayName`
- On success, `setDoc` is called with a document containing `id` and `codename` but **no** `email` field
- Submit button has `disabled` attribute while the async request is pending
- A `auth/email-already-in-use` Firebase error renders a visible error message in the form
- A generic Firebase error renders a visible fallback error message

---

## Verification

1. Run `npm test` — all existing tests must still pass, new tests must pass
2. Run `npm run dev`, navigate to `/signup`, submit with a fresh email/password
3. Confirm redirect lands on `/welcome?codename=<GeneratedName>` and the codename is displayed
4. Click the CTA — confirm redirect to `/heists`
5. In Firebase Console → Authentication: verify user exists with `displayName` set
6. In Firebase Console → Firestore → `users` collection: verify document has `id` and `codename`, no `email`
7. Try signing up with the same email again — confirm error message appears in the form
