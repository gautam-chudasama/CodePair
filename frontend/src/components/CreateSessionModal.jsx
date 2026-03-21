import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-base-100/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="glass-panel relative z-10 w-full max-w-2xl rounded-3xl p-8 m-4 border-white/20 shadow-[0_0_50px_rgba(139,92,246,0.15)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-3xl text-white tracking-tight">Create New Session</h3>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-white/10"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-base font-bold text-white tracking-wide">Select Problem <span className="text-secondary">*</span></span>
              <p className="text-sm text-base-content/60 mt-1">Choose a scenario to tackle in this session</p>
            </label>

            <div className="relative">
              <select
                className="w-full bg-white/5 border border-white/20 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-white appearance-none transition-colors outline-none cursor-pointer placeholder:text-base-content/50"
                value={roomConfig.problem}
                onChange={(e) => {
                  const selectedProblem = problems.find(
                    (p) => p.title === e.target.value,
                  );
                  setRoomConfig({
                    difficulty: selectedProblem.difficulty,
                    problem: e.target.value,
                  });
                }}
              >
                <option value="" disabled className="bg-base-200">
                  Select a coding challenge...
                </option>

                {problems.map((problem) => (
                  <option key={problem.id} value={problem.title} className="bg-base-200">
                    {problem.title} ({problem.difficulty})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 border-b-2 border-r-2 border-white/50 transform rotate-45" />
              </div>
            </div>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="bg-success/5 border border-success/20 rounded-2xl p-6 flex gap-4">
              <div className="p-3 bg-success/10 rounded-xl h-fit">
                <Code2Icon className="size-6 text-success" />
              </div>
              <div>
                <p className="font-bold text-lg text-white mb-2 tracking-wide">Room Configuration</p>
                <div className="space-y-1 text-sm text-base-content/70">
                  <p>
                    Challenge: <span className="font-bold text-white">{roomConfig.problem}</span>
                  </p>
                  <p>
                    Capacity: <span className="font-bold text-white">2 Developers (Pair Session)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-10">
          <button 
            className="px-6 py-3 font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wider text-sm" 
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2 border border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}
            {isCreating ? "Initializing..." : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateSessionModal;
