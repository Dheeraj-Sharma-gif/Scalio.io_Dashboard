import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Users, Eye, TrendingUp, Sparkles } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlowCard } from "@/components/dashboard/GlowCard";
import { TimeframeFilter } from "@/components/dashboard/TimeframeFilter";
import { AreaTrend, BarsCompare, DonutChart, LineDual, RadialGauge } from "@/components/dashboard/Charts";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { AnimatedSwap } from "@/components/dashboard/PlatformPage";
import {
  getPlatforms,
  formatNumber,
  seriesFor,
  defaultSelection,
  engagementBreakdownFor,
  heatmapFor,
  type Selection,
} from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Scalio Analytics" },
      { name: "description", content: "Unified analytics across all of Scalio's social media channels." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const [sel, setSel] = useState<Selection>(defaultSelection());

  const platforms = getPlatforms(sel);
  const totalFollowers = platforms.reduce((s, p) => s + p.followers, 0);
  const totalReach = platforms.reduce((s, p) => s + p.reach, 0);
  const avgEngagement = platforms.reduce((s, p) => s + p.engagement, 0) / platforms.length;
  const avgGrowth = platforms.reduce((s, p) => s + p.growth, 0) / platforms.length;

  const reachSeries = seriesFor(sel, 240000, "reach");
  const engagementSeries = seriesFor(sel, 38000, "eng");
  const growthSeries = seriesFor(sel, 8400, "growth");
  const platformBars = platforms.map((p) => ({ label: p.name, value: Math.round(p.reach / 1000) }));
  const followerSplit = platforms.map((p) => ({ name: p.name, value: p.followers }));
  const engagementPie = engagementBreakdownFor(sel);
  const heatmap = heatmapFor(sel);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-glass p-8 shadow-card-elevated">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-aurora opacity-30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/30 opacity-30 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-[var(--brand-magenta)]/30 opacity-30 blur-3xl animate-float" style={{ animationDelay: "-1.5s" }} />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/30 px-3 py-1 text-xs font-medium text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live · {sel.label}
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
            >
              The pulse of <span className="text-gradient">Scalio</span> across every channel.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base"
            >
              A cinematic command center for AI-driven social performance. Pick any week, month or year — every counter, chart and curve below morphs in real time.
            </motion.p>
          </div>
          <TimeframeFilter value={sel} onChange={setSel} />
        </div>
      </section>

      {/* Stat grid */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`hero-stats-${sel.key}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard label="Total Followers" value={totalFollowers} delta={avgGrowth} icon={Users} accent="cyan" index={0} />
          <StatCard label="Total Reach" value={totalReach} delta={9.3} icon={Eye} accent="violet" index={1} />
          <StatCard label="Avg Engagement" value={avgEngagement} delta={2.1} icon={Activity} accent="magenta" format="percent" index={2} />
          <StatCard label="Growth Index" value={avgGrowth} delta={avgGrowth - 6} icon={TrendingUp} accent="cyan" format="percent" index={3} />
        </motion.section>
      </AnimatePresence>

      {/* Main charts */}
      <section className="grid gap-4 lg:grid-cols-3">
        <GlowCard title="Reach & Engagement" subtitle={`Combined performance · ${sel.label}`} className="lg:col-span-2" delay={0.15}>
          <AnimatedSwap k={`area-${sel.key}`}><AreaTrend data={reachSeries} /></AnimatedSwap>
        </GlowCard>
        <GlowCard title="Audience Split" subtitle="Followers per platform" delay={0.2}>
          <AnimatedSwap k={`split-${sel.key}`}><DonutChart data={followerSplit} /></AnimatedSwap>
        </GlowCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <GlowCard title="Engagement Breakdown" subtitle="Likes · Comments · Shares · Saves" delay={0.25}>
          <AnimatedSwap k={`pie-${sel.key}`}><DonutChart data={engagementPie} /></AnimatedSwap>
        </GlowCard>
        <GlowCard title="Platform Reach (K)" subtitle="Cross-platform comparison" className="lg:col-span-2" delay={0.3}>
          <AnimatedSwap k={`bars-${sel.key}`}><BarsCompare data={platformBars} /></AnimatedSwap>
        </GlowCard>
      </section>

      {/* Platform mini cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {platforms.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
            whileHover={{ y: -8, scale: 1.04, rotateY: 8, rotateX: -4 }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
            className="group relative overflow-hidden rounded-2xl bg-glass p-4 shadow-card-elevated"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60" style={{ background: p.color }} />
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.name}</div>
              <div className="mt-1 font-display text-2xl font-bold">{formatNumber(p.followers)}</div>
              <div className={`mt-1 text-xs font-semibold ${p.growth >= 0 ? "text-success" : "text-destructive"}`}>
                {p.growth >= 0 ? "+" : ""}{p.growth.toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Heatmap + Gauge + Trends */}
      <section className="grid gap-4 lg:grid-cols-3">
        <GlowCard title="Activity Heatmap" subtitle={`Engagement density · ${sel.label}`} className="lg:col-span-2" delay={0.5}>
          <AnimatedSwap k={`heat-${sel.key}`}><ActivityHeatmap data={heatmap} /></AnimatedSwap>
        </GlowCard>
        <GlowCard title="Engagement Score" subtitle="Composite index across platforms" delay={0.55}>
          <div className="relative">
            <AnimatedSwap k={`gauge-${sel.key}`}>
              <RadialGauge value={Math.min(100, Math.round(avgEngagement * 10))} label="Engagement" />
            </AnimatedSwap>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-3xl font-bold text-gradient">{(avgEngagement * 10).toFixed(0)}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</div>
            </div>
          </div>
        </GlowCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlowCard title="Followers vs Engagement" subtitle="Dual-axis trend over time" delay={0.6}>
          <AnimatedSwap k={`line-${sel.key}`}><LineDual data={engagementSeries} /></AnimatedSwap>
        </GlowCard>
        <GlowCard title="Growth Velocity" subtitle="New followers / period" delay={0.65}>
          <AnimatedSwap k={`growth-${sel.key}`}><BarsCompare data={growthSeries} color="var(--brand-cyan)" /></AnimatedSwap>
        </GlowCard>
      </section>
    </div>
  );
}
