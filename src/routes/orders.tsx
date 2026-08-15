import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { subscribeToMyOrders, type Order } from "@/integrations/firebase/orders";
import { formatAdminDateTime } from "@/lib/format-date";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — Mixue of RUPP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

const statusColor: Record<Order["status"], string> = {
  New: "bg-accent text-accent-foreground",
  Preparing: "bg-yellow-100 text-yellow-800",
  Ready: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-muted text-muted-foreground",
};

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToMyOrders(
      user.uid,
      (list) => {
        setOrders(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, [user]);

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-muted-foreground">Please sign in to view your orders.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 font-[Fraunces,serif] text-2xl font-black">No orders yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order history will show up here once you place your first order.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
        >
          Browse menu
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-[Fraunces,serif] text-3xl font-black">Your orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {o.items.length} item{o.items.length > 1 ? "s" : ""} · ${o.total.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{formatAdminDateTime(o.createdAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status]}`}>
                {o.status}
              </span>
            </div>
            <ul className="mt-3 text-sm text-muted-foreground">
              {o.items.map((it) => (
                <li key={it.id}>
                  {it.qty}× {it.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

