# Figma Design Audit: AUCATZYL Know It ALL Trivia Challenge

**File:** Game Structure (Copy)
**Canvas:** Layouts for Handoff (node `611:7425`)
**Audit Date:** 2026-02-15
**Auditor:** Claude Code (Opus 4.6)

---

## STEP 1: AUDIT

---

### 1. High-Level Design Understanding

This is a **pharmaceutical trivia game** ("Know It ALL - The AUCATZYL Trivia Challenge") designed for a **landscape kiosk or tablet** deployment. Every screen is a split layout:

| Zone | Width | Content |
|------|-------|---------|
| Main game area | 1085 px | Interactive game content |
| ISI sidebar | 515 px | Required medical safety information |

**Total viewport: 1600 x 900 px** (16:9 widescreen).

---

### 2. Design Patterns & Screen Flow

The canvas contains the following screens, laid out left-to-right:

```
Screensaver Animation  ->  1.0 Screensaver  ->  1.1 INTRO (player entry, empty)
                                                   |
                                              1.2 Intro - Keyboard (iPad overlay)
                                              1.3 INTRO - filled (form filled)
                                                   |
                                              2 WARM UP ROUND (question)
                                                   |
                                    +--- 2 WARM UP CORRECT ---+
                                    |                         |
                                    +--- 2 WARM UP WRONG  ----+
                                                   |
                                              3 CATEGORY BOARD (Jeopardy-style grid)
                                                   |
                                              QUESTION (3 variants)
                                                   |
                                    +--- QUESTION - CORRECT ---+
                                    |                          |
                                    +--- QUESTION - WRONG  ----+
                                                   |
                                              WINNER
```

**Pattern:** Linear game flow with branching at answer states (correct / wrong), plus a Jeopardy-style category board for the main rounds.

**Identified UI patterns:**
- Split-panel layout (game + ISI) on every screen
- Centered hero text with gradient logo
- Fill-in-the-blank questions with multiple-choice answers (A/B/C)
- Pagination dots (3-dot indicator) on warm-up screens
- Jeopardy grid (4 categories x 4 point values)
- Bottom score tray with player names and points
- Form inputs with board selector (segmented control)

---

### 3. Structure & Layer Hierarchy

**Positive observations:**
- Top-level frames are named by screen state (e.g. "2 WARM UP CORRECT")
- A dedicated **"Components" section** (`624:5395`) exists with reusable instances
- Game ISI, Settings, and Know It ALL logo are proper components used as instances throughout

**Technical Debt - Non-semantic layer names:**

| Node ID | Current Name | Suggested Name |
|---------|-------------|----------------|
| `682:7032` | **Rectangle 51** | `Color Overlay` or `Background Tint` |
| `736:2877` | **Rectangle 51** | `Color Overlay` |
| `682:7035` | **Frame 109** | `Winner Content` or `Results Container` |
| `622:2757` | **Group 1** | `Page Section Divider` |
| `682:7039` | **Line 1** | `Divider` |
| `622:2755` | **Line 80** | `Section Rule` |

> **Screenshot reference:** See WINNER screen - the main content container holding congratulations text is called "Frame 109" and the green overlay is "Rectangle 51". These names convey no meaning to a developer.

**Technical Debt - Missing Auto Layout:**
- No Auto Layout detected on any main layout frame. All child elements use absolute positioning.
- The Category Board (`611:7515`) has 16 individual value cells manually positioned instead of using Auto Layout grid.
- The Scores component (`611:7438`) uses two manually positioned columns rather than Auto Layout with wrap.
- The Bottom Tray (`674:6881`) score bar uses absolutely positioned colored rectangles and text instead of a flex layout.

**Technical Debt - Deep nesting without structure:**
- The AUCATZYL logo inside Game ISI (`521:4797`) contains 4 nested Groups (`521:4798`, `521:4818`, `521:4841`, `521:4844`) with absolute percentage-based positioning. This should be a single flattened SVG asset.

---

### 4. Semantic Naming

**Score: PARTIAL**

**Good naming:**
- Screen frames: "1.1 INTRO", "2 WARM UP ROUND", "3 CATEGORY BOARD", "WINNER"
- Components: "Know It ALL", "Game ISI", "Settings", "Leaderboard Slot"
- Sub-elements: "Scores column", "ISI Section", "Black Box", "Boardselect", "SubnavItem"

**Bad naming (must fix):**
- `Rectangle 51` (appears twice: `682:7032`, `736:2877`)
- `Frame 109` (`682:7035`)
- `Group 1` (`622:2757`)
- `Line 1` (`682:7039`)
- `Line 80` (`622:2755`)
- Text nodes named by their content rather than role (e.g. `"89103"` instead of `"Placeholder Text"`)

