import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemDescription({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}) {
  return (
    <div className="h-full overflow-y-auto bg-transparent custom-scrollbar">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-start justify-between mb-3 relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {problem.title}
          </h1>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(problem.difficulty)} border border-current/20 bg-current/10`}
          >
            {problem.difficulty}
          </span>
        </div>
        <p className="text-sm font-bold text-primary/80 uppercase tracking-widest relative z-10">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-6 relative z-10">
          <select
            className="w-full bg-white/5 border border-white/10 hover:border-primary/40 focus:border-primary/70 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-2 text-sm text-white appearance-none transition-colors outline-none cursor-pointer"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id} className="bg-base-200">
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-2 h-2 border-b-2 border-r-2 border-white/50 transform rotate-45" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* PROBLEM DESC */}
        <div className="relative">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/50" />
            Description
          </h2>

          <div className="space-y-4 text-base leading-relaxed text-white/80">
            <p>{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm italic">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="relative pt-4 border-t border-white/5">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary/50" />
            Examples
          </h2>
          <div className="space-y-6">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-white/70 border border-white/20">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-white/90 text-sm tracking-wide">
                    Example {idx + 1}
                  </p>
                </div>
                <div className="bg-black/20 rounded-xl p-5 font-mono text-sm space-y-3 border border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span className="text-primary font-bold min-w-[70px] uppercase text-xs tracking-wider mb-1 sm:mb-0">
                      Input:
                    </span>
                    <span className="text-white/80 break-all">{example.input}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span className="text-success font-bold min-w-[70px] uppercase text-xs tracking-wider mb-1 sm:mb-0">
                      Output:
                    </span>
                    <span className="text-white/80 break-all">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-3 mt-3 border-t border-white/10">
                      <span className="text-white/60 font-sans text-xs leading-relaxed flex flex-col sm:flex-row sm:gap-2">
                        <span className="font-bold text-white/40 uppercase tracking-wider mb-1 sm:mb-0">Explanation:</span>
                        <span>{example.explanation}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="relative pt-4 border-t border-white/5">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent/50" />
            Constraints
          </h2>
          <ul className="space-y-3">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                <code className="text-sm font-mono text-white/70 bg-black/20 px-2 py-0.5 rounded border border-white/5">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
