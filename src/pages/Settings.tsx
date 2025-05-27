
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SettingsContent } from "@/components/SettingsContent";
import { SuccessToast } from "@/components/sequence/SuccessToast";

const Settings = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <SettingsContent />
          <SuccessToast />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Settings;
