import { useEffect, useRef, useState, type ReactNode } from "react";
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

interface ToolItem {
  label: string;
  icon: LucideIcon;
}

const POINTER_VARIANTS: ToolItem[] = [
  { label: "Move", icon: MousePointer2 },
  { label: "Hand tool", icon: Hand },
];

const SHAPE_VARIANTS: ToolItem[] = [
  { label: "Rectangle", icon: Square },
  { label: "Ellipse", icon: Circle },
  { label: "Triangle", icon: Triangle },
  { label: "Polygon", icon: Hexagon },
];

const MORE_ITEMS: ToolItem[] = [
  { label: "Media", icon: Image },
  { label: "Assets", icon: Boxes },
  { label: "Variables", icon: Variable },
  { label: "Plugins", icon: Puzzle },
];

/** Toolbar tools. Exactly one is active at any time. */
type ToolKey = "select" | "frame" | "shape" | "pen" | "text" | "comment";

/** Toolbar dropdowns. At most one is open at any time. */
type MenuKey = "select" | "shape" | "more";

/** Brand accent for the active tool — the single source of truth for that colour. */
const ACTIVE_TOOL_STYLE = "bg-[#9333ea] text-white";

/** Neutral "on" state, used by open dropdown triggers and selected menu entries. */
const ACTIVE_NEUTRAL_STYLE = "bg-neutral-200 text-neutral-900";

const IDLE_STYLE =
  "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white";

const ICON_BUTTON_STYLE = "flex h-8 w-8 items-center justify-center rounded-full transition-colors";

const MENU_ITEM_STYLE = "flex w-full items-center gap-2 rounded-full px-2 py-2 text-left transition-colors";

const MENU_PANEL_STYLE =
  "absolute bottom-[calc(100%+8px)] left-0 z-10 w-36 origin-bottom-left rounded-[20px] border border-neutral-200 bg-white p-1 shadow-lg transition-[opacity,transform] duration-150 dark:border-neutral-700 dark:bg-neutral-900";

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

function Chevron({ open }: { open: boolean }) {
  return <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />;
}

