import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joinedAt: number;
};

export function useCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const list = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name ?? "—",
              email: data.email ?? "—",
              phone: data.phone ?? "—",
              role: data.role ?? "customer",
              // Real order counts land here once the Orders collection exists (Step 2).
              orders: 0,
              spent: 0,
              joinedAt: data.createdAt?.toMillis?.() ?? 0,
            };
          })
          .filter((u) => u.role === "customer");
        setCustomers(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsubscribe;
  }, []);

  return { customers, loading };
}
