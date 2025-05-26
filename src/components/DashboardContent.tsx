
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { dashboardApi } from "@/services/api";

export function DashboardContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardApi.getOverview,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <nav className="text-sm text-gray-500 mb-2">Dashboard</nav>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Administrator</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total leads" 
          value={isLoading ? "..." : (stats?.total_leads?.toString() || "0")} 
        />
        <StatsCard 
          title="E-mails verzonden" 
          value={isLoading ? "..." : (stats?.emails_sent?.toString() || "0")} 
        />
        <StatsCard 
          title="Opens" 
          value={isLoading ? "..." : (stats?.opens?.toString() || "0")} 
        />
        <StatsCard 
          title="Replies" 
          value={isLoading ? "..." : (stats?.replies?.toString() || "0")} 
        />
      </div>

      {/* Performance Chart */}
      <PerformanceChart />
    </div>
  );
}
