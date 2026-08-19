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

function stripUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(stripUndefined) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)]),
    ) as T;
  }
  return obj;
}

export async function placeOrder(data: {
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  phone: string;
  location: { lat: number; lng: number } | null;
}) {
  const clean = stripUndefined({
    ...data,
    payment: "Pending",
    status: "New",
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "orders"), clean);
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
