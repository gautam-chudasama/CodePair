import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function RecentSessions({ sessions, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      className="glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8 mt-6 md:mt-8 relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8 relative z-10">
        <div className="p-2 md:p-2.5 bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/15 rounded-xl">
          <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Command History</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-16 md:py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primary" />
              <span className="text-sm text-white/30">Loading history...</span>
            </div>
          </div>
        ) : sessions?.length > 0 ? (
          sessions.map((session, i) => (
            <motion.div
              key={session._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className={`relative rounded-xl md:rounded-2xl p-5 md:p-6 transition-all duration-500 border group cursor-default ${
                session.status === "active"
                  ? "glass-card border-success/20 hover:border-success/40 shadow-[0_0_20px_rgba(16,185,129,0.06)]"
                  : "glass-card hover:border-white/15"
              }`}
            >
              {/* Active badge */}
              {session.status === "active" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2.5 -right-2.5"
                >
                  <div className="px-2.5 py-1 bg-success/15 border border-success/30 text-success text-[10px] font-bold rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5">
                    <div className="relative">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-success rounded-full animate-ping" />
                    </div>
                    ACTIVE
                  </div>
                </motion.div>
              )}

              {/* Icon + Title */}
              <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-5">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    session.status === "active"
                      ? "bg-success/10 border border-success/20 group-hover:bg-success/20"
                      : "bg-white/[0.04] border border-white/[0.08] group-hover:bg-primary/10 group-hover:border-primary/20"
                  }`}
                >
                  <Code2
                    className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                      session.status === "active"
                        ? "text-success"
                        : "text-white/60 group-hover:text-primary"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="font-bold text-base md:text-lg text-white mb-1.5 truncate group-hover:text-primary/90 transition-colors duration-300">
                    {session.problem}
                  </h3>
                  <span
                    className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                      session.difficulty
                    )} border border-current/20 bg-current/10`}
                  >
                    {session.difficulty}
                  </span>
                </div>
              </div>

              {/* Meta info */}
              <div className="space-y-2.5 text-xs md:text-sm font-medium text-white/35 uppercase tracking-widest mb-5 md:mb-6">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/25" />
                  <span>
                    {formatDistanceToNow(new Date(session.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/25" />
                  <span>
                    {session.participant ? "2" : "1"} participant
                    {session.participant ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/[0.06]">
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-primary">
                  {session.status === "active" ? "Started" : "Completed"}
                </span>
                <span className="text-[10px] md:text-xs opacity-30 font-mono">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-12 md:py-16"
          >
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white/40" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/30 animate-float" />
            </div>
            <p className="text-lg md:text-xl font-bold text-white mb-2">No sessions yet</p>
            <p className="text-xs md:text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
              Your coding transcript is empty. Complete a session to start building your history!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default RecentSessions;
