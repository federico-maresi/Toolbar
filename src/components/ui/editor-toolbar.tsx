import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading,
  Heading2,
  Heading3,
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

interface HeadingLevel {
  label: string;
  icon: LucideIcon;
}

const HEADING_LEVELS: HeadingLevel[] = [
  { label: "Heading 2", icon: Heading2 },
  { label: "Heading 3", icon: Heading3 },
];

type ToggleKey = "bold" | "italic" | "heading" | "bulletList" | "numberedList" | "code";
type ExclusiveKey = "heading" | "bulletList" | "numberedList" | "code";

const EXCLUSIVE_KEYS: ExclusiveKey[] = ["heading", "bulletList", "numberedList", "code"];

export function EditorToolbar() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    bold: false,
    italic: false,
    heading: false,
    bulletList: false,
    numberedList: false,
    code: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [headingMenuOpen, setHeadingMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggle(key: "bold" | "italic") {
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

  function handleHeadingSelect(label: string) {
    console.log(`Format: ${label}`);
    activateExclusive("heading");
    setHeadingMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen && !headingMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setHeadingMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setHeadingMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, headingMenuOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <ToggleButton icon={Bold} label="Bold" pressed={toggles.bold} onToggle={() => toggle("bold")} />
        <ToggleButton icon={Italic} label="Italic" pressed={toggles.italic} onToggle={() => toggle("italic")} />

        <div className="group relative">
          <button
            type="button"
            aria-label="Heading"
            aria-haspopup="menu"
            aria-expanded={headingMenuOpen}
            aria-pressed={toggles.heading}
            onClick={() => {
              setMenuOpen(false);
              setHeadingMenuOpen((open) => !open);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              toggles.heading || headingMenuOpen
                ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`}
          >
            <Heading className="h-4 w-4" strokeWidth={2} />
          </button>
          {!headingMenuOpen && <Tooltip label="Heading" />}

          {headingMenuOpen && (
            <div
              role="menu"
              className="absolute bottom-[calc(100%+8px)] left-1/2 z-10 w-40 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              {HEADING_LEVELS.map((level) => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.label}
                    type="button"
                    role="menuitem"
                    onClick={() => handleHeadingSelect(level.label)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{level.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <ToggleButton
          icon={List}
          label="Bullet list"
          pressed={toggles.bulletList}
          onToggle={() => toggleExclusive("bulletList")}
        />
        <ToggleButton
          icon={ListOrdered}
          label="Numbered list"
          pressed={toggles.numberedList}
          onToggle={() => toggleExclusive("numberedList")}
        />
        <ToggleButton icon={Code} label="Code" pressed={toggles.code} onToggle={() => toggleExclusive("code")} />

        <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setHeadingMenuOpen(false);
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
