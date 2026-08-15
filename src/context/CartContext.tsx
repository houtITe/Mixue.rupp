import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export type CartOptions = {
  size?: string;
  ice?: string;
  sugar?: string;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  options?: CartOptions;
};

type CartState = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, qty?: number, options?: CartOptions) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  wishlistProducts: Product[];
};

const CartContext = createContext<CartState | null>(null);

const CART_KEY = "mixue.cart.v1";
const WISH_KEY = "mixue.wishlist.v1";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function itemKey(productId: string, opts?: CartOptions) {
  return `${productId}::${opts?.size ?? ""}::${opts?.ice ?? ""}::${opts?.sugar ?? ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useAuth();
  const { getProduct } = useProducts();
  const navigate = useNavigate();

  const requireAuth = useCallback(() => {
    if (user) return true;
    toast.error("Please sign in to do that.");
    navigate({ to: "/login" });
    return false;
  }, [user, navigate]);

  useEffect(() => {
    setCart(safeRead<CartItem[]>(CART_KEY, []));
    setWishlist(safeRead<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback(
    (product: Product, qty = 1, options?: CartOptions) => {
      if (!requireAuth()) return;
      setCart((prev) => {
        const id = itemKey(product.id, options);
        const found = prev.find((i) => i.id === id);
        if (found) {
          return prev.map((i) =>
            i.id === id ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [
          ...prev,
          {
            id,
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty,
            options,
          },
        ];
      });
    },
    [requireAuth],
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    if (!requireAuth()) return;
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, [requireAuth]);

  const inWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart],
  );
  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart],
  );

  const wishlistProducts = useMemo(
    () => wishlist.map(getProduct).filter((p): p is Product => !!p),
    [wishlist, getProduct],
  );

  const value: CartState = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    toggleWishlist,
    inWishlist,
    cartTotal,
    cartCount,
    wishlistProducts,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}