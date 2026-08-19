import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, inputCls, primaryBtn } from "@/components/site/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { friendlyAuthError } from "@/integrations/firebase/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Mixue of RUPP" },
      { name: "description", content: "Sign in to your Mixue of RUPP account." },
      { property: "og:title", content: "Login — Mixue of RUPP" },
      { property: "og:description", content: "Sign in to your Mixue of RUPP account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(friendlyAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Sweet moments are just a click away."
      footer={
        <Link to="/" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          ← Back home
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@rupp.edu.kh" className={inputCls + " pl-10"} />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password</span>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input required type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls + " pl-10 pr-10"} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded border-border" /> Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <button disabled={loading} className={primaryBtn + " disabled:opacity-60"}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-6 space-y-3 text-center text-sm text-muted-foreground">
          <div>
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </div>
          <div>
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}