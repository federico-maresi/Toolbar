# Editor Toolbar — Design

## Purpose

A self-contained React/TSX toolbar component matching a provided screenshot, intended for publishing to 21st.dev. Pill-shaped formatting toolbar with a trailing "Add" button that opens a categorized insert menu.

## Scope

- Single component, single file, no external state/props required to render — works standalone as its own demo.
- Not wired to any real text editor; button states are local UI state only.

## Structure

**Component name:** `EditorToolbar` (default export)

**Toolbar row** (pill container, white/light surface, border, subtle shadow, rounded-full):
- Icon toggle buttons, left to right, each independently toggleable (pressed state = subtle gray background), using `lucide-react` icons:
  - Bold → `Bold`
  - Italic → `Italic`
  - Heading → `Heading2`
  - Bullet list → `List`
  - Numbered list → `ListOrdered`
  - Code → `Code`
- Vertical divider (thin line)
- "Add" button: black pill, white text "Add", trailing `ChevronDown` icon. Opens the insert menu on click.

**Insert menu** (opens on "Add" click, anchored below the button, right-aligned, max-height ~420px with `overflow-y-auto`, closes on outside click or Escape):

All labels/descriptions in English (placeholder content).

| Section | Item | Description | Icon |
|---|---|---|---|
| STRUCTURE & PATH | Free text | Formattable text paragraph | `FileText` |
| STRUCTURE & PATH | Steps | Numbered steps | `ListOrdered` |
| STRUCTURE & PATH | Do / Don'ts | When to / when not to | `CircleCheck` |
| EMPHASIS | Callout | Highlighted note | `Info` |
| EMPHASIS | Warn | Warnings | `TriangleAlert` |
| COMPARISON & CHOICE | Comparison | N-option comparison table | `Columns2` |
| COMPARISON & CHOICE | Scenarios | Use case scenarios | `Target` |
| PRODUCT & FEATURE | Product Card | Product/tool card | `Box` |
| PRODUCT & FEATURE | Feature Grid | Feature grid | `LayoutGrid` |

Each menu item row: icon + bold title + gray description below it, hover highlight, click fires an internal `onSelect` placeholder (no-op / console log) and closes the menu.

## Behavior

- All state is local `useState` (toggle buttons' pressed state, menu open/closed).
- No external dependencies beyond `lucide-react` + Tailwind CSS.
- Full Tailwind `dark:` variants on both the toolbar and the menu, so it renders correctly in both light and dark preview (21st.dev checks both).

## Out of scope

- No real rich-text editing logic.
- No mutual exclusivity between toggle buttons (each is independent).
- No keyboard navigation inside the menu beyond Escape-to-close.

## Testing / verification

- Manual visual check in a browser (light + dark) after publishing to 21st.dev, per the publish workflow's review step.
- No automated tests — this is a presentational component with no business logic.
