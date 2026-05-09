import { motion } from "framer-motion";
import { heatmapData as defaultHeatmap } from "@/lib/mockData";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Cell { day: number; hour: number; value: number }

export function ActivityHeatmap({ data }: { data?: Cell[] }) {
  const heat = data ?? defaultHeatmap;
  const max = Math.max(...heat.map((d) => d.value)) || 1;
  return (
    <div className="space-y-1.5">
      {days.map((d, di) => (
        <div key={d} className="flex items-center gap-2">
          <div className="w-9 text-[10px] font-medium text-muted-foreground">{d}</div>
          <div className="flex flex-1 gap-[3px]">
            {Array.from({ length: 24 }, (_, hi) => {
              const cell = heat[di * 24 + hi];
              const intensity = cell.value / max;
              return (
                <motion.div
                  key={hi}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: (di * 24 + hi) * 0.003 }}
                  whileHover={{ scale: 1.5, zIndex: 10, rotate: 4 }}
                  title={`${d} ${hi}:00 — ${cell.value}`}
                  className="h-5 flex-1 rounded-[3px] border border-white/5"
                  style={{
                    background: `oklch(${0.4 + intensity * 0.5} ${0.1 + intensity * 0.18} ${220 - intensity * 50} / ${0.25 + intensity * 0.75})`,
                    boxShadow: intensity > 0.7 ? "0 0 8px oklch(0.78 0.18 220 / 0.5)" : undefined,
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="ml-11 mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0.2, 0.4, 0.6, 0.8, 1].map((i) => (
          <div key={i} className="h-3 w-4 rounded-[3px]" style={{ background: `oklch(${0.4 + i * 0.5} ${0.1 + i * 0.18} ${220 - i * 50} / ${0.25 + i * 0.75})` }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
