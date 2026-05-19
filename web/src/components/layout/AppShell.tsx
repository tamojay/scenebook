import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TopBar } from "./TopBar";
import { LeftRail } from "./LeftRail";

const navItems = [
  { to: "/", label: "Projects", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <LeftRail />

        {/* Mobile drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <nav className="flex flex-col py-4">
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
