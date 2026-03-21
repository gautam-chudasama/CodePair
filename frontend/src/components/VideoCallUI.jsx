import {
  CallControls,
  CallingState,
  SpeakerLayout,
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

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center relative z-10 bg-black/60 backdrop-blur-md">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-6" />
          <p className="text-xl font-bold text-white tracking-wide">Connecting to Peer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-4 relative str-video overflow-hidden p-4">
      <div className="flex-1 flex flex-col gap-4">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-4 glass-panel p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <UsersIcon className="w-5 h-5 text-primary" />
            <span className="font-bold text-white text-sm tracking-wide">
              {participantCount}{" "}
              {participantCount === 1 ? "Active Peer" : "Active Peers"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm tracking-wide transition-all border ${
                isChatOpen
                  ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="w-4 h-4" />
              SESSION CHAT
            </button>
          )}
        </div>

        {/* Video Area */}
        <div className="flex-1 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10">
          <SpeakerLayout />
        </div>

        {/* Call Controls */}
        <div className="glass-panel p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] flex justify-center z-10">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden bg-[#111111] border border-white/10 z-10 transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-80 lg:w-96 opacity-100" : "w-0 opacity-0 border-transparent overflow-hidden"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-black/40 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
                  <MessageSquareIcon className="w-4 h-4 text-primary" />
                  Terminal Chat
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
                  title="Close chat"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark custom-scrollbar bg-[#0a0a0a]">
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default VideoCallUI;
