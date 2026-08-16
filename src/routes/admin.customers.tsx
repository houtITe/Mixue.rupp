import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { DataTableShell, EmptyState } from "@/components/admin/DataTableShell";
import { useCustomers } from "@/hooks/use-customers";
import { formatAdminDateTime } from "@/lib/format-date";
import { updateUserRole } from "@/integrations/firebase/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const { customers, loading } = useCustomers();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"orders" | "spent" | "joined">("joined");
  const [page, setPage] = useState(1);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = customers.filter(
      (c) => !query || c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query),
    );
    return [...list].sort((a, b) => {
      if (sort === "orders") return b.orders - a.orders;
      if (sort === "spent") return b.spent - a.spent;
      return b.joinedAt - a.joinedAt;
    });
  }, [customers, q, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleRoleChange(userId: string, newRole: "customer" | "staff" | "admin") {
    setUpdatingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update user role");
    } finally {
      setUpdatingRole(null);
    }
  }

  return (
    <div>
      <PageHeader title="Customers" subtitle="View and manage your customer base." />
      <DataTableShell
        toolbar={
          <>
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="pl-10" />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="joined">Recently joined</SelectItem>
                <SelectItem value="orders">Most orders</SelectItem>
                <SelectItem value="spent">Highest spend</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        footer={
          <>
            <p className="text-xs text-muted-foreground">
              {current.length} of {filtered.length} customers
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </>
        }
      >
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : current.length === 0 ? (
          <EmptyState title="No customers yet" hint="Customers appear here once someone registers an account." />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Spent</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {current.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary font-bold">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <p className="font-semibold">{c.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.email}</p>
                    <p className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3" /> {c.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={c.role}
                      onValueChange={(newRole) => handleRoleChange(c.id, newRole as "customer" | "staff" | "admin")}
                      disabled={updatingRole === c.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4 font-semibold">{c.orders}</td>
                  <td className="py-3 px-4 font-semibold">${c.spent.toFixed(2)}</td>
                  <td className="py-3 px-4 text-muted-foreground">{formatAdminDateTime(c.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTableShell>
    </div>
  );
}