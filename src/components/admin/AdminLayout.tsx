import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  Ticket,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  IceCream,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { subscribeToNewOrders } from "@/integrations/firebase/orders";
import { toast } from "sonner";
import { shortDisplayName } from "@/lib/display-name";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/goods", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/promotions", label: "Promotions", icon: Ticket },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToNewOrders((order) => {
      setNewOrderCount((n) => n + 1);
      toast.success(`New order from ${order.customerName} — $${order.total.toFixed(2)}`, {
        description: "Tap the bell to view it in Orders.",
      });
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch {
        // Audio isn't critical — the toast still shows.
      }
    });
    return unsubscribe;
  }, []);

  const initials = (profile?.name || "Admin")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 border-r border-border bg-background transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-hero shadow-elegant">
              <IceCream className="h-5 w-5 text-primary-foreground" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-black">Mixue Admin</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Dashboard
              </p>
            </div>
          </Link>
          <button
            className="lg:hidden grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {nav.map((n) => {
            const active = isActive(n.to, n.exact);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "text-foreground/75 hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
          <Link
            to="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            Back to site
          </Link>
        </nav>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex flex-1 min-w-0 flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4 sm:px-6">
          <button
            className="lg:hidden grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dashboard…"
              className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
            />
          </div>
          <button
            aria-label="Notifications"
            onClick={() => {
              setNewOrderCount(0);
              navigate({ to: "/admin/orders" });
            }}
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-accent"
          >
            <Bell className="h-5 w-5" />
            {newOrderCount > 0 && (
              <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {newOrderCount > 9 ? "9+" : newOrderCount}
              </span>
            )}
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate({ to: "/" });
            }}
            title="Log out"
            className="flex items-center gap-2 rounded-full border border-border px-2 py-1 hover:bg-accent transition"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </span>
            <span className="hidden sm:block text-sm font-semibold">
              {shortDisplayName(profile?.name, "Admin")}
            </span>
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-[Fraunces,serif] text-3xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
