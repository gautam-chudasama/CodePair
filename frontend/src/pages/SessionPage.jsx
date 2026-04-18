import { useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import { motion } from "framer-motion";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    problemData?.starterCode?.[selectedLanguage] || "",
  );

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
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

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success && problemData) {
      const expectedOutput = problemData.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
      
      if (testsPassed) {
        triggerConfetti();
        toast.success("Awesome! Both of you passed all test cases! 🎉");
      } else {
        toast.error("Tests failed. Keep trying together!");
      }
    } else if (!result.success) {
      toast.error("Code execution failed!");
    }
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified.",
      )
    ) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, {
        onSuccess: () => navigate("/dashboard"),
      });
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
            /* MOBILE: Scrollable vertical stack */
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
              {/* Problem Header (compact) */}
              <div className="p-3 border-b border-white/[0.06] bg-black/30 shrink-0 sticky top-0 z-20">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h1 className="text-base font-black text-white tracking-tight truncate">
                      {session?.problem || "Loading..."}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        {session?.host?.name || "..."}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {session?.participant ? "2/2" : "1/2"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                        session?.difficulty
                      )} border border-current/20 bg-current/10`}
                    >
                      {session?.difficulty
                        ? session.difficulty.slice(0, 1).toUpperCase() +
                          session.difficulty.slice(1)
                        : "Easy"}
                    </span>
                    {isHost && session?.status === "active" && (
                      <button
                        onClick={handleEndSession}
                        disabled={endSessionMutation.isPending}
                        className="p-1.5 bg-error/15 text-error border border-error/20 rounded-lg text-[10px]"
                      >
                        <LogOutIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Code Editor — fixed height so it doesn't collapse */}
              <div className="shrink-0 border-b border-white/[0.06]" style={{ height: "max(360px, 50vh)" }}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={(value) => setCode(value)}
                  onRunCode={handleRunCode}
                />
              </div>

              {/* Output — fixed minimum height */}
              <div className="shrink-0 border-b border-white/[0.06]" style={{ minHeight: "120px", height: "150px" }}>
                <OutputPanel output={output} />
              </div>

              {/* Video/Chat — fixed height so it's always visible when scrolled to */}
              <div className="shrink-0 bg-[#07070d]" style={{ height: "max(320px, 45vh)" }}>
                {isInitializingCall ? (
                  <div className="h-full flex items-center justify-center bg-black/60">
                    <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !streamClient || !call ? (
                  <div className="h-full flex items-center justify-center bg-black/60">
                    <div className="text-center p-4">
                      <PhoneOffIcon className="w-8 h-8 text-error/60 mx-auto mb-2" />
                      <p className="text-xs text-white/40">Connection failed</p>
                    </div>
                  </div>
                ) : (
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                )}
              </div>
            </div>
          ) : (
            /* DESKTOP: 3-column IDE Layout */
            <PanelGroup direction="horizontal">
              {/* LEFT PANEL - PROBLEM DETAILS */}
              <Panel defaultSize={30} minSize={20} className="bg-[#07070d]/30">
                <div className="h-full overflow-y-auto bg-transparent custom-scrollbar">
                  {/* HEADER SECTION */}
                  <div className="p-4 md:p-6 border-b border-white/[0.06] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 blur-[60px] rounded-full pointer-events-none" />

                    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 relative z-10">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
                          {session?.problem || "Initializing..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-xs md:text-sm font-bold text-primary/60 uppercase tracking-[0.2em] mt-2 mb-1">
                            {problemData.category}
                          </p>
                        )}
                        <p className="text-xs md:text-sm text-white/40 flex items-center gap-2 mt-3 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Host: {session?.host?.name || "..."}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            {session?.participant ? 2 : 1}/2 Active
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <span
                          className={`text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                            session?.difficulty
                          )} border border-current/20 bg-current/10`}
                        >
                          {session?.difficulty
                            ? session.difficulty.slice(0, 1).toUpperCase() +
                              session.difficulty.slice(1)
                            : "Easy"}
                        </span>

                        {isHost && session?.status === "active" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="px-3 md:px-4 py-1.5 bg-error/10 text-error hover:bg-error hover:text-white border border-error/20 hover:border-transparent rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 md:gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            )}
                            End Session
                          </motion.button>
                        )}
                        {session?.status === "completed" && (
                          <span className="px-3 py-1 bg-white/[0.06] text-white/40 border border-white/[0.08] rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 space-y-6 md:space-y-8">
                    {/* problem desc */}
                    {problemData?.description && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                      >
                        <h2 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/50" />
                          Description
                        </h2>
                        <div className="space-y-3 md:space-y-4 text-sm md:text-base leading-relaxed text-white/70">
                          <p>{problemData.description.text}</p>
                          {problemData.description.notes?.map(
                            (note, idx) => (
                              <p
                                key={idx}
                                className="p-3 md:p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs md:text-sm italic text-white/60"
                              >
                                {note}
                              </p>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* examples section */}
                    {problemData?.examples &&
                      problemData.examples.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="relative pt-4 border-t border-white/[0.04]"
                        >
                          <h2 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary/50" />
                            Examples
                          </h2>

                          <div className="space-y-4 md:space-y-6">
                            {problemData.examples.map((example, idx) => (
                              <div key={idx} className="group">
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/[0.06] text-[10px] md:text-xs font-bold flex items-center justify-center text-white/60 border border-white/[0.08]">
                                    {idx}
                                  </span>
                                  <p className="font-bold text-white/80 text-xs md:text-sm tracking-wide">
                                    Example {idx + 1}
                                  </p>
                                </div>
                                <div className="bg-black/20 rounded-xl p-3 md:p-5 font-mono text-xs md:text-sm space-y-2 md:space-y-3 border border-white/[0.04] group-hover:border-white/[0.08] transition-colors duration-500">
                                  <div className="flex flex-col xl:flex-row xl:gap-4">
                                    <span className="text-primary font-bold min-w-[60px] md:min-w-[70px] uppercase text-[10px] md:text-xs tracking-wider mb-1 xl:mb-0">
                                      Input:
                                    </span>
                                    <span className="text-white/70 break-all">
                                      {example.input}
                                    </span>
                                  </div>
                                  <div className="flex flex-col xl:flex-row xl:gap-4">
                                    <span className="text-success font-bold min-w-[60px] md:min-w-[70px] uppercase text-[10px] md:text-xs tracking-wider mb-1 xl:mb-0">
                                      Output:
                                    </span>
                                    <span className="text-white/70 break-all">
                                      {example.output}
                                    </span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-2 md:pt-3 mt-2 md:mt-3 border-t border-white/[0.06]">
                                      <span className="text-white/50 font-sans text-[10px] md:text-xs flex flex-col xl:flex-row xl:gap-2 leading-relaxed">
                                        <span className="font-bold text-white/30 uppercase tracking-wider mb-1 xl:mb-0">
                                          Explanation:
                                        </span>
                                        <span>
                                          {example.explanation}
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                    {/* Constraints */}
                    {problemData?.constraints &&
                      problemData.constraints.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="relative pt-4 border-t border-white/[0.04]"
                        >
                          <h2 className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-3 md:mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent/50" />
                            Constraints
                          </h2>
                          <ul className="space-y-2 md:space-y-3">
                            {problemData.constraints.map(
                              (constraint, idx) => (
                                <li
                                  key={idx}
                                  className="flex gap-2 md:gap-3 items-start"
                                >
                                  <div className="mt-1.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent/40 shrink-0" />
                                  <code className="text-xs md:text-sm font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded border border-white/[0.04]">
                                    {constraint}
                                  </code>
                                </li>
                              )
                            )}
                          </ul>
                        </motion.div>
                      )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="w-1 md:w-1.5 bg-white/[0.03] hover:bg-primary/40 active:bg-primary transition-colors duration-300 cursor-col-resize relative flex items-center justify-center group">
                <div className="w-0.5 h-8 bg-white/15 group-hover:bg-white/60 rounded-full transition-all duration-300 group-hover:h-12" />
              </PanelResizeHandle>

              {/* MIDDLE PANEL - CODE EDITOR & OUTPUT */}
              <Panel defaultSize={45} minSize={30} className="bg-[#07070d]/30">
                <PanelGroup direction="vertical">
                  <Panel
                    defaultSize={70}
                    minSize={20}
                    className="bg-[#07070d]/30"
                  >
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1 md:h-1.5 bg-white/[0.03] hover:bg-primary/40 active:bg-primary transition-colors duration-300 cursor-row-resize relative flex items-center justify-center group">
                    <div className="h-0.5 w-8 bg-white/15 group-hover:bg-white/60 rounded-full transition-all duration-300 group-hover:w-12" />
                  </PanelResizeHandle>

                  <Panel
                    defaultSize={30}
                    minSize={15}
                    className="bg-[#07070d]/50"
                  >
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>

              <PanelResizeHandle className="w-1 md:w-1.5 bg-white/[0.03] hover:bg-primary/40 active:bg-primary transition-colors duration-300 cursor-col-resize relative flex items-center justify-center group">
                <div className="w-0.5 h-8 bg-white/15 group-hover:bg-white/60 rounded-full transition-all duration-300 group-hover:h-12" />
              </PanelResizeHandle>

              {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
              <Panel defaultSize={25} minSize={15} className="bg-[#07070d]">
                <div className="h-full w-full overflow-hidden relative">
                  {isInitializingCall ? (
                    <div className="h-full flex items-center justify-center flex-col relative z-10 bg-black/70 backdrop-blur-xl">
                      <div className="relative mb-6">
                        <Loader2Icon className="w-10 h-10 md:w-12 md:h-12 animate-spin text-primary" />
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
                      </div>
                      <p className="text-lg md:text-xl font-bold text-white tracking-wide text-center px-4">
                        Establishing Connection...
                      </p>
                      <p className="text-xs md:text-sm text-white/40 mt-2 text-center px-4">
                        Securing peer-to-peer video streams
                      </p>
                    </div>
                  ) : !streamClient || !call ? (
                    <div className="h-full flex items-center justify-center relative z-10 bg-black/70 backdrop-blur-xl p-4">
                      <div className="glass-card p-6 max-w-sm text-center rounded-2xl">
                        <div className="w-16 h-16 bg-error/8 border border-error/15 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(239,68,68,0.12)]">
                          <PhoneOffIcon className="w-8 h-8 text-error/70" />
                        </div>
                        <h2 className="text-lg md:text-xl font-black text-white mb-2">
                          Connection Failed
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm leading-relaxed">
                          Unable to establish connection to the remote
                          environment. Please try refreshing.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full relative z-10 bg-[#07070d]">
                      <StreamVideo client={streamClient}>
                        <StreamCall call={call}>
                          <VideoCallUI
                            chatClient={chatClient}
                            channel={channel}
                          />
                        </StreamCall>
                      </StreamVideo>
                    </div>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default SessionPage;
