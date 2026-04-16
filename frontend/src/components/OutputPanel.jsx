import { TerminalIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function OutputPanel({ output }) {
  return (
    <div className="h-full bg-[#0d0d1a] flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-3 md:px-5 py-2.5 md:py-3 bg-black/50 backdrop-blur-xl border-b border-white/[0.06] flex items-center gap-2 z-10">
        <TerminalIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/40" />
        <span className="font-bold text-[10px] md:text-xs text-white/40 uppercase tracking-[0.15em]">
          Console Output
        </span>
        {output !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-auto"
          >
            {output.success ? (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-success/70">
                <CheckCircle2Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SUCCESS</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-error/70">
                <XCircleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ERROR</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-auto p-3 md:p-5 custom-scrollbar">
        <AnimatePresence mode="wait">
          {output === null ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <p className="text-white/20 text-xs md:text-sm font-mono flex items-center gap-2">
                <span className="inline-block w-2 h-4 bg-white/20 animate-typewriter-cursor rounded-[1px]" />
                Awaiting execution...
              </p>
            </motion.div>
          ) : output.success ? (
            <motion.pre
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs md:text-sm font-mono text-success/80 whitespace-pre-wrap leading-relaxed tracking-wide"
            >
              {output.output || "Program finished with no output."}
            </motion.pre>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-error/[0.06] border border-error/15 p-3 md:p-4 rounded-xl relative overflow-hidden"
            >
              {/* Red accent bar */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-error to-error/50 rounded-full" />
              
              {output.output && (
                <pre className="text-xs md:text-sm font-mono text-white/70 whitespace-pre-wrap mb-3 pb-3 border-b border-error/15 leading-relaxed pl-3">
                  {output.output}
                </pre>
              )}
              <pre className="text-xs md:text-sm font-mono text-error/80 whitespace-pre-wrap leading-relaxed font-semibold pl-3">
                {output.error}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OutputPanel;
