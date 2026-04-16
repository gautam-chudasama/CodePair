import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode.javascript,
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) =>
    navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    if (!output) return "";
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
          .replace(/'/g, '"')    // normalize quotes
          .replace(/\s+/g, " ") // collapse multiple spaces
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    if (!actualOutput || !expectedOutput) return false;
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual === normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="h-screen bg-[#07070d] bg-aurora flex flex-col overflow-hidden text-white relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none z-0 opacity-50" />

      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-2 md:p-4 h-[calc(100vh-80px)] mt-2 md:mt-4 relative z-10"
      >
        <div className="glass-panel w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {isMobile ? (
            /* MOBILE: Vertical stack with tabs */
            <div className="flex flex-col h-full">
              <div className="h-[40%] overflow-hidden border-b border-white/[0.06]">
                <ProblemDescription
                  problem={currentProblem}
                  currentProblemId={currentProblemId}
                  onProblemChange={handleProblemChange}
                  allProblems={Object.values(PROBLEMS)}
                />
              </div>
              <div className="h-[40%] border-b border-white/[0.06]">
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </div>
              <div className="h-[20%]">
                <OutputPanel output={output} />
              </div>
            </div>
          ) : (
            /* DESKTOP: Resizable panels */
            <PanelGroup direction="horizontal">
              {/* LEFT PANEL - Problem Desc */}
              <Panel defaultSize={40} minSize={25} className="bg-[#07070d]/50">
                <ProblemDescription
                  problem={currentProblem}
                  currentProblemId={currentProblemId}
                  onProblemChange={handleProblemChange}
                  allProblems={Object.values(PROBLEMS)}
                />
              </Panel>

              <PanelResizeHandle className="w-1 md:w-1.5 bg-white/[0.03] hover:bg-primary/40 active:bg-primary transition-colors duration-300 cursor-col-resize relative flex items-center justify-center group">
                <div className="w-0.5 h-8 bg-white/15 group-hover:bg-white/60 rounded-full transition-all duration-300 group-hover:h-12" />
              </PanelResizeHandle>

              {/* RIGHT PANEL - Code Editor & Output */}
              <Panel defaultSize={60} minSize={30}>
                <PanelGroup direction="vertical">
                  {/* Top Panel - Code Editor */}
                  <Panel defaultSize={70} minSize={30} className="bg-[#07070d]/30">
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1 md:h-1.5 bg-white/[0.03] hover:bg-primary/40 active:bg-primary transition-colors duration-300 cursor-row-resize relative flex items-center justify-center group">
                    <div className="h-0.5 w-8 bg-white/15 group-hover:bg-white/60 rounded-full transition-all duration-300 group-hover:w-12" />
                  </PanelResizeHandle>

                  {/* Bottom Panel - Output Panel */}
                  <Panel defaultSize={30} minSize={15} className="bg-[#07070d]/50">
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ProblemPage;
