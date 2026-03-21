import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-2xl rounded-full" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <UsersIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="px-3 py-1 bg-primary/20 border border-primary/50 text-primary-content text-xs font-bold rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            LIVE
          </div>
        </div>
        <div className="text-5xl font-black mb-1 text-white tracking-tight relative z-10">{activeSessionsCount}</div>
        <div className="text-sm text-base-content/60 font-medium relative z-10 uppercase tracking-wider">Active Sessions</div>
      </div>

      {/* Recent Count */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-secondary/50 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-2xl rounded-full" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
            <TrophyIcon className="w-6 h-6 text-secondary" />
          </div>
        </div>
        <div className="text-5xl font-black mb-1 text-white tracking-tight relative z-10">{recentSessionsCount}</div>
        <div className="text-sm text-base-content/60 font-medium relative z-10 uppercase tracking-wider">Total Sessions</div>
      </div>
    </div>
  );
}

export default StatsCards;
