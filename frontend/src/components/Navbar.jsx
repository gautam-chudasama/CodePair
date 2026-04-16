import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, Code2Icon, MenuIcon, XIcon } from "lucide-react";
import { UserButton } from "@clerk/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware backdrop
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/problems", icon: BookOpenIcon, label: "Problems" },
    { to: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  ];

  return (
    <div className="w-full flex justify-center pt-4 md:pt-6 pb-2 sticky top-0 z-50 pointer-events-none px-4">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-2xl md:rounded-full px-4 md:px-6 py-3 flex items-center justify-between w-full max-w-7xl pointer-events-auto transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            : "glass-panel"
        }`}
      >
        {/* LOGO */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative size-9 md:size-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            {/* Gradient border glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-fuchsia-500 to-secondary rounded-xl rotate-6 opacity-60 group-hover:rotate-12 group-hover:opacity-100 transition-all duration-500 blur-[1px]" />
            {/* Dark fill */}
            <div className="absolute inset-[1px] bg-[#07070d]/90 rounded-xl" />
            {/* Inner gradient overlay */}
            <div className="absolute inset-[1px] bg-gradient-to-br from-primary/15 to-secondary/15 rounded-xl border border-white/15" />
            <Code2Icon className="size-4.5 md:size-5 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          </div>

          <span className="font-black text-xl md:text-2xl tracking-tighter text-white">
            Code<span className="text-gradient-primary">Pair</span>
          </span>
        </Link>

        {/* DESKTOP LINKS & AUTH */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-x-2 border group ${
                  active
                    ? "bg-primary/15 border-primary/40 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "border-transparent hover:bg-white/[0.06] text-white/60 hover:text-white"
                }`}
              >
                <Icon className={`size-4 transition-colors ${active ? "text-primary" : "group-hover:text-primary/70"}`} />
                <span className="font-semibold text-sm">{link.label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-primary/10 border border-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}

          <div className="ml-2 pl-3 border-l border-white/10 flex items-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "size-9 border-2 border-primary/40 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] rounded-full",
                },
              }}
            />
          </div>
        </div>

        {/* MOBILE: Hamburger + Avatar */}
        <div className="flex md:hidden items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "size-8 border-2 border-primary/40 rounded-full",
              },
            }}
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XIcon className="size-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuIcon className="size-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-4 right-4 mt-2 glass-panel rounded-2xl p-4 pointer-events-auto md:hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="space-y-1">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                        active
                          ? "bg-primary/15 border border-primary/30 text-white"
                          : "hover:bg-white/5 text-white/70 hover:text-white border border-transparent"
                      }`}
                    >
                      <Icon className={`size-5 ${active ? "text-primary" : ""}`} />
                      <span className="font-semibold">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
