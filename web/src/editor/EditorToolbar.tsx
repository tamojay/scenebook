import { useSlate } from "slate-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBlockType, getCurrentBlockType } from "./transforms.ts";
import type { ElementType } from "./types";

const elementOptions: { value: ElementType; label: string }[] = [
  { value: "scene_heading", label: "Scene Heading" },
  { value: "action", label: "Action" },
  { value: "character", label: "Character" },
  { value: "parenthetical", label: "Parenthetical" },
  { value: "dialogue", label: "Dialogue" },
  { value: "transition", label: "Transition" },
  { value: "shot", label: "Shot" },
];

export function EditorToolbar() {
  const editor = useSlate();
  const currentType = getCurrentBlockType(editor) ?? "action";

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border py-2 mb-4">
      <div className="flex items-center gap-2">
        <Select
          value={currentType}
          onValueChange={(v) => setBlockType(editor, v as ElementType)}
        >
          <SelectTrigger className="w-48 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {elementOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
