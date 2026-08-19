import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -z-10 inset-0 bg-soft" />
      <div className="pointer-events-none absolute -z-10 -top-24 -right-24 h-96 w-96 rounded-full bg-hero opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -z-10 -bottom-24 -left-24 h-96 w-96 rounded-full bg-hero opacity-20 blur-3xl" />

      <div className="w-full max-w-md">
        <div className="glass rounded-3xl border border-border shadow-elegant p-8 sm:p-10 animate-fade-in-up">
          <Link to="/" className="flex flex-col items-center gap-2 justify-center">
            <img src="/logo.jpg" alt="Mixue Logo" className="h-16 w-16 rounded-full object-cover shadow-elegant border-2 border-primary/20" />
            <span className="text-base font-black">
              Mixue <span className="text-primary">of RUPP</span>
            </span>
          </Link>
          <div className="mt-6 text-center">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 font-[Fraunces,serif] text-3xl font-black tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </section>
  );
}

export const inputCls =
  "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export const primaryBtn =
  "w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition";
