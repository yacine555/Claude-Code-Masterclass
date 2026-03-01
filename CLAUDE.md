# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comunication

- when reporting information to me, be extremely concise and sacrifice grammar for the sake of concision.


## Project Overview

Pocket Heist is a Next.js 16 application demonstrating modern React patterns with TypeScript. It's a learning project built with the App Router, featuring authentication flows and a dashboard interface for managing "heists."

## Plans

Make the plan extremely concise. Sacrifice grammar for the sake of concision.
At the end of each plan, give me a list of unresolved questions to answer, if any.

## Development Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Testing
npm test             # Run all Vitest tests
npm test -- Navbar   # Run specific test file matching "Navbar"

# Building & Production
npm run build        # Create production build
npm start            # Run production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Route Structure

The app uses Next.js App Router with **route groups** to organize pages by layout:

- **`(public)`** - Unauthenticated pages with minimal layout
  - Landing page (`/`)
  - `/login`, `/signup`, `/preview`
  - Wrapped in `app/(public)/layout.tsx` with `className="public"`

- **`(dashboard)`** - Authenticated pages with Navbar
  - `/heists` - List heists
  - `/heists/[id]` - View heist details (dynamic route)
  - `/heists/create` - Create new heist
  - Wrapped in `app/(dashboard)/layout.tsx` which includes Navbar component

Route groups (`(folder)`) don't affect URL structure but allow different layouts. The root `app/layout.tsx` provides global HTML structure.

### Component Organization

Components live in `components/[ComponentName]/`:
- `ComponentName.tsx` - Main component file
- `ComponentName.module.css` - CSS modules for scoped styling
- `index.ts` - Re-exports component for clean imports

Example: `import Navbar from "@/components/Navbar"` resolves via the index file.

### Path Aliases

- `@/*` maps to project root (configured in `tsconfig.json`)
- Used for imports: `import Navbar from "@/components/Navbar"`

### Testing Setup

- **Framework**: Vitest with React Testing Library
- **Environment**: jsdom for DOM simulation
- **Location**: Tests in `tests/` directory mirror `components/` structure
- **Globals**: Vitest globals enabled (no need to import `describe`, `it`, `expect`)
- **Setup**: `vitest.setup.ts` imports `@testing-library/jest-dom` matchers

## Tech Stack

- Next.js 16.0.7 (App Router)
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4 with PostCSS plugin
- Vitest 4 for testing
- lucide-react for icons
