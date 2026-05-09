import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Youtube, Linkedin, Instagram, Facebook, Twitter } from "lucide-react";

const items = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/youtube", label: "YouTube", icon: Youtube },
  { to: "/linkedin", label: "LinkedIn", icon: Linkedin },
  { to: "/instagram", label: "Instagram", icon: Instagram },
  { to: "/facebook", label: "Facebook", icon: Facebook },
  { to: "/twitter", label: "X", icon: Twitter },
] as const;

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-border/50 bg-glass px-2 py-2 lg:hidden">
      {items.map((it) => {
        const Icon = it.icon;
        const active = pathname === it.to;
        return (
          <Link key={it.to} to={it.to} className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
            <Icon className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
