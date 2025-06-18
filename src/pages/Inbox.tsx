
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { InboxContent } from "@/components/InboxContent";

export default function Inbox() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-gray-50">
          <InboxContent />
        </main>
      </div>
    </SidebarProvider>
  );
}
