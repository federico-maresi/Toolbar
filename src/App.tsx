import { useState } from "react";
import DesignToolbarDemo from "@/demos/default";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="relative flex min-h-screen items-center justify-center bg-neutral-50 p-8 dark:bg-neutral-950">
        <button
          type="button"
          onClick={() => setDark((value) => !value)}
          className="absolute right-4 top-4 rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
        >
          Toggle {dark ? "light" : "dark"} mode
        </button>
        <DesignToolbarDemo />
      </div>
    </div>
  );
}
