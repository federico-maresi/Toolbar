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
