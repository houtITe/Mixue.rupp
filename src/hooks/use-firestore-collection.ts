import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  subscribeToCollection,
  createInCollection,
  updateInCollection,
  deleteFromCollection,
} from "@/integrations/firebase/collection";

export function useFirestoreCollection<T extends { id: string }>(
  name: string,
  orderField = "createdAt",
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection<T>(
      name,
      orderField,
      (list) => {
        setItems(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return useMemo(
    () => ({
      items,
      loading,
      add: async (data: Record<string, unknown>) => {
        await createInCollection(name, data);
      },
      edit: async (id: string, data: Record<string, unknown>) => {
        await updateInCollection(name, id, data);
      },
      remove: async (id: string) => {
        await deleteFromCollection(name, id);
        toast.success("Deleted");
      },
    }),
    [items, loading, name],
  );
}