---

### 5. Responsiveness

**Score: NOT RESPONSIVE**

- All screens are fixed at **1600 x 900 px**
- One alternate layout exists: "1.2 Intro - Keyboard" at **1366 x 1024 px** (iPad with on-screen keyboard), but this is an overlay composition, not a responsive breakpoint
- No Auto Layout, no constraints, no min/max widths
- No mobile or portrait-orientation variants

**Breakpoint logic:** Single fixed viewport. Designed for a specific kiosk/tablet display in landscape mode.

> **Screenshot reference:** The "1.2 Intro - Keyboard" screen shows the keyboard overlapping the game interface. The ISI sidebar is clipped at the right edge, suggesting no responsive handling - just a static overlay.

---

### 6. Variables & Design Tokens

**Defined variables (12 total):**

| Variable Name | Value | Usage |
|---------------|-------|-------|
| Brand Green | `#1C4C36` | Main area overlays, ISI headings |
| Orange | `#FF5100` | Buttons, CTA, score bars, wrong-answer highlights |
| Background/White | `#FFFFFF` | Form fields, ISI logo bg |
| Branded/Body Copy | `#404042` | Form borders |
| Dark Alt | `#939393` | - |
| Dark Ink | `#ffffff` | - |
| Dark Secondary | `#3f3f3f` | - |
| Dark Primary | `#646464` | - |
| Dark Action | `#d3d3d3` | - |
| Light Ink | `#000000` | - |
| Light Primary | `#ffffff` | - |
| Dark Background | `#FFFFFF, #000000` | Multi-value (ambiguous) |

**Hardcoded colors NOT in variables (critical gap):**

| Hex Value | Where Used | Suggested Variable Name |
|-----------|-----------|------------------------|
| `#F3CD24` | Logo gradient, title text, value text, answer highlights | `Gold / Brand Yellow` |
| `#F4F4F4` | ISI sidebar background | `Surface / ISI Background` |
| `#909092` | Scrollbar | `Neutral / Scrollbar` |
| `#A3A3A3` | Placeholder text in form fields | `Neutral / Placeholder` |
| `#091810` | Category board title cells background | `Dark Green / Category Header` |
| `rgba(28,76,54,0.6)` | Category board value cells | `Brand Green / 60% opacity` |

**Missing token categories:**
- **Spacing tokens:** None defined. Found values: 4, 8, 10, 12, 15, 16, 19, 20, 30, 40, 50, 60 px
- **Border radius tokens:** None defined. Found values: 15, 20, 40, 50, 60 px
- **Shadow tokens:** None defined. Found: `0px 4px 4px rgba(0,0,0,0.25)`, `0px 4px 50px rgba(0,0,0,0.25) inset`, `-10px 4px 14px rgba(0,0,0,0.45)` (text shadow)
- **Border tokens:** None defined. Found: `2px solid black`, `1px solid #404042`, `2px solid #F3CD24`

---

### 7. Typography System

**Fonts used:**

| Font Family | Weights | Usage |
|-------------|---------|-------|
| **DIN Next LT Pro** | Heavy, Bold, Medium, Regular | Primary font: logo, headings, body copy, UI elements |
| **Inter** | Bold, Regular | Secondary: ISI "Warnings and Precautions" section |
| **Noto Sans** | Regular | Fallback for Inter in ISI body text |

**Font size inventory:**

| Size | Usage | On 4px grid? |
|------|-------|-------------|
| 235px | Logo "Know It ALL" (large variant) | No (but display size, acceptable) |
| 160px | Logo "Know It ALL" (medium variant) | Yes |
| 115px | Category board point values | No |
| 60px | Winner congratulations text | Yes |
| 45px | "YOU ARE A REAL" text | No |
| 40px | "The AUCATZYL Trivia Challenge" subtitle | Yes |
| 30px | Bottom tray player names/scores | No (use 32px) |
| 25px | Category board title text | No (use 24px) |
| 23px | Board selector tab text, form field text | No (use 24px) |
| 19px | ISI body text, form labels | No (use 20px) |
| 16px | SubnavItem text | Yes |

**Offline font availability:**
- **DIN Next LT Pro:** Commercial font (Linotype). Requires a web font license purchase. **Cannot be used offline without self-hosting the WOFF2 files.**
- **Inter:** Open source (Google Fonts). Can be self-hosted for offline.
- **Noto Sans:** Open source (Google Fonts). Can be self-hosted for offline.

