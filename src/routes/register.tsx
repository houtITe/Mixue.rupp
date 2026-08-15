import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, inputCls, primaryBtn } from "@/components/site/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { friendlyAuthError } from "@/integrations/firebase/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account — Mixue of RUPP" },
      { name: "description", content: "Register a new Mixue of RUPP account." },
      { property: "og:title", content: "Create an account — Mixue of RUPP" },
      { property: "og:description", content: "Join the sweetest campus community." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created! Check your inbox to verify.");
      navigate({ to: "/verify-email" });
    } catch (error) {
      toast.error(friendlyAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join us"
      title="Create your account"
      subtitle="Get personalized picks, order faster, save favorites."
      footer={
        <Link to="/" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          ← Back home
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full name</span>
          <div className="relative mt-1.5">
            <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chhey Menghout" className={inputCls + " pl-10"} />
          </div>
        </label>
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
            <input required minLength={6} type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputCls + " pl-10 pr-10"} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input required type="checkbox" className="mt-1 rounded border-border" />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        <button disabled={loading} className={primaryBtn + " disabled:opacity-60"}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}