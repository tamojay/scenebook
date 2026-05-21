import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Check, Loader2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScreenplayEditor } from "@/editor/ScreenplayEditor";
import { projectsApi } from "@/lib/api/projects";
import { useDocument } from "@/lib/hooks/useDocument";
import { toFountain } from "@/editor/export/fountain";
import { downloadText, safeFilename } from "@/lib/utils";
import type { Project } from "@/lib/db/types";
import type { ScreenplayDocument } from "@/editor/types";
import { BookOpen } from "lucide-react";
import { StoryBibleSidebar } from "@/editor/storybible/StoryBibleSidebar";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "loaded"; project: Project };

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const { initialValue, saveStatus, onChange } = useDocument(id);
  const [currentDoc, setCurrentDoc] = useState<ScreenplayDocument | null>(null);
  const [storyBibleOpen, setStoryBibleOpen] = useState(false);
  const [jumpToIndex, setJumpToIndex] = useState<number | null>(null);

  // Load project
  useEffect(() => {
    if (!id) {
      setState({ status: "not-found" });
      return;
    }
    setState({ status: "loading" });
    projectsApi.get(id).then((project) => {
      setState(
        project ? { status: "loaded", project } : { status: "not-found" },
      );
    });
  }, [id]);

  // Seed currentDoc once initial document arrives
  useEffect(() => {
    if (initialValue) setCurrentDoc(initialValue);
  }, [initialValue]);

  const handleChange = (value: ScreenplayDocument) => {
    setCurrentDoc(value);
    onChange(value);
  };

  if (
    state.status === "loading" ||
    (state.status === "loaded" && initialValue === null)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (state.status === "not-found") {
    return <Navigate to="/" replace />;
  }

  const { project } = state;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b border-border flex items-center px-4 md:px-6 gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
          <Link to="/" aria-label="Back to projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-['Instrument_Serif'] text-xl truncate">
            {project.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <SaveIndicator status={saveStatus} />
          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => setStoryBibleOpen(true)}
          >
            <BookOpen className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Story Bible</span>
          </Button>
          <ExportMenu
            title={project.title}
            document={currentDoc ?? initialValue ?? []}
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <ScreenplayEditor
          initialValue={initialValue ?? undefined}
          onChange={handleChange}
          jumpToIndex={jumpToIndex}
        />
      </main>
      <StoryBibleSidebar
        open={storyBibleOpen}
        onOpenChange={setStoryBibleOpen}
        document={currentDoc ?? initialValue ?? []}
        onJumpTo={(index) => setJumpToIndex(index)}
      />
    </div>
  );
}

function SaveIndicator({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  if (status === "idle") return null;

  if (status === "saving") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Saving…
      </div>
    );
  }

  if (status === "saved") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5" />
        Saved
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5" />
      Error
    </div>
  );
}

function ExportMenu({
  title,
  document,
}: {
  title: string;
  document: ScreenplayDocument;
}) {
  const baseName = safeFilename(title);

  const handleFountain = () => {
    const content = toFountain(document);
    downloadText(`${baseName}.fountain`, content);
  };

  const handleJson = () => {
    const content = JSON.stringify(document, null, 2);
    downloadText(`${baseName}.json`, content, "application/json");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9">
          <Download className="h-4 w-4 mr-1.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleFountain}>
          <div className="flex flex-col">
            <span>Fountain</span>
            <span className="text-xs text-muted-foreground">
              .fountain — universal plaintext
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleJson}>
          <div className="flex flex-col">
            <span>JSON</span>
            <span className="text-xs text-muted-foreground">
              Raw editor data
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <div className="flex flex-col">
            <span>PDF (Preview)</span>
            <span className="text-xs text-muted-foreground">
              Browser print — production PDF coming soon
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
