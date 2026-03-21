import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, Code2Icon } from "lucide-react";
import { UserButton } from "@clerk/react";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full flex justify-center pt-6 pb-2 sticky top-0 z-50 pointer-events-none">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-full px-6 py-3 flex items-center justify-between w-[95%] max-w-7xl pointer-events-auto"
      >
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="relative size-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-xl rotate-6 opacity-70 group-hover:rotate-12 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-base-100/80 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl backdrop-blur-sm border border-white/20"></div>
            <Code2Icon className="size-5 text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>

          <span className="font-black text-2xl tracking-tighter">
            Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Pair</span>
          </span>
        </Link>

        {/* LINKS & AUTH */}
        <div className="flex items-center gap-2">
          <Link
            to={"/problems"}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-x-2 border
              ${
                isActive("/problems")
                  ? "bg-primary/20 border-primary/50 text-primary-content shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  : "border-transparent hover:bg-white/5 text-base-content/70 hover:text-base-content"
              }`}
          >
            <BookOpenIcon className="size-4" />
            <span className="font-medium hidden sm:inline text-sm">Problems</span>
          </Link>

          <Link
            to={"/dashboard"}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-x-2 border
              ${
                isActive("/dashboard")
                  ? "bg-primary/20 border-primary/50 text-primary-content shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  : "border-transparent hover:bg-white/5 text-base-content/70 hover:text-base-content"
              }`}
          >
            <LayoutDashboardIcon className="size-4" />
            <span className="font-medium hidden sm:inline text-sm">Dashboard</span>
          </Link>

          <div className="ml-2 pl-2 border-l border-white/10 flex items-center pt-1">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "size-9 border-2 border-primary/50 hover:border-primary transition-colors hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] rounded-full"
                }
              }}
            />
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
export default Navbar;
