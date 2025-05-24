
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NewCampaignContent } from "@/components/NewCampaignContent";

const NewCampaign = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <NewCampaignContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default NewCampaign;
