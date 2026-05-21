import { useMemo, useState } from "react";
import { Sparkles, BarChart3 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FRAMEWORKS, getFramework, type Beat } from "./frameworks";
import { estimatePageCount } from "./estimatePages";
import type { ScreenplayDocument } from "../types";

interface BeatSheetDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ScreenplayDocument;
  targetPages: number; // typical: 110 for feature, 60 for TV hour, etc.
}

export function BeatSheetDrawer({
  open,
  onOpenChange,
  document,
  targetPages,
}: BeatSheetDrawerProps) {
  const [frameworkId, setFrameworkId] = useState("save_the_cat");
  const framework = getFramework(frameworkId);

  const currentPage = useMemo(() => estimatePageCount(document), [document]);
  const currentPercent = Math.min(100, (currentPage / targetPages) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[60vh] sm:h-[55vh] p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pr-14 py-4 border-b border-border space-y-2">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <SheetTitle className="font-['Instrument_Serif'] text-2xl">
                  Beat Sheet
                </SheetTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                {framework.author} — {framework.description}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-xs text-muted-foreground">
                Page{" "}
                <span className="font-medium text-foreground tabular-nums">
                  {currentPage.toFixed(1)}
                </span>
                {" / "}
                <span className="tabular-nums">{targetPages}</span>
              </div>
              <Select value={frameworkId} onValueChange={setFrameworkId}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRAMEWORKS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetHeader>

        {/* Beat track */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <BeatTrack
            beats={framework.beats}
            currentPercent={currentPercent}
            targetPages={targetPages}
          />
        </div>

        <div className="border-t border-border px-6 py-3 bg-muted/30">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <Sparkles className="h-3 w-3 inline mr-1 -mt-0.5" />
            Soon: AI will auto-detect which scenes match each beat and flag
            structural pacing issues.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BeatTrack({
  beats,
  currentPercent,
  targetPages,
}: {
  beats: Beat[];
  currentPercent: number;
  targetPages: number;
}) {
  return (
    <div className="relative">
      {/* The horizontal track */}
      <div className="relative h-2 bg-muted rounded-full mb-1">
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 bg-amber-500/40 rounded-full transition-all duration-500"
          style={{ width: `${currentPercent}%` }}
        />
        {/* Current position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
          style={{ left: `${currentPercent}%` }}
        >
          <div className="h-4 w-4 rounded-full bg-amber-500 border-2 border-background shadow-md" />
        </div>
      </div>

      {/* Act dividers */}
      <div className="relative h-3 mb-6">
        <ActMark percent={25} label="Act II" />
        <ActMark percent={75} label="Act III" />
      </div>

      {/* Beat pins */}
      <div className="relative min-h-[200px]">
        {beats.map((beat, i) => (
          <BeatPin
            key={beat.id}
            beat={beat}
            targetPages={targetPages}
            isPassed={currentPercent >= beat.targetPercent}
            laneOffset={i % 4}
          />
        ))}
      </div>
    </div>
  );
}

function ActMark({ percent, label }: { percent: number; label: string }) {
  return (
    <div
      className="absolute top-0 -translate-x-1/2 text-[10px] uppercase tracking-wider text-muted-foreground"
      style={{ left: `${percent}%` }}
    >
      <div className="h-2 border-l border-border" />
      <span className="block mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

function BeatPin({
  beat,
  targetPages,
  isPassed,
  laneOffset,
}: {
  beat: Beat;
  targetPages: number;
  isPassed: boolean;
  laneOffset: number;
}) {
  const targetPage = Math.round((beat.targetPercent / 100) * targetPages);
  // Stagger vertically into 4 lanes so labels don't overlap
  const top = laneOffset * 48;

  return (
    <div
      className="absolute group"
      style={{ left: `${beat.targetPercent}%`, top: `${top}px` }}
    >
      <div className="-translate-x-1/2 flex flex-col items-center">
        {/* Tick */}
        <div
          className={cn(
            "h-3 w-px transition-colors",
            isPassed ? "bg-amber-500" : "bg-border",
          )}
        />
        {/* Label */}
        <div
          className={cn(
            "mt-1 px-2 py-1 rounded-md border text-[10px] whitespace-nowrap cursor-default transition-colors",
            isPassed
              ? "border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30",
          )}
          title={beat.description}
        >
          <span className="font-medium">{beat.name}</span>
          <span className="ml-1.5 tabular-nums opacity-60">p.{targetPage}</span>
        </div>
      </div>
    </div>
  );
}
