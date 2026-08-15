// Thin wrappers around Firebase Auth so route components stay simple.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

export type AppUser = User;

export function subscribeToAuthChanges(callback: (user: AppUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });

  // Create a matching profile document in Firestore so admin/staff pages can
  // list users, assign roles ("customer" | "staff" | "admin"), etc.
  await setDoc(doc(db, "users", credential.user.uid), {
    name,
    email,
    role: "customer",
    createdAt: serverTimestamp(),
  });

  await sendEmailVerification(credential.user);

  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await setDoc(
    doc(db, "users", credential.user.uid),
    {
      name: credential.user.displayName ?? "",
      email: credential.user.email ?? "",
      role: "customer",
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
  return credential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await signOut(auth);
}

// Turns Firebase's error codes into short, user-friendly messages.
export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try signing in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
