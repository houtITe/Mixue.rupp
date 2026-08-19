import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart, toggleWishlist, inWishlist } = useCart();

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-card border border-border shadow-elegant"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur shadow-card-soft hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {product.category}
                </span>
                <h2 className="mt-2 font-[Fraunces,serif] text-3xl font-black">
                  {product.name}
                </h2>
                {product.rating !== undefined && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-foreground">
                      {product.rating}
                    </span>
                    <span>({product.reviews} reviews)</span>
                  </div>
                )}
                <p className="mt-4 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mt-auto pt-6 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      toast.success(`${product.name} added to cart`);
                      onClose();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="grid h-12 w-12 place-items-center rounded-full border border-border hover:bg-accent"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        inWishlist(product.id)
                          ? "fill-primary text-primary"
                          : "text-foreground/70",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
