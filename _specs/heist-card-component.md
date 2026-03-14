# Spec for heist-card-component

branch: feature/heist-card-component
figma_component (if used): Heist Card — node-id=14-2

## Summary
Add a `HeistCard` component to display individual heist data, shown in a 3-column grid on the `/heists` page. Only active and assigned heists are displayed; expired heists are filtered out. Card titles link to `/heists/:id`. A `HeistCardSkeleton` component mirrors the card layout for loading states.

## Functional Requirements
- Render a card for each heist with status `active` or `assigned`
- Filter out heists with status `expired` before rendering
- Heist title is a clickable link to `/heists/[id]`
- Do not add any content to the `/heists/[id]` page
- Display cards in a responsive 3-column grid layout on the `/heists` page
- Create a `HeistCardSkeleton` component that matches the card dimensions/layout for use while data loads

## Figma Design Reference
- File: https://www.figma.com/design/cAed9tKpcu4kvERNwQlsUV/Page-Designs--Copy-?node-id=14-2
- Component name: Heist Card (node-id: 14-2)
- Key visual constraints: Design reference could not be retrieved. See Figma manually for details.

## Possible Edge Cases
- No heists returned (empty state — show appropriate empty message)
- All heists are expired (same empty state)
- Very long heist titles should truncate or wrap gracefully
- Loading state before data is fetched (skeleton grid)

## Acceptance Criteria
- `HeistCard` renders heist title, and any other visible fields from the data model
- Heist title links to `/heists/[id]`
- `/heists` page filters to only active/assigned heists
- Expired heists are not visible in the list
- `/heists` page shows `HeistCardSkeleton` components in a 3-column grid while loading
- `HeistCardSkeleton` matches the card's approximate size/shape
- Grid layout is 3 columns

## Open Questions
- What heist fields should the card display beyond the title? (e.g. status, reward, date, assignee) the codename of the creator, the codename of the assignee, the due date
- Should the empty state (no active/assigned heists) have a specific CTA or message? no, do not display

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `HeistCard` renders the title as a link to `/heists/[id]`
- `HeistCard` displays key heist fields correctly
- `/heists` page filters out expired heists and only shows active/assigned
- `HeistCardSkeleton` renders without errors
