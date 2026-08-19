import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, inputCls, primaryBtn } from "@/components/site/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { friendlyAuthError } from "@/integrations/firebase/auth";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Mixue of RUPP" },
      { name: "description", content: "Reset your Mixue of RUPP password." },
      { property: "og:title", content: "Forgot password — Mixue of RUPP" },
      { property: "og:description", content: "Reset your Mixue of RUPP password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent!");
    } catch (error) {
      toast.error(friendlyAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Password help"
      title={sent ? "Check your inbox" : "Forgot your password?"}
      subtitle={
        sent
          ? "We sent a reset link to your email. It may take a minute to arrive."
          : "Enter the email tied to your account and we'll send a reset link."
      }
      footer={
        <Link to="/" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      }
    >
      {!sent ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@rupp.edu.kh" className={inputCls + " pl-10"} />
            </div>
          </label>
          <button disabled={loading} className={primaryBtn + " disabled:opacity-60"}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      ) : (
        <button onClick={() => setSent(false)} className="w-full rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover-lift">
          Send to a different email
        </button>
      )}
    </AuthShell>
  );
}