**Typography inconsistency within Game ISI component:**
- ISI sections "Indication" and "Important Safety Information" use **DIN Next LT Pro Bold/Regular**
- But "Warnings and Precautions" header switches to **Inter Bold** (`521:4888`)
- And its body text switches to **Inter Regular / Noto Sans Regular** (`521:4889`)
- This mixed-font approach within a single component creates inconsistency

---

### 8. Component Inventory

**Properly componentized:**

| Component | Node(s) | Variants | Properties |
|-----------|---------|----------|------------|
| Know It ALL (Logo) | `622:2758`, `622:2765` | 2 sizes: 848x468, 1316x468 | None exposed |
| Game ISI | `521:4893` | 1 (default) | None exposed |
| Settings | `521:5505` | 1 (default) | None exposed |
| Leaderboard Slot | (source not in canvas) | 1 | Player name, score |
| Scores | `2002:5512` | 1 | None exposed |
| iPad Keyboard | `611:8905` | 1 | None exposed |

**NOT componentized (should be):**

| Element | Location | Why it needs componentization |
|---------|----------|------------------------------|
| **Form Field** | `798:2754`, `798:2756` | Repeated twice on intro, needs states (empty, filled, error, focused) |
| **CTA Button** | `798:2766` | Appears on intro + warm-up wrong. Needs default/hover/active/disabled variants |
| **Board Selector Tab** (SubnavItem) | `798:2760-2764` | 3 instances with selected/unselected states. Should be a component with variant property |
| **Category Title Cell** | `611:7519-7526` | 4 identical structures with different text |
| **Category Value Cell** | `611:7528-7562` | 16 identical structures with different point values |
| **Bottom Score Tray** | `674:6881` | Repeated on category board and question screens |
| **Answer Option** | (in question screens) | A/B/C options with default/selected/correct/wrong states |
| **Pagination Dots** | (in warm-up screens) | 3-dot indicator, active/inactive state |
| **"TRY AGAIN!" Button** | (in warm-up wrong screen) | CTA variant |

---

### 9. Pixel Precision Errors

**Fractional / non-rounded pixel values found:**

| Node ID | Layer Name | Problematic Value | Fix |
|---------|-----------|-------------------|-----|
| `611:7435` | MAIN IMAGE | width: `1409.9482421875` | Round to `1410` |
| `611:7435` | MAIN IMAGE | height: `1074.6724853515625` | Round to `1075` |
| `611:7439` | Scores column | width: `484.5` | Round to `485` or use Auto Layout |
| `611:8905` | iPad Keyboard | height: `472.3680725097656` | Round to `472` |
| `611:8905` | iPad Keyboard | y: `-2.84e-14` (floating point error) | Set to `0` |
| `682:7035` | Frame 109 | height: `519.5` | Round to `520` |
| `622:2766` | Know It ALL | width: `1316.302734375` | Round to `1316` |
| `682:7036` | "YOU ARE A REAL" | x: `284.595703125`, y: `189.525390625` | Round to `285, 190` |
| `682:7036` | "YOU ARE A REAL" | width: `459.80859375` | Round to `460` |
| `682:7039` | Line 1 | y: `115.525390625` | Round to `116` |
| `798:2752` | Line | width: `803.5000000000052` | Round to `804` |
| `798:2752` | Line | height: `0.00012999766818211356` | Set to `0` (or use border) |

**Inconsistent sibling dimensions in Category Board:**

| Layer | Width Issue |
|-------|-----------|
| TITLES row cells | 271, 271, **272**, 271 px |
| VALUES row 1 container | 1081 px |
| VALUES row 2 container | 1083 px |
| VALUES row 3 container | **1280** px |
| VALUES row 4 container | **1280** px |
| Individual value cells | 270, 271, 270, 271, **272** (inconsistent) |

> **Screenshot reference:** The Category Board has cells with 1px width differences. Rows 3 and 4 have container widths of 1280px vs 1081/1083px for rows 1 and 2. This will cause alignment bugs in implementation.

---

### 10. Annotations

**Score: NONE**

No annotations or developer notes were found anywhere in the design. The following are missing:

- No interaction state descriptions (hover, focus, active, disabled for any element)
- No animation/transition specifications (screensaver animation, page transitions, answer reveal)
- No spacing callouts between elements
- No accessibility notes (ARIA labels, focus order, screen reader behavior)
- No content-dynamic behavior notes (e.g., "question text wraps to N lines max")
- No error-state designs (e.g., what happens if player name field is empty?)
- No timer or countdown behavior for questions

---

### 11. Additional Observations

**Stray/orphaned elements on canvas:**
- Text node `622:4817` ("Press anywhere to continue") at y:1658 is outside any frame
- Instance `622:4818` (Game ISI) at y:-2594 is floating above all frames
- Instance `622:5111` (Game ISI) at y:-2498 is also floating

