import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 glass-panel rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      
      {/* HEADERS SECTION */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        {/* TITLE AND ICON */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
            <ZapIcon className="size-5 text-warning" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">Live Exchange</h2>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-full">
          <div className="size-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-bold text-success uppercase tracking-wider">
            {sessions.length} active
          </span>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative z-10 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 h-full">
            <LoaderIcon className="size-10 animate-spin text-primary" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="relative size-14 rounded-2xl bg-base-300/50 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Code2Icon className="size-7 text-primary-content" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-white truncate">
                        {session.problem}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                          session.difficulty,
                        )} border border-current/20 bg-current/10`}
                      >
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-base-content/60 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <CrownIcon className="size-3.5 text-warning" />
                        <span>{session.host?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UsersIcon className="size-3.5" />
                        <span>
                          {session.participant ? "2/2" : "1/2"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {session.participant && !isUserInSession(session) ? (
                  <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-base-content/50 rounded-xl font-bold text-sm cursor-not-allowed uppercase tracking-wider w-full sm:w-auto">
                    Full
                  </button>
                ) : (
                  <Link
                    to={`/session/${session._id}`}
                    className="px-6 py-2.5 bg-primary/20 hover:bg-primary border border-primary/50 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {isUserInSession(session) ? "Rejoin Session" : "Join Session"}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <div className="w-20 h-20 mb-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <SparklesIcon className="w-8 h-8 text-primary/60" />
            </div>
            <p className="text-xl font-bold text-white mb-2">
              No sessions found
            </p>
            <p className="text-sm text-base-content/50 max-w-xs text-center">
              The lobby is quiet right now. Be the catalyst and start a new coding session!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ActiveSessions;
