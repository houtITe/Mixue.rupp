import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "Access denied — Mixue of RUPP" },
      { name: "description", content: "You don't have permission to view this page." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Access denied — Mixue of RUPP" },
      { property: "og:description", content: "You don't have permission to view this page." },
    ],
  }),
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -z-10 inset-0 bg-soft" />
      <div className="pointer-events-none absolute -z-10 -top-24 -right-24 h-96 w-96 rounded-full bg-hero opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -z-10 -bottom-24 -left-24 h-96 w-96 rounded-full bg-hero opacity-20 blur-3xl" />
      <div className="max-w-xl text-center animate-fade-in-up">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-elegant">
          <ShieldAlert className="h-9 w-9" />
        </div>
        <p className="mt-6 font-[Fraunces,serif] text-[6rem] sm:text-[8rem] font-black leading-none text-primary drop-shadow-sm">
          403
        </p>
        <h1 className="mt-2 font-[Fraunces,serif] text-3xl sm:text-4xl font-black tracking-tight">
          Access denied
        </h1>
        <p className="mt-3 text-muted-foreground">
          You don't have permission to view this page. If this looks wrong, try signing in with a different account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/login" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition">
            Sign in
          </Link>
          <Link to="/" className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover-lift">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}