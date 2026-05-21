import { useMemo } from "react";
import { Users, MapPin, X, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { extractStoryBible } from "./extract";
import type { ScreenplayDocument } from "../types";

interface StoryBibleSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ScreenplayDocument;
  onJumpTo: (nodeIndex: number) => void;
}

export function StoryBibleSidebar({
  open,
  onOpenChange,
  document,
  onJumpTo,
}: StoryBibleSidebarProps) {
  const data = useMemo(() => extractStoryBible(document), [document]);

  const handleJump = (index: number) => {
    onJumpTo(index);
    // On mobile, close the sheet so user can see where they jumped
    if (window.matchMedia("(max-width: 768px)").matches) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pr-14 py-4 border-b border-border space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <SheetTitle className="font-['Instrument_Serif'] text-2xl">
              Story Bible
            </SheetTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Auto-extracted from your script
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          {/* Characters section */}
          <section className="px-6 py-5">
            <SectionHeader
              icon={Users}
              title="Characters"
              count={data.characters.length}
            />

            {data.characters.length === 0 ? (
              <EmptyHint>
                No characters yet. Add a character cue to see it here.
              </EmptyHint>
            ) : (
              <ul className="space-y-1">
                {data.characters.map((char) => (
                  <EntityRow
                    key={char.name}
                    label={char.name}
                    sublabel={`${char.appearances} ${
                      char.appearances === 1 ? "scene" : "scenes"
                    }`}
                    onClick={() => handleJump(char.firstAppearanceIndex)}
                  />
                ))}
              </ul>
            )}
          </section>

          <div className="border-t border-border" />

          {/* Locations section */}
          <section className="px-6 py-5">
            <SectionHeader
              icon={MapPin}
              title="Locations"
              count={data.locations.length}
            />

            {data.locations.length === 0 ? (
              <EmptyHint>
                No locations yet. Add a scene heading like "INT. CAFE — DAY".
              </EmptyHint>
            ) : (
              <ul className="space-y-1">
                {data.locations.map((loc) => (
                  <EntityRow
                    key={`${loc.intExt}::${loc.name}`}
                    label={loc.name}
                    badge={loc.intExt}
                    sublabel={`${loc.appearances} ${
                      loc.appearances === 1 ? "scene" : "scenes"
                    }`}
                    onClick={() => handleJump(loc.firstAppearanceIndex)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Footer note about future AI */}
        <div className="border-t border-border px-6 py-3 bg-muted/30">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <Sparkles className="h-3 w-3 inline mr-1 -mt-0.5" />
            Soon: AI will track character knowledge, flag continuity issues, and
            suggest backstory.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      {count > 0 && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground italic py-2">{children}</p>
  );
}

function EntityRow({
  label,
  sublabel,
  badge,
  onClick,
}: {
  label: string;
  sublabel: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="w-full text-left flex items-center justify-between gap-2 py-2 px-2 -mx-2 rounded-md hover:bg-accent transition-colors group"
      >
        <div className="flex items-center gap-2 min-w-0">
          {badge && (
            <Badge variant="outline" className="text-[10px] font-mono shrink-0">
              {badge}
            </Badge>
          )}
          <span className="font-['Courier_Prime'] text-sm truncate">
            {label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 group-hover:text-foreground transition-colors">
          {sublabel}
        </span>
      </button>
    </li>
  );
}
