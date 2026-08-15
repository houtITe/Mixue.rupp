import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./config";

const SETTINGS_DOC = "settings/site";

export function subscribeToSettings<T>(defaults: T, onChange: (settings: T) => void) {
  return onSnapshot(
    doc(db, SETTINGS_DOC),
    (snap) => {
      if (snap.exists()) {
        onChange({ ...defaults, ...(snap.data() as Partial<T>) });
      } else {
        onChange(defaults);
      }
    },
    () => onChange(defaults),
  );
}

export async function saveSettings<T extends Record<string, unknown>>(settings: T) {
  await setDoc(doc(db, SETTINGS_DOC), settings, { merge: true });
}
