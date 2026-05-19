import { AppShell } from "@/components/layout/AppShell";

export function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6 md:p-8">
        <h1 className="font-['Instrument_Serif'] text-4xl mb-2">Projects</h1>
        <p className="text-muted-foreground text-sm">
          Your screenplays live here.
        </p>
      </div>
    </AppShell>
  );
}
