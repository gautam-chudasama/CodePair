import { TerminalIcon } from "lucide-react";

function OutputPanel({ output }) {
  return (
    <div className="h-full bg-[#111111] flex flex-col relative overflow-hidden">
      <div className="px-5 py-3 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center gap-2 z-10">
        <TerminalIcon className="w-4 h-4 text-white/50" />
        <span className="font-bold text-xs text-white/50 uppercase tracking-widest">
          Console Output
        </span>
      </div>
      
      <div className="flex-1 overflow-auto p-5 custom-scrollbar">
        {output === null ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-white/30 text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
              Awaiting execution...
            </p>
          </div>
        ) : output.success ? (
          <pre className="text-sm font-mono text-success/90 whitespace-pre-wrap leading-relaxed tracking-wide">
            {output.output || "Program finished with no output."}
          </pre>
        ) : (
          <div className="bg-error/10 border border-error/20 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error" />
            {output.output && (
              <pre className="text-sm font-mono text-white/80 whitespace-pre-wrap mb-4 pb-4 border-b border-error/20 leading-relaxed">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error/90 whitespace-pre-wrap leading-relaxed font-semibold">
              {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
