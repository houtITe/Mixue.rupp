import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Mixue of RUPP" },
      { name: "description", content: "Review your Mixue of RUPP order before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, cartTotal, updateQty, removeFromCart, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-[Fraunces,serif] text-4xl sm:text-5xl font-black">
        Your Cart
      </h1>
      <p className="mt-2 text-muted-foreground">
        {cart.length === 0
          ? "Your cart is currently empty."
          : `${cart.length} item${cart.length > 1 ? "s" : ""} ready for pickup.`}
      </p>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <p className="mt-6 font-[Fraunces,serif] text-2xl font-black">
            Nothing here yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our menu and add your favourite drink.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card-soft"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link
                      to="/products/$id"
                      params={{ id: item.productId }}
                      className="font-bold hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="font-bold text-primary">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                  {item.options && (
                    <p className="text-xs text-muted-foreground">
                      {[item.options.size, item.options.ice, item.options.sugar]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        aria-label="Decrease"
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent/60"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Increase"
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent/60"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-3xl border border-border bg-card p-6 shadow-card-soft h-fit">
            <h2 className="font-[Fraunces,serif] text-2xl font-black">
              Order summary
            </h2>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">${cartTotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="font-semibold">Free on campus</dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-primary text-lg">
                  ${cartTotal.toFixed(2)}
                </dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110"
            >
              Place order
            </Link>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-xs text-muted-foreground hover:text-primary"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}