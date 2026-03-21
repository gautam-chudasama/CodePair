import { useUser } from "@clerk/react";
import { ArrowRightIcon, Code2Icon, TerminalIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-secondary/20 blur-3xl rounded-full pointer-events-none group-hover:bg-secondary/30 transition-colors duration-500" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <Code2Icon className="w-6 h-6 text-primary-content" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white text-glow tracking-tight">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {user?.firstName || "Hacker"}
              </span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-base-content/60 md:ml-16">
            Your workspace is ready. What are we building today?
          </p>
        </div>

        <button
          onClick={onCreateSession}
          className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 border border-primary/50"
        >
          <TerminalIcon className="w-6 h-6" />
          <span>New Session</span>
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;
