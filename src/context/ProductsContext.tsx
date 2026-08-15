import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { seedProducts } from "@/data/products";
import {
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  importSeedProducts,
} from "@/integrations/firebase/products";

type ProductsState = {
  products: Product[];
  loading: boolean;
  getProduct: (id: string) => Product | undefined;
  addProduct: (data: Omit<Product, "id" | "createdAt">) => Promise<void>;
  editProduct: (id: string, data: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  importStarterMenu: () => Promise<void>;
};

const ProductsContext = createContext<ProductsState | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (list) => {
        setProducts(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, []);

  const value = useMemo<ProductsState>(
    () => ({
      products,
      loading,
      getProduct: (id) => products.find((p) => p.id === id),
      addProduct: async (data) => {
        await createProduct(data);
        toast.success(`Created ${data.name}`);
      },
      editProduct: async (id, data) => {
        await updateProduct(id, data);
        toast.success(`Updated ${data.name ?? "product"}`);
      },
      removeProduct: async (id) => {
        await deleteProduct(id);
        toast.success("Product deleted");
      },
      importStarterMenu: async () => {
        await importSeedProducts(seedProducts);
        toast.success(`Imported ${seedProducts.length} starter items`);
      },
    }),
    [products, loading],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
