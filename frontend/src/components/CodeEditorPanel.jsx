import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon, CheckCircleIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { motion } from "framer-motion";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-[#1a1a2e] flex flex-col relative overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5 md:py-3 bg-black/50 backdrop-blur-xl border-b border-white/[0.06] z-10 relative">
        {/* Running glow bar */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-gradient-shift"
            style={{ backgroundSize: "200% 100%" }}
          />
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1 md:p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage].icon}
              alt={LANGUAGE_CONFIG[selectedLanguage].name}
              className="w-4 h-4 md:w-5 md:h-5"
            />
          </div>
          <div className="relative">
            <select
              className="w-28 md:w-36 bg-white/[0.04] border border-white/[0.08] hover:border-white/15 rounded-lg pl-3 pr-8 py-1.5 text-xs md:text-sm text-white/80 appearance-none transition-all duration-300 outline-none cursor-pointer focus:border-primary/40 focus:ring-1 focus:ring-primary/20 font-medium tracking-wide"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-[#0d0f18]">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1.5 h-1.5 border-b border-r border-white/40 transform rotate-45" />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={!isRunning ? { scale: 1.05 } : {}}
          whileTap={!isRunning ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-bold text-[11px] md:text-sm tracking-wider transition-all duration-300 ${
            isRunning
              ? "bg-primary/20 text-primary/70 cursor-wait border border-primary/20"
              : "bg-primary/15 text-primary hover:bg-primary hover:text-white border border-primary/25 hover:border-transparent hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
          }`}
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
              <span className="hidden xs:inline">EXECUTING</span>
              <span className="xs:hidden">RUN</span>
            </>
          ) : (
            <>
              <PlayIcon className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
              <span className="hidden xs:inline">RUN CODE</span>
              <span className="xs:hidden">RUN</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: 14,
            lineHeight: 1.7,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderLineHighlight: "gutter",
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;
