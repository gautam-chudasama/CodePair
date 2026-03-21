import { Link } from "react-router";
import {
  ArrowRightIcon,
  Code2Icon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  TerminalIcon,
  LayersIcon,
  FingerprintIcon
} from "lucide-react";
import { SignInButton } from "@clerk/react";
import { motion } from "framer-motion";

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-base-content overflow-hidden relative selection:bg-primary/30">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Advanced Animated Aurora Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.2, 0.8, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50" 
        />
        <motion.div 
          animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0], scale: [1, 0.8, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen opacity-50" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-accent/10 blur-[100px] rounded-full mix-blend-screen opacity-30" 
        />
      </div>

      {/* NAVBAR: Floating Pill Design */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-full px-6 py-3 flex items-center justify-between"
      >
        <Link
          to={"/"}
          className="flex items-center gap-3 group"
        >
          <div className="relative size-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-fuchsia-500 to-secondary rounded-xl rotate-6 opacity-70 group-hover:rotate-12 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-[#0a0a0f]/90 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl backdrop-blur-sm border border-white/20"></div>
            <Code2Icon className="size-5 text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>

          <span className="font-black text-2xl tracking-tighter text-white">
            Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-500 to-secondary">Pair</span>
          </span>
        </Link>
        
        <SignInButton mode="modal">
          <button className="relative group overflow-hidden bg-white/5 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border border-white/10 hover:border-primary/50 hover:bg-white/10">
            <span className="relative z-10 flex items-center gap-2">
              <FingerprintIcon className="size-4 text-primary" />
              Sign In
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </SignInButton>
      </motion.nav>

      <div className="relative z-10 pt-32 pb-20 max-w-7xl mx-auto px-6">
        {/* HERO SECTION */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mt-20"
          variants={STAGGER}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-sm mb-10 group">
            <ZapIcon className="size-4 text-warning group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all" />
            <span className="font-bold tracking-wide text-white/90">The Next Gen Coding Platform</span>
          </motion.div>

          <motion.h1 
            variants={FADE_UP}
            className="text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tighter"
          >
            <span className="text-white drop-shadow-md">Code like</span> <br className="hidden md:block" />
            <span className="text-white drop-shadow-md">you're in the</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-fuchsia-400 to-secondary drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]">
              Future.
            </span>
          </motion.h1>

          <motion.p 
            variants={FADE_UP}
            className="text-xl md:text-2xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Elevate your pair programming experience with high-fidelity video chat, zero-latency code syncing, and a workspace designed for deep focus.
          </motion.p>

          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <SignInButton mode="modal">
              <button className="group relative w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-black text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 overflow-hidden">
                <span className="relative z-10">Launch Workspace</span>
                <ArrowRightIcon className="size-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </SignInButton>
          </motion.div>
        </motion.div>

        {/* BENTO BOX FEATURES SECTION */}
        <motion.div 
          className="mt-40"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            
            {/* Box 1 (Large - IDE Mockup) */}
            <div className="md:col-span-2 md:row-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-center overflow-hidden relative group hover:border-primary/30 transition-colors duration-500">
              <div className="absolute -right-20 -top-20 size-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />
              
              <div className="relative z-10 md:w-1/2">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/0 p-[1px] mb-8">
                  <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center border border-white/10">
                    <TerminalIcon className="size-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Zero-Latency IDE</h3>
                <p className="text-white/50 text-lg">Industry-standard Monaco editor with syntax highlighting for 40+ languages. See changes immediately.</p>
              </div>

              {/* 3D Mockup Graphic */}
              <div className="hidden md:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-80 h-56 bg-[#050505] border border-white/10 rounded-2xl shadow-2xl skew-y-6 rotate-3 group-hover:rotate-0 group-hover:skew-y-0 group-hover:-translate-x-4 transition-all duration-700 ease-out p-5">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-error/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-3 bg-primary/30 rounded-full" />
                    <div className="w-24 h-3 bg-white/20 rounded-full" />
                  </div>
                  <div className="w-4/5 h-3 bg-white/10 rounded-full ml-8" />
                  <div className="w-2/3 h-3 bg-white/10 rounded-full ml-16" />
                  <div className="w-1/3 h-3 bg-secondary/30 rounded-full ml-8" />
                  <div className="w-3/4 h-3 bg-white/10 rounded-full ml-8" />
                </div>
              </div>
            </div>

            {/* Box 2 (Small - Video) */}
            <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center group hover:bg-white/5 transition-colors overflow-hidden relative">
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="size-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-secondary/20 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                  <VideoIcon className="size-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Crystal Clear</h3>
                <p className="text-white/50 text-base">HD Video & Audio built right into your workspace.</p>
              </div>
            </div>

            {/* Box 3 (Small - Sync) */}
            <div className="md:col-span-1 md:row-span-1 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center group hover:bg-white/5 transition-colors overflow-hidden relative">
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="size-20 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-accent/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <UsersIcon className="size-8 text-accent" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Instant Sync</h3>
                <p className="text-white/50 text-base">Collaborate with your peers without stepping on toes.</p>
              </div>
            </div>

            {/* Box 4 (Large - Architecture) */}
            <div className="md:col-span-2 md:row-span-1 bg-[#111] backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col justify-center overflow-hidden relative group hover:border-white/20 transition-colors duration-500">
              <div className="absolute -left-20 -bottom-20 size-64 bg-accent/10 blur-[80px] rounded-full group-hover:bg-accent/20 transition-all duration-500" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none" />
              
              <div className="relative z-10 md:w-2/3 ml-auto text-right flex flex-col items-end">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/0 p-[1px] mb-8">
                  <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center border border-white/10">
                    <LayersIcon className="size-7 text-accent" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Seamless Workflow</h3>
                <p className="text-white/50 text-lg">Designed for flow-state. Everything you need to nail technical interviews and pair programming sessions.</p>
              </div>

              {/* Decorative nodes graphic */}
              <div className="hidden md:block absolute left-[5%] top-1/2 -translate-y-1/2">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  <div className="absolute inset-8 border border-accent/20 rounded-full animate-[spin_5s_linear_infinite]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 bg-accent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 size-3 bg-primary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)]" />
                  <div className="absolute bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2 size-3 bg-secondary rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                  <UsersIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-white/20" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
