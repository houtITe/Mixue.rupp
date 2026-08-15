import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { VideoBackground } from "@/components/site/VideoBackground";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Menu — Mixue of RUPP" },
      { name: "description", content: "Ice cream, bubble tea, fruit tea and more." },
      { property: "og:title", content: "Menu — Mixue of RUPP" },
      { property: "og:description", content: "Ice cream, bubble tea, fruit tea and more." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const categoryTabs = useMemo(() => ["All", ...categories.map((c) => c.name)], [categories]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCat = category === "All" || p.category === category;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return inCat && inQuery;
    });
  }, [products, query, category]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <VideoBackground srcs={["/products-hero-bg.mp4"]} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30">
              Our menu
            </span>
            <h2 className="mt-4 font-[Fraunces,serif] text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Cold, creamy, refreshing — take your pick.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80">
              Handcrafted ice cream, bubble teas, fruit refreshers and premium coffee. All under $3.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Full menu */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-hidden rounded-3xl shadow-card-soft">
          <img
            src="https://mixuemenu.us/news/wp-content/uploads/2026/08/Mixue-Menu.png"
            alt="Full Mixue menu"
            loading="lazy"
            className="w-full object-contain bg-white"
          />
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search matcha, mango, boba…"
              className="w-full rounded-full border border-border bg-background pl-11 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 md:pb-0">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            {categoryTabs.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                  (category === c
                    ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                    : "border-border bg-background text-foreground hover:border-primary/60 hover:text-primary")
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="mb-6 text-sm text-muted-foreground">
          {" "}
          Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          of {products.length} items
        </div>
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-3/4 animate-pulse rounded-3xl bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl border border-dashed border-border p-16 text-center"
            >
              <p className="font-[Fraunces,serif] text-2xl font-black">Nothing matches yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different keyword or category.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.04, 0.4)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}