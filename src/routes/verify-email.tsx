import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, primaryBtn } from "@/components/site/AuthShell";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify email — Mixue of RUPP" },
      { name: "description", content: "Confirm your email to activate your Mixue of RUPP account." },
      { property: "og:title", content: "Verify email — Mixue of RUPP" },
      { property: "og:description", content: "Confirm your email to activate your account." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.some((d) => !d)) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    toast.success("Email verified! (demo)");
  };

  return (
    <AuthShell
      eyebrow="One last step"
      title="Verify your email"
      subtitle="We sent a 6-digit code to your inbox. Enter it below to activate your account."
      footer={
        <>
          Wrong email?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Start over
          </Link>
        </>
      }
    >
      <div className="mb-6 grid place-items-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-elegant">
          <MailCheck className="h-6 w-6" />
        </span>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex justify-between gap-2">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
              }}
              className="h-14 w-full text-center text-xl font-black rounded-xl border border-border bg-background/80 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          ))}
        </div>
        <button className={primaryBtn}>Verify email</button>
        <button
          type="button"
          onClick={() => toast.success("A new code has been sent. (demo)")}
          className="w-full text-sm text-muted-foreground hover:text-primary transition"
        >
          Didn't get a code? Resend
        </button>
      </form>
    </AuthShell>
  );
}