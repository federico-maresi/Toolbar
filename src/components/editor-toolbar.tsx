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
