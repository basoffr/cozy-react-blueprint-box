
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See Your Data Come to Life
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the power of beautiful, interactive dashboards that make complex data simple to understand.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Revenue"
              value="$45,231"
              change="+20.1%"
              positive={true}
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              title="Users"
              value="2,350"
              change="+15.3%"
              positive={true}
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Conversion"
              value="3.2%"
              change="+5.4%"
              positive={true}
            />
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              title="Bounce Rate"
              value="2.1%"
              change="-1.2%"
              positive={false}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">Revenue Trend</h3>
              <div className="h-48 bg-gradient-to-t from-purple-500/20 to-transparent rounded-lg flex items-end justify-center">
                <div className="text-white/50 text-center">
                  <div className="w-64 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-20 mb-4"></div>
                  Chart visualization would go here
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4">User Activity</h3>
              <div className="space-y-4">
                <ActivityItem
                  user="Sarah Wilson"
                  action="Created new project"
                  time="2 minutes ago"
                  avatar="SW"
                />
                <ActivityItem
                  user="Michael Chen"
                  action="Updated dashboard"
                  time="15 minutes ago"
                  avatar="MC"
                />
                <ActivityItem
                  user="Emma Davis"
                  action="Shared report"
                  time="1 hour ago"
                  avatar="ED"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, title, value, change, positive }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="text-purple-400">{icon}</div>
        <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
};

const ActivityItem = ({ user, action, time, avatar }: {
  user: string;
  action: string;
  time: string;
  avatar: string;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {avatar}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">
          <span className="font-medium">{user}</span> {action}
        </p>
        <p className="text-white/50 text-xs">{time}</p>
      </div>
    </div>
  );
};
