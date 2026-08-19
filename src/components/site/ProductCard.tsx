import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { RatingStars } from "./RatingStars";
import { QuickViewModal } from "./QuickViewModal";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, inWishlist, addToCart } = useCart();
  const wished = inWishlist(product.id);
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group relative overflow-hidden rounded-3xl bg-card shadow-card-soft border border-border flex flex-col"
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur shadow-card-soft hover:scale-110 transition"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition",
              wished ? "fill-primary text-primary" : "text-foreground/70",
            )}
          />
        </button>
        <Link to="/products/$id" params={{ id: product.id }} className="block flex-1">
          <div className="relative aspect-4/5 overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />
            <span className="absolute left-2 top-2 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-foreground sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[11px]">
              {product.category}
            </span>
            <div className="absolute left-2 bottom-2 flex flex-wrap gap-1 sm:left-3 sm:bottom-3 sm:gap-1.5">
              {product.bestSeller && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground shadow-elegant sm:px-2.5 sm:text-[10px]">
                  Best Seller
                </span>
              )}
              {product.isNew && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent-foreground sm:px-2.5 sm:text-[10px]">
                  New
                </span>
              )}
              {product.onSale && (
                <span className="rounded-full bg-foreground px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-background sm:px-2.5 sm:text-[10px]">
                  Sale
                </span>
              )}
            </div>
          </div>
          <div className="p-3 sm:p-5">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <h3 className="font-[Fraunces,serif] text-lg font-black leading-tight text-foreground sm:text-xl">
                {product.name}
              </h3>
              <div className="shrink-0 text-right">
                {product.oldPrice && (
                  <span className="block text-xs text-muted-foreground line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground sm:px-3 sm:py-1 sm:text-sm">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            {product.rating !== undefined && (
              <div className="mt-1 sm:mt-2">
                <RatingStars rating={product.rating} reviews={product.reviews} />
              </div>
            )}
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{product.short}</p>
          </div>
        </Link>
        <div className="p-3 pt-0 flex gap-2 sm:p-5 sm:pt-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
              toast.success(`${product.name} added to cart`);
            }}
            disabled={product.inStock === false}
            className="flex-1 inline-flex items-center justify-center gap-0.5 rounded-full bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed sm:gap-1 sm:px-3 sm:py-2"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {product.inStock === false ? "Sold out" : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setQuickOpen(true);
            }}
            aria-label="Quick view"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border hover:bg-accent transition sm:h-10 sm:w-10"
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </motion.div>
      <QuickViewModal product={quickOpen ? product : null} onClose={() => setQuickOpen(false)} />
    </>
  );
}
