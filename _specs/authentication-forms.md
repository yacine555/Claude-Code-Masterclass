# Spec for Authentication Forms

branch: claude/feature/authentication-forms

## Summary

Build authentication forms for the /login and /signup pages that allow users to enter their credentials (email and password) and submit them. The forms will be functional placeholders that log submission data to the console, enabling easy navigation between login and signup flows.

## Functional Requirements

- Display an email input field with appropriate label and validation
- Display a password input field with appropriate label
- Include a toggle icon to show/hide password text
- Provide a submit button with contextual text ("Log In" for login, "Sign Up" for signup)
- Log form submission data (email and password) to the browser console when submitted
- Provide clear navigation between /login and /signup pages
- Apply consistent styling and layout across both forms
- Use semantic HTML form elements with proper accessibility attributes

## Possible Edge Cases

- Empty form submission (no email or password entered)
- Invalid email format (missing @, no domain, etc.)
- Password visibility toggle state when switching between pages
- Form submission while already processing (prevent double-submit)
- Browser autofill behavior with password fields
- Tab navigation order through form fields
- Screen reader announcements for password visibility toggle

## Acceptance Criteria

- Login page displays a form with email field, password field with toggle, and "Log In" button
- Signup page displays a form with email field, password field with toggle, and "Sign Up" button
- Password toggle icon changes state (eye/eye-off) and reveals/hides password text
- Form submissions log email and password values to console in a readable format
- Navigation links allow switching between /login and /signup pages
- Forms follow existing application design patterns and styling conventions
- Forms are keyboard accessible (can tab through fields and submit with Enter)
- Password field uses type="password" when hidden and type="text" when visible

## Open Questions

- Should we add a "Remember me" checkbox on the login form? No
- Do we need password strength indicators on the signup form? No.
- Should there be minimum password length validation? yes. 8 charactes
- Do we want to show validation errors inline or as a summary? Yes
- Should navigation between login/signup preserve any entered data? No

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Form renders with all required fields and labels
- Password toggle button switches between hidden and visible states
- Password input type changes from "password" to "text" when toggle is clicked
- Form submission calls console.log with correct email and password values
- Submit button displays correct text based on page context (login vs signup)
- Navigation links between login and signup pages work correctly
- Form fields accept user input and update their values
