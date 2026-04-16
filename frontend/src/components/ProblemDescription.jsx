import { getDifficultyBadgeClass } from "../lib/utils";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}) {
  return (
    <div className="h-full overflow-y-auto bg-transparent custom-scrollbar">
      {/* HEADER SECTION */}
      <div className="p-4 md:p-6 border-b border-white/[0.06] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {problem.title}
          </h1>
          <span
            className={`text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
              problem.difficulty
            )} border border-current/20 bg-current/10 shrink-0 w-fit`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-xs md:text-sm font-bold text-primary/70 uppercase tracking-[0.2em] relative z-10">
          {problem.category}
        </p>

        {/* Problem selector */}
        <div className="mt-4 md:mt-6 relative z-10">
          <select
            className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-primary/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 md:px-4 py-2 text-xs md:text-sm text-white appearance-none transition-all duration-300 outline-none cursor-pointer"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0d0f18]">
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
          <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-2 h-2 border-b-2 border-r-2 border-white/40 transform rotate-45" />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6 md:space-y-8">
        {/* PROBLEM DESC */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative"
        >
          <h2 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/50" />
            Description
          </h2>

          <div className="space-y-3 md:space-y-4 text-sm md:text-base leading-relaxed text-white/70">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p
                key={idx}
                className="p-3 md:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs md:text-sm italic text-white/60"
              >
                {note}
              </p>
            ))}
          </div>
        </motion.div>

        {/* EXAMPLES SECTION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ delay: 0.1 }}
          className="relative pt-4 border-t border-white/[0.04]"
        >
          <h2 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary/50" />
            Examples
          </h2>
          <div className="space-y-4 md:space-y-6">
            {problem.examples.map((example, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
                className="group"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/[0.06] text-[10px] md:text-xs font-bold flex items-center justify-center text-white/60 border border-white/[0.08]">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-white/80 text-xs md:text-sm tracking-wide">
                    Example {idx + 1}
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 md:p-5 font-mono text-xs md:text-sm space-y-2 md:space-y-3 border border-white/[0.04] group-hover:border-white/[0.08] transition-colors duration-500">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span className="text-primary font-bold min-w-[60px] md:min-w-[70px] uppercase text-[10px] md:text-xs tracking-wider mb-1 sm:mb-0">
                      Input:
                    </span>
                    <span className="text-white/70 break-all">
                      {example.input}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span className="text-success font-bold min-w-[60px] md:min-w-[70px] uppercase text-[10px] md:text-xs tracking-wider mb-1 sm:mb-0">
                      Output:
                    </span>
                    <span className="text-white/70 break-all">
                      {example.output}
                    </span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 md:pt-3 mt-2 md:mt-3 border-t border-white/[0.06]">
                      <span className="text-white/50 font-sans text-[10px] md:text-xs leading-relaxed flex flex-col sm:flex-row sm:gap-2">
                        <span className="font-bold text-white/30 uppercase tracking-wider mb-1 sm:mb-0">
                          Explanation:
                        </span>
                        <span>{example.explanation}</span>
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CONSTRAINTS */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ delay: 0.2 }}
          className="relative pt-4 border-t border-white/[0.04]"
        >
          <h2 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent/50" />
            Constraints
          </h2>
          <ul className="space-y-2 md:space-y-3">
            {problem.constraints.map((constraint, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="flex gap-2 md:gap-3 items-start"
              >
                <div className="mt-1.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent/40 shrink-0" />
                <code className="text-xs md:text-sm font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded border border-white/[0.04]">
                  {constraint}
                </code>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default ProblemDescription;
