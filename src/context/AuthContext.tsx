import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";
import {
  subscribeToAuthChanges,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword,
  logout,
  type AppUser,
} from "@/integrations/firebase/auth";

export type UserRole = "customer" | "staff" | "admin";

export type UserProfile = {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: { lat: number; lng: number };
};

type AuthState = {
  user: AppUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: typeof loginWithEmail;
  register: typeof registerWithEmail;
  loginGoogle: typeof loginWithGoogle;
  forgotPassword: typeof resetPassword;
  logout: typeof logout;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      setProfileLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      loading: authLoading || profileLoading,
      isAdmin: profile?.role === "admin",
      isStaff: profile?.role === "staff" || profile?.role === "admin",
      login: loginWithEmail,
      register: registerWithEmail,
      loginGoogle: loginWithGoogle,
      forgotPassword: resetPassword,
      logout,
    }),
    [user, profile, authLoading, profileLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
