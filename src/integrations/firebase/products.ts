import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./config";
import type { Product } from "@/data/products";

const COLLECTION = "products";

export function subscribeToProducts(
  onChange: (products: Product[]) => void,
  onError: (err: unknown) => void,
) {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          ...data,
          id: d.id,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
        } as Product;
      });
      onChange(list);
    },
    onError,
  );
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">) {
  await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const { id: _drop, createdAt: _drop2, ...rest } = data as Product;
  await updateDoc(doc(db, COLLECTION, id), rest);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function importSeedProducts(seed: Product[]) {
  const batch = writeBatch(db);
  for (const p of seed) {
    const { id, createdAt: _drop, ...rest } = p;
    batch.set(doc(db, COLLECTION, id), { ...rest, createdAt: serverTimestamp() });
  }
  await batch.commit();
}
