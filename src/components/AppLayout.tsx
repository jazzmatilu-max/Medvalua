import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useDeficiency } from "@/contexts/DeficiencyContext";
import { Activity } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { combinedValue, chapterResults } = useDeficiency();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
            {chapterResults.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20">
                <Activity className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs font-medium text-muted-foreground">PCL Integral:</span>
                <span className="text-sm font-bold text-destructive">{combinedValue?.toFixed(2)}%</span>
              </div>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
