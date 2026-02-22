"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { ReactNode } from "react";

export type AppUser = { uid: string; email: string | null; displayName: string | null };
type AuthContextValue = { user: AppUser | null; loading: boolean };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(
        firebaseUser
          ? { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName }
          : null
      );
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useUser(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error(
      "useUser must be used within an AuthProvider. Wrap your app with <AuthProvider> in app/layout.tsx."
    );
  }
  return context;
}
