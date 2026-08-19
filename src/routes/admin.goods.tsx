import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, Upload, Download } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminLayout";
import { DataTableShell, EmptyState } from "@/components/admin/DataTableShell";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/hooks/use-categories";
import type { Product } from "@/data/products";
import { formatAdminDateTime } from "@/lib/format-date";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/goods")({
  component: GoodsPage,
});

type Tab = "All" | "Drink" | "Ice Cream";
type StatusFilter = "All" | "Available" | "Out of Stock";
type SortKey = "newest" | "name" | "price";

function GoodsPage() {
  const { products, loading, addProduct, editProduct, removeProduct, importStarterMenu } =
    useProducts();
  const { categories } = useCategories();
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [importing, setImporting] = useState(false);
  const pageSize = 8;

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const iceCreamNames = useMemo(
    () => new Set(categories.filter((c) => c.group === "Ice Cream").map((c) => c.name)),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products
      .filter((p) =>
        tab === "All" ? true : tab === "Ice Cream" ? iceCreamNames.has(p.category) : !iceCreamNames.has(p.category),
      )
      .filter((p) =>
        status === "All" ? true : status === "Available" ? p.inStock !== false : p.inStock === false,
      )
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    const sorted = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price") return a.price - b.price;
      return (b.createdAt ?? 0) - (a.createdAt ?? 0);
    });
    return sorted;
  }, [products, tab, status, sort, query, iceCreamNames]);

  useEffect(() => setPage(1), [tab, status, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openCreate() {
    setSelected(null);
    setFormOpen(true);
  }
  function openEdit(g: Product) {
    setSelected(g);
    setFormOpen(true);
  }
  function openView(g: Product) {
    setSelected(g);
    setViewOpen(true);
  }
  function openDelete(g: Product) {
    setSelected(g);
    setDeleteOpen(true);
  }

  async function handleSave(data: Omit<Product, "id" | "createdAt">) {
    if (selected) {
      await editProduct(selected.id, data);
    } else {
      await addProduct(data);
    }
    setFormOpen(false);
  }

  async function handleDelete() {
    if (!selected) return;
    await removeProduct(selected.id);
    setDeleteOpen(false);
  }

  async function handleImport() {
    setImporting(true);
    try {
      await importStarterMenu();
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage all drinks and ice cream products. Changes appear on the website instantly."
        action={
          <div className="flex gap-2">
            {!loading && products.length === 0 && (
              <Button variant="outline" onClick={handleImport} disabled={importing} className="gap-1.5">
                <Download className="h-4 w-4" />
                {importing ? "Importing…" : "Import starter menu"}
              </Button>
            )}
            <Button onClick={openCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
        }
      />

      <div className="mb-5 inline-flex rounded-full border border-border bg-card p-1 shadow-card-soft">
        {(["All", "Drink", "Ice Cream"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "relative rounded-full px-5 py-2 text-sm font-semibold transition " +
              (tab === t
                ? "bg-primary text-primary-foreground shadow-elegant"
                : "text-foreground/70 hover:text-foreground")
            }
          >
            {t}
          </button>
        ))}
      </div>

      <DataTableShell
        toolbar={
          <>
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or category…"
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name (A–Z)</SelectItem>
                  <SelectItem value="price">Price (low → high)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        }
        footer={
          <>
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{current.length}</span> of{" "}
              {filtered.length} products
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </Button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                Next
              </Button>
            </div>
          </>
        }
      >
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : current.length === 0 ? (
          <EmptyState
            title="No products yet"
            hint={products.length === 0 ? "Import the starter menu or add your first product." : "Try adjusting filters."}
          />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {current.map((g) => (
                  <motion.tr key={g.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-muted/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={g.image} alt={g.name} className="h-11 w-11 rounded-lg object-cover" loading="lazy" />
                        <div>
                          <p className="font-semibold">{g.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{g.short}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{g.category}</td>
                    <td className="py-3 px-4 font-semibold">${g.price.toFixed(2)}</td>
                    <td className="py-3 px-4">{g.stock ?? "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant={g.inStock !== false ? "default" : "secondary"} className={g.inStock === false ? "bg-muted text-muted-foreground" : ""}>
                        {g.inStock !== false ? "Available" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatAdminDateTime(g.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openView(g)} aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(g)} aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openDelete(g)} aria-label="Delete" className="text-primary hover:text-primary">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </DataTableShell>

      <GoodsForm open={formOpen} onOpenChange={setFormOpen} initial={selected} onSave={handleSave} categories={categories} />

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>{selected?.category}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img src={selected.image} alt={selected.name} className="w-full rounded-xl object-cover aspect-video" />
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-bold">${selected.price.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="font-bold">{selected.stock ?? "—"}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold">{selected.inStock !== false ? "Available" : "Out of Stock"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the product from your catalog and the live website.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function emptyForm(defaultCategory: string): Omit<Product, "id" | "createdAt"> {
  return {
    name: "",
    category: defaultCategory,
    price: 0,
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80",
    short: "",
    description: "",
    tags: [],
    inStock: true,
    stock: 0,
  };
}

function GoodsForm({
  open,
  onOpenChange,
  initial,
  onSave,
  categories,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Product | null;
  onSave: (data: Omit<Product, "id" | "createdAt">) => void;
  categories: { id: string; name: string }[];
}) {
  const firstCategory = categories[0]?.name ?? "Bubble Tea";
  const [form, setForm] = useState<Omit<Product, "id" | "createdAt">>(initial ?? emptyForm(firstCategory));
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setForm(initial ?? emptyForm(firstCategory));
    setImageUploading(false);
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>Saved directly to your live Firestore catalog.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
              await onSave(form);
            } finally {
              setSaving(false);
            }
          }}
          className="space-y-4"
        >
          <div className="grid gap-2">
            <Label>Product Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <SelectItem value={form.category}>{form.category || "No categories yet"}</SelectItem>
                  ) : (
                    categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.inStock !== false ? "Available" : "Out of Stock"} onValueChange={(v) => setForm({ ...form, inStock: v === "Available" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Short tagline</Label>
            <Input value={form.short} onChange={(e) => setForm({ ...form, short: e.target.value })} placeholder="One line shown on product cards" required />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
            </div>
            <div className="grid gap-2">
              <Label>Stock</Label>
              <Input type="number" value={form.stock ?? 0} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Product Image</Label>
            <ImageUploadField
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              folder="products"
              onUploadingChange={setImageUploading}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || imageUploading}>
              {saving ? "Saving…" : imageUploading ? "Uploading image…" : initial ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
