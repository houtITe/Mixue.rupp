import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit, Trash2, Tags } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useCategories } from "@/hooks/use-categories";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories, loading, addCategory, editCategory, removeCategory, importStarterCategories } =
    useCategories();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; group: "Ice Cream" | "Drinks" } | null>(null);
  const [form, setForm] = useState<{ name: string; group: "Ice Cream" | "Drinks" }>({
    name: "",
    group: "Drinks",
  });
  const [importing, setImporting] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", group: "Drinks" });
    setOpen(true);
  }
  function openEdit(c: { id: string; name: string; group: "Ice Cream" | "Drinks" }) {
    setEditing(c);
    setForm({ name: c.name, group: c.group });
    setOpen(true);
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await editCategory(editing.id, form);
      toast.success("Category updated");
    } else {
      await addCategory(form);
      toast.success("Category added");
    }
    setOpen(false);
  }
  async function handleImport() {
    setImporting(true);
    try {
      await importStarterCategories();
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Group your products for easier discovery."
        action={
          <div className="flex gap-2">
            {!loading && categories.length === 0 && (
              <Button variant="outline" onClick={handleImport} disabled={importing}>
                {importing ? "Importing…" : "Import starter categories"}
              </Button>
            )}
            <Button onClick={openCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> New Category
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="group rounded-2xl border border-border bg-card p-5 shadow-card-soft transition hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Tags className="h-5 w-5" />
              </span>
              <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition">
                <Button size="icon" variant="ghost" onClick={() => openEdit(c)} aria-label="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeCategory(c.id)}
                  aria-label="Delete"
                  className="text-primary"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-3 font-[Fraunces,serif] text-xl font-black">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.group}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              {c.itemCount} items
            </p>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={form.group}
                onValueChange={(v) => setForm({ ...form, group: v as "Ice Cream" | "Drinks" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drinks">Drinks</SelectItem>
                  <SelectItem value="Ice Cream">Ice Cream</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}