import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Mixue of RUPP" },
      { name: "description", content: "Your saved Mixue of RUPP drinks and treats." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlistProducts } = useCart();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-[Fraunces,serif] text-4xl sm:text-5xl font-black">
        Your Wishlist
      </h1>
      <p className="mt-2 text-muted-foreground">
        Save your favourites for later — {wishlistProducts.length} item
        {wishlistProducts.length === 1 ? "" : "s"} saved.
      </p>

      {wishlistProducts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
            <Heart className="h-7 w-7" />
          </span>
          <p className="mt-6 font-[Fraunces,serif] text-2xl font-black">
            Nothing saved yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any product to save it here.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}