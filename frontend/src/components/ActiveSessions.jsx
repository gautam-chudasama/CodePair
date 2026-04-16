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
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 glass-panel rounded-2xl md:rounded-3xl p-5 md:p-6 h-full flex flex-col relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 md:mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-2.5 bg-gradient-to-br from-warning/15 to-warning/5 border border-warning/15 rounded-xl">
            <ZapIcon className="size-4 md:size-5 text-warning" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Live Exchange</h2>
        </div>

        <div className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
          <div className="relative">
            <div className="size-2 bg-success rounded-full" />
            <div className="absolute inset-0 size-2 bg-success rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-[10px] md:text-xs font-bold text-success uppercase tracking-wider">
            {sessions.length} active
          </span>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-3 md:space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar relative z-10 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 h-full">
            <div className="flex flex-col items-center gap-4">
              <LoaderIcon className="size-8 md:size-10 animate-spin text-primary" />
              <span className="text-sm text-white/30 font-medium">Loading sessions...</span>
            </div>
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session, i) => (
            <motion.div
              key={session._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="glass-card rounded-xl md:rounded-2xl group transition-all duration-500 hover:bg-white/[0.06] hover:border-primary/30 hover:-translate-y-0.5"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 p-4 md:p-5">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 w-full min-w-0">
                  <div className="relative size-11 md:size-14 rounded-xl md:rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:border-primary/20 transition-all duration-500">
                    <Code2Icon className="size-5 md:size-7 text-white/70 group-hover:text-primary transition-colors duration-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3 mb-1">
                      <h3 className="font-bold text-base md:text-lg text-white truncate group-hover:text-primary/90 transition-colors duration-300">
                        {session.problem}
                      </h3>
                      <span
                        className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                          session.difficulty
                        )} border border-current/20 bg-current/10 shrink-0`}
                      >
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-medium text-white/40 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <CrownIcon className="size-3 md:size-3.5 text-warning/70" />
                        <span>{session.host?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UsersIcon className="size-3 md:size-3.5" />
                        <span>{session.participant ? "2/2" : "1/2"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {session.participant && !isUserInSession(session) ? (
                  <button className="px-5 md:px-6 py-2 md:py-2.5 bg-white/[0.04] border border-white/[0.08] text-white/30 rounded-xl font-bold text-xs md:text-sm cursor-not-allowed uppercase tracking-wider w-full sm:w-auto text-center">
                    Full
                  </button>
                ) : (
                  <Link
                    to={`/session/${session._id}`}
                    className="px-5 md:px-6 py-2 md:py-2.5 bg-primary/15 hover:bg-primary border border-primary/30 hover:border-primary text-white rounded-xl font-bold text-xs md:text-sm transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto btn-shimmer"
                  >
                    {isUserInSession(session) ? "Rejoin" : "Join"}
                    <ArrowRightIcon className="size-3.5 md:size-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full py-12 md:py-16"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center">
                <SparklesIcon className="w-7 h-7 md:w-8 md:h-8 text-primary/50" />
              </div>
              {/* Floating decorative dots */}
              <div className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-primary/30 animate-float" />
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-secondary/30 animate-float-delay-1" />
            </div>
            <p className="text-lg md:text-xl font-bold text-white mb-2">No sessions found</p>
            <p className="text-xs md:text-sm text-white/40 max-w-xs text-center leading-relaxed">
              The lobby is quiet right now. Be the catalyst and start a new coding session!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;
