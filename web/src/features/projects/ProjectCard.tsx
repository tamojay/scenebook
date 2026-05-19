import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/db/types";

const formatLabels: Record<Project["format"], string> = {
  feature: "Feature",
  tv_hour: "TV Hour",
  tv_half: "TV Half",
  short: "Short",
};

interface ProjectCardProps {
  project: Project;
  onRename: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({
  project,
  onRename,
  onDuplicate,
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="group relative rounded-lg border border-border bg-card hover:shadow-md hover:border-foreground/20 transition-all duration-200">
      <Link
        to={`/projects/${project.id}`}
        className="block aspect-[3/4] p-6 flex flex-col"
      >
        {/* Faux screenplay preview */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-['Courier_Prime'] text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            FADE IN:
          </p>
          <p className="font-['Courier_Prime'] text-xs uppercase tracking-wider text-foreground/80 mb-2">
            INT. SCENE — DAY
          </p>
          <p className="font-['Courier_Prime'] text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
            The story begins. A blank page, waiting.
          </p>
        </div>

        {/* Title block */}
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="font-['Instrument_Serif'] text-xl leading-tight line-clamp-2">
            {project.title}
          </h3>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatLabels[project.format]}</span>
            <span>
              {formatDistanceToNow(new Date(project.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </Link>

      {/* Action menu — visible on hover, always visible on touch */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onRename(project)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(project)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(project)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
