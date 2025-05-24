
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { LeadsContent } from "@/components/LeadsContent";

const Leads = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <LeadsContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Leads;
