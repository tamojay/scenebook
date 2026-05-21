import { useMemo } from "react";
import { useSlate } from "slate-react";
import { estimatePageCount } from "./beatsheet/estimatePages";
import type { ScreenplayElement } from "./types";

export function EditorStatusBar() {
  const editor = useSlate();
  // Re-read on every editor change (useSlate triggers re-render)
  const stats = useMemo(() => {
    const doc = editor.children as ScreenplayElement[];

    let words = 0;
    let scenes = 0;

    for (const node of doc) {
      const text = node.children
        .map((c) => c.text)
        .join("")
        .trim();
      if (!text) continue;
      if (node.type === "scene_heading") scenes += 1;
      words += text.split(/\s+/).filter(Boolean).length;
    }

    const pages = estimatePageCount(doc);

    return { words, scenes, pages };
  }, [editor.children]);

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-[8.5in] mx-auto px-4 py-1.5 flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
        <div className="flex items-center gap-4">
          <Stat label="Words" value={stats.words} />
          <Separator />
          <Stat label="Scenes" value={stats.scenes} />
          <Separator />
          <Stat label="Pages" value={stats.pages.toFixed(1)} />
        </div>
        <span className="hidden sm:block text-[10px] italic opacity-70">
          Page count is approximate
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <span>
      <span className="font-medium text-foreground">{value}</span>
      <span className="ml-1">{label}</span>
    </span>
  );
}

function Separator() {
  return <span className="text-border">·</span>;
}
