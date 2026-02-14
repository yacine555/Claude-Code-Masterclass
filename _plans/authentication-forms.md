# Implementation Plan: Authentication Forms

## Context

The /login and /signup pages currently only display titles without any form functionality. This feature adds complete authentication forms with email/password inputs, validation, password visibility toggle, and console logging of submissions. The forms should provide a consistent user experience with inline validation, keyboard accessibility, and easy navigation between login and signup flows.

This is a foundational UI component that establishes patterns for form handling across the application.

## Approach

Create a single reusable `AuthForm` component that both pages will use, with a `mode` prop to differentiate between login and signup behavior. This approach ensures consistency, avoids code duplication, and follows the established component pattern in the codebase.

## Component Architecture

**Single reusable component** (`AuthForm`) with mode-based rendering:
- **Rationale**: Both forms have identical structure (email, password, submit). Only differences are button text and navigation links.
- **Props**: `mode: 'login' | 'signup'`
- **No extracted Input/Button components**: Keep implementation simple as these are the only forms currently. Can extract later if needed.

## Critical Files

### New Files to Create

1. **`components/AuthForm/AuthForm.tsx`** - Main form component
   - Controlled inputs with React state (email, password, showPassword)
   - Inline validation (email format, 8-char password minimum)
   - Password toggle using Eye/EyeOff icons from lucide-react
   - Form submission handler that logs to console
   - Navigation links to switch between pages

2. **`components/AuthForm/AuthForm.module.css`** - Component styles
   - CSS modules with `@reference "../../app/globals.css"`
   - Use theme colors: `var(--color-primary)`, `var(--color-error)`, `var(--color-light)`
   - Follow Tailwind's `@apply` pattern from existing components
   - Focus states, error states, hover states for interactive elements

3. **`components/AuthForm/index.ts`** - Re-export
   ```typescript
   export { default } from "./AuthForm"
   ```

4. **`tests/components/AuthForm.test.tsx`** - Test suite
   - Use `@testing-library/react` and `@testing-library/user-event`
   - Test rendering, validation, password toggle, submission, navigation
   - Mock console.log to verify logging behavior

### Files to Modify

5. **`app/(public)/login/page.tsx`**
   - Import and render `<AuthForm mode="login" />`
   - Keep existing title and layout structure

6. **`app/(public)/signup/page.tsx`**
   - Import and render `<AuthForm mode="signup" />`
   - Fix title: "Signup" → "Sign up"
   - Keep existing layout structure

## Implementation Details

### State Management (AuthForm.tsx)

```typescript
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [emailError, setEmailError] = useState('')
const [passwordError, setPasswordError] = useState('')
```

### Validation Logic

- **Email validation**: Basic regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` on blur and submit
- **Password validation**: Minimum 8 characters on blur and submit
- **Empty submission prevention**: Block submit if fields are empty or invalid
- **Inline error display**: Show errors below each field with `role="alert"`

### Password Toggle Implementation

- Boolean state: `showPassword`
- Conditional input type: `type={showPassword ? "text" : "password"}`
- Toggle button with lucide-react icons:
  - `{showPassword ? <EyeOff /> : <Eye />}`
  - Position absolutely in password field wrapper
  - `aria-label={showPassword ? "Hide password" : "Show password"}`

### Form Structure

```tsx
<form onSubmit={handleSubmit}>
  <div className={styles.formGroup}>
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={validateEmailField}
      aria-invalid={!!emailError}
      aria-describedby={emailError ? "email-error" : undefined}
    />
    {emailError && <span id="email-error" role="alert">{emailError}</span>}
  </div>

  <div className={styles.formGroup}>
    <label htmlFor="password">Password</label>
    <div className={styles.passwordWrapper}>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={validatePasswordField}
        aria-invalid={!!passwordError}
        aria-describedby={passwordError ? "password-error" : undefined}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className={styles.toggleButton}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {passwordError && <span id="password-error" role="alert">{passwordError}</span>}
  </div>

  <button type="submit">
    {mode === 'login' ? 'Log In' : 'Sign Up'}
  </button>

  <p className={styles.navLink}>
    {mode === 'login' ? (
      <>Don't have an account? <Link href="/signup">Sign up</Link></>
    ) : (
      <>Already have an account? <Link href="/login">Log in</Link></>
    )}
  </p>
</form>
```

### Submission Handler

```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault()

  // Validate both fields
  const emailValid = validateEmail(email)
  const passwordValid = validatePassword(password)

  // Prevent empty submission
  if (!email || !password) {
    if (!email) setEmailError('Email is required')
    if (!password) setPasswordError('Password is required')
    return
  }

  // Prevent invalid submission
  if (!emailValid || !passwordValid) {
    return
  }

  // Log to console
  console.log({
    email,
    password,
    mode
  })
}
```

### Styling Patterns (AuthForm.module.css)

Follow established patterns from Navbar.module.css:

```css
@reference "../../app/globals.css";

.formGroup {
  @apply mb-4 flex flex-col gap-2;
}

.formGroup label {
  @apply text-sm font-semibold text-heading;
}

.formGroup input {
  @apply px-4 py-3 bg-light border border-lighter rounded-md text-heading;
  @apply focus:outline-none focus:border-primary transition-colors;
}

.formGroup input[aria-invalid="true"] {
  border-color: var(--color-error);
}

.passwordWrapper {
  @apply relative flex items-center;
}

.passwordWrapper input {
  @apply flex-1 pr-12;
}

