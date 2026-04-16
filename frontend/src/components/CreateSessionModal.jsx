import { Code2Icon, LoaderIcon, PlusIcon, XIcon, SparklesIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { motion, AnimatePresence } from "framer-motion";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel relative z-10 w-full max-w-2xl rounded-2xl md:rounded-3xl p-6 md:p-8 border-white/15 shadow-[0_20px_80px_rgba(139,92,246,0.12),0_0_0_1px_rgba(139,92,246,0.05)]"
          >
            {/* Background accents */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/15">
                  <SparklesIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-black text-2xl md:text-3xl text-white tracking-tight">
                  New Session
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/[0.06] hover:border-white/10"
              >
                <XIcon className="w-5 h-5 text-white/60" />
              </motion.button>
            </div>

            <div className="space-y-6 md:space-y-8 relative z-10">
              {/* PROBLEM SELECTION */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm md:text-base font-bold text-white tracking-wide">
                    Select Problem{" "}
                    <span className="text-secondary">*</span>
                  </span>
                  <p className="text-xs md:text-sm text-white/40 mt-1">
                    Choose a scenario to tackle in this session
                  </p>
                </label>

                <div className="relative">
                  <select
                    className="w-full bg-white/[0.04] border border-white/[0.1] hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 md:py-3.5 text-white appearance-none transition-all duration-300 outline-none cursor-pointer text-sm md:text-base"
                    value={roomConfig.problem}
                    onChange={(e) => {
                      const selectedProblem = problems.find(
                        (p) => p.title === e.target.value
                      );
                      setRoomConfig({
                        difficulty: selectedProblem.difficulty,
                        problem: e.target.value,
                      });
                    }}
                  >
                    <option value="" disabled className="bg-[#0d0f18]">
                      Select a coding challenge...
                    </option>
                    {problems.map((problem) => (
                      <option
                        key={problem.id}
                        value={problem.title}
                        className="bg-[#0d0f18]"
                      >
                        {problem.title} ({problem.difficulty})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 border-b-2 border-r-2 border-white/40 transform rotate-45" />
                  </div>
                </div>
              </div>

              {/* ROOM SUMMARY */}
              <AnimatePresence>
                {roomConfig.problem && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="bg-success/[0.04] border border-success/15 rounded-xl md:rounded-2xl p-4 md:p-6 flex gap-3 md:gap-4">
                      <div className="p-2.5 md:p-3 bg-success/10 rounded-xl h-fit border border-success/15 shrink-0">
                        <Code2Icon className="size-5 md:size-6 text-success" />
                      </div>
                      <div>
                        <p className="font-bold text-base md:text-lg text-white mb-2 tracking-wide">
                          Room Configuration
                        </p>
                        <div className="space-y-1 text-xs md:text-sm text-white/50">
                          <p>
                            Challenge:{" "}
                            <span className="font-bold text-white">
                              {roomConfig.problem}
                            </span>
                          </p>
                          <p>
                            Capacity:{" "}
                            <span className="font-bold text-white">
                              2 Developers (Pair Session)
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 md:gap-4 mt-8 md:mt-10 relative z-10">
              <button
                className="px-6 py-3 font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider text-sm hover:bg-white/5 rounded-xl"
                onClick={onClose}
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 md:px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-fuchsia-600 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_4px_30px_rgba(139,92,246,0.25)] hover:shadow-[0_8px_40px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 border border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none uppercase tracking-wider text-sm btn-shimmer"
                onClick={onCreateRoom}
                disabled={isCreating || !roomConfig.problem}
              >
                {isCreating ? (
                  <LoaderIcon className="size-4 md:size-5 animate-spin" />
                ) : (
                  <PlusIcon className="size-4 md:size-5" />
                )}
                {isCreating ? "Initializing..." : "Create Room"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CreateSessionModal;
