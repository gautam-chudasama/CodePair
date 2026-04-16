import { useUser } from "@clerk/react";
import { ArrowRightIcon, TerminalIcon, SparklesIcon } from "lucide-react";
import { motion } from "framer-motion";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden group"
    >
      {/* Animated background orbs */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-primary/15 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/25 transition-all duration-700" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-secondary/20 transition-all duration-700" />
      
      {/* Floating decorative dots */}
      <div className="absolute top-6 right-[20%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-float" />
      <div className="absolute bottom-8 left-[30%] w-1 h-1 rounded-full bg-secondary/40 animate-float-delay-1" />
      <div className="absolute top-[40%] right-[10%] w-2 h-2 rounded-full bg-accent/30 animate-float-delay-2" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <SparklesIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary/70 uppercase tracking-[0.2em]">Command Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-3"
          >
            Welcome back,{" "}
            <span className="text-gradient-primary">
              {user?.firstName || "Hacker"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-white/50 max-w-md"
          >
            Your workspace is ready. What are we building today?
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateSession}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-fuchsia-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-[0_4px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.5)] transition-all duration-500 flex items-center justify-center gap-3 border border-primary/30 btn-shimmer"
        >
          <TerminalIcon className="w-5 h-5" />
          <span>New Session</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default WelcomeSection;
