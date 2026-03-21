import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="glass-panel rounded-3xl p-8 mt-8 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
          <Clock className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-wide">Command History</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : sessions?.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className={`relative rounded-2xl p-6 transition-all duration-300 border ${
                session.status === "active"
                  ? "bg-success/5 border-success/20 hover:border-success/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/40"
              }`}
            >
              {session.status === "active" && (
                <div className="absolute -top-3 -right-3">
                  <div className="px-3 py-1 bg-success/20 border border-success/50 text-success text-xs font-bold rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    ACTIVE
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 mb-5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    session.status === "active"
                      ? "bg-success/20 border border-success/30"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  <Code2 className={`w-6 h-6 ${session.status === "active" ? "text-success" : "text-white"}`} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-bold text-lg text-white mb-1.5 truncate">
                    {session.problem}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(session.difficulty)} border border-current/20 bg-current/10`}
                  >
                    {session.difficulty}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm font-medium text-base-content/60 uppercase tracking-widest mb-6">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDistanceToNow(new Date(session.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>
                    {session.participant ? "2" : "1"} participant{session.participant ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-primary">
                  {session.status === "active" ? "Started" : "Completed"}
                </span>
                <span className="text-xs opacity-50 font-mono">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Trophy className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-xl font-bold text-white mb-2">
              No sessions yet
            </p>
            <p className="text-sm text-base-content/50 max-w-xs mx-auto">
              Your coding transcript is empty. Complete a session to start accumulating points!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentSessions;
