import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function GlowCard({ title, subtitle, action, children, className = "", delay = 0 }: { title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl bg-glass p-5 shadow-card-elevated ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}