**Duplicate "QUESTION" frame names:**
- `622:5110` "QUESTION" at x:7055
- `658:6568` "QUESTION" at x:9095, y:-1813
- `674:6740` "QUESTION" at x:9095, y:791

Three frames share the identical name "QUESTION" with no differentiator. A developer cannot distinguish which is which.

**Game ISI sidebar width inconsistency:**
- On "Screensaver animation" (`611:7433`): ISI is **377px** wide
- On all other screens: ISI is **515px** wide
- On orphan instance `622:4818`: ISI is **534px** wide

**Duplicate Settings icon placement:**
- On "WINNER" screen: Settings appears twice (`682:7033` at x:1224 and `682:7043` at x:1026)
- On "1.3 INTRO - filled": Settings appears twice (`736:2895` inside Main and `736:2899` outside)
- Only one should be visible per screen

**Color contrast concern:**
- Yellow text (`#F3CD24`) on green overlay (`#1C4C36` with hard-light blend) - contrast ratio needs verification for accessibility
- White text on semi-transparent green category cells - may fail WCAG AA at smaller sizes

---

## STEP 2: RECOMMENDATIONS

---

### Priority 1 - BLOCKING (must fix before handoff)

#### R1. Round all fractional pixel values
Every dimension listed in Section 9 must be snapped to whole integers. Fractional pixels cause sub-pixel rendering inconsistencies across browsers.

**Action:** Select each layer listed above, round x/y/w/h to nearest integer.

> **Illustrative screen: Screensaver Animation** - The MAIN IMAGE layer (`611:7435`) has dimensions `1409.95 x 1074.67` which should be `1410 x 1075`.

#### R2. Fix Category Board cell inconsistencies
The grid cells have 1-2px width variations and the container widths differ by row (1081 vs 1280px).

**Action:** Standardize all cells to 271px wide, all containers to 1084px wide. Better yet, rebuild using Auto Layout with equal distribution.

> **Illustrative screen: 3 CATEGORY BOARD** - Notice cells are 270-272px wide instead of uniform. Rows 3-4 containers overflow at 1280px.

#### R3. Add missing color variables
The most-used color in the design (`#F3CD24` gold/yellow) has no variable. Five other frequently used colors are also hardcoded.