/** Dropdown surface. Stays mounted and fades out, so it can animate on close. */
function MenuPanel({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      role="menu"
      className={`${MENU_PANEL_STYLE} ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
    >
      {children}
    </div>
  );
}

interface ToggleButtonProps {
  icon: LucideIcon;
  label: string;
  pressed: boolean;
  onToggle: () => void;
  /** Suppressed while the tool's own dropdown is open, so it cannot cover the menu. */
  tooltipVisible?: boolean;
}

function ToggleButton({ icon: Icon, label, pressed, onToggle, tooltipVisible = true }: ToggleButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        onClick={onToggle}
        className={`${ICON_BUTTON_STYLE} ${pressed ? ACTIVE_TOOL_STYLE : IDLE_STYLE}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </button>
      {tooltipVisible && <Tooltip label={label} />}
    </div>
  );
}

interface ToolWithVariantsProps {
  /** Tooltip and accessible name of the main button. */
  label: string;
  pressed: boolean;
  onActivate: () => void;
  menuLabel: string;
  menuTooltip: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  variants: ToolItem[];
  selectedVariant: string;
  onSelectVariant: (label: string) => void;
}

/** A tool button whose icon reflects the variant picked from its adjoining dropdown. */
function ToolWithVariants({
  label,
  pressed,
  onActivate,
  menuLabel,
  menuTooltip,
  menuOpen,
  onToggleMenu,
  variants,
  selectedVariant,
  onSelectVariant,
}: ToolWithVariantsProps) {
  const activeVariant = variants.find((variant) => variant.label === selectedVariant) ?? variants[0];

  return (
    <div className="relative flex items-center gap-0">
      <ToggleButton
        icon={activeVariant.icon}
        label={label}
        pressed={pressed}
        onToggle={onActivate}
        tooltipVisible={!menuOpen}
      />
      <div className="relative">
        <div className="group relative">
          <button
            type="button"
            aria-label={menuLabel}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
            className={`flex h-8 items-center rounded-lg px-1 transition-colors ${
              menuOpen ? ACTIVE_NEUTRAL_STYLE : IDLE_STYLE
            }`}
          >
            <Chevron open={menuOpen} />
          </button>
          {!menuOpen && <Tooltip label={menuTooltip} />}
        </div>

        <MenuPanel open={menuOpen}>
          {variants.map((variant) => {
            const Icon = variant.icon;
            const selected = variant.label === selectedVariant;
            return (
              <button
                key={variant.label}
                type="button"
                role="menuitem"
                aria-pressed={selected}
                onClick={() => onSelectVariant(variant.label)}
                className={`${MENU_ITEM_STYLE} ${selected ? ACTIVE_NEUTRAL_STYLE : IDLE_STYLE}`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                <span className="text-sm font-medium">{variant.label}</span>
              </button>
            );
          })}
        </MenuPanel>
      </div>
    </div>
  );
}

export function DesignToolbar() {
  const [activeTool, setActiveTool] = useState<ToolKey>("select");
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [selectedPointerTool, setSelectedPointerTool] = useState("Move");
  const [selectedShapeVariant, setSelectedShapeVariant] = useState("Rectangle");
  const containerRef = useRef<HTMLDivElement>(null);

  const moreMenuOpen = openMenu === "more";

  function activateTool(tool: ToolKey) {
    setActiveTool(tool);
    setOpenMenu(null);
  }

  function toggleMenu(menu: MenuKey) {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  function handlePointerSelect(label: string) {
    console.log(`Tool: ${label}`);
    setSelectedPointerTool(label);
    activateTool("select");
  }

  function handleShapeSelect(label: string) {
    console.log(`Shape: ${label}`);
    setSelectedShapeVariant(label);
    activateTool("shape");
  }

  function handleMoreSelect(label: string) {
    console.log(`Insert: ${label}`);
    setOpenMenu(null);
  }

  useEffect(() => {
    if (openMenu === null) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <div className="flex items-center gap-2 rounded-3xl border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <ToolWithVariants
          label={selectedPointerTool}
          pressed={activeTool === "select"}
          onActivate={() => activateTool("select")}
          menuLabel="Choose pointer tool"
          menuTooltip="Move tools"
          menuOpen={openMenu === "select"}
          onToggleMenu={() => toggleMenu("select")}
          variants={POINTER_VARIANTS}
          selectedVariant={selectedPointerTool}
          onSelectVariant={handlePointerSelect}
        />

        <ToggleButton
          icon={Frame}
          label="Frame"
          pressed={activeTool === "frame"}
          onToggle={() => activateTool("frame")}
        />

        <ToolWithVariants
          label="Shape"
          pressed={activeTool === "shape"}
          onActivate={() => activateTool("shape")}
          menuLabel="Choose shape"
          menuTooltip="Shape tools"
          menuOpen={openMenu === "shape"}
          onToggleMenu={() => toggleMenu("shape")}
          variants={SHAPE_VARIANTS}
          selectedVariant={selectedShapeVariant}
          onSelectVariant={handleShapeSelect}
        />

        <ToggleButton icon={PenTool} label="Pen" pressed={activeTool === "pen"} onToggle={() => activateTool("pen")} />
        <ToggleButton icon={Type} label="Text" pressed={activeTool === "text"} onToggle={() => activateTool("text")} />
        <ToggleButton
          icon={MessageSquare}
          label="Comment"
          pressed={activeTool === "comment"}
          onToggle={() => activateTool("comment")}
        />
        <div className="h-5 w-px bg-neutral-300 dark:bg-neutral-600" />

        <div className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={moreMenuOpen}
            onClick={() => toggleMenu("more")}
            className={`flex h-8 items-center gap-1 rounded-full border pl-3 pr-2 text-sm font-medium text-white transition-colors dark:text-neutral-900 ${
              moreMenuOpen
                ? "border-transparent bg-neutral-900 dark:bg-white"
                : "bg-neutral-900 bg-gradient-to-b from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border-t-black/90 border-x-black/55 border-b-black/55 dark:bg-white dark:from-white dark:to-neutral-50 dark:hover:from-neutral-50 dark:hover:to-neutral-100 dark:border-t-white/90 dark:border-x-white/55 dark:border-b-white/55"
            }`}
          >
            More
            <Chevron open={moreMenuOpen} />
          </button>

          <MenuPanel open={moreMenuOpen}>
            {MORE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => handleMoreSelect(item.label)}
                  className={`${MENU_ITEM_STYLE} ${IDLE_STYLE} active:bg-neutral-200 active:text-neutral-900 dark:active:bg-neutral-200 dark:active:text-neutral-900`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </MenuPanel>
        </div>
      </div>
    </div>
  );
}
