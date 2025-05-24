
import { Bell, User } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { ActionButtons } from "@/components/ActionButtons";

// Placeholder data
const statsData = [
  {
    title: "Leads geïmporteerd:",
    value: "0",
  },
  {
    title: "E-mails verzonden:",
    value: "0",
  },
  {
    title: "Opens:",
    value: "0",
  },
  {
    title: "Replies:",
    value: "0",
  },
];

export function DashboardContent() {
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Performance Chart */}
      <div className="mb-8">
        <PerformanceChart />
      </div>

      {/* Action Buttons */}
      <ActionButtons />
    </div>
  );
}
