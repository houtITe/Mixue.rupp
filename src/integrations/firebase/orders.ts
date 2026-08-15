import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { CartItem } from "@/context/CartContext";

export type OrderStatus = "New" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  phone: string;
  location: { lat: number; lng: number } | null;
  payment: PaymentStatus;
  status: OrderStatus;
  createdAt: number;
};

export async function placeOrder(data: {
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  phone: string;
  location: { lat: number; lng: number } | null;
}) {
  await addDoc(collection(db, "orders"), {
    ...data,
    payment: "Pending",
    status: "New",
    createdAt: serverTimestamp(),
  });
}

export function subscribeToAllOrders(
  onChange: (orders: Order[]) => void,
  onError: (err: unknown) => void,
) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      onChange(
        snap.docs.map((d) => {
          const data = d.data();
          return { ...data, id: d.id, createdAt: data.createdAt?.toMillis?.() ?? Date.now() } as Order;
        }),
      );
    },
    onError,
  );
}

// Fires `onNewOrder` for each order that arrives AFTER the initial snapshot —
// used to trigger the POS "ring" alert without firing for existing orders.
export function subscribeToNewOrders(onNewOrder: (order: Order) => void) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  let ready = false;
  return onSnapshot(q, (snap) => {
    if (!ready) {
      ready = true;
      return;
    }
    for (const change of snap.docChanges()) {
      if (change.type === "added") {
        const data = change.doc.data();
        onNewOrder({
          ...data,
          id: change.doc.id,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        } as Order);
      }
    }
  });
}

export function subscribeToMyOrders(
  uid: string,
  onChange: (orders: Order[]) => void,
  onError: (err: unknown) => void,
) {
  const q = query(collection(db, "orders"), where("customerId", "==", uid));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return { ...data, id: d.id, createdAt: data.createdAt?.toMillis?.() ?? Date.now() } as Order;
      });
      list.sort((a, b) => b.createdAt - a.createdAt);
      onChange(list);
    },
    onError,
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db, "orders", id), { status });
}
