import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projectsApi } from "@/lib/api/projects";
import type { Project } from "@/lib/db/types";
import { ScreenplayEditor } from "@/editor/ScreenplayEditor";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "loaded"; project: Project };

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: "loading" });

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

  if (state.status === "loading") {
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
      </header>

      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <ScreenplayEditor />
        </div>
      </main>
    </div>
  );
}
