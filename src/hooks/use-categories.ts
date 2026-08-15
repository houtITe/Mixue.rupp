import { useFirestoreCollection } from "@/hooks/use-firestore-collection";
import { useProducts } from "@/context/ProductsContext";

export type Category = {
  id: string;
  name: string;
  group: "Ice Cream" | "Drinks";
};

const SEED_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Soft Serve", group: "Ice Cream" },
  { name: "Sundae", group: "Ice Cream" },
  { name: "Bubble Tea", group: "Drinks" },
  { name: "Fruit Tea", group: "Drinks" },
  { name: "Coffee", group: "Drinks" },
  { name: "Smoothie", group: "Drinks" },
];

export function useCategories() {
  const { items, loading, add, edit, remove } = useFirestoreCollection<Category>("categories", "name");
  const { products } = useProducts();

  const withCounts = items.map((c) => ({
    ...c,
    itemCount: products.filter((p) => p.category === c.name).length,
  }));

  return {
    categories: withCounts,
    loading,
    addCategory: add,
    editCategory: edit,
    removeCategory: remove,
    importStarterCategories: async () => {
      for (const c of SEED_CATEGORIES) await add(c);
    },
  };
}
