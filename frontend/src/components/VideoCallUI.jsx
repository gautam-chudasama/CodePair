import {
  CallControls,
  CallingState,
  ParticipantView,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import { motion, AnimatePresence } from "framer-motion";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount, useParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const participants = useParticipants();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center relative z-10 bg-black/70 backdrop-blur-xl">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <Loader2Icon className="w-10 h-10 md:w-12 md:h-12 animate-spin text-primary" />
            <div className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 rounded-full animate-ping opacity-20 bg-primary" />
          </div>
          <p className="text-lg md:text-xl font-bold text-white tracking-wide">Connecting to Peer...</p>
          <p className="text-xs md:text-sm text-white/40 mt-2">Securing peer-to-peer video streams</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-2 md:gap-4 relative str-video overflow-hidden p-2 md:p-4">
      <div className="flex-1 flex flex-col gap-2 md:gap-4 min-w-0">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-2 md:gap-4 glass-card p-2.5 md:p-4 rounded-xl md:rounded-2xl z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 bg-white/[0.04] px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-white/[0.06]">
            <UsersIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="font-bold text-white text-xs md:text-sm tracking-wide">
              {participantCount}{" "}
              <span className="hidden sm:inline">
                {participantCount === 1 ? "Active Peer" : "Active Peers"}
              </span>
            </span>
          </div>
          {chatClient && channel && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-bold text-[10px] md:text-sm tracking-wider transition-all duration-300 border ${
                isChatOpen
                  ? "bg-primary/20 text-white border-primary/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                  : "bg-white/[0.04] text-white/60 border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">CHAT</span>
            </motion.button>
          )}
        </div>

        {/* Video Area - Custom Grid Layout */}
        <div className="flex-1 overflow-hidden relative z-10 min-h-0">
          <div className="codepair-video-grid h-full w-full flex flex-col gap-2">
            {participants.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/[0.06]">
                <div className="text-center">
                  <Loader2Icon className="w-8 h-8 animate-spin text-primary/40 mx-auto mb-3" />
                  <p className="text-sm text-white/40">Waiting for participants...</p>
                </div>
              </div>
            ) : participants.length === 1 ? (
              /* Single participant - take full space */
              <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_0_40px_rgba(0,0,0,0.4)] min-h-0">
                <ParticipantView
                  participant={participants[0]}
                  className="h-full w-full"
                />
              </div>
            ) : (
              /* Two participants - stack vertically, equal space */
              <>
                <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_0_40px_rgba(0,0,0,0.4)] min-h-0">
                  <ParticipantView
                    participant={participants[0]}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl md:rounded-2xl overflow-hidden relative border border-white/[0.06] shadow-[0_0_40px_rgba(0,0,0,0.4)] min-h-0">
                  <ParticipantView
                    participant={participants[1]}
                    className="h-full w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Call Controls */}
        <div className="glass-card p-2.5 md:p-4 rounded-xl md:rounded-2xl flex justify-center z-10 shrink-0">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-xl md:rounded-2xl overflow-hidden bg-[#0a0a14] border border-white/[0.06] z-10 w-64 sm:w-72 md:w-80 lg:w-96 shrink-0"
            >
              {/* Chat header */}
              <div className="bg-black/50 backdrop-blur-xl p-3 md:p-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
                  <MessageSquareIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  <span className="hidden sm:inline">Session Chat</span>
                  <span className="sm:hidden">Chat</span>
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/40 hover:text-white hover:bg-white/[0.08] p-1.5 md:p-2 rounded-lg transition-colors"
                  title="Close chat"
                >
                  <XIcon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>
              {/* Chat content */}
              <div className="flex-1 overflow-hidden stream-chat-dark custom-scrollbar bg-[#07070d]">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput focus />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default VideoCallUI;
