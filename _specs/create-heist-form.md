# Spec for create-heist-form

branch: feature/create-heist-form
figma_component (if used): N/A

## Summary

Build out the Create Heist form at `/heists/create`. On submission, a new document is written to the Firestore `heists` collection and the user is redirected to `/heists`. The form allows assigning the heist to one or more users, whose codenames and IDs are fetched from the Firestore `users` collection.

## Functional Requirements

- Form fields:
  - Heist name (text input, required)
  - Description (textarea, optional)
  - Assigned users (multi-select or checkbox list populated from `users` collection, showing codenames)
- On mount, fetch all documents from the `users` Firestore collection to populate the assignees list
- On submit:
  - Validate required fields (heist name must not be empty)
  - Write a new document to the `heists` Firestore collection with: name, description, array of assigned user IDs, createdAt timestamp, and the current user's ID as `createdBy`
  - Redirect to `/heists` on success
- Show a loading state while the form is submitting
- Show an error message if the Firestore write fails

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- `users` collection is empty — assignees list should render empty with a graceful message
- Firestore write fails — display error without losing form state
- User submits before `users` collection has loaded — disable submit or show loading indicator
- Duplicate heist names — not blocked at this stage (no uniqueness constraint required)
- Very long heist names or descriptions — no explicit length validation required unless Firestore limits are hit

## Acceptance Criteria

- Form renders at `/heists/create` with name, description, and assignees fields
- Assignees list is populated from the `users` Firestore collection (codename displayed, user ID stored)
- Submitting the form with a valid heist name creates a document in the `heists` collection
- Created document contains: `name`, `description`, `assignedUserIds[]`, `createdBy`, `createdAt`
- After successful write, user is redirected to `/heists`
- Submitting with an empty heist name shows a validation error and does not write to Firestore
- A Firestore write error is surfaced to the user

## Open Questions

- Should assigned users be a required field, or can a heist be created with no assignees? required
- What Firestore security rules govern writes to the `heists` collection — authenticated users only? Yes. only authenticated
- Should `createdAt` be a client-side timestamp or a Firestore server timestamp? a Firestore server timestamp

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Renders the form with name, description, and assignees fields
- Fetches users from Firestore and populates the assignees list
- Shows a validation error when heist name is empty on submit
- Calls Firestore `addDoc` with correct shape on valid submission
- Redirects to `/heists` after successful submission
- Shows error message when Firestore write throws
