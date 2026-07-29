# Editor Toolbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working, self-contained `EditorToolbar` React/TSX component (formatting toolbar + categorized "Add" insert menu) matching the approved design, verified visually in light and dark mode, ready for 21st.dev publishing.

**Architecture:** A minimal Vite + React + TypeScript + Tailwind CSS scaffold hosts the component for local development/verification. The component itself (`src/components/editor-toolbar.tsx`) is the deliverable: a single file, default export, no required props, all state local via `useState`/`useRef`. The scaffold app (`src/App.tsx`) exists only to preview the component and is not part of the publishable artifact.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS (`darkMode: "class"`), lucide-react icons.

## Global Constraints

- Component must be a single self-contained file: `src/components/editor-toolbar.tsx`, default export, zero required props.
- Only runtime dependency beyond React itself: `lucide-react`.
- All interactive elements (toggle buttons, Add button, menu items) must render correct styling in both light mode and `dark:` (Tailwind class-based dark mode).
- All placeholder copy (toolbar "Add" label, menu section titles, item labels/descriptions) is in English, exactly as specified in `docs/superpowers/specs/2026-07-29-editor-toolbar-design.md`.
- No automated unit tests — this is a presentational component with no business logic (per spec's Testing section). Verification is: TypeScript compiles cleanly (`npm run build`) + manual visual check in a real browser, light and dark.

---

### Task 1: Project scaffold (Vite + React + TypeScript + Tailwind)

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `.gitignore`

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` toolchain that Task 2+ will add files into. `src/App.tsx` default-exports an `App` component that Task 2 will modify to render `EditorToolbar`.

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/federico/Desktop/Progetti/Toolbar
git init
```

- [ ] **Step 2: Write `.gitignore`**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "editor-toolbar",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.469.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.6.3",
    "vite": "^6.0.5"
  }
}
```

- [ ] **Step 4: Write `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 6: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Editor Toolbar</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Write `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 9: Write `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 10: Write `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 11: Write `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 12: Write placeholder `src/App.tsx`**

```tsx
export default function App() {
  return <div className="p-8">Hello</div>;
}
```

- [ ] **Step 13: Install dependencies**

Run: `npm install`
Expected: completes with no errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 14: Verify the scaffold builds**

Run: `npm run build`
Expected: exits 0, produces `dist/`.

- [ ] **Step 15: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json index.html tailwind.config.js postcss.config.js src/index.css src/main.tsx src/App.tsx .gitignore
git commit -m "chore: scaffold Vite + React + TypeScript + Tailwind project"
```

---

### Task 2: Toolbar shell — toggle buttons + Add button

**Files:**
- Create: `src/components/editor-toolbar.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: none (first component code).
- Produces: `EditorToolbar` (default export from `src/components/editor-toolbar.tsx`), a zero-props component. Internal `ToggleButton` helper component and `ToggleKey` type are local to this file — Task 3 extends the same file and reuses `menuOpen`/`setMenuOpen` state and the `containerRef` div this task creates.

- [ ] **Step 1: Write `src/components/editor-toolbar.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Code,
  ChevronDown,
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
  );
}

type ToggleKey = "bold" | "italic" | "heading" | "bulletList" | "numberedList" | "code";

export default function EditorToolbar() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    bold: false,
    italic: false,
    heading: false,
    bulletList: false,
    numberedList: false,
    code: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggle(key: ToggleKey) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <ToggleButton icon={Bold} label="Bold" pressed={toggles.bold} onToggle={() => toggle("bold")} />
        <ToggleButton icon={Italic} label="Italic" pressed={toggles.italic} onToggle={() => toggle("italic")} />
        <ToggleButton icon={Heading2} label="Heading" pressed={toggles.heading} onToggle={() => toggle("heading")} />
        <ToggleButton icon={List} label="Bullet list" pressed={toggles.bulletList} onToggle={() => toggle("bulletList")} />
        <ToggleButton
          icon={ListOrdered}
          label="Numbered list"
          pressed={toggles.numberedList}
          onToggle={() => toggle("numberedList")}
        />
        <ToggleButton icon={Code} label="Code" pressed={toggles.code} onToggle={() => toggle("code")} />

        <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-8 items-center gap-1 rounded-full bg-neutral-900 pl-3 pr-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Add
          <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} strokeWidth={2} />
        </button>
      </div>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-10 w-72 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="px-2 py-1 text-xs text-neutral-400">Menu placeholder — Task 3 replaces this</div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/App.tsx` to render it**

```tsx
import EditorToolbar from "./components/editor-toolbar";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-950">
      <EditorToolbar />
    </div>
  );
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/editor-toolbar.tsx src/App.tsx
git commit -m "feat: add EditorToolbar shell with toggle buttons and Add button"
```

---

### Task 3: Insert menu — categorized items, click-outside/Escape close

**Files:**
- Modify: `src/components/editor-toolbar.tsx`

**Interfaces:**
- Consumes: `menuOpen`/`setMenuOpen` state and `containerRef` from Task 2 (unchanged). Replaces only the `{menuOpen && (...)}` placeholder block from Task 2's Step 1.
- Produces: fully working insert menu with 4 sections / 9 items, each firing `handleSelect(item.label)` on click.

- [ ] **Step 1: Add menu data + icon imports**

