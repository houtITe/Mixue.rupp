import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function StatCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 1600,
  label,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <p className="font-[Fraunces,serif] text-4xl sm:text-5xl font-black text-primary">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
}
