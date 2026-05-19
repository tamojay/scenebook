import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  LogOut,
  Trash2,
  Check,
  Pencil,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/useAuth";
import { db } from "@/lib/db/client";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const handleSaveName = () => {
    if (!user || !nameValue.trim()) return;
    const updated = { ...user, name: nameValue.trim() };
    localStorage.setItem("scenebook:current_user", JSON.stringify(updated));
    setIsEditingName(false);
    // Quick & dirty: force a reload so AuthProvider re-reads localStorage.
    // We'll replace this with proper state update later.
    window.location.reload();
  };

  const handleDeleteAllData = async () => {
    await db.delete();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Instrument_Serif'] text-3xl md:text-4xl mb-1">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile section */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Profile
          </h2>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="h-9"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setIsEditingName(false);
                          setNameValue(user?.name ?? "");
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      className="h-9 w-9"
                      onClick={handleSaveName}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h3 className="font-['Instrument_Serif'] text-2xl truncate">
                      {user?.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setNameValue(user?.name ?? "");
                        setIsEditingName(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <Separator className="mb-4" />

            <Button variant="ghost" onClick={logout} className="text-sm">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </section>

        {/* Appearance section */}
        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Appearance
          </h2>

          <div className="rounded-lg border border-border bg-card p-6">
            <Label className="mb-3 block">Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md border p-4 transition-colors",
                    theme === value
                      ? "border-foreground bg-accent"
                      : "border-border hover:border-foreground/40 hover:bg-accent/50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <h2 className="text-sm font-medium text-destructive uppercase tracking-wider mb-4">
            Danger zone
          </h2>

          <div className="rounded-lg border border-destructive/30 bg-card p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">Delete all data</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently remove all screenplays and your account from this
                  browser.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete everything
              </Button>
            </div>
          </div>
        </section>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete all data?</DialogTitle>
              <DialogDescription>
                This will permanently delete all your screenplays and log you
                out. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAllData}>
                Delete everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
