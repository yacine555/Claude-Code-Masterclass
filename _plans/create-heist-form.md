# Plan: Create Heist Form

## Context

The `/heists/create` page is a placeholder. Need a form that writes a new heist doc to Firestore and redirects to `/heists`. Existing `CreateHeistInput` type defines the shape — notably `assignedTo` is a **single user**, not an array (spec said multi-select but we're matching the existing type).

## Files to Create

- `types/firestore/user.ts` — `UserDoc` interface + `userConverter`
- `components/CreateHeistForm/CreateHeistForm.tsx` — client component
- `components/CreateHeistForm/CreateHeistForm.module.css` — styles following AuthForm pattern
- `components/CreateHeistForm/index.ts` — re-export
- `tests/components/CreateHeistForm.test.tsx`

## Files to Modify

- `types/firestore/index.ts` — add `USERS: "users"` to COLLECTIONS, re-export user types
- `app/(dashboard)/heists/create/page.tsx` — render `<CreateHeistForm />`

## Implementation

### 1. Types & Constants

- Create `UserDoc { id: string; codename: string }` + `userConverter` in `types/firestore/user.ts`
- `toFirestore` takes `UserDoc` (not `Partial`) to avoid type issues with `withConverter`
- Add `USERS: "users"` to `COLLECTIONS`

### 2. CreateHeistForm Component

Follow AuthForm pattern (`components/AuthForm/AuthForm.tsx`).

**State:** title, description, assignedTo (uid), assignedToCodename, errors, isLoading, usersLoading, users[]

**On mount:** `getDocs` from `users` collection with `userConverter`, filter out current user, populate dropdown

**Validation:** title required, assignedTo required

**Submit:** build `CreateHeistInput`, `addDoc` to heists collection (skip converter — `CreateHeistInput` has `FieldValue` for deadline, converter expects `Partial<Heist>`), `serverTimestamp()` for deadline, `router.replace("/heists")`

**Form fields:**
- Title text input (required)
- Description textarea (optional, defaults to `""`)
- Assigned user `<select>` dropdown showing codenames (required)
- Submit button, disabled while loading

**Accessibility:** aria-invalid, aria-describedby, role="alert" for errors — same as AuthForm

### 3. Styles

CSS Module with `@reference "../../app/globals.css"`. Reuse AuthForm patterns: `.formGroup`, `.submitButton`. Add select + textarea styling matching input styles.

### 4. Page Update

Import and render `<CreateHeistForm />` inside existing wrapper divs in `page.tsx`.

### 5. Tests

Mock firebase/firestore (`getDocs`, `addDoc`, `collection`, `serverTimestamp`), next/navigation, AuthContext.

Test cases:
- Renders all form fields (title, description, select, submit)
- Populates dropdown from fetched users (excludes current user)
- Validation error on empty title
- Validation error on no user selected
- Calls `addDoc` with correct shape on valid submit
- Redirects to `/heists` after success
- Shows error on Firestore write failure

## Key Reusable Code

- `CreateHeistInput` from `types/firestore/heist.ts`
- `useUser()` from `contexts/AuthContext.tsx` — get uid + displayName (codename)
- `db` from `lib/firebase.ts`
- `COLLECTIONS` from `types/firestore/index.ts`
- AuthForm patterns for form structure, validation, CSS

## Verification

1. `npm test -- CreateHeistForm` — all tests pass
2. `npm run build` — no type errors
3. Manual: navigate to `/heists/create`, fill form, submit, verify doc in Firestore, verify redirect
