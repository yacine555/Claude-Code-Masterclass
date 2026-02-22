# Plan: Login Form Authentication

## Context

The `AuthForm` component supports both `login` and `signup` modes, but the login path is a stub — it currently only calls `console.log` with the credentials instead of signing the user in. The spec requires wiring up Firebase's `signInWithEmailAndPassword`, showing an inline success message on success, and displaying user-friendly error messages on failure. No redirect is needed; the form is simply replaced by the success message.

---

## Files to Modify

### 1. `components/AuthForm/AuthForm.tsx`

**New import:**
- Add `signInWithEmailAndPassword` to the existing `firebase/auth` import line

**New state:**
- Add `const [success, setSuccess] = useState(false);`

**Replace the login stub** (`else { console.log(...) }`) with:
```
setIsLoading(true);
setFormError("");
try {
  await signInWithEmailAndPassword(auth, email, password);
  setSuccess(true);
} catch (err) {
  map code → user-friendly message:
    "auth/invalid-credential" | "auth/wrong-password" | "auth/user-not-found" → "Invalid email or password."
    "auth/too-many-requests" → "Too many failed attempts. Please try again later."
    anything else → "Something went wrong. Please try again."
  setIsLoading(false);
}
```
Note: `setIsLoading(false)` on success is unnecessary — the form unmounts when `success` is true.

**New conditional render** — add before `return (<form ...>)`:
```
if (success) {
  return <p role="status">You're logged in!</p>;
}
```

---

### 2. `tests/components/AuthForm.test.tsx`

The existing `firebase/auth` mock only covers signup functions. Extend it:

**Add to mock:** `signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "uid123" } })`

**Add top-level `beforeEach`:** `vi.clearAllMocks()` — prevents call history bleeding between tests

**Update stale "Submission" tests:**
- Replace "logs email and password to console" → check success message appears instead
- Remove "does not log to console for signup" — concept no longer applies
- Replace `consoleSpy` assertions in "prevents submission" tests → assert `signInWithEmailAndPassword` was not called

---

### 3. `tests/components/AuthForm.login.test.tsx` (new file)

Follow the pattern of `tests/components/AuthForm.signup.test.tsx`.

**Top-level mocks:** tracked `mockSignIn = vi.fn()` for `signInWithEmailAndPassword`, stubs for `firebase/firestore`, `@/lib/firebase`, `next/navigation`, `@/lib/codename`

**`beforeEach`:** `vi.clearAllMocks()`

**Tests (7):**
1. Valid credentials call `signInWithEmailAndPassword` exactly once with correct args
2. Success message (`role="status"`) is shown; form fields are gone
3. `auth/invalid-credential` → "Invalid email or password."
4. Unknown error → "Something went wrong. Please try again."
5. Submit button is disabled while request is in flight (deferred promise)
6. Empty email prevents sign-in; shows "Email is required"
7. Empty password prevents sign-in; shows "Password is required"

---

## Key Files for Reference

| File | Role |
|---|---|
| `components/AuthForm/AuthForm.tsx` | Component to modify — login stub at line ~106 |
| `lib/firebase.ts` | Exports `auth` instance |
| `tests/components/AuthForm.test.tsx` | Existing tests — mock and stale tests to update |
| `tests/components/AuthForm.signup.test.tsx` | Pattern reference for mock structure |

---

## Verification

1. Run `npm test -- AuthForm` — all tests across all 3 AuthForm test files must pass
2. Run `npm run dev`, navigate to `/login`
3. Submit with wrong credentials — confirm inline error message appears, no redirect
4. Submit with correct credentials — confirm form is replaced by success message
5. Confirm no page redirect occurs after login
