import { TrophyIcon, UsersIcon, ActivityIcon } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * end));

      if (frame === totalFrames) {
        clearInterval(counter);
        setDisplay(end);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value, duration]);

  return <>{display}</>;
}

function TiltCard({ children, className, glowColor = "primary" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  const cards = [
    {
      icon: UsersIcon,
      value: activeSessionsCount,
      label: "Active Sessions",
      color: "primary",
      badge: "LIVE",
      badgeClass: "bg-success/15 border-success/30 text-success",
      iconBg: "from-primary/20 to-primary/5",
      glowClass: "hover:border-primary/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]",
      accentBg: "bg-primary/10",
    },
    {
      icon: TrophyIcon,
      value: recentSessionsCount,
      label: "Total Sessions",
      color: "secondary",
      badge: null,
      iconBg: "from-secondary/20 to-secondary/5",
      glowClass: "hover:border-secondary/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.12)]",
      accentBg: "bg-secondary/10",
    },
  ];

  return (
    <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <TiltCard key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card rounded-2xl md:rounded-3xl p-5 md:p-6 relative overflow-hidden group transition-all duration-500 ${card.glowClass}`}
            >
              {/* Background accent blob */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 ${card.accentBg} blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700`} />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-2.5 md:p-3 bg-gradient-to-br ${card.iconBg} rounded-xl border border-white/[0.08] group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${card.color}`} />
                </div>
                {card.badge && (
                  <div className={`px-2.5 py-1 ${card.badgeClass} text-[10px] font-bold rounded-full border flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]`}>
                    <div className="relative">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-success rounded-full animate-ping" />
                    </div>
                    {card.badge}
                  </div>
                )}
              </div>

              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-black mb-1 text-white tracking-tight">
                  <AnimatedCounter value={card.value} />
                </div>
                <div className="text-xs md:text-sm text-white/40 font-semibold uppercase tracking-[0.15em]">
                  {card.label}
                </div>
              </div>
            </motion.div>
          </TiltCard>
        );
      })}
    </div>
  );
}

export default StatsCards;
