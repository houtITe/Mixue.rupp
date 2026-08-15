import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "muted";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent text-accent-foreground",
    muted: "bg-muted text-foreground",
  } as const;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card-soft"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("grid h-10 w-10 place-items-center rounded-full", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 font-[Fraunces,serif] text-3xl font-black tracking-tight">{value}</p>
      {delta && <p className="mt-1 text-xs font-medium text-primary">{delta}</p>}
    </motion.div>
  );
}
