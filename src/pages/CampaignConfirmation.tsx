
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CampaignConfirmationContent } from "@/components/CampaignConfirmationContent";

const CampaignConfirmation = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <CampaignConfirmationContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default CampaignConfirmation;