**Action:** Create these variables: `Gold` (#F3CD24), `ISI Background` (#F4F4F4), `Dark Category Header` (#091810), `Placeholder` (#A3A3A3), `Scrollbar` (#909092). Apply them to all instances.

#### R4. Rename non-semantic layers
Replace all generic names with descriptive, role-based names as listed in Section 3.
https://help.figma.com/hc/en-us/articles/24004711129879-Rename-layers-with-AI

**Action:** Rename "Rectangle 51" -> "Color Overlay", "Frame 109" -> "Winner Results Container", "Group 1" -> "Section Divider", "Line 1" -> "Divider", "Line 80" -> "Section Rule".

#### R5. Deduplicate "QUESTION" frame names
Three frames named "QUESTION" make handoff ambiguous.

**Action:** Rename to: "4.1 QUESTION - Category", "4.2 QUESTION - Alternate A", "4.3 QUESTION - Alternate B" (or whatever the actual distinction is).

---

### Priority 2 - HIGH (strongly recommended)

#### R6. Componentize repeating elements
The form field, CTA button, board selector tab, category grid cell, answer option, pagination dots, and bottom score tray all appear multiple times but are not components.

**Action:** Create components with variants:
- `FormField`: default / filled / focused / error
- `Button`: default / hover / active / disabled
- `TabItem`: selected / unselected
- `CategoryCell`: title / value (with point value property)
- `AnswerOption`: default / selected / correct / wrong
- `PaginationDot`: active / inactive

#### R7. Apply Auto Layout to all major frames
No frames use Auto Layout. This makes responsive adjustments impossible and increases implementation ambiguity.

**Action:** Convert at minimum:
- Game ISI sidebar (vertical stack)
- Category Board grid (nested horizontal/vertical auto layout)
- Bottom Score Tray (horizontal distribution)
- Scores/Leaderboard (two-column auto layout)
- Form field row (horizontal auto layout with gap)

#### R8. Resolve font inconsistency in Game ISI
The ISI component mixes DIN Next LT Pro and Inter within the same block. This appears unintentional.

**Action:** Decide on a single font family for the ISI component. If the mixed fonts are intentional (e.g., legal requirement), document this with an annotation.

#### R9. Clean up stray elements
Three orphaned elements float outside any frame on the canvas.

**Action:** Delete or move into relevant frames:
- Text `622:4817` ("Press anywhere to continue")
- Instance `622:4818` (Game ISI at y:-2594)
- Instance `622:5111` (Game ISI at y:-2498)

#### R10. Remove duplicate Settings icons
WINNER and 1.3 INTRO screens each contain two Settings icons.

**Action:** Remove the extra instance from each screen (keep the one at x:1026, y:845 which is consistently positioned across other screens).

---

### Priority 3 - MEDIUM (improve quality)

#### R11. Add spacing and radius token collections
Create variable collections for:
- **Spacing:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 60 px
- **Radius:** sm(15), md(20), lg(40), pill(50), full(60) px
- **Shadows:** elevation-1, elevation-2, inset

#### R12. Normalize font sizes to a consistent scale
Replace off-grid sizes: 19 -> 20, 23 -> 24, 25 -> 24, 30 -> 32, 45 -> 48, 115 -> 112 or 120.

#### R13. Create Figma Text Styles
No text styles are defined. Create a type scale:
- `Display/Hero` (235px Heavy), `Display/Large` (160px Heavy)
- `Heading/XL` (60px Bold), `Heading/L` (48px Bold), `Heading/M` (40px Bold)
- `Body/L` (24px Regular), `Body/M` (20px Regular)
- `Label/L` (24px Bold), `Label/M` (20px Bold)
- `Caption` (16px Regular)

#### R14. Add developer annotations
Annotate each screen with:
- Interactive element states (hover, focus, active, disabled)
- Transition/animation notes (e.g., "screensaver loops", "answer reveal animation")
- Timer behavior on question screens
- Error states for form validation
- Keyboard navigation / focus order
- Accessibility requirements (contrast compliance, ARIA)

#### R15. Document font licensing
Add a note in the file or README specifying:
- DIN Next LT Pro requires a web font license from Monotype/Linotype
- Provide WOFF2 files for self-hosting (required for offline)
- Fallback stack recommendation: `'DIN Next LT Pro', 'Inter', system-ui, sans-serif`

#### R16. Standardize Game ISI sidebar width
The ISI appears at 377px, 515px, and 534px across different screens. Pick one width (515px appears most common) and apply it consistently.

---

## STEP 3: SUMMARY

---

### Strengths
- Clear screen flow organization with descriptive top-level frame names
- Core components (Know It ALL logo, Game ISI, Settings) are properly componentized and reused via instances
- Dedicated "Components" section exists on the canvas
- Color variables defined for core brand palette (Brand Green, Orange, White)
- Consistent split-panel layout pattern across all screens

### Critical Issues (must fix)
- 12+ layers have **fractional pixel values** (e.g., 1409.95px, 484.5px, 472.37px)
- Category Board has **inconsistent cell widths** (270-272px) and **mismatched row containers** (1081 vs 1280px)
- **6 colors used extensively but not in variables** (notably `#F3CD24` gold - the most visible color in the design)
- **6 layers have generic/default names** ("Rectangle 51", "Frame 109", "Group 1")
- **3 frames all named "QUESTION"** with no differentiation

### Structural Issues (high priority)
- **Zero Auto Layout usage** across the entire file - all layouts are absolute-positioned
- **9+ UI elements are not componentized** despite being used repeatedly (form fields, buttons, tabs, grid cells, answer options)
- **Font inconsistency** in Game ISI: mixes DIN Next LT Pro and Inter within the same component
- **3 orphaned elements** floating outside frames on the canvas
- **Duplicate Settings icons** on 2 screens (WINNER, 1.3 INTRO)
- **ISI sidebar width varies** (377px, 515px, 534px) across screens

### Design System Gaps (medium priority)
- No spacing tokens, radius tokens, or shadow tokens defined
- No Figma text styles created
- 7 font sizes are off the standard 4px/8px grid (19, 23, 25, 30, 45, 115px)
- DIN Next LT Pro (primary font) is commercial and requires license documentation
- No responsive breakpoints or adaptive layouts

### Missing for Handoff
- No annotations on any screen
- No interactive states designed (hover, focus, active, disabled)
- No animation/transition specifications
- No error states for forms
- No accessibility documentation (contrast, focus order, ARIA)
- No font delivery plan (WOFF2 files, licensing)

### Handoff Readiness: 4/10

**Current state:** Screens convey the visual intent clearly, but the file lacks the structural rigor (Auto Layout, complete token system, componentized UI elements, annotations) needed for an efficient handoff to either a human developer or an AI coding agent.

**Path to 8/10:** Complete all Priority 1 and Priority 2 recommendations.
**Path to 10/10:** Complete all recommendations including Priority 3.
