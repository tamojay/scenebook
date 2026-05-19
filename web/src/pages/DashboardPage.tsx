import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { ProjectsGrid } from "@/features/projects/ProjectsGrid";
import { NewProjectDialog } from "@/features/projects/NewProjectDialog";
import { projectsApi } from "@/lib/api/projects";
import { useAuth } from "@/features/auth/useAuth";
import type { Project, ProjectFormat } from "@/lib/db/types";

export function DashboardPage() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const projects = useLiveQuery(
    () => (user ? projectsApi.list(user.id) : Promise.resolve([])),
    [user?.id],
  );

  const isLoading = projects === undefined;
  const projectList = projects ?? [];

  const handleCreate = async (title: string, format: ProjectFormat) => {
    if (!user) return;
    await projectsApi.create({ title, format, userId: user.id });
  };

  const handleRename = async (project: Project) => {
    const newTitle = prompt("Rename screenplay", project.title);
    if (newTitle && newTitle.trim() && newTitle !== project.title) {
      await projectsApi.update(project.id, { title: newTitle.trim() });
    }
  };

  const handleDuplicate = async (project: Project) => {
    await projectsApi.duplicate(project.id);
  };

  const handleDelete = async (project: Project) => {
    if (confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      await projectsApi.delete(project.id);
    }
  };

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Instrument_Serif'] text-3xl md:text-4xl mb-1">
              Projects
            </h1>
            <p className="text-muted-foreground text-sm">
              {projectList.length === 0
                ? "Your screenplays will appear here"
                : `${projectList.length} screenplay${projectList.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {projectList.length > 0 && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New screenplay</span>
              <span className="sm:hidden">New</span>
            </Button>
          )}
        </div>

        <ProjectsGrid
          projects={projectList}
          isLoading={isLoading}
          onCreateClick={() => setDialogOpen(true)}
          onRename={handleRename}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />

        <NewProjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCreate={handleCreate}
        />
      </div>
    </AppShell>
  );
}
