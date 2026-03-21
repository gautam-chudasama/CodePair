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

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
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
    <div className="h-screen bg-base-100 bg-aurora flex flex-col overflow-hidden text-base-content relative">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 p-2 md:p-4 h-[calc(100vh-80px)] mt-4 relative z-10"
      >
        <div className="glass-panel w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <PanelGroup direction="horizontal">
            {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
            <Panel defaultSize={50} minSize={30} className="bg-base-100/30">
              <PanelGroup direction="vertical">
                {/* PROBLEM DSC PANEL */}
                <Panel defaultSize={50} minSize={20}>
                  <div className="h-full overflow-y-auto bg-transparent custom-scrollbar">
                    {/* HEADER SECTION */}
                    <div className="p-6 border-b border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
                      
                      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 relative z-10">
                        <div>
                          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                            {session?.problem || "Initializing..."}
                          </h1>
                          {problemData?.category && (
                            <p className="text-sm font-bold text-primary/80 uppercase tracking-widest mt-2 mb-1">
                              {problemData.category}
                            </p>
                          )}
                          <p className="text-sm text-base-content/60 flex items-center gap-2 mt-3">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              Host: {session?.host?.name || "..."}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-success" />
                              {session?.participant ? 2 : 1}/2 Active
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getDifficultyBadgeClass(
                              session?.difficulty,
                            )} border border-current/20 bg-current/10`}
                          >
                            {session?.difficulty ? session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1) : "Easy"}
                          </span>
                          
                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={endSessionMutation.isPending}
                              className="px-4 py-1.5 bg-error/20 text-error hover:bg-error hover:text-white border border-error/30 hover:border-transparent rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                              {endSessionMutation.isPending ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="w-4 h-4" />
                              )}
                              End Session
                            </button>
                          )}
                          {session?.status === "completed" && (
                            <span className="px-3 py-1 bg-white/10 text-white/50 border border-white/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-8">
                      {/* problem desc */}
                      {problemData?.description && (
                        <div className="relative">
                          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/50" />
                            Description
                          </h2>
                          <div className="space-y-4 text-base leading-relaxed text-white/80">
                            <p>
                              {problemData.description.text}
                            </p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm italic text-white/70">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* examples section */}
                      {problemData?.examples && problemData.examples.length > 0 && (
                        <div className="relative pt-4 border-t border-white/5">
                          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-secondary/50" />
                            Examples
                          </h2>

                          <div className="space-y-6">
                            {problemData.examples.map((example, idx) => (
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
                                  <div className="flex flex-col xl:flex-row xl:gap-4">
                                    <span className="text-primary font-bold min-w-[70px] uppercase text-xs tracking-wider mb-1 xl:mb-0">
                                      Input:
                                    </span>
                                    <span className="text-white/80 break-all">{example.input}</span>
                                  </div>
                                  <div className="flex flex-col xl:flex-row xl:gap-4">
                                    <span className="text-success font-bold min-w-[70px] uppercase text-xs tracking-wider mb-1 xl:mb-0">
                                      Output:
                                    </span>
                                    <span className="text-white/80 break-all">{example.output}</span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-3 mt-3 border-t border-white/10">
                                      <span className="text-white/60 font-sans text-xs flex flex-col xl:flex-row xl:gap-2 leading-relaxed">
                                        <span className="font-bold text-white/40 uppercase tracking-wider mb-1 xl:mb-0">
                                          Explanation:
                                        </span>
                                        <span>{example.explanation}</span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constraints */}
                      {problemData?.constraints && problemData.constraints.length > 0 && (
                        <div className="relative pt-4 border-t border-white/5">
                          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent/50" />
                            Constraints
                          </h2>
                          <ul className="space-y-3">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-3 items-start">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                                <code className="text-sm font-mono text-white/70 bg-black/20 px-2 py-0.5 rounded border border-white/5">
                                  {constraint}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-1.5 bg-white/5 hover:bg-primary/50 active:bg-primary transition-colors cursor-row-resize relative flex items-center justify-center group">
                  <div className="h-0.5 w-8 bg-white/20 group-hover:bg-white/80 rounded-full transition-colors" />
                </PanelResizeHandle>

                <Panel defaultSize={50} minSize={20}>
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={70} minSize={30} className="bg-base-100/30">
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value)}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <PanelResizeHandle className="h-1.5 bg-white/5 hover:bg-primary/50 active:bg-primary transition-colors cursor-row-resize relative flex items-center justify-center group">
                      <div className="h-0.5 w-8 bg-white/20 group-hover:bg-white/80 rounded-full transition-colors" />
                    </PanelResizeHandle>

                    <Panel defaultSize={30} minSize={15} className="bg-base-100/50">
                      <OutputPanel output={output} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-white/5 hover:bg-primary/50 active:bg-primary transition-colors cursor-col-resize relative flex items-center justify-center group">
              <div className="w-0.5 h-8 bg-white/20 group-hover:bg-white/80 rounded-full transition-colors" />
            </PanelResizeHandle>

            {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
            <Panel defaultSize={50} minSize={30} className="bg-[#0a0a0a]">
              <div className="h-full w-full overflow-hidden relative">
                {isInitializingCall ? (
                  <div className="h-full flex items-center justify-center flex-col relative z-10 bg-black/60 backdrop-blur-md">
                    <Loader2Icon className="w-12 h-12 animate-spin text-primary mb-6" />
                    <p className="text-xl font-bold text-white tracking-wide">Establishing Connection...</p>
                    <p className="text-sm text-white/50 mt-2">Securing peer-to-peer video streams</p>
                  </div>
                ) : !streamClient || !call ? (
                  <div className="h-full flex items-center justify-center relative z-10 bg-black/60 backdrop-blur-md">
                    <div className="glass-panel p-10 max-w-md text-center">
                      <div className="w-24 h-24 bg-error/10 border border-error/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <PhoneOffIcon className="w-10 h-10 text-error" />
                      </div>
                      <h2 className="text-2xl font-black text-white mb-3">Connection Failed</h2>
                      <p className="text-white/60">
                        Unable to establish connection to the remote environment. Please check your network or try refreshing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full relative z-10 bg-[#0a0a0a]">
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI chatClient={chatClient} channel={channel} />
                      </StreamCall>
                    </StreamVideo>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </motion.div>
    </div>
  );
}

export default SessionPage;
