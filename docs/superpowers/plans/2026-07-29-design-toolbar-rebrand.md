# Design Toolbar Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the existing `EditorToolbar` text-editor toolbar component into `DesignToolbar`, a canvas tool selector for design software, per `docs/superpowers/specs/2026-07-29-design-toolbar-rebrand-design.md` — same component architecture and styling, new icons/labels/menu content and internal naming.

**Architecture:** Single-file component rename + full content rewrite (`src/components/ui/editor-toolbar.tsx` → `src/components/ui/design-toolbar.tsx`), with its two trivial consumers (`src/demos/default.tsx`, `src/App.tsx`) updated to match, plus a `package.json` name update. No new dependencies, no new files beyond the rename.

**Tech Stack:** React 18 + TypeScript + Tailwind CSS (Vite), `lucide-react` for icons. No test framework is configured in this project — verification is TypeScript compilation (`tsc -b`) plus manual browser check in light/dark mode, consistent with how this component was originally verified (see `docs/superpowers/plans/2026-07-29-editor-toolbar.md`).

## Global Constraints

- Every icon used must come from the already-installed `lucide-react` package (`^0.469.0`) — no new dependencies.
- Interaction logic (exclusivity behavior, click-outside/Escape-to-close, tooltip hover) must be byte-for-byte behaviorally identical to the current component — only names/content change.
- All Tailwind classes (light/dark mode, spacing, shape, shadows) carry over unchanged.
- Menu section item counts must stay 3 + 2 + 2 + 2 = 9, matching the spec exactly.

---

### Task 1: Rename and rewrite the component

**Files:**
- Create: `src/components/ui/design-toolbar.tsx`
- Delete: `src/components/ui/editor-toolbar.tsx`

**Interfaces:**
- Produces: `export function DesignToolbar()` — zero-props React component, default via named export (matches current `EditorToolbar` named-export pattern).

- [ ] **Step 1: Create `src/components/ui/design-toolbar.tsx` with the full rewritten component**

