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
