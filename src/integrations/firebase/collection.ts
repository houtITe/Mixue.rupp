import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./config";

export function subscribeToCollection<T>(
  name: string,
  orderField: string,
  onChange: (items: (T & { id: string })[]) => void,
  onError: (err: unknown) => void,
) {
  const q = query(collection(db, name), orderBy(orderField, "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        const out: DocumentData = { ...data, id: d.id };
        for (const key of Object.keys(out)) {
          if (out[key]?.toMillis) out[key] = out[key].toMillis();
        }
        return out as T & { id: string };
      });
      onChange(list);
    },
    onError,
  );
}

export async function createInCollection(name: string, data: Record<string, unknown>) {
  await addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });
}

export async function updateInCollection(
  name: string,
  id: string,
  data: Record<string, unknown>,
) {
  const { id: _drop, createdAt: _drop2, ...rest } = data;
  await updateDoc(doc(db, name, id), rest);
}

export async function deleteFromCollection(name: string, id: string) {
  await deleteDoc(doc(db, name, id));
}
