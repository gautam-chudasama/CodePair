import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-black/40 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage].icon}
              alt={LANGUAGE_CONFIG[selectedLanguage].name}
              className="w-5 h-5"
            />
          </div>
          <div className="relative">
            <select
              className="w-36 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pl-3 pr-8 py-1.5 text-sm text-white/90 appearance-none transition-colors outline-none cursor-pointer focus:border-primary/50 font-medium tracking-wide"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-base-200">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1.5 h-1.5 border-b border-r border-white/50 transform rotate-45" />
            </div>
          </div>
        </div>

        <button
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm tracking-wide transition-all ${
            isRunning 
              ? "bg-white/10 text-white/50 cursor-not-allowed" 
              : "bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/30 hover:border-transparent hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          }`}
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              EXECUTING
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4 fill-current" />
              RUN CODE
            </>
          )}
        </button>
      </div>

      <div className="flex-1 relative">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: 14,
            lineHeight: 1.6,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            OverviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
