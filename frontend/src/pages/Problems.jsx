import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems.js";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { motion } from "framer-motion";

const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Problems = () => {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-base-100 bg-aurora text-base-content overflow-x-hidden relative">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-white text-glow">
            Training Grounds
          </h1>
          <p className="text-xl text-base-content/60 max-w-2xl mx-auto">
            Hone your problem-solving abilities with our curated collection of technical challenges.
          </p>
        </motion.div>

        {/* PROBLEMS LIST */}
        <motion.div 
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {problems.map((problem) => (
            <motion.div key={problem.id} variants={FADE_UP}>
              <Link
                to={`/problem/${problem.id}`}
                className="block glass-panel rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  {/* LEFT SIDE */}
                  <div className="flex items-start gap-5 flex-1 w-full">
                    <div className="size-14 min-w-[56px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      <Code2Icon className="size-7 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">{problem.title}</h2>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(problem.difficulty)} border border-current/20 bg-current/10`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-widest">{problem.category}</span>
                      </div>
                      <p className="text-sm text-base-content/60 line-clamp-2 md:line-clamp-1 group-hover:text-base-content/80 transition-colors">
                        {problem.description.text}
                      </p>
                    </div>
                  </div>
                  
                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mt-4 md:mt-0 w-full md:w-auto justify-end md:justify-center">
                    <span className="group-hover:mr-1 transition-all">Solve Challenge</span>
                    <ChevronRightIcon className="size-5 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* STATS FOOTER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 glass-panel rounded-3xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <div className="px-4">
              <div className="text-sm text-base-content/50 font-bold uppercase tracking-widest mb-2">Total Arsenal</div>
              <div className="text-4xl font-black text-primary text-glow">{problems.length}</div>
            </div>

            <div className="px-4">
              <div className="text-sm text-base-content/50 font-bold uppercase tracking-widest mb-2">Easy</div>
              <div className="text-4xl font-black text-success text-glow">{easyProblemsCount}</div>
            </div>
            
            <div className="px-4">
              <div className="text-sm text-base-content/50 font-bold uppercase tracking-widest mb-2">Medium</div>
              <div className="text-4xl font-black text-warning text-glow">{mediumProblemsCount}</div>
            </div>
            
            <div className="px-4">
              <div className="text-sm text-base-content/50 font-bold uppercase tracking-widest mb-2">Hard</div>
              <div className="text-4xl font-black text-error text-glow">{hardProblemsCount}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Problems;
