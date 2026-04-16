import { Link } from "react-router";
import {
  ArrowRightIcon,
  Code2Icon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  TerminalIcon,
  LayersIcon,
  FingerprintIcon,
  GithubIcon,
  SparklesIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── Animation Variants ─── */
const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Particle Field Component ─── */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(60, Math.floor(window.innerWidth / 25));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ─── Bento Feature Box ─── */
function BentoBox({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass-card rounded-2xl md:rounded-3xl relative overflow-hidden group transition-all duration-700 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main Home Component ─── */
const Home = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  return (
    <div
      className="min-h-screen bg-[#07070d] text-white overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Particle Field */}
      <ParticleField />

      {/* Dot Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-grid-dots z-0" />

      {/* Animated Aurora Orbs with parallax */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
          className="absolute top-[-15%] left-[-15%] w-[55vw] h-[55vw] bg-primary/15 blur-[140px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{
            x: [0, -60, 60, 0],
            y: [0, 60, -60, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ x: mousePos.x * -0.3, y: mousePos.y * -0.3 }}
          className="absolute bottom-[-15%] right-[-15%] w-[50vw] h-[50vw] bg-secondary/8 blur-[140px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
          className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-accent/8 blur-[120px] rounded-full mix-blend-screen"
        />
      </div>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl glass-panel rounded-2xl md:rounded-full px-4 md:px-6 py-3 flex items-center justify-between"
      >
        <Link to={"/"} className="flex items-center gap-2.5 group">
          <div className="relative size-9 md:size-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-fuchsia-500 to-secondary rounded-xl rotate-6 opacity-60 group-hover:rotate-12 group-hover:opacity-100 transition-all duration-500 blur-[1px]" />
            <div className="absolute inset-[1px] bg-[#07070d]/90 rounded-xl" />
            <div className="absolute inset-[1px] bg-gradient-to-br from-primary/15 to-secondary/15 rounded-xl border border-white/15" />
            <Code2Icon className="size-4.5 md:size-5 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tighter">
            Code<span className="text-gradient-primary">Pair</span>
          </span>
        </Link>

        <SignInButton mode="modal">
          <button className="relative group/btn overflow-hidden bg-white/[0.04] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 border border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.08] btn-shimmer">
            <span className="relative z-10 flex items-center gap-2">
              <FingerprintIcon className="size-3.5 md:size-4 text-primary" />
              Sign In
            </span>
          </button>
        </SignInButton>
      </motion.nav>

      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-28 md:pt-32 pb-16 md:pb-20 max-w-7xl mx-auto px-4 md:px-6">
        {/* HERO SECTION */}
        <motion.div
          className="text-center max-w-4xl mx-auto mt-10 md:mt-20"
          variants={STAGGER}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={FADE_UP}
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass-card text-xs md:text-sm mb-8 md:mb-10 group"
          >
            <ZapIcon className="size-3.5 md:size-4 text-warning group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-500" />
            <span className="font-bold tracking-wide text-white/80">
              The Next Gen Coding Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={FADE_UP}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 leading-[1.05] tracking-tighter"
          >
            <span className="text-white">Code like</span>{" "}
            <br className="hidden sm:block" />
            <span className="text-white">you're in the </span>
            <span className="text-gradient-primary drop-shadow-[0_0_40px_rgba(236,72,153,0.3)]">
              Future.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={FADE_UP}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/40 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed font-light px-4"
          >
            Elevate your pair programming experience with high-fidelity video
            chat, zero-latency code syncing, and a workspace designed for deep
            focus.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={FADE_UP}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4"
          >
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group/cta relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-[#07070d] rounded-2xl font-black text-base md:text-lg transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.35)] flex items-center justify-center gap-3 overflow-hidden btn-shimmer"
              >
                <span className="relative z-10">Launch Workspace</span>
                <ArrowRightIcon className="size-4 md:size-5 relative z-10 group-hover/cta:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500" />
              </motion.button>
            </SignInButton>
          </motion.div>
        </motion.div>

        {/* BENTO BOX FEATURES */}
        <div className="mt-24 md:mt-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Box 1 — IDE (Large, spans 2 cols) */}
            <BentoBox
              className="md:col-span-2 p-6 md:p-10 hover:border-primary/25"
              delay={0}
            >
              <div className="absolute -right-20 -top-20 size-64 bg-primary/8 blur-[100px] rounded-full group-hover:bg-primary/15 transition-all duration-700" />

              <div className="relative z-10 md:w-1/2">
                <div className="size-12 md:size-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/0 p-[1px] mb-6 md:mb-8">
                  <div className="w-full h-full bg-[#07070d] rounded-2xl flex items-center justify-center border border-white/[0.08]">
                    <TerminalIcon className="size-6 md:size-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 tracking-tight">
                  Zero-Latency IDE
                </h3>
                <p className="text-white/40 text-sm md:text-lg leading-relaxed">
                  Industry-standard Monaco editor with syntax highlighting for
                  40+ languages. See changes immediately.
                </p>
              </div>

              {/* Mockup Graphic */}
              <div className="hidden md:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-80 h-56 bg-[#050510] border border-white/[0.06] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] skew-y-6 rotate-3 group-hover:rotate-0 group-hover:skew-y-0 group-hover:-translate-x-4 transition-all duration-700 ease-out p-5">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-error/70" />
                  <div className="w-3 h-3 rounded-full bg-warning/70" />
                  <div className="w-3 h-3 rounded-full bg-success/70" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-3 bg-primary/25 rounded-full" />
                    <div className="w-24 h-3 bg-white/15 rounded-full" />
                  </div>
                  <div className="w-4/5 h-3 bg-white/8 rounded-full ml-8" />
                  <div className="w-2/3 h-3 bg-white/8 rounded-full ml-16" />
                  <div className="w-1/3 h-3 bg-secondary/25 rounded-full ml-8" />
                  <div className="w-3/4 h-3 bg-white/8 rounded-full ml-8" />
                </div>
              </div>
            </BentoBox>

            {/* Box 2 — Video */}
            <BentoBox
              className="p-6 md:p-8 flex items-center justify-center text-center hover:border-secondary/25"
              delay={0.1}
            >
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/[0.03] transition-colors duration-700" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="size-16 md:size-20 rounded-full bg-secondary/8 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-500 border border-secondary/15 shadow-[0_0_40px_rgba(236,72,153,0.12)]">
                  <VideoIcon className="size-7 md:size-8 text-secondary" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">
                  Crystal Clear
                </h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed">
                  HD Video & Audio built right into your workspace.
                </p>
              </div>
            </BentoBox>

            {/* Box 3 — Sync */}
            <BentoBox
              className="p-6 md:p-8 flex items-center justify-center text-center hover:border-accent/25"
              delay={0.15}
            >
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-700" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="size-16 md:size-20 rounded-full bg-accent/8 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-500 border border-accent/15 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
                  <UsersIcon className="size-7 md:size-8 text-accent" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">
                  Instant Sync
                </h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed">
                  Collaborate with your peers without stepping on toes.
                </p>
              </div>
            </BentoBox>

            {/* Box 4 — Workflow (Large, spans 2 cols) */}
            <BentoBox
              className="md:col-span-2 p-6 md:p-10 bg-[#0c0c14]/80 hover:border-white/15"
              delay={0.2}
            >
              <div className="absolute -left-20 -bottom-20 size-64 bg-accent/8 blur-[100px] rounded-full group-hover:bg-accent/15 transition-all duration-700" />

              <div className="relative z-10 md:w-2/3 ml-auto text-right flex flex-col items-end">
                <div className="size-12 md:size-14 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/0 p-[1px] mb-6 md:mb-8">
                  <div className="w-full h-full bg-[#07070d] rounded-2xl flex items-center justify-center border border-white/[0.08]">
                    <LayersIcon className="size-6 md:size-7 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 tracking-tight">
                  Seamless Workflow
                </h3>
                <p className="text-white/40 text-sm md:text-lg leading-relaxed">
                  Designed for flow-state. Everything you need to nail technical
                  interviews and pair programming sessions.
                </p>
              </div>

              {/* Decorative orbital graphic */}
              <div className="hidden md:block absolute left-[5%] top-1/2 -translate-y-1/2">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 border border-white/[0.06] rounded-full animate-spin-slow" />
                  <div className="absolute inset-4 border border-white/[0.04] rounded-full animate-spin-reverse" />
                  <div className="absolute inset-8 border border-accent/15 rounded-full animate-spin-slow" style={{ animationDuration: "5s" }} />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 md:size-4 bg-accent rounded-full shadow-[0_0_20px_rgba(6,182,212,0.7)]" />
                  <div className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 size-2.5 md:size-3 bg-primary rounded-full shadow-[0_0_20px_rgba(139,92,246,0.7)]" />
                  <div className="absolute bottom-1/4 left-0 -translate-x-1/2 translate-y-1/2 size-2.5 md:size-3 bg-secondary rounded-full shadow-[0_0_20px_rgba(236,72,153,0.7)]" />
                  <UsersIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-7 md:size-8 text-white/15" />
                </div>
              </div>
            </BentoBox>
          </div>
        </div>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 md:mt-40 text-center pb-8"
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8" />
          <p className="text-xs md:text-sm text-white/25 font-medium tracking-wide">
            Built with <span className="text-primary/50">♥</span> for developers who code together
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
