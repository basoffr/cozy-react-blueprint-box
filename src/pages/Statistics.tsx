
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatisticsContent } from "@/components/StatisticsContent";

const Statistics = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <StatisticsContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Statistics;
