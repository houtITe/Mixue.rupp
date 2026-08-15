import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { MapPin, Phone, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder } from "@/integrations/firebase/orders";
import { getCurrentLocation, isValidKhmerPhone, updateUserPhone, updateUserLocation } from "@/integrations/firebase/profile";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Mixue of RUPP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40";

function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [location, setLocation] = useState(profile?.location ?? null);
  const [locating, setLocating] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [placing, setPlacing] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-muted-foreground">Please sign in to check out.</p>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-primary underline">
          Browse the menu
        </Link>
      </section>
    );
  }

  async function handleUseLocation() {
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      if (user) await updateUserLocation(user, loc.lat, loc.lng);
    } catch {
      toast.error("Could not get your location. Please allow location access.");
    } finally {
      setLocating(false);
    }
  }

  const phoneValid = isValidKhmerPhone(phone);
  const canPlace = phoneValid && !!location && agreed && !placing;

  async function handlePlaceOrder() {
    if (!canPlace || !user) return;
    setPlacing(true);
    try {
      await updateUserPhone(user, phone);
      await placeOrder({
        customerId: user.uid,
        customerName: profile?.name || user.email || "Customer",
        items: cart,
        total: cartTotal,
        phone,
        location,
      });
      clearCart();
      toast.success("Order placed! We'll get started right away.");
      navigate({ to: "/orders" });
    } catch {
      toast.error("Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-[Fraunces,serif] text-3xl font-black">Complete your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We need a delivery location and phone number before we can place your order.
      </p>

      <div className="mt-8 space-y-4 rounded-3xl border border-border bg-background p-6 shadow-card-soft sm:p-8">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Phone className="mr-1 inline h-3.5 w-3.5" /> Phone number
          </label>
          <input
            className={inputCls}
            placeholder="0XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {phone && !phoneValid && (
            <p className="mt-1 text-xs text-destructive">Should start with 0 and have 9–10 digits.</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <MapPin className="mr-1 inline h-3.5 w-3.5" /> Delivery location
          </label>
          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent/60 disabled:opacity-60"
            >
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {location ? "Update my location" : "Use my current location"}
            </button>
            {location && <span className="text-xs text-primary">Location set ✓</span>}
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            I agree to the{" "}
            <Link to="/privacy" target="_blank" className="text-primary underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" target="_blank" className="text-primary underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
            .
          </span>
        </label>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-bold text-primary">${cartTotal.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={!canPlace}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant hover:brightness-110 transition disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {placing ? "Placing order…" : "Place order"}
        </button>
        {!canPlace && !placing && (
          <p className="text-center text-xs text-muted-foreground">
            Fill in a valid phone number, set your location, and accept the terms to continue.
          </p>
        )}
      </div>
    </section>
  );
}