```tsx
import { useEffect, useRef, useState } from "react";
import {
  Lock,
  Magnet,
  Shapes,
  Square,
  Circle,
  PenTool,
  Type,
  MessageSquare,
  ChevronDown,
  Hexagon,
  AlignLeft,
  Image,
  Component,
  MousePointerClick,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";

interface ToggleButtonProps {
  icon: LucideIcon;
  label: string;
  pressed: boolean;
  onToggle: () => void;
}

function ToggleButton({ icon: Icon, label, pressed, onToggle }: ToggleButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        onClick={onToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          pressed
            ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white"
            : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </button>
      <Tooltip label={label} />
    </div>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 dark:border dark:border-neutral-700 dark:bg-neutral-800"
    >
      {label}
      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
    </span>
  );
}

interface MenuItem {
  label: string;
  description: string;
  icon: LucideIcon;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "SHAPES",
    items: [
      { label: "Rectangle", description: "Basic rectangle shape", icon: Square },
      { label: "Ellipse", description: "Basic ellipse shape", icon: Circle },
      { label: "Polygon", description: "Multi-sided polygon", icon: Hexagon },
    ],
  },
  {
    title: "TEXT",
    items: [
      { label: "Heading", description: "Large heading text", icon: Type },
      { label: "Body text", description: "Paragraph body text", icon: AlignLeft },
    ],
  },
  {
    title: "MEDIA",
    items: [
      { label: "Image", description: "Image placeholder", icon: Image },
      { label: "Icon", description: "Icon from library", icon: Component },
    ],
  },
  {
    title: "COMPONENTS",
    items: [
      { label: "Button", description: "Interactive button component", icon: MousePointerClick },
      { label: "Card", description: "Card container component", icon: LayoutTemplate },
    ],
  },
];

interface ShapeVariant {
  label: string;
  icon: LucideIcon;
}

const SHAPE_VARIANTS: ShapeVariant[] = [
  { label: "Rectangle", icon: Square },
  { label: "Ellipse", icon: Circle },
];

type ToggleKey = "lockRatio" | "snapToGrid" | "shape" | "pen" | "text" | "comment";
type ExclusiveKey = "shape" | "pen" | "text" | "comment";

const EXCLUSIVE_KEYS: ExclusiveKey[] = ["shape", "pen", "text", "comment"];

export function DesignToolbar() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    lockRatio: false,
    snapToGrid: false,
    shape: false,
    pen: false,
    text: false,
    comment: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggle(key: "lockRatio" | "snapToGrid") {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function activateExclusive(key: ExclusiveKey) {
    setToggles((prev) => {
      const next = { ...prev };
      for (const exclusiveKey of EXCLUSIVE_KEYS) {
        next[exclusiveKey] = exclusiveKey === key;
      }
      return next;
    });
  }

  function toggleExclusive(key: ExclusiveKey) {
    setToggles((prev) => {
      if (prev[key]) return { ...prev, [key]: false };
      const next = { ...prev };
      for (const exclusiveKey of EXCLUSIVE_KEYS) {
        next[exclusiveKey] = exclusiveKey === key;
      }
      return next;
    });
  }

  function handleSelect(label: string) {
    console.log(`Insert: ${label}`);
    setMenuOpen(false);
  }

  function handleShapeSelect(label: string) {
    console.log(`Shape: ${label}`);
    activateExclusive("shape");
    setShapeMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen && !shapeMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setShapeMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setShapeMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, shapeMenuOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <ToggleButton icon={Lock} label="Lock ratio" pressed={toggles.lockRatio} onToggle={() => toggle("lockRatio")} />
        <ToggleButton icon={Magnet} label="Snap to grid" pressed={toggles.snapToGrid} onToggle={() => toggle("snapToGrid")} />

        <div className="group relative">
          <button
            type="button"
            aria-label="Shape"
            aria-haspopup="menu"
            aria-expanded={shapeMenuOpen}
            aria-pressed={toggles.shape}
            onClick={() => {
              setMenuOpen(false);
              setShapeMenuOpen((open) => !open);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              toggles.shape || shapeMenuOpen
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`}
          >
            <Shapes className="h-4 w-4" strokeWidth={2} />
          </button>
          {!shapeMenuOpen && <Tooltip label="Shape" />}

          {shapeMenuOpen && (
            <div
              role="menu"
              className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 w-40 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              {SHAPE_VARIANTS.map((variant) => {
                const Icon = variant.icon;
                return (
                  <button
                    key={variant.label}
                    type="button"
                    role="menuitem"
                    onClick={() => handleShapeSelect(variant.label)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{variant.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <ToggleButton icon={PenTool} label="Pen" pressed={toggles.pen} onToggle={() => toggleExclusive("pen")} />
        <ToggleButton icon={Type} label="Text" pressed={toggles.text} onToggle={() => toggleExclusive("text")} />
        <ToggleButton
          icon={MessageSquare}
          label="Comment"
          pressed={toggles.comment}
          onToggle={() => toggleExclusive("comment")}
        />

        <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setShapeMenuOpen(false);
            setMenuOpen((open) => !open);
          }}
          className="flex h-8 items-center gap-1 rounded-full bg-neutral-900 pl-3 pr-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Add
          <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} strokeWidth={2} />
        </button>
      </div>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-10 max-h-[420px] w-72 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          {MENU_SECTIONS.map((section, index) => (
            <div
              key={section.title}
              className={index > 0 ? "mt-1 border-t border-neutral-100 pt-1 dark:border-neutral-800" : ""}
            >
              <div className="px-2 pb-1 pt-2 text-[11px] font-semibold tracking-wide text-neutral-400 dark:text-neutral-500">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelect(item.label)}
                    className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                    <span>
                      <span className="block text-sm font-medium text-neutral-900 dark:text-white">{item.label}</span>
                      <span className="block text-xs text-neutral-500 dark:text-neutral-400">{item.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Delete the old file**

```bash
git rm src/components/ui/editor-toolbar.tsx
```

(This removes the tracked file; the new `design-toolbar.tsx` from Step 1 is untracked until Step 3.)

- [ ] **Step 3: Stage the new file**

```bash
git add src/components/ui/design-toolbar.tsx
```

---

### Task 2: Update consumers

**Files:**
- Modify: `src/demos/default.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `DesignToolbar` named export from `src/components/ui/design-toolbar.tsx` (Task 1).
- Produces: `DesignToolbarDemo` default export from `src/demos/default.tsx`, consumed by `src/App.tsx`.

- [ ] **Step 1: Rewrite `src/demos/default.tsx`**

```tsx
import { DesignToolbar } from "@/components/ui/design-toolbar";

export default function DesignToolbarDemo() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center p-8">
      <DesignToolbar />
    </div>
  );
}
```

- [ ] **Step 2: Update the import and usage in `src/App.tsx`**

In `src/App.tsx`, change line 2 from:

```tsx
import EditorToolbarDemo from "@/demos/default";
```

to:

```tsx
import DesignToolbarDemo from "@/demos/default";
```

And change line 17 from:

```tsx
        <EditorToolbarDemo />
```

to:

```tsx
        <DesignToolbarDemo />
```

- [ ] **Step 3: Commit Tasks 1 and 2 together**

```bash
git add src/components/ui/design-toolbar.tsx src/demos/default.tsx src/App.tsx
git commit -m "feat: rebrand EditorToolbar into DesignToolbar canvas tool selector"
```

(The `git rm` from Task 1 Step 2 is already staged; this commit captures the full rename.)

---

### Task 3: Update package identity

**Files:**
- Modify: `package.json:2`

**Interfaces:**
- None (metadata-only change, no code consumes this field).

- [ ] **Step 1: Change the `name` field**

In `package.json`, change:

```json
  "name": "editor-toolbar",
```

to:

```json
  "name": "design-toolbar",
```

- [ ] **Step 2: Regenerate the lockfile's root name field**

```bash
npm install --package-lock-only
```

Expected: `package-lock.json` lines 2 and 8 update `"name"` to `"design-toolbar"`; no dependency versions change.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: rename package to design-toolbar"
```

---

### Task 4: Verify

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Type-check the project**

Run: `npm run build`
Expected: completes with no TypeScript errors (this catches any invalid `lucide-react` icon import from Task 1 immediately).

- [ ] **Step 2: Start the dev server**

Run: `npm run dev -- --port 5173` (background)
Expected: prints local URL `http://localhost:5173/`.

- [ ] **Step 3: Verify in browser — light mode, closed toolbar**

Open `http://localhost:5173/`, take a screenshot. Expected: white pill toolbar with 6 gray icon buttons (Lock, Magnet, Shapes, PenTool, Type, MessageSquare glyphs), thin divider, black "Add" pill button with chevron. Hover each icon to confirm tooltip text: "Lock ratio", "Snap to grid", "Shape", "Pen", "Text", "Comment".

- [ ] **Step 4: Verify the Shape submenu**

Click the Shapes icon (3rd button). Expected: submenu opens above showing "Rectangle" (Square icon) and "Ellipse" (Circle icon). Click "Rectangle". Expected: submenu closes, Shapes button now shows pressed/active styling (light gray background).

- [ ] **Step 5: Verify exclusive group behavior**

Click "Pen", then "Text", then "Comment" in turn. Expected: each click activates only that button (gray background) and deactivates the previously active one (Shapes/Pen/Text), confirming the 4-way exclusive group (Shape/Pen/Text/Comment) still works.

- [ ] **Step 6: Verify independent toggles**

Click "Lock ratio" and "Snap to grid". Expected: both can be active (pressed) at the same time, independent of whichever exclusive tool is active.

- [ ] **Step 7: Verify the Add/Insert menu — light mode**

Click "Add". Expected: 4 sections (SHAPES, TEXT, MEDIA, COMPONENTS), 9 items total (Rectangle, Ellipse, Polygon / Heading, Body text / Image, Icon / Button, Card), each with icon + bold label + gray description, no clipping or overlapping text.

- [ ] **Step 8: Verify dark mode**

Click "Toggle dark mode" in the demo shell, repeat Steps 3–7. Expected: dark surfaces (`neutral-900`/`neutral-950`), white/light text and icons, no white-on-white or black-on-black contrast issues, "Add" button remains legible (white bg / dark text in dark mode).

- [ ] **Step 9: Check the browser console**

Expected: no errors. Selecting "Rectangle" from the Shape submenu logs `Shape: Rectangle`; selecting any Add-menu item logs `Insert: <label>`.

- [ ] **Step 10: Fix any issues found, then stop the dev server**

If any element is blank, clipped, mislabeled, or has incorrect contrast in either mode, edit `src/components/ui/design-toolbar.tsx` directly and re-run Steps 1–9 until clean. Stop the dev server when done.

- [ ] **Step 11: Commit any fixes**

If Step 10 required changes:

```bash
git add src/components/ui/design-toolbar.tsx
git commit -m "fix: correct design-toolbar visual issues found in verification"
```

If no fixes were needed, skip this step — nothing to commit.

---

## Self-Review Notes

- **Spec coverage:** All spec sections map to tasks — renames (Task 1 file/component, Task 2 consumers, Task 3 package.json), content mapping (Task 1 full rewrite), internal naming (Task 1), verification (Task 4). No spec requirement is unaddressed.
- **Placeholder scan:** No TBD/TODO; every code step contains complete, copy-pasteable code; no "similar to Task N" shortcuts.
- **Type consistency:** `ToggleKey`/`ExclusiveKey`/`EXCLUSIVE_KEYS` in Task 1 match usage in `toggle`/`activateExclusive`/`toggleExclusive`. `DesignToolbar` (Task 1) matches the import in Task 2. `DesignToolbarDemo` (Task 2) matches the import/usage in `App.tsx` (Task 2). Menu item counts (3+2+2+2=9) match the spec and Task 4's verification checklist.
