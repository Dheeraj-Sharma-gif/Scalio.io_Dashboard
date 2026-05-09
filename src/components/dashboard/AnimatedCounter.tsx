import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({ value, format }: { value: number; format?: (n: number) => string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => (format ? format(latest) : Math.round(latest).toLocaleString()));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, mv]);

  return <motion.span>{rounded}</motion.span>;
}
