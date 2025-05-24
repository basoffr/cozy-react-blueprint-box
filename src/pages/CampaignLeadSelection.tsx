
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CampaignLeadSelectionContent } from "@/components/CampaignLeadSelectionContent";

const CampaignLeadSelection = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <CampaignLeadSelectionContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default CampaignLeadSelection;