In `src/components/editor-toolbar.tsx`, replace the icon import block:

```tsx
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Code,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
```

with:

```tsx
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Code,
  ChevronDown,
  FileText,
  CircleCheck,
  Info,
  TriangleAlert,
  Columns2,
  Target,
  Box,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
```

Then add this data directly below the `ToggleButtonProps`/`ToggleButton` declarations (before `type ToggleKey = ...`):

```tsx
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
    title: "STRUCTURE & PATH",
    items: [
      { label: "Free text", description: "Formattable text paragraph", icon: FileText },
      { label: "Steps", description: "Numbered steps", icon: ListOrdered },
      { label: "Do / Don'ts", description: "When to / when not to", icon: CircleCheck },
    ],
  },
  {
    title: "EMPHASIS",
    items: [
      { label: "Callout", description: "Highlighted note", icon: Info },
      { label: "Warn", description: "Warnings", icon: TriangleAlert },
    ],
  },
  {
    title: "COMPARISON & CHOICE",
    items: [
      { label: "Comparison", description: "N-option comparison table", icon: Columns2 },
      { label: "Scenarios", description: "Use case scenarios", icon: Target },
    ],
  },
  {
    title: "PRODUCT & FEATURE",
    items: [
      { label: "Product Card", description: "Product/tool card", icon: Box },
      { label: "Feature Grid", description: "Feature grid", icon: LayoutGrid },
    ],
  },
];
```

- [ ] **Step 2: Add `handleSelect` inside `EditorToolbar`**

Directly below the `toggle` function, add:

```tsx
  function handleSelect(label: string) {
    console.log(`Insert: ${label}`);
    setMenuOpen(false);
  }
```

- [ ] **Step 3: Replace the menu placeholder block**

Replace:

```tsx
      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-10 w-72 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="px-2 py-1 text-xs text-neutral-400">Menu placeholder — Task 3 replaces this</div>
        </div>
      )}
```

with:

```tsx
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
```

- [ ] **Step 4: Verify it compiles**

Run: `npm run build`
Expected: exits 0, no TypeScript errors (no unused imports — every imported icon must be referenced in `MENU_SECTIONS` or the toolbar row).

- [ ] **Step 5: Commit**

```bash
git add src/components/editor-toolbar.tsx
git commit -m "feat: add categorized insert menu to EditorToolbar"
```

---

### Task 4: Visual verification — light and dark mode

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `EditorToolbar` default export (unchanged signature).
- Produces: a local preview harness with a light/dark toggle, used only for manual verification — not part of the publishable component.

- [ ] **Step 1: Add a theme toggle to `src/App.tsx`**

```tsx
import { useState } from "react";
import EditorToolbar from "./components/editor-toolbar";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-50 p-8 dark:bg-neutral-950">
        <button
          type="button"
          onClick={() => setDark((value) => !value)}
          className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
        >
          Toggle {dark ? "light" : "dark"} mode
        </button>
        <EditorToolbar />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start the dev server**

Run: `npm run dev -- --port 5173` (background)
Expected: prints local URL `http://localhost:5173/`.

- [ ] **Step 3: Verify in browser — light mode, closed toolbar**

Open `http://localhost:5173/` in a browser, take a screenshot. Expected: white pill toolbar with 6 gray icon buttons, thin divider, black "Add" pill button with chevron — matches the original screenshot.

- [ ] **Step 4: Verify in browser — light mode, menu open**

Click the "Add" button, take a screenshot. Expected: 4 sections (STRUCTURE & PATH, EMPHASIS, COMPARISON & CHOICE, PRODUCT & FEATURE), 9 items total, each with icon + bold label + gray description, no clipping, no overlapping text.

- [ ] **Step 5: Verify in browser — dark mode, closed and open**

Click "Toggle dark mode", repeat Steps 3–4. Expected: dark surfaces (`neutral-900`/`neutral-950`), white/light text, no white-on-white or black-on-black text, "Add" button remains legible (white bg / dark text in dark mode).

- [ ] **Step 6: Fix any visual issues found**

If any element is blank, clipped, or has incorrect contrast in either mode, edit `src/components/editor-toolbar.tsx` directly and re-run Steps 2–5 until both modes are clean.

- [ ] **Step 7: Stop the dev server**

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx
git commit -m "chore: add light/dark preview toggle for manual verification"
```

If Step 6 required fixes to `editor-toolbar.tsx`, include it in this commit (or a preceding `fix:` commit) as well.

---

## Self-Review Notes

- **Spec coverage:** toolbar row (Task 2), divider + Add button (Task 2), categorized menu with exact section/item copy from spec (Task 3), light/dark `dark:` variants throughout (Tasks 2–3), click-outside/Escape close (Task 2), light+dark manual verification (Task 4). All spec sections covered.
- **Type consistency:** `ToggleKey`, `toggles`, `toggle()`, `menuOpen`/`setMenuOpen`, `containerRef`, `handleSelect`, `MENU_SECTIONS`, `MenuItem`/`MenuSection` are used with the same names/shapes across Tasks 2–3.
- **No placeholders:** every step has literal file content; the only "placeholder" is the intentional, temporary one in Task 2 Step 1 that Task 3 explicitly replaces (shown as an exact find/replace).
