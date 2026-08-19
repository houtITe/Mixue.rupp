import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as fbUpdatePassword,
  updateProfile as fbUpdateProfile,
  type User,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export function isValidKhmerPhone(phone: string): boolean {
  return /^0\d{8,9}$/.test(phone.trim());
}

export async function updateUserName(user: User, name: string) {
  await fbUpdateProfile(user, { displayName: name });
  await updateDoc(doc(db, "users", user.uid), { name });
}

export async function updateUserPhone(user: User, phone: string) {
  if (!isValidKhmerPhone(phone)) {
    throw new Error("Please enter a valid phone number (starts with 0, 9-10 digits).");
  }
  await updateDoc(doc(db, "users", user.uid), { phone });
}

export async function updateUserLocation(user: User, lat: number, lng: number) {
  await updateDoc(doc(db, "users", user.uid), { location: { lat, lng } });
}

export async function updateUserRole(userId: string, role: "customer" | "staff" | "admin") {
  await updateDoc(doc(db, "users", userId), { role });
}

export async function changePassword(
  user: User,
  currentPassword: string,
  newPassword: string,
) {
  if (!user.email) throw new Error("No email on this account.");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await fbUpdatePassword(user, newPassword);
}

export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}
