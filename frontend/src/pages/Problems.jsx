import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems.js";
import { ChevronRightIcon, Code2Icon, FilterIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

const Problems = () => {
  const problems = Object.values(PROBLEMS);
  const [filter, setFilter] = useState("All");

  const filteredProblems =
    filter === "All"
      ? problems
      : problems.filter((p) => p.difficulty === filter);

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;

  const filters = [
    { label: "All", count: problems.length, color: "text-white" },
    { label: "Easy", count: easyCount, color: "text-success" },
    { label: "Medium", count: mediumCount, color: "text-warning" },
    { label: "Hard", count: hardCount, color: "text-error" },
  ];

  return (
    <div className="min-h-screen bg-[#07070d] bg-aurora text-white overflow-x-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none z-0" />
      <div className="absolute inset-0 bg-mesh pointer-events-none z-0" />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 md:mb-4 tracking-tight text-white text-glow">
            Training Grounds
          </h1>
          <p className="text-base md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed px-4">
            Hone your problem-solving abilities with our curated collection of
            technical challenges.
          </p>
        </motion.div>

        {/* FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 md:mb-10"
        >
          {filters.map((f) => (
            <motion.button
              key={f.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.label)}
              className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold tracking-wider transition-all duration-300 border ${
                filter === f.label
                  ? "bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06]"
              }`}
            >
              <span className={filter === f.label ? f.color : ""}>
                {f.label}
              </span>
              <span className="ml-1.5 text-[10px] opacity-50">({f.count})</span>
            </motion.button>
          ))}
        </motion.div>

        {/* PROBLEMS LIST */}
        <div className="space-y-3 md:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredProblems.map((problem, i) => (
              <motion.div
                key={problem.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                layout
              >
                <Link
                  to={`/problem/${problem.id}`}
                  className="block glass-card rounded-xl md:rounded-2xl p-4 md:p-6 group transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative z-10">
                    {/* LEFT SIDE */}
                    <div className="flex items-start gap-3 md:gap-5 flex-1 w-full min-w-0">
                      <div className="size-11 md:size-14 min-w-[44px] md:min-w-[56px] rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary/20 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                        <Code2Icon className="size-5 md:size-7 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                          <h2 className="text-base md:text-xl font-bold text-white group-hover:text-primary/90 transition-colors duration-300">
                            {problem.title}
                          </h2>
                          <span
                            className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                              problem.difficulty
                            )} border border-current/20 bg-current/10`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] md:text-xs font-bold text-primary/60 uppercase tracking-[0.2em]">
                            {problem.category}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-white/40 line-clamp-2 md:line-clamp-1 group-hover:text-white/60 transition-colors duration-300">
                          {problem.description.text}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs md:text-sm w-full md:w-auto justify-end">
                      <span className="group-hover:mr-1 transition-all duration-300">
                        Solve
                      </span>
                      <ChevronRightIcon className="size-4 md:size-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* STATS FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 md:mt-16 glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { label: "Total Arsenal", value: problems.length, color: "text-primary" },
              { label: "Easy", value: easyCount, color: "text-success" },
              { label: "Medium", value: mediumCount, color: "text-warning" },
              { label: "Hard", value: hardCount, color: "text-error" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`px-2 md:px-4 ${i > 0 ? "border-l border-white/[0.06]" : ""}`}
              >
                <div className="text-[10px] md:text-sm text-white/30 font-bold uppercase tracking-[0.15em] mb-1.5 md:mb-2">
                  {stat.label}
                </div>
                <div className={`text-3xl md:text-4xl font-black ${stat.color} text-glow-sm`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Problems;
