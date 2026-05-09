import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from "recharts";
import type { Point } from "@/lib/mockData";

const tooltipStyle = {
  background: "oklch(0.18 0.04 265 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.08)",
  borderRadius: 12,
  fontSize: 12,
  color: "white",
  boxShadow: "0 10px 40px -10px black",
} as const;

export function AreaTrend({ data, color = "var(--brand-cyan)", color2 = "var(--brand-violet)" }: { data: Point[]; color?: string; color2?: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color2} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
        <XAxis dataKey="label" stroke="oklch(0.7 0.04 260)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="oklch(0.7 0.04 260)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
        <Area type="monotone" dataKey="secondary" stroke={color2} strokeWidth={2} fill="url(#g2)" />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#g1)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsCompare({ data, color = "var(--brand-violet)" }: { data: Point[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
        <XAxis dataKey="label" stroke="oklch(0.7 0.04 260)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="oklch(0.7 0.04 260)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
        <Bar dataKey="value" fill="url(#bar1)" radius={[8, 8, 2, 2]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineDual({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
        <XAxis dataKey="label" stroke="oklch(0.7 0.04 260)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="oklch(0.7 0.04 260)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="value" stroke="var(--brand-cyan)" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="secondary" stroke="var(--brand-magenta)" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = ["var(--brand-cyan)", "var(--brand-violet)", "var(--brand-magenta)", "var(--chart-4)", "var(--chart-5)"];

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: "oklch(0.85 0.02 260)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadialGauge({ value, label }: { value: number; label: string }) {
  const data = [{ name: label, value, fill: "var(--brand-cyan)" }];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={90 - (value / 100) * 360}>
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-cyan)" />
            <stop offset="100%" stopColor="var(--brand-violet)" />
          </linearGradient>
        </defs>
        <RadialBar dataKey="value" cornerRadius={20} fill="url(#rg)" background={{ fill: "oklch(1 0 0 / 0.05)" }} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
