import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IceCream } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

export function RequireStaff({ children }: { children: ReactNode }) {
  const { user, profile, loading, isStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!isStaff) {
      navigate({ to: "/access-denied" });
    }
  }, [loading, user, isStaff, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/30">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <IceCream className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  if (user && isStaff) {
    return <>{children}</>;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted/30">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <IceCream className="h-8 w-8 animate-pulse text-primary" />
        <p className="text-sm">Checking access…</p>
      </div>
    </div>
  );
}
