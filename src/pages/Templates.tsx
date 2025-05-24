
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TemplatesContent } from "@/components/TemplatesContent";

const Templates = () => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <TemplatesContent />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default Templates;
