import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit, Trash2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";

type AdminPromotion = {
  id: string;
  title: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  active: boolean;
};

export const Route = createFileRoute("/admin/promotions")({
  component: PromotionsPage,
});

const empty: AdminPromotion = {
  id: "",
  title: "",
  code: "",
  discount: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  active: true,
};

function PromotionsPage() {
  const { items, loading, add, edit, remove } = useFirestoreCollection<AdminPromotion>("promotions");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPromotion | null>(null);
  const [form, setForm] = useState<AdminPromotion>(empty);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(p: AdminPromotion) {
    setEditing(p);
    setForm(p);
    setOpen(true);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await edit(editing.id, form);
      toast.success("Promotion updated");
    } else {
      await add(form);
      toast.success("Promotion created");
    }
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Promotions"
        subtitle="Discounts, campaigns and student deals."
        action={
          <Button onClick={openCreate} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Promotion
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No promotions yet — create your first one.</p>
        )}
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Ticket className="h-5 w-5" />
              </span>
              <Badge variant={p.active ? "default" : "secondary"}>
                {p.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="mt-3 font-[Fraunces,serif] text-xl font-black">{p.title}</p>
            <p className="text-sm text-muted-foreground">{p.discount}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono">{p.code}</span>
              <span className="text-muted-foreground">
                {p.startDate} → {p.endDate}
              </span>
            </div>
            <div className="mt-4 flex gap-1">
              <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="gap-1.5">
                <Edit className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => remove(p.id)}
                className="gap-1.5 text-primary"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Promotion" : "New Promotion"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
              </div>
              <div className="grid gap-2">
                <Label>Discount</Label>
                <Input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="15% off" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Start date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>End date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-semibold">Active</p>
                <p className="text-xs text-muted-foreground">Show this promotion on the website.</p>
              </div>
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}