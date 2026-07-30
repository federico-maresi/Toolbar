import { useEffect, useRef, useState } from "react";
import {
  MousePointer2,
  Hand,
  Frame,
  Square,
  Circle,
  Triangle,
  Hexagon,
  PenTool,
  Type,
  MessageSquare,
  ChevronDown,
  Image,
  Boxes,
  Variable,
  Puzzle,
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
            ? "bg-[#c6ff00] text-neutral-900"
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

interface MoreItem {
  label: string;
  icon: LucideIcon;
}

const MORE_ITEMS: MoreItem[] = [
  { label: "Media", icon: Image },
  { label: "Assets", icon: Boxes },
  { label: "Variables", icon: Variable },
  { label: "Plugins", icon: Puzzle },
];

interface PointerVariant {
  label: string;
  icon: LucideIcon;
}

const POINTER_VARIANTS: PointerVariant[] = [
  { label: "Move", icon: MousePointer2 },
  { label: "Hand tool", icon: Hand },
];

interface ShapeVariant {
  label: string;
  icon: LucideIcon;
}

const SHAPE_VARIANTS: ShapeVariant[] = [
  { label: "Rectangle", icon: Square },
  { label: "Ellipse", icon: Circle },
  { label: "Triangle", icon: Triangle },
  { label: "Polygon", icon: Hexagon },
];

type ToggleKey = "select" | "frame" | "shape" | "pen" | "text" | "comment";
type ExclusiveKey = "select" | "frame" | "shape" | "pen" | "text" | "comment";

const EXCLUSIVE_KEYS: ExclusiveKey[] = ["select", "frame", "shape", "pen", "text", "comment"];

export function DesignToolbar() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    select: true,
    frame: false,
    shape: false,
    pen: false,
    text: false,
    comment: false,
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [selectMenuOpen, setSelectMenuOpen] = useState(false);
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const [selectedPointerTool, setSelectedPointerTool] = useState("Move");
  const [selectedShapeVariant, setSelectedShapeVariant] = useState("Rectangle");
  const containerRef = useRef<HTMLDivElement>(null);

  const PointerIcon = POINTER_VARIANTS.find((variant) => variant.label === selectedPointerTool)?.icon ?? MousePointer2;
  const ShapeIcon = SHAPE_VARIANTS.find((variant) => variant.label === selectedShapeVariant)?.icon ?? Square;

  function closeMenus() {
    setSelectMenuOpen(false);
    setShapeMenuOpen(false);
    setMoreMenuOpen(false);
  }

  function activateExclusive(key: ExclusiveKey) {
    setToggles((prev) => {
      const next = { ...prev };
      for (const exclusiveKey of EXCLUSIVE_KEYS) {
        next[exclusiveKey] = exclusiveKey === key;
      }
      return next;
    });
    closeMenus();
  }

  function handleSelect(label: string) {
    console.log(`Insert: ${label}`);
    setMoreMenuOpen(false);
  }

  function handlePointerSelect(label: string) {
    console.log(`Tool: ${label}`);
    activateExclusive("select");
    setSelectedPointerTool(label);
    setSelectMenuOpen(false);
  }

  function handleShapeSelect(label: string) {
    console.log(`Shape: ${label}`);
    activateExclusive("shape");
    setSelectedShapeVariant(label);
    setShapeMenuOpen(false);
  }

  useEffect(() => {
    if (!moreMenuOpen && !shapeMenuOpen && !selectMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeMenus();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreMenuOpen, shapeMenuOpen, selectMenuOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="flex items-center gap-2 rounded-3xl border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="relative flex items-center gap-0">
          <div className="group relative">
            <button
              type="button"
              aria-label={selectedPointerTool}
              aria-pressed={toggles.select}
              onClick={() => activateExclusive("select")}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                toggles.select
                  ? "bg-[#c6ff00] text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              }`}
            >
              <PointerIcon className="h-4 w-4" strokeWidth={2} />
            </button>
            {!selectMenuOpen && <Tooltip label={selectedPointerTool} />}
          </div>
          <div className="relative">
            <div className="group relative">
              <button
                type="button"
                aria-label="Choose pointer tool"
                aria-haspopup="menu"
                aria-expanded={selectMenuOpen}
                onClick={() => {
                  setShapeMenuOpen(false);
                  setMoreMenuOpen(false);
                  setSelectMenuOpen((open) => !open);
                }}
                className={`flex h-8 items-center rounded-lg px-1 transition-colors ${
                  selectMenuOpen
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                }`}
              >
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${selectMenuOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>
              {!selectMenuOpen && <Tooltip label="Move tools" />}
            </div>

            <div
              role="menu"
              className={`absolute bottom-[calc(100%+8px)] left-0 z-10 w-36 origin-bottom-left rounded-[20px] border border-neutral-200 bg-white p-1 shadow-lg transition-[opacity,transform] duration-150 dark:border-neutral-700 dark:bg-neutral-900 ${
                selectMenuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              {POINTER_VARIANTS.map((variant) => {
                const Icon = variant.icon;
                const selected = selectedPointerTool === variant.label;
                return (
                  <button
                    key={variant.label}
                    type="button"
                    role="menuitem"
                    aria-pressed={selected}
                    onClick={() => handlePointerSelect(variant.label)}
                    className={`flex w-full items-center gap-2 rounded-full px-2 py-2 text-left transition-colors ${
                      selected
                        ? "bg-neutral-200 text-neutral-900"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="text-sm font-medium">{variant.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ToggleButton icon={Frame} label="Frame" pressed={toggles.frame} onToggle={() => activateExclusive("frame")} />

        <div className="relative flex items-center gap-0">
          <div className="group relative">
            <button
              type="button"
              aria-label="Shape"
              aria-pressed={toggles.shape}
              onClick={() => activateExclusive("shape")}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                toggles.shape
                  ? "bg-[#c6ff00] text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              }`}
            >
              <ShapeIcon className="h-4 w-4" strokeWidth={2} />
            </button>
            {!shapeMenuOpen && <Tooltip label="Shape" />}
          </div>
          <div className="relative">
            <div className="group relative">
              <button
                type="button"
                aria-label="Choose shape"
                aria-haspopup="menu"
                aria-expanded={shapeMenuOpen}
                onClick={() => {
                  setSelectMenuOpen(false);
                  setMoreMenuOpen(false);
                  setShapeMenuOpen((open) => !open);
                }}
                className={`flex h-8 items-center rounded-lg px-1 transition-colors ${
                  shapeMenuOpen
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                }`}
              >
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${shapeMenuOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>
              {!shapeMenuOpen && <Tooltip label="Shape tools" />}
            </div>

            <div
              role="menu"
              className={`absolute bottom-[calc(100%+8px)] left-0 z-10 w-36 origin-bottom-left rounded-[20px] border border-neutral-200 bg-white p-1 shadow-lg transition-[opacity,transform] duration-150 dark:border-neutral-700 dark:bg-neutral-900 ${
                shapeMenuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
              }`}
            >
              {SHAPE_VARIANTS.map((variant) => {
                const Icon = variant.icon;
                const selected = selectedShapeVariant === variant.label;
                return (
                  <button
                    key={variant.label}
                    type="button"
                    role="menuitem"
                    aria-pressed={selected}
                    onClick={() => handleShapeSelect(variant.label)}
                    className={`flex w-full items-center gap-2 rounded-full px-2 py-2 text-left transition-colors ${
                      selected
                        ? "bg-neutral-200 text-neutral-900"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="text-sm font-medium">{variant.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ToggleButton icon={PenTool} label="Pen" pressed={toggles.pen} onToggle={() => activateExclusive("pen")} />
        <ToggleButton icon={Type} label="Text" pressed={toggles.text} onToggle={() => activateExclusive("text")} />
        <ToggleButton
          icon={MessageSquare}
          label="Comment"
          pressed={toggles.comment}
          onToggle={() => activateExclusive("comment")}
        />
        <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-600" />

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={moreMenuOpen}
            onClick={() => {
              setSelectMenuOpen(false);
              setShapeMenuOpen(false);
              setMoreMenuOpen((open) => !open);
            }}
            className={`flex h-8 items-center gap-1 rounded-full border pl-3 pr-2 text-sm font-medium text-white transition-colors dark:text-neutral-900 ${
              moreMenuOpen
                ? "border-transparent bg-neutral-900 dark:bg-white"
                : "bg-neutral-900 bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border-t-black/90 border-x-black/55 border-b-black/55 dark:bg-white dark:from-white dark:to-neutral-50 dark:hover:from-neutral-50 dark:hover:to-neutral-100 dark:border-t-white/90 dark:border-x-white/55 dark:border-b-white/55"
            }`}
          >
            More
            <ChevronDown className={`h-3 w-3 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>

          <div
            role="menu"
            className={`absolute bottom-[calc(100%+8px)] left-0 z-10 w-36 origin-bottom-left rounded-[20px] border border-neutral-200 bg-white p-1 shadow-lg transition-[opacity,transform] duration-150 dark:border-neutral-700 dark:bg-neutral-900 ${
              moreMenuOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            }`}
          >
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(item.label)}
                  className="flex w-full items-center gap-2 rounded-full px-2 py-2 text-left text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 active:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:active:bg-neutral-200 dark:active:text-neutral-900"
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
