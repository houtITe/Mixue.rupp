import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Star, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { DataTableShell, EmptyState } from "@/components/admin/DataTableShell";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { formatAdminDateTime } from "@/lib/format-date";
import { Button } from "@/components/ui/button";

type AdminReview = {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: number;
};

const SEED_REVIEWS = [
  { customer: "Sokha Chan", product: "Matcha Milk Boba", rating: 5, comment: "Best matcha on campus, hands down!" },
  { customer: "Dara Meas", product: "Classic Vanilla Cone", rating: 5, comment: "Perfect after class treat." },
  { customer: "Ratha Ny", product: "Brown Sugar Milk Tea", rating: 4, comment: "Sweet but great flavor." },
  { customer: "Bopha Lim", product: "Choco Storm Sundae", rating: 5, comment: "Chocolate heaven ❤" },
  { customer: "Kunthea Sok", product: "Peach Oolong Tea", rating: 3, comment: "Would love less sugar." },
];

export const Route = createFileRoute("/admin/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const { items, loading, add, remove } = useFirestoreCollection<AdminReview>("reviews");
  const [importing, setImporting] = useState(false);

  async function handleImport() {
    setImporting(true);
    try {
      for (const r of SEED_REVIEWS) await add(r);
      toast.success("Imported example reviews");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Moderate what customers say about your products."
        action={
          !loading && items.length === 0 ? (
            <Button variant="outline" onClick={handleImport} disabled={importing} className="gap-1.5">
              <Download className="h-4 w-4" />
              {importing ? "Importing…" : "Import example reviews"}
            </Button>
          ) : undefined
        }
      />
      <DataTableShell>
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No reviews yet" />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-muted/40">
                  <td className="py-3 px-4 font-semibold">{r.customer}</td>
                  <td className="py-3 px-4">{r.product}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                      <Star className="h-3 w-3 fill-current" /> {r.rating}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-md text-muted-foreground">{r.comment}</td>
                  <td className="py-3 px-4 text-muted-foreground">{formatAdminDateTime(r.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(r.id)}
                      aria-label="Delete"
                      className="text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataTableShell>
    </div>
  );
}