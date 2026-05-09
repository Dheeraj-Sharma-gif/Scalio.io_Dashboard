import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TimeframeFilter } from "@/components/dashboard/TimeframeFilter";
import { GlowCard } from "@/components/dashboard/GlowCard";
import { AreaTrend, BarsCompare, DonutChart, LineDual, RadialGauge } from "@/components/dashboard/Charts";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  seriesFor,
  formatNumber,
  defaultSelection,
  engagementBreakdownFor,
  heatmapFor,
  type Selection,
} from "@/lib/mockData";

export interface StatDef {
  label: string;
  value: number;
  delta?: number;
  icon?: LucideIcon;
  format?: "number" | "compact" | "percent";
  accent?: "cyan" | "violet" | "magenta";
}

export interface PlatformData {
  stats: StatDef[];
  topItem: { label: string; title: string; views: number };
}

export function PlatformPage({
  name,
  tagline,
  icon: Icon,
  accent,
  compute,
  baseSeries,
  extra,
}: {
  name: string;
  tagline: string;
  icon: LucideIcon;
  accent: string;
  compute: (sel: Selection) => PlatformData;
  baseSeries: number;
  extra?: ReactNode;
}) {
  const [sel, setSel] = useState<Selection>(defaultSelection());
  const { stats, topItem } = compute(sel);

  const trend = seriesFor(sel, baseSeries, "trend");
  const trend2 = seriesFor(sel, baseSeries * 0.4, "vol");
  const engagementPie = engagementBreakdownFor(sel);
  const heatmap = heatmapFor(sel);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-glass p-7 shadow-card-elevated">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl animate-float" style={{ background: accent }} />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-gradient-aurora opacity-20 blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -45 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ rotateY: 12, rotateX: -8, scale: 1.05 }}
              style={{ transformStyle: "preserve-3d", perspective: 800 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" 
            >
              <div className="absolute inset-0 rounded-2xl" style={{ background: accent }} />
              <Icon className="relative h-8 w-8 text-primary-foreground" />
            </motion.div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Platform · {sel.label}</div>
              <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>
            </div>
          </div>
          <TimeframeFilter value={sel} onChange={setSel} />
        </div>
      </section>

      {/* Stats — re-mounts on selection change for staggered entrance */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`stats-${sel.key}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              delta={s.delta}
              icon={s.icon}
              format={s.format ?? "compact"}
              accent={s.accent ?? (i % 3 === 0 ? "cyan" : i % 3 === 1 ? "violet" : "magenta")}
              index={i}
            />
          ))}
        </motion.section>
      </AnimatePresence>

      {/* Trend */}
      <section className="grid gap-4 lg:grid-cols-3">
        <GlowCard title="Performance Trend" subtitle={`Reach & impressions · ${sel.label}`} className="lg:col-span-2" delay={0.1}>
          <AnimatedSwap k={`area-${sel.key}`}><AreaTrend data={trend} /></AnimatedSwap>
        </GlowCard>
        <GlowCard title="Engagement Mix" subtitle="Distribution of interactions" delay={0.15}>
          <AnimatedSwap k={`donut-${sel.key}`}><DonutChart data={engagementPie} /></AnimatedSwap>
        </GlowCard>
      </section>

      {/* Top content + Gauge */}
      <section className="grid gap-4 lg:grid-cols-3">
        <GlowCard title={topItem.label} subtitle={`Highest reaching content · ${sel.label}`} className="lg:col-span-2" delay={0.2}>
          <AnimatePresence mode="wait">
            <motion.div
              key={topItem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-5 rounded-xl border border-border/50 bg-background/30 p-5"
            >
              <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl" style={{ background: accent }}>
                <div className="absolute inset-0 bg-gradient-aurora opacity-50 animate-shimmer" />
                <div className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-white/90">▶</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Top performer</div>
                <div className="mt-1 truncate font-display text-xl font-semibold">{topItem.title}</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  {formatNumber(topItem.views)} views
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </GlowCard>
        <GlowCard title="Engagement Score" subtitle="Composite index" delay={0.25}>
          <div className="relative">
            <AnimatedSwap k={`gauge-${sel.key}`}>
              <RadialGauge value={Math.min(100, Math.round((stats.find((s) => s.format === "percent")?.value ?? 50) * 8))} label="Score" />
            </AnimatedSwap>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-3xl font-bold text-gradient">
                {(stats.find((s) => s.format === "percent")?.value ?? 0).toFixed(1)}%
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Engagement</div>
            </div>
          </div>
        </GlowCard>
      </section>

      {/* Bars + Lines */}
      <section className="grid gap-4 lg:grid-cols-2">
        <GlowCard title="Volume by Period" subtitle="Posts and interactions" delay={0.3}>
          <AnimatedSwap k={`bars-${sel.key}`}><BarsCompare data={trend2} /></AnimatedSwap>
        </GlowCard>
        <GlowCard title="Likes vs Comments" subtitle="Comparative trend" delay={0.35}>
          <AnimatedSwap k={`line-${sel.key}`}><LineDual data={trend} /></AnimatedSwap>
        </GlowCard>
      </section>

      <section>
        <GlowCard title="Activity Heatmap" subtitle={`Best times to post · ${sel.label}`} delay={0.4}>
          <AnimatedSwap k={`heat-${sel.key}`}><ActivityHeatmap data={heatmap} /></AnimatedSwap>
        </GlowCard>
      </section>

      {extra}
    </div>
  );
}

export function AnimatedSwap({ k, children }: { k: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={k}
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
