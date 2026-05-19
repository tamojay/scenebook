import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/db/types";

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
  onCreateClick: () => void;
  onRename: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectsGrid({
  projects,
  isLoading,
  onCreateClick,
  onRename,
  onDuplicate,
  onDelete,
}: ProjectsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="font-['Instrument_Serif'] text-2xl mb-2">
          Your first scene awaits
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Create your first screenplay to begin. Every great film started here.
        </p>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          New screenplay
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* New project tile (matches card dimensions) */}
      <button
        onClick={onCreateClick}
        className="group rounded-lg border-2 border-dashed border-border hover:border-foreground/40 hover:bg-accent/30 transition-all flex flex-row md:flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground py-4 md:py-0 md:aspect-[3/4]"
      >
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-muted group-hover:bg-background flex items-center justify-center transition-colors">
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <span className="text-sm font-medium">New screenplay</span>
      </button>

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onRename={onRename}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
