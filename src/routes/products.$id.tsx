import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Flame, Sparkles, ShoppingBag, Heart, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { RatingStars } from "@/components/site/RatingStars";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { formatAdminDateTime } from "@/lib/format-date";
import { Star } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  head: ({ params }) => ({
    meta: [
      { title: "Mixue of RUPP" },
      { property: "og:url", content: `/products/${params.id}` },
    ],
    links: [{ rel: "canonical", href: `/products/${params.id}` }],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { getProduct, products, loading } = useProducts();
  const { categories } = useCategories();
  const product = getProduct(id);
  const { addToCart, toggleWishlist, inWishlist } = useCart();
  const [size, setSize] = useState("Regular");
  const [ice, setIce] = useState("Regular ice");
  const [sugar, setSugar] = useState("50% sugar");
  const [qty, setQty] = useState(1);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-[2.5rem] bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-[Fraunces,serif] text-4xl font-black">
          We couldn't find that drink
        </h1>
        <p className="mt-3 text-muted-foreground">It may have been retired from the menu.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>
      </section>
    );
  }

  const isDrink = categories.find((c) => c.name === product.category)?.group !== "Ice Cream";
  const wished = inWishlist(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <section className="bg-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to menu
          </Link>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative"
          >
            <div className="pointer-events-none absolute -z-10 -inset-6 rounded-[3rem] bg-hero opacity-25 blur-3xl" />
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square rounded-[2.5rem] object-cover shadow-elegant"
            />
          </motion.div>
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
              {product.category}
            </span>
            <h1 className="mt-4 font-[Fraunces,serif] text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <span className="text-4xl font-[Fraunces,serif] font-black text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.calories && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Flame className="h-4 w-4" /> {product.calories} kcal
                </span>
              )}
              {product.prepTime && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {product.prepTime}
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" /> Signature
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80"
                >
                  #{t}
                </span>
              ))}
            </div>

            {product.rating !== undefined && (
              <div className="mt-6">
                <RatingStars rating={product.rating} reviews={product.reviews} size={16} />
              </div>
            )}

            <div className="mt-8 space-y-5">
              <OptionRow
                label="Size"
                value={size}
                options={["Small", "Regular", "Large"]}
                onChange={setSize}
              />
              {isDrink && (
                <>
                  <OptionRow
                    label="Ice"
                    value={ice}
                    options={["No ice", "Less ice", "Regular ice", "Extra ice"]}
                    onChange={setIce}
                  />
                  <OptionRow
                    label="Sugar"
                    value={sugar}
                    options={["0%", "25%", "50% sugar", "75%", "100%"]}
                    onChange={setSugar}
                  />
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent/60"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent/60"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(product, qty, { size, ice: isDrink ? ice : undefined, sugar: isDrink ? sugar : undefined });
                  toast.success(`${product.name} added to cart`);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
              >
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border transition",
                  wished
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/60",
                )}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <ProductReviews productName={product.name} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-[Fraunces,serif] text-3xl sm:text-4xl font-black">
              You may also love
            </h2>
            <Link
              to="/products"
              className="hidden sm:inline text-sm font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function OptionRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={
              "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
              (value === o
                ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                : "border-border bg-background hover:border-primary/60 hover:text-primary")
            }
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

type AdminReview = {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: number;
};

function ProductReviews({ productName }: { productName: string }) {
  const { items, loading } = useFirestoreCollection<AdminReview>("reviews");
  const reviews = items.filter((r) => r.product === productName);

  if (loading) return null;
  if (reviews.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-[Fraunces,serif] text-2xl font-black">Customer reviews</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          No reviews yet for this drink — be the first to try it!
        </p>
      </section>
    );
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3">
        <h2 className="font-[Fraunces,serif] text-2xl font-black">Customer reviews</h2>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-primary text-primary" />
          {avg.toFixed(1)} · {reviews.length} review{reviews.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.customer}</p>
              <p className="text-xs text-muted-foreground">{formatAdminDateTime(r.createdAt)}</p>
            </div>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}