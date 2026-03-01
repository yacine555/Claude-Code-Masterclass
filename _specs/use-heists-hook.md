# Spec for use-heists-hook

branch: feature/use-heists-hook
figma_component (if used): N/A

## Summary

Create a `useHeists` custom React hook that subscribes to real-time Firestore data from the `heists` collection. The hook accepts a mode argument (`'active'`, `'assigned'`, or `'expired'`) and returns a filtered array of `Heist` objects based on the current user and deadline state. Once built, the hook will be used on the `/heists` dashboard page to display heist titles across the three result sets.

## Functional Requirements

- Hook signature: `useHeists(mode: 'active' | 'assigned' | 'expired'): Heist[]`
- Uses a Firestore real-time listener (`onSnapshot`) — not a one-time fetch
- Returns a `Heist[]` array, initially empty while loading
- Query behaviour per mode:
  - `'active'`: heists where `assignedTo === currentUser.uid` AND `deadline > now`
  - `'assigned'`: heists where `createdBy === currentUser.uid` AND `deadline > now`
  - `'expired'`: heists where `deadline <= now` AND `finalStatus !== null` (regardless of user)
- Listener is cleaned up (`unsubscribe`) when the component unmounts or mode changes
- Hook should also return a `loading` boolean (true until first snapshot fires)
- Hook should return an `error` value (null or Error) if the snapshot fails
- On the `/heists` page, use `useHeists` three times (once per mode) to render only the `title` field of each result set under the existing section headings

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- No heists match the query — return empty array, no error
- User is not authenticated when hook runs — should not fire a query; return empty array
- `deadline` field stored as a Firestore Timestamp — must be converted to `Date` for comparison (already handled by `heistConverter`)
- Mode argument changes at runtime — old listener must be torn down and new one set up
- Firestore query requires a composite index on `assignedTo` + `deadline` and `createdBy` + `deadline` — may need to be created in Firebase console
- `finalStatus !== null` cannot be expressed as a single Firestore `where` clause — filter client-side after querying `deadline <= now`

## Acceptance Criteria

- `useHeists('active')` returns only heists assigned to the current user with a future deadline, updated in real time
- `useHeists('assigned')` returns only heists created by the current user with a future deadline, updated in real time
- `useHeists('expired')` returns only heists with a past deadline and a non-null `finalStatus`, updated in real time
- All three modes clean up their Firestore listeners on unmount
- `/heists` page renders a list of titles under each of the three section headings using the hook
- Loading state is exposed and can be used to defer rendering
- An error state is exposed if the snapshot subscription fails

## Open Questions

- None at this time.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Returns empty array before snapshot fires (loading state)
- Returns correct heists for `'active'` mode (filters by assignedTo and future deadline)
- Returns correct heists for `'assigned'` mode (filters by createdBy and future deadline)
- Returns correct heists for `'expired'` mode (filters by past deadline and non-null finalStatus)
- Cleans up the Firestore listener on unmount
- Returns error state when the snapshot subscription fails
- `/heists` page renders heist titles under each section heading