.toggleButton {
  @apply absolute right-3 text-body hover:text-heading transition-colors;
  @apply focus:outline-none focus:text-primary;
  background: none;
  border: none;
  cursor: pointer;
}

.formGroup span[role="alert"] {
  @apply text-sm;
  color: var(--color-error);
}

form button[type="submit"] {
  @apply w-full py-3 font-semibold rounded-md transition-colors;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  background-color: var(--color-primary);
  color: var(--color-heading);
}

form button[type="submit"]:hover:not(:disabled) {
  background-color: var(--color-secondary);
}

.navLink {
  @apply text-center text-sm mt-4;
  color: var(--color-body);
}

.navLink a {
  @apply transition-colors underline;
  color: var(--color-primary);
}

.navLink a:hover {
  color: var(--color-secondary);
}
```

## Accessibility Features

- **Semantic HTML**: Proper `<form>`, `<label>`, and `<input>` elements with id associations
- **ARIA attributes**:
  - `aria-invalid` on inputs with validation errors
  - `aria-describedby` linking inputs to error messages
  - `aria-label` on password toggle button for screen readers
  - `role="alert"` on error messages for immediate announcement
- **Keyboard navigation**:
  - Natural tab order: email → password → toggle → submit
  - Enter key submits form from any input
  - Focus styles on all interactive elements
- **Screen reader friendly**:
  - Labels properly associated with inputs via htmlFor/id
  - Error messages announced immediately via role="alert"
  - Toggle button state changes announced

## Testing Strategy

Create `tests/components/AuthForm.test.tsx` with the following test cases:

### Rendering Tests
- Form renders with all required fields (email, password, submit button)
- Submit button shows "Log In" for login mode
- Submit button shows "Sign Up" for signup mode
- Labels are properly associated with inputs

### Password Toggle Tests
- Password input type is "password" by default
- Clicking toggle button changes input type to "text"
- Clicking toggle again changes back to "password"
- Eye icon changes to EyeOff when password is visible
- Toggle button has accessible aria-label

### Input Tests
- Email field accepts and updates user input
- Password field accepts and updates user input

### Validation Tests
- Shows error for invalid email format on blur
- Shows error for password less than 8 characters on blur
- Prevents submission when email is empty
- Prevents submission when password is empty
- Prevents submission when email is invalid
- Prevents submission when password is too short
- Clears errors when valid input is provided

### Submission Tests
- Logs email and password to console on valid submission
- Console.log receives correct email value
- Console.log receives correct password value
- Does not log when validation fails

### Navigation Tests
- Login mode renders "Sign up" link to /signup
- Signup mode renders "Log in" link to /login
- Links have correct href attributes

### Accessibility Tests
- Can tab through all form fields in correct order
- Submit button is keyboard accessible
- Error messages have role="alert"
- Inputs have aria-invalid when errors present

**Testing utilities**:
- `@testing-library/react` for rendering
- `@testing-library/user-event` for interactions (typing, clicking)
- `vi.spyOn(console, 'log')` to mock and verify console output
- `screen.getByRole()` for accessibility-first queries
- `screen.getByLabelText()` for form field queries

## Edge Cases Handled

1. **Empty form submission**: Validation displays error messages and prevents submission
2. **Invalid email format**: Regex validation shows inline error on blur and submit
3. **Password too short**: Length check shows inline error on blur and submit
4. **Browser autofill**: Native input behavior works naturally with controlled inputs
5. **Tab navigation**: Semantic HTML ensures proper keyboard order
6. **Screen reader support**: ARIA attributes ensure errors and states are announced
7. **Password state persistence**: Each page remounts the component, so no state carries over (per spec requirement)

## Implementation Sequence

1. Create `components/AuthForm/` directory structure
2. Implement `AuthForm.tsx` with state, validation, and form logic
3. Create `AuthForm.module.css` with styling following existing patterns
4. Create `index.ts` re-export file
5. Update `app/(public)/login/page.tsx` to use AuthForm
6. Update `app/(public)/signup/page.tsx` to use AuthForm and fix title
7. Create `tests/components/AuthForm.test.tsx` with comprehensive test suite
8. Run tests: `npm test -- AuthForm`
9. Manual browser testing for visual polish and edge cases

## Verification Steps

After implementation:

1. **Run tests**: `npm test -- AuthForm` - All tests should pass
2. **Start dev server**: `npm run dev`
3. **Test /login page**:
   - Form renders with email, password, submit button
   - Password toggle works (Eye/EyeOff icons change)
   - Empty submission shows inline errors
   - Invalid email shows error on blur
   - Password < 8 chars shows error on blur
   - Valid submission logs to console
   - "Sign up" link navigates to /signup
4. **Test /signup page**:
   - Form renders with same functionality
   - Submit button says "Sign Up"
   - Valid submission logs to console
   - "Log in" link navigates to /login
5. **Test keyboard navigation**:
   - Tab through all fields in correct order
   - Enter key submits form from input fields
   - All interactive elements have visible focus states
6. **Test accessibility**:
   - Screen reader announces labels and errors
   - ARIA attributes are present (inspect DevTools)
   - Error messages use role="alert"

## Reusable Patterns for Future Components

This implementation establishes patterns that can be reused:
- Form component structure with controlled inputs
- Inline validation approach
- CSS module styling with theme colors
- Accessibility-first testing with RTL
- Icon usage from lucide-react
- Error state handling and display
