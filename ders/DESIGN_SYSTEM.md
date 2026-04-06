# Pharmaceutical Chemistry Study Platform - Design System

## Design Philosophy

- **Professional Medical Aesthetic**: Clean, modern, clinical feel. Dark sidebar with blue-slate accent. No gradients, no emojis.
- **Content-first**: Dense information with excellent readability. Typography hierarchy guides the eye.
- **Accessible**: WCAG 2.1 AA compliant. High contrast text, keyboard navigable. Focus rings on all interactive elements.
- **Responsive**: Desktop-first with seamless tablet/mobile adaptation. Touch-friendly targets.
- **Micro-interactions**: Subtle hover states, smooth transitions (150-300ms), card lift on hover.

## Color Palette (Blue-Slate Professional Theme)

```
Background:           hsl(210 20% 98%)       -- off-white with cool tint
Foreground:           hsl(222.2 84% 4.9%)    -- near-black
Card:                 hsl(0 0% 100%)         -- pure white
Card Foreground:      hsl(222.2 84% 4.9%)

Primary:              hsl(221.2 83.2% 53.3%) -- professional blue (trustworthy)
Primary Foreground:   hsl(210 40% 98%)       -- white on blue

Secondary:            hsl(210 40% 96.1%)     -- light blue-gray
Accent:               hsl(210 40% 96.1%)
Muted:                hsl(210 40% 96.1%)
Muted Foreground:     hsl(215.4 16.3% 46.9%)

Border:               hsl(214.3 31.8% 91.4%) -- soft blue-gray border
Ring:                 hsl(221.2 83.2% 53.3%) -- matches primary

Destructive:          hsl(0 72% 51%)         -- red (wrong answers)

-- Semantic Colors --
Success:              hsl(142 71% 45%)       -- green (correct answers)
Warning:              hsl(38 92% 50%)        -- amber (key points, important notes)
Info:                 hsl(217 91% 60%)       -- blue (informational callouts)
Exam:                 hsl(346 77% 50%)       -- rose-red (past exam markers)

-- Sidebar (Dark) --
Sidebar Background:   hsl(222.2 84% 4.9%)   -- near-black
Sidebar Foreground:   hsl(210 40% 80%)       -- light gray text
Sidebar Primary:      hsl(217.2 91.2% 59.8%) -- active blue
Sidebar Accent:       hsl(217.2 32.6% 17.5%) -- dark blue hover
```

## Typography

| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| Body | Inter / system | 14px (0.875rem) | 400 | normal |
| H1 (page title) | Inter | 30px (1.875rem) | 700 | tight |
| H2 (section) | Inter | 24px (1.5rem) | 700 | normal |
| H3 (card title) | Inter | 18px (1.125rem) | 600 | normal |
| Label/Caption | Inter | 10-12px | 500-600 | wider (uppercase) |
| Code/Formula | JetBrains Mono | 14-24px | 400-700 | wide |
| Badge | Inter | 10-12px | 600 | normal |

## Spacing Scale

Tailwind 4px base unit:
- Card padding: `p-5` to `p-6` (20-24px)
- Section gap: `gap-6` to `gap-8` (24-32px)
- Inline spacing: `gap-2` to `gap-3` (8-12px)
- Page padding: `px-4 py-6` (mobile) / `px-6 py-8` (desktop)
- Border radius: `rounded-lg` (cards), `rounded-xl` (prominent cards), `rounded-full` (badges, pills)

## Component Patterns

### Cards
- Use shadcn `Card` for all content containers
- Subtle `border` from theme with `shadow-sm`
- Hover: `hover:shadow-md transition-shadow duration-200`
- No transform animations on hover
- Clickable cards get `cursor-pointer` and `hover:bg-muted/30`

### Buttons
- Primary: `Button variant="default"` - blue background
- Secondary: `Button variant="outline"` - bordered
- Destructive: `Button variant="destructive"` - red
- Ghost: `Button variant="ghost"` - minimal
- Size: `default` for main actions, `sm` for inline, `icon` for icon-only
- Rounded pills for toggles: `className="rounded-full"`

### Badges
- Topic category: `Badge variant="secondary"` with uppercase 10px text
- Exam year: `Badge variant="exam"` - rose-red
- Difficulty: `Badge variant="outline"`
- Status: `Badge variant="success"` / `"warning"` / `"info"`

### Stat Cards (Dashboard)
- Icon in colored rounded box (bg-primary/10, bg-success/10, etc.)
- Large number (text-3xl font-bold)
- Small label above (uppercase, tracking-wider, muted)
- Subtitle below (text-xs, muted)

