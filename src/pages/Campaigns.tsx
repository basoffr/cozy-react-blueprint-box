
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CampaignsContent } from "@/components/CampaignsContent";

const Campaigns = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <CampaignsContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Campaigns;
