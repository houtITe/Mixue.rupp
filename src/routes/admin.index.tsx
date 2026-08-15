import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { useProducts } from "@/context/ProductsContext";
import { useCustomers } from "@/hooks/use-customers";
import { subscribeToAllOrders, type Order } from "@/integrations/firebase/orders";
import { formatAdminDateTime } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { products } = useProducts();
  const { customers } = useCustomers();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders(setOrders, () => {});
    return unsubscribe;
  }, []);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.payment === "Paid").reduce((sum, o) => sum + o.total, 0),
    [orders],
  );
  const goodsInStock = useMemo(() => products.reduce((sum, p) => sum + (p.stock ?? 0), 0), [products]);

  const revenueChart = useMemo(() => {
    const now = new Date();
    const months: { key: string; month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: d.toLocaleString("en", { month: "short" }), value: 0 });
    }
    for (const o of orders) {
      if (o.payment !== "Paid") continue;
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.value += o.total;
    }
    return months;
  }, [orders]);

  const categoryShare = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p.category]));
    const totals = new Map<string, number>();
    for (const o of orders) {
      for (const item of o.items) {
        const category = byId.get(item.productId) ?? "Other";
        totals.set(category, (totals.get(category) ?? 0) + item.qty);
      }
    }
    return [...totals.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);
  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back — here's what's happening at Mixue today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} delta="Paid orders" icon={DollarSign} tone="primary" />
        <StatCard label="Orders" value={String(orders.length)} delta={`${orders.filter((o) => o.status === "New").length} new`} icon={ShoppingCart} tone="accent" />
        <StatCard label="Customers" value={String(customers.length)} icon={Users} tone="muted" />
        <StatCard label="Stock Units" value={String(goodsInStock)} delta={`${products.length} product${products.length === 1 ? "" : "s"} · ${products.filter((p) => (p.stock ?? 0) <= 5).length} low stock`} icon={Package} tone="primary" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-card-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue trend</p>
              <p className="font-[Fraunces,serif] text-2xl font-black">Last 6 months</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <TrendingUp className="h-3 w-3" /> Paid orders
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
          <p className="text-sm font-medium text-muted-foreground">Top categories</p>
          <p className="font-[Fraunces,serif] text-2xl font-black">Share of sales</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryShare} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent orders</p>
            <p className="font-[Fraunces,serif] text-2xl font-black">Latest activity</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40">
                    <td className="py-3 pr-4 font-semibold">#{o.id.slice(0, 6).toUpperCase()}</td>
                    <td className="py-3 pr-4">{o.customerName}</td>
                    <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{formatAdminDateTime(o.createdAt)}</td>
                    <td className="py-3 pr-4 font-semibold">${o.total.toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="secondary">{o.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}