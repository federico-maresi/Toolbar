# Design Toolbar

Floating design-tool toolbar in React + Tailwind: pill buttons, dropdown variant
menus for the pointer and shape tools, hover tooltips, light and dark mode.

The whole component is one self-contained file —
[`src/components/ui/design-toolbar.tsx`](src/components/ui/design-toolbar.tsx) —
whose only runtime dependencies are `react` and `lucide-react`.

## Install it in another project

This repo doubles as a [shadcn registry](https://ui.shadcn.com/docs/registry), so
the component can be pulled straight into a project:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/federico-maresi/Toolbar/main/r/design-toolbar.json
```

That copies the file to whatever your `components.json` maps `@ui` to (usually
`src/components/ui/`) and installs `lucide-react` if it is missing. The target
project needs to be shadcn-initialised — run `npx shadcn@latest init` first if it
has no `components.json`.

### Without the shadcn CLI

Copy the single file and install the one dependency:

```bash
curl -o src/components/ui/design-toolbar.tsx \
  https://raw.githubusercontent.com/federico-maresi/Toolbar/main/src/components/ui/design-toolbar.tsx
npm install lucide-react
```

### Usage

```tsx
import { DesignToolbar } from "@/components/ui/design-toolbar";

<DesignToolbar />
```

## Requirements in the consuming project

- **React 18+** with the modern JSX transform (`"jsx": "react-jsx"`).
- **Tailwind CSS**, with this file covered by the `content` globs — otherwise the
  purge strips the classes and the toolbar renders unstyled.
- **Class-based dark mode**, since the component uses `dark:` variants and expects
  a `.dark` on an ancestor:
  - Tailwind v3 — `darkMode: "class"` in `tailwind.config.js`.
  - Tailwind v4 — `@custom-variant dark (&:where(.dark, .dark *));` in your CSS,
    as there is no JS config to set it in.

## Known limitations

- **No props.** Tool selection, open menu and shape variant are internal state,
  and picking an item only `console.log`s it. Wire up callbacks if the host app
  needs to react to the selection.
- **The accent colour is hardcoded** as `bg-[#9333ea]` in `ACTIVE_TOOL_STYLE`.
  Point it at a theme token when adopting the component into a design system.

## Repo layout

| Path | Role |
| --- | --- |
| `src/components/ui/design-toolbar.tsx` | The component — the only file consumers ever receive |
| `src/App.tsx`, `src/demos/` | Local demo harness, not published |
| `registry.json` | Registry manifest: name, dependencies, install target |
| `scripts/build-registry.mjs` | Inlines the source into the published payload |
| `r/design-toolbar.json` | Generated payload that `shadcn add` downloads |
| `.githooks/pre-commit` | Rebuilds `r/` so it cannot drift from `src/` |
| `docs/superpowers/` | Design specs and implementation plans behind the component |

## Developing this repo

```bash
npm install
npm run dev               # demo app at localhost:5173
npm run build             # type-check + production build
npm run standalone:build  # single-file HTML preview
npm run registry:build    # regenerate r/*.json from registry.json
```

`r/design-toolbar.json` is generated — it inlines a *copy* of the component
source, so a stale payload would be served to every consumer with nothing to
signal it. A versioned pre-commit hook in `.githooks/` guards against that: any
commit touching `src/` or `registry.json` rebuilds `r/` and folds the result
into the commit.

`npm install` wires the hook up via the `prepare` script. To do it by hand:

```bash
git config core.hooksPath .githooks
```

The hook stops at the commit: consumers install from `raw.githubusercontent.com`,
so a change only reaches them once it is **pushed to `main`**.

### A note on the lucide-react version

`registry.json` declares `lucide-react` without a version range, so the shadcn
CLI installs the current major (1.x) into consuming projects, while this repo
still develops against `0.469`. All fifteen icons the component imports, plus the
`LucideIcon` type, exist under both — but that is worth re-checking if the import
list ever grows.
