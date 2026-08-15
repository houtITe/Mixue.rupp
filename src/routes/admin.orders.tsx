import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { DataTableShell, EmptyState } from "@/components/admin/DataTableShell";
import { subscribeToAllOrders, updateOrderStatus, type Order } from "@/integrations/firebase/orders";
import { formatAdminDateTime } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

const statuses = ["All", "New", "Preparing", "Ready", "Delivered", "Cancelled"] as const;

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof statuses)[number]>("All");
  const [view, setView] = useState<Order | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders(
      (list) => {
        setOrders(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return orders.filter((o) => {
      const matchQ =
        !query ||
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query);
      const matchS = filter === "All" || o.status === filter;
      return matchQ && matchS;
    });
  }, [orders, q, filter]);

  async function updateStatus(id: string, status: Order["status"]) {
    await updateOrderStatus(id, status);
    toast.success(`Order → ${status}`);
  }

  return (
    <div>
      <PageHeader title="Orders" subtitle="Track and update order fulfillment." />

      <DataTableShell
        toolbar={
          <>
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders…" className="pl-10" />
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      >
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No orders match" />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40">
                  <td className="py-3 px-4 font-semibold">#{o.id.slice(0, 6).toUpperCase()}</td>
                  <td className="py-3 px-4">{o.customerName}</td>
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatAdminDateTime(o.createdAt)}</td>
                  <td className="py-3 px-4 font-semibold">${o.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={o.payment === "Paid" ? "default" : "secondary"}>
                      {o.payment}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={o.status}
                      onValueChange={(v) => updateStatus(o.id, v as Order["status"])}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.filter((s) => s !== "All").map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button size="icon" variant="ghost" onClick={() => setView(o)} aria-label="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTableShell>

      <Dialog open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{view?.id.slice(0, 6).toUpperCase()}</DialogTitle>
          </DialogHeader>
          {view && (
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Customer</dt><dd className="font-semibold">{view.customerName}</dd></div>
                <div><dt className="text-muted-foreground">Date</dt><dd>{formatAdminDateTime(view.createdAt)}</dd></div>
                <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">${view.total.toFixed(2)}</dd></div>
                <div><dt className="text-muted-foreground">Payment</dt><dd>{view.payment}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd>{view.status}</dd></div>
                <div><dt className="text-muted-foreground">Phone</dt><dd>{view.phone}</dd></div>
              </dl>
              {view.location && (
                <a
                  href={`https://www.google.com/maps?q=${view.location.lat},${view.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline underline-offset-2"
                >
                  View delivery location on map
                </a>
              )}
              <ul className="rounded-xl bg-muted p-3 text-sm">
                {view.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.qty}× {it.name}</span>
                    <span>${(it.price * it.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}