# Design: rebrand EditorToolbar → DesignToolbar

**Date:** 2026-07-29
**Status:** Approved

## Goal

Restyle the existing text-editor toolbar component into a coherent toolbar for design software (Figma/Sketch-style canvas tool selector), reusing the exact same component architecture, interaction logic, and visual styling — only the icon set, labels, menu content, and internal naming change to reflect the new domain.

## Scope

This is a content/rename pass on `src/components/ui/editor-toolbar.tsx` and its consumers. No new interaction patterns, no new dependencies, no visual/style changes beyond icon swaps.

## Renames

| Before | After |
|---|---|
| `src/components/ui/editor-toolbar.tsx` | `src/components/ui/design-toolbar.tsx` |
| `export function EditorToolbar()` | `export function DesignToolbar()` |
| `EditorToolbarDemo` (in `src/demos/default.tsx`) | `DesignToolbarDemo` |
| import in `src/App.tsx` | updated to `DesignToolbar` / `DesignToolbarDemo` |
| `package.json` `"name": "editor-toolbar"` | `"name": "design-toolbar"` |

## Content mapping

Structure (2 independent toggles → 1 exclusive group of 4, first member has a submenu → divider → "Add" button with a 4-section categorized menu) is unchanged. Only content/icons/naming change:

**Independent toggles** (both can be active simultaneously — was Bold/Italic):
- Lock ratio — icon `Lock`
- Snap to grid — icon `Magnet`

**Exclusive tool group** (was Heading+submenu / Bullet list / Numbered list / Code):
- Shape — icon `Shapes` — opens submenu:
  - Rectangle — icon `Square`
  - Ellipse — icon `Circle`
- Pen — icon `PenTool`
- Text — icon `Type`
- Comment — icon `MessageSquare`

**"Add" button**: unchanged label, position, style. Opens the same categorized menu shell, content remapped:

| Section | Items (label — icon — description) |
|---|---|
| SHAPES | Rectangle — `Square` — "Basic rectangle shape"; Ellipse — `Circle` — "Basic ellipse shape"; Polygon — `Hexagon` — "Multi-sided polygon" |
| TEXT | Heading — `Type` — "Large heading text"; Body text — `AlignLeft` — "Paragraph body text" |
| MEDIA | Image — `Image` — "Image placeholder"; Icon — `Component` — "Icon from library" |
| COMPONENTS | Button — `MousePointerClick` — "Interactive button component"; Card — `LayoutTemplate` — "Card container component" |

Section item counts (3 + 2 + 2 + 2 = 9) match the original exactly.

## Internal naming (types/state, not user-visible)

- `ToggleKey`: `"bold" | "italic" | "heading" | "bulletList" | "numberedList" | "code"` → `"lockRatio" | "snapToGrid" | "shape" | "pen" | "text" | "comment"`
- `ExclusiveKey` / `EXCLUSIVE_KEYS`: updated to `"shape" | "pen" | "text" | "comment"`
- `HeadingLevel` interface / `HEADING_LEVELS` const → `ShapeVariant` / `SHAPE_VARIANTS`
- `headingMenuOpen` / `setHeadingMenuOpen` → `shapeMenuOpen` / `setShapeMenuOpen`
- `handleHeadingSelect` → `handleShapeSelect`
- `MenuItem` / `MenuSection` / `MENU_SECTIONS` — names kept (already domain-neutral), only content changes
- `console.log` text: `Insert: ${label}` unchanged (already generic); `Format: ${label}` → `Shape: ${label}`

## Unchanged

- All interaction logic: exclusivity behavior, click-outside/Escape handling to close menus, tooltip component and hover behavior
- All Tailwind styling, light/dark mode classes, spacing, shape (pill/rounded), shadows
- `ToggleButton` and `Tooltip` helper components (fully generic already)
- No new dependencies — all replacement icons (`Lock`, `Magnet`, `Shapes`, `Square`, `Circle`, `PenTool`, `Type`, `MessageSquare`, `Hexagon`, `AlignLeft`, `Image`, `Component`, `MousePointerClick`, `LayoutTemplate`) come from the already-installed `lucide-react` package

## Verification

Run `npm run dev`, visually confirm in both light and dark mode (existing toggle in `App.tsx`):
- All 6 main toolbar icons render with correct tooltips
- Shape submenu opens showing Rectangle/Ellipse, selecting one sets Shape as the active exclusive tool
- Pen/Text/Comment correctly participate in the same exclusive group
- Lock ratio / Snap to grid toggle independently of the tool group and of each other
- "Add" button opens the Insert menu with the 4 new sections and 9 items, each with icon + label + description
- No TypeScript errors (`npm run build`)
