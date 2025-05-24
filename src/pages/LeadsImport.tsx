
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LeadsImportContent } from "@/components/LeadsImportContent";

const LeadsImport = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <LeadsImportContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default LeadsImport;
