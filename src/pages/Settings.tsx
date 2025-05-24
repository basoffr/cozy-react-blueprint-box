
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SettingsContent } from "@/components/SettingsContent";

const Settings = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <SettingsContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Settings;
