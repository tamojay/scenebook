import { Link, useLocation } from "react-router-dom";
import { FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { to: "/", label: "Projects", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function LeftRail() {
  const location = useLocation();

  return (
    <nav className="hidden md:flex w-16 border-r border-border bg-background flex-col items-center py-4 gap-1">
      <TooltipProvider delayDuration={200}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <Link
                  to={to}
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
