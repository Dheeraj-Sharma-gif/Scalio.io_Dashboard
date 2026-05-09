import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LayoutDashboard, Youtube, Linkedin, Instagram, Facebook, Twitter, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/youtube", label: "YouTube", icon: Youtube },
  { to: "/linkedin", label: "LinkedIn", icon: Linkedin },
  { to: "/instagram", label: "Instagram", icon: Instagram },
  { to: "/facebook", label: "Facebook", icon: Facebook },
  { to: "/twitter", label: "Twitter (X)", icon: Twitter },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/50 bg-glass px-4 py-6 lg:flex">
      <Link to="/" className="mb-10 flex items-center gap-3 px-2">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-aurora glow-cyan">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-lg font-bold text-gradient">Scalio</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Analytics</div>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-primary opacity-90 glow-cyan"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`relative z-10 h-4 w-4 ${active ? "text-primary-foreground" : ""}`} />
              <span className={`relative z-10 ${active ? "text-primary-foreground" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-border/40 bg-glass p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Live
        </div>
        <p className="text-xs text-muted-foreground">
          Mock data feed. Connect your social APIs to stream real metrics.
        </p>
      </div>
    </aside>
  );
}
