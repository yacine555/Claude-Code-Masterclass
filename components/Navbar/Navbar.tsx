"use client";

import { useState } from "react";
import { Clock8, Plus } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/contexts/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, loading } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await signOut(auth);
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {!loading && user && (
            <li>
              <button onClick={handleLogout} disabled={isSigningOut}>
                Logout
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className="btn">
              <Plus size={20} strokeWidth={2} />
              Create New Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