### Tables (SAR)
- Use shadcn `Table` component
- Header: uppercase text-xs with tracking-wider
- Alternating row colors: `even:bg-muted/20`
- Monospace font for chemical formulas
- Horizontal scroll on mobile: `overflow-x-auto`

### Flashcards
- Fixed aspect ratio (3:2)
- CSS perspective flip animation (500ms)
- Front: primary background, white text, centered
- Back: white background with primary/20 border, dark text
- Tap-to-flip hint at bottom
- No 3D libraries needed

### Quiz
- Custom radio group with border highlighting
- Immediate feedback: green border+bg for correct, red for wrong
- Explanation in colored callout box
- Progress bar at top with percentage

### Command Palette Search (Cmd+K)
- cmdk-based command palette
- Radix Dialog overlay with backdrop blur
- Grouped results: Pages, Topics, Drugs, SAR Tables
- Keyboard navigable with arrow keys
- Trigger button in header with "Cmd+K" keyboard shortcut badge

### Molecule Viewer (React Flow)
- Light background (zinc-50) with subtle dot grid
- Custom node types: atom (colored circles), functional-group (rounded rectangles), bond-label
- Element-specific colors: C=zinc, N=blue, O=red, S=yellow, F=green
- SAR annotations displayed below diagram
- Controls: zoom in/out, fit view
- Read-only mode

## Layout

```
┌─────────────────────────────────────────────────────┐
│  Header: Sidebar Toggle + Command Search + Lang     │
│  (sticky, backdrop-blur, h-16)                      │
├─────────┬───────────────────────────────────────────┤
│         │                                            │
│ Sidebar │    Main Content Area                       │
│ (dark)  │    (scrollable, max-w-960px centered)      │
│ w-64    │                                            │
│         │                                            │
│ [Logo]  │                                            │
│ Progress│                                            │
│ ────────│                                            │
│ - Home  │                                            │
│ - Topics│                                            │
│ - Cards │                                            │
│ - Quiz  │                                            │
│ - Exams │                                            │
│ - SAR   │                                            │
│ - Form  │                                            │
│ ────────│                                            │
│ Footer  │                                            │
│         │                                            │
└─────────┴───────────────────────────────────────────┘
```

- Sidebar: 256px, dark background, collapsible (desktop toggle + mobile overlay)
- Header: sticky, h-16, glass-morphism effect (bg-background/80 backdrop-blur-md)
- Main content: max-width 960px, centered with responsive padding
- Mobile: sidebar becomes slide-over with backdrop overlay, auto-closes on navigation

## Mobile Responsive Breakpoints

| Breakpoint | Sidebar | Content Padding | Grid Columns |
|-----------|---------|-----------------|--------------|
| < 640px (sm) | Overlay (slide) | px-4 py-6 | 1 column |
| 640-1023px (md) | Overlay (slide) | px-6 py-8 | 2 columns |
| ≥ 1024px (lg) | Persistent sidebar | px-6 py-8 | 3-4 columns |

## Animation Guidelines

- Page transitions: opacity 150ms ease-in-out only (via React.lazy + Suspense)
- Card hover: shadow-md transition-shadow 200ms
- Flashcard flip: transform rotateY(180deg) with perspective(1000px), 500ms
- Sidebar slide: translate-x with 300ms duration
- Backdrop: opacity transition 300ms
- Progress bars: width transition 500ms
- No bouncing, no spring physics, no decorative motion

## Iconography

- Lucide React icons only
- Size: 14-16px inline, 20px in stat boxes, 24px in navigation
- Stroke width: 2 (default)
- Icon-only buttons get aria-label
- No emoji anywhere in the UI

## Accessibility

- All interactive elements keyboard accessible
- Focus visible rings (ring-2 ring-ring ring-offset-2)
- ARIA labels on icon-only buttons
- ARIA roles on flashcard (role="button"), radio groups
- Color is never the sole indicator (icons + text for status)
- Minimum tap target: 44x44px on mobile
- Screen reader support for command palette search
- Custom scrollbar styling (6px, rounded)

## Cursor & Interaction States

- Clickable cards: `cursor-pointer`
- Disabled elements: `cursor-not-allowed opacity-50`
- Links: underline on hover (text links only)
- Buttons: subtle scale on active (default browser behavior)
- Drag areas (React Flow): `cursor-grab` / `cursor-grabbing`
