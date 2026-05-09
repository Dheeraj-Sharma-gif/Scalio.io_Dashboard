import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { formatNumber } from "@/lib/mockData";

interface Props {
  label: string;
  value: number;
  delta?: number;
  icon?: LucideIcon;
  accent?: "cyan" | "violet" | "magenta";
  format?: "number" | "compact" | "percent";
  index?: number;
}

const accentClasses = {
  cyan: "from-[oklch(0.82_0.17_215)] to-[oklch(0.65_0.25_295)]",
  violet: "from-[oklch(0.65_0.25_295)] to-[oklch(0.7_0.27_340)]",
  magenta: "from-[oklch(0.7_0.27_340)] to-[oklch(0.83_0.18_80)]",
};

export function StatCard({ label, value, delta, icon: Icon, accent = "cyan", format = "compact", index = 0 }: Props) {
  const fmt =
    format === "compact" ? formatNumber :
    format === "percent" ? (n: number) => `${n.toFixed(1)}%` :
    (n: number) => Math.round(n).toLocaleString();

  const positive = (delta ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-glass p-5 shadow-card-elevated"
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accentClasses[accent]} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-bold tracking-tight">
            <AnimatedCounter value={value} format={fmt} />
          </div>
          {delta !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta).toFixed(1)}%
            </div>
          )}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accentClasses[accent]} shadow-lg`}>
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
