
import { Home, Send, Users, FileText, BarChart3, Settings, ChevronLeft } from "lucide-react";
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
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    ariaLabel: "Dashboard"
  },
  {
    title: "Campaigns",
    icon: Send,
    url: "/campaigns",
    ariaLabel: "Campaigns"
  },
  {
    title: "Leads",
    icon: Users,
    url: "/leads",
    ariaLabel: "Leads"
  },
  {
    title: "Templates",
    icon: FileText,
    url: "/templates",
    ariaLabel: "Templates"
  },
  {
    title: "Statistics",
    icon: BarChart3,
    url: "/statistics",
    ariaLabel: "Statistics"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
    ariaLabel: "Settings"
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <Sidebar className={`border-r bg-white transition-all duration-200 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <h1 className="text-xl font-semibold text-blue-600">OutReach</h1>
              )}
              <button
                onClick={toggleSidebar}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                        className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-600"
                      >
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}
                          aria-label={item.ariaLabel}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-50 border-t border-gray-200 sm:hidden z-50">
        <div className="flex justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                location.pathname === item.url 
                  ? 'text-blue-600 bg-blue-100' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-label={item.ariaLabel}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1 truncate max-w-[60px]">{item.title.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile content padding to account for bottom tab bar */}
      <div className="h-16 sm:hidden" />
    </>
  );
}
