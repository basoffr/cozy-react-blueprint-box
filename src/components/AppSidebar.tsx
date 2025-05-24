
import { Home, Send, Users, FileText, BarChart3, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Campaigns",
    icon: Send,
  },
  {
    title: "Leads",
    icon: Users,
  },
  {
    title: "Templates",
    icon: FileText,
  },
  {
    title: "Statistieken",
    icon: BarChart3,
  },
  {
    title: "Instellingen",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-6">
        <h1 className="text-xl font-semibold text-blue-600">OutReach</h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-600"
                  >
                    <a href="#" className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-gray-700 hover:bg-gray-100">
              <a href="#" className="flex items-center gap-3 px-3 py-2">
                <LogOut className="h-4 w-4" />
                <span>Log uit</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
