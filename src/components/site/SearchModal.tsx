import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useProducts } from "@/context/ProductsContext";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const { products } = useProducts();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products.slice(0, 5);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)),
      )
      .slice(0, 8);
  }, [q, products]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-foreground/40 backdrop-blur-sm p-4 sm:p-16 flex items-start justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-elegant"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search drinks, flavours, tags…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No matches. Try "matcha" or "mango".
                </p>
              ) : (
                results.map((p) => (
                  <Link
                    key={p.id}
                    to="/products/$id"
                    params={{ id: p.id }}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-2xl p-3 hover:bg-accent/40 transition"
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.category} · {p.short}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      ${p.price.toFixed(2)}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